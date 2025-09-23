import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const countdownBanner = await prisma.countdownBanner.findFirst({
      where: {
        isVisible: true,
        targetDate: {
          gt: new Date() // Only get banners that haven't expired
        }
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })

    return NextResponse.json({ data: countdownBanner })
  } catch (error) {
    console.error('Error fetching countdown banner:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
