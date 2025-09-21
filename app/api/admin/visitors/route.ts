import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const activeOnly = searchParams.get('active') === 'true'
    const timeRange = searchParams.get('range') || '24h'
    
    // Calculate time range
    let timeFilter: Date
    switch (timeRange) {
      case '1h':
        timeFilter = new Date(Date.now() - 60 * 60 * 1000)
        break
      case '24h':
        timeFilter = new Date(Date.now() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        timeFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        timeFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        timeFilter = new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
    
    const where = {
      ...(activeOnly && {
        isActive: true,
        lastSeen: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Active in last 5 minutes
        }
      }),
      createdAt: {
        gte: timeFilter
      }
    }
    
    // Get visitors with pagination
    const [visitors, total] = await Promise.all([
      prisma.visitor.findMany({
        where,
        orderBy: { lastSeen: 'desc' },
        take: limit,
        include: {
          pageViews: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      }),
      prisma.visitor.count({ where })
    ])
    
    // Get analytics data
    const [
      totalVisitors,
      activeVisitors,
      uniqueCountries,
      topPages,
      hourlyStats
    ] = await Promise.all([
      // Total visitors in time range
      prisma.visitor.count({
        where: { createdAt: { gte: timeFilter } }
      }),
      
      // Active visitors (last 5 minutes)
      prisma.visitor.count({
        where: {
          isActive: true,
          lastSeen: { gte: new Date(Date.now() - 5 * 60 * 1000) }
        }
      }),
      
      // Unique countries
      prisma.visitor.groupBy({
        by: ['country'],
        where: { createdAt: { gte: timeFilter } },
        _count: { country: true }
      }),
      
      // Top pages
      prisma.pageView.groupBy({
        by: ['page'],
        where: { 
          createdAt: { gte: timeFilter }
        },
        _count: { page: true },
        orderBy: { _count: { page: 'desc' } },
        take: 10
      }),
      
      // Hourly visitor stats for the last 24 hours
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('hour', "createdAt") as hour,
          COUNT(*) as visitors
        FROM "Visitor"
        WHERE "createdAt" >= ${timeFilter}
        GROUP BY DATE_TRUNC('hour', "createdAt")
        ORDER BY hour DESC
        LIMIT 24
      `
    ])
    
    // Get real-time stats
    const realTimeStats = {
      totalVisitors,
      activeVisitors,
      uniqueCountries: uniqueCountries.length,
      topCountries: uniqueCountries
        .sort((a, b) => b._count.country - a._count.country)
        .slice(0, 5)
        .map(item => ({
          country: item.country || 'Unknown',
          count: item._count.country
        })),
      topPages: topPages.map(item => ({
        page: item.page,
        views: item._count.page
      })),
      hourlyStats: (hourlyStats as any[]).map(item => ({
        hour: item.hour,
        visitors: parseInt(item.visitors)
      }))
    }
    
    return NextResponse.json({
      success: true,
      visitors,
      total,
      stats: realTimeStats
    })
    
  } catch (error) {
    console.error('Error fetching visitor data:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch visitor data' 
    }, { status: 500 })
  }
}
