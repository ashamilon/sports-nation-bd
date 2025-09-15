import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get dashboard statistics
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'user' } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'completed' }
      })
    ])

    const stats = {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue: totalRevenue._sum.total || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
