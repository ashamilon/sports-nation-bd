import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    console.log('GET /api/cms/countdown-banners - Starting request')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'Authenticated' : 'Not authenticated')
    
    if (!session || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log('Fetching countdown banners from database')
    const countdownBanners = await prisma.countdownBanner.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    })

    console.log('Countdown banners fetched successfully:', countdownBanners.length, 'banners')
    return NextResponse.json({ data: countdownBanners })
  } catch (error) {
    console.error('Error fetching countdown banners:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    console.log('POST /api/cms/countdown-banners - Starting request')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'Authenticated' : 'Not authenticated')
    
    if (!session || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    console.log('Request body:', body)
    const { title, subtitle, targetDate, backgroundImage, isVisible, sortOrder } = body

    if (!title || !targetDate) {
      console.log('Validation failed - missing required fields')
      return new NextResponse('Title and target date are required', { status: 400 })
    }

    // Validate and parse the target date
    let parsedTargetDate
    try {
      parsedTargetDate = new Date(targetDate)
      if (isNaN(parsedTargetDate.getTime())) {
        throw new Error('Invalid date format')
      }
    } catch (error) {
      console.log('Invalid target date:', targetDate, error)
      return new NextResponse('Invalid target date format', { status: 400 })
    }

    console.log('Creating countdown banner with data:', {
      title,
      subtitle,
      targetDate: parsedTargetDate,
      backgroundImage,
      isVisible: isVisible ?? true,
      sortOrder: sortOrder ?? 0,
    })

    const countdownBanner = await prisma.countdownBanner.create({
      data: {
        title,
        subtitle,
        targetDate: parsedTargetDate,
        backgroundImage,
        isVisible: isVisible ?? true,
        sortOrder: sortOrder ?? 0,
      },
    })

    console.log('Countdown banner created successfully:', countdownBanner)
    return NextResponse.json({ data: countdownBanner })
  } catch (error) {
    console.error('Error creating countdown banner:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
