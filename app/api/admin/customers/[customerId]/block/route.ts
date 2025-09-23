import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerId } = await params
    const { blocked } = await request.json()

    // Update customer status
    const updatedCustomer = await prisma.user.update({
      where: { id: customerId },
      data: {
        // You can add a blocked field to your User model if needed
        // For now, we'll use a custom field or role
        role: blocked ? 'blocked' : 'customer'
      }
    })

    return NextResponse.json({
      success: true,
      customer: updatedCustomer
    })

  } catch (error) {
    console.error('Error updating customer block status:', error)
    return NextResponse.json(
      { error: 'Failed to update customer status' },
      { status: 500 }
    )
  }
}
