import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { title, subtitle, targetDate, backgroundImage, isVisible, sortOrder } = body

    const countdownBanner = await prisma.countdownBanner.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(targetDate && { targetDate: new Date(targetDate) }),
        ...(backgroundImage !== undefined && { backgroundImage }),
        ...(isVisible !== undefined && { isVisible }),
        ...(sortOrder !== undefined && { sortOrder }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ data: countdownBanner })
  } catch (error) {
    console.error('Error updating countdown banner:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params
    await prisma.countdownBanner.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting countdown banner:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
