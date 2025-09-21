import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { User: { name: { contains: search, mode: 'insensitive' } } },
        { User: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          OrderItem: {
            include: {
              Product: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    // Format orders for display to match frontend expectations
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customer: {
        name: order.User?.name || 'Unknown Customer',
        email: order.User?.email || '',
        phone: '' // Add phone if available
      },
      items: order.OrderItem.map(item => ({
        name: item.Product.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod || 'Unknown',
      courierService: order.courierService,
      courierTrackingId: order.courierTrackingId,
      trackingNumber: order.trackingNumber,
      orderDate: order.createdAt.toLocaleDateString(),
      deliveryDate: order.status === 'completed' ? order.updatedAt.toLocaleDateString() : null
    }))

    return NextResponse.json({
      orders: formattedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}