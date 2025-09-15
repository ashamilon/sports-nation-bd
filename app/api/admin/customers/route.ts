import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { role: 'user' }
    if (status && status !== 'all') {
      where.status = status
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          orders: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Format customers for display
    const formattedCustomers = customers.map(customer => {
      const totalOrders = customer.orders.length
      const totalSpent = customer.orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0)
      const lastOrder = customer.orders.length > 0 
        ? customer.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : null

      return {
        id: customer.id,
        name: customer.name || 'Unknown',
        email: customer.email || '',
        phone: customer.phone || '',
        location: customer.address || 'Not provided',
        joinDate: customer.createdAt.toLocaleDateString(),
        status: 'active', // Default status since User model doesn't have status field
        totalOrders,
        totalSpent,
        lastOrder: lastOrder ? lastOrder.createdAt.toLocaleDateString() : 'No orders',
        rating: 4.5, // Default rating
        avatar: customer.image || '/api/placeholder/40/40'
      }
    })

    return NextResponse.json({
      customers: formattedCustomers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
