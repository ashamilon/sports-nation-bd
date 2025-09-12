import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const metric = searchParams.get('metric') || 'revenue'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get analytics data based on metric
    let data = {}

    switch (metric) {
      case 'revenue':
        data = await getRevenueAnalytics(startDate, now)
        break
      case 'orders':
        data = await getOrdersAnalytics(startDate, now)
        break
      case 'customers':
        data = await getCustomersAnalytics(startDate, now)
        break
      case 'products':
        data = await getProductsAnalytics(startDate, now)
        break
      default:
        data = await getAllAnalytics(startDate, now)
    }

    return NextResponse.json({
      success: true,
      period,
      metric,
      data
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getRevenueAnalytics(startDate: Date, endDate: Date) {
  const [totalRevenue, dailyRevenue, monthlyRevenue] = await Promise.all([
    // Total revenue
    prisma.order.aggregate({
      where: {
        status: 'completed',
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { total: true }
    }),
    
    // Daily revenue
    prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM "Order"
      WHERE status = 'completed' 
        AND createdAt >= ${startDate}
        AND createdAt <= ${endDate}
      GROUP BY DATE(createdAt)
      ORDER BY date
    `,
    
    // Monthly revenue
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', createdAt) as month,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM "Order"
      WHERE status = 'completed' 
        AND createdAt >= ${startDate}
        AND createdAt <= ${endDate}
      GROUP BY DATE_TRUNC('month', createdAt)
      ORDER BY month
    `
  ])

  return {
    total: totalRevenue._sum.total || 0,
    daily: dailyRevenue,
    monthly: monthlyRevenue
  }
}

async function getOrdersAnalytics(startDate: Date, endDate: Date) {
  const [totalOrders, ordersByStatus, dailyOrders] = await Promise.all([
    // Total orders
    prisma.order.count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Orders by status
    prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: { status: true }
    }),
    
    // Daily orders
    prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as orders
      FROM "Order"
      WHERE createdAt >= ${startDate}
        AND createdAt <= ${endDate}
      GROUP BY DATE(createdAt)
      ORDER BY date
    `
  ])

  return {
    total: totalOrders,
    byStatus: ordersByStatus,
    daily: dailyOrders
  }
}

async function getCustomersAnalytics(startDate: Date, endDate: Date) {
  const [totalCustomers, newCustomers, customerSegments] = await Promise.all([
    // Total customers
    prisma.user.count({
      where: {
        role: 'customer'
      }
    }),
    
    // New customers
    prisma.user.count({
      where: {
        role: 'customer',
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Customer segments
    prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN orderCount = 0 THEN 'inactive'
          WHEN orderCount = 1 THEN 'new'
          WHEN orderCount BETWEEN 2 AND 5 THEN 'returning'
          ELSE 'vip'
        END as segment,
        COUNT(*) as count,
        SUM(totalSpent) as revenue
      FROM (
        SELECT 
          u.id,
          COUNT(o.id) as orderCount,
          COALESCE(SUM(o.total), 0) as totalSpent
        FROM "User" u
        LEFT JOIN "Order" o ON u.id = o.userId
        WHERE u.role = 'customer'
        GROUP BY u.id
      ) customerStats
      GROUP BY segment
    `
  ])

  return {
    total: totalCustomers,
    new: newCustomers,
    segments: customerSegments
  }
}

async function getProductsAnalytics(startDate: Date, endDate: Date) {
  const [totalProducts, topProducts, categoryDistribution] = await Promise.all([
    // Total products
    prisma.product.count({
      where: { isActive: true }
    }),
    
    // Top products
    prisma.$queryRaw`
      SELECT 
        p.id,
        p.name,
        p.price,
        SUM(oi.quantity) as sales,
        SUM(oi.quantity * oi.price) as revenue
      FROM "Product" p
      JOIN "OrderItem" oi ON p.id = oi.productId
      JOIN "Order" o ON oi.orderId = o.id
      WHERE o.status = 'completed'
        AND o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
      GROUP BY p.id, p.name, p.price
      ORDER BY sales DESC
      LIMIT 10
    `,
    
    // Category distribution
    prisma.$queryRaw`
      SELECT 
        c.name as category,
        COUNT(p.id) as productCount,
        SUM(oi.quantity * oi.price) as revenue
      FROM "Category" c
      LEFT JOIN "Product" p ON c.id = p.categoryId
      LEFT JOIN "OrderItem" oi ON p.id = oi.productId
      LEFT JOIN "Order" o ON oi.orderId = o.id AND o.status = 'completed'
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `
  ])

  return {
    total: totalProducts,
    topProducts,
    categoryDistribution
  }
}

async function getAllAnalytics(startDate: Date, endDate: Date) {
  const [revenue, orders, customers, products] = await Promise.all([
    getRevenueAnalytics(startDate, endDate),
    getOrdersAnalytics(startDate, endDate),
    getCustomersAnalytics(startDate, endDate),
    getProductsAnalytics(startDate, endDate)
  ])

  return {
    revenue,
    orders,
    customers,
    products
  }
}
