import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerId } = params
    const { name, email, phone, location, status } = await request.json()

    // Update customer details
    const updatedCustomer = await prisma.user.update({
      where: { id: customerId },
      data: {
        name: name,
        email: email,
        phone: phone,
        address: location, // Map location to address field
        // You can add a status field to your User model if needed
      }
    })

    return NextResponse.json({
      success: true,
      customer: updatedCustomer
    })

  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}
