import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Function to get IP address from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return '127.0.0.1' // fallback for localhost
}

// Function to get location data from IP (using a free service)
async function getLocationFromIP(ip: string) {
  try {
    // Skip location lookup for localhost/private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Local',
        city: 'Local',
        region: 'Local',
        timezone: 'Local',
        isp: 'Local',
        latitude: null,
        longitude: null
      }
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,timezone,isp,lat,lon,query`)
    
    if (!response.ok) {
      throw new Error('Location API failed')
    }
    
    const data = await response.json()
    
    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown',
        region: data.regionName || 'Unknown',
        timezone: data.timezone || 'Unknown',
        isp: data.isp || 'Unknown',
        latitude: data.lat || null,
        longitude: data.lon || null
      }
    }
    
    throw new Error('Location API returned error')
  } catch (error) {
    console.error('Error fetching location:', error)
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      timezone: 'Unknown',
      isp: 'Unknown',
      latitude: null,
      longitude: null
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, page, title, referrer } = body
    
    if (!sessionId || !page) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    
    // Get location data
    const locationData = await getLocationFromIP(ip)
    
    // Check if visitor already exists
    let visitor = await prisma.visitor.findUnique({
      where: { sessionId }
    })
    
    if (visitor) {
      // Update existing visitor
      visitor = await prisma.visitor.update({
        where: { sessionId },
        data: {
          lastSeen: new Date(),
          isActive: true,
          page,
          referrer: referrer || null,
          ...locationData
        }
      })
    } else {
      // Create new visitor
      visitor = await prisma.visitor.create({
        data: {
          sessionId,
          ipAddress: ip,
          userAgent,
          page,
          referrer: referrer || null,
          ...locationData
        }
      })
    }
    
    // Create page view record
    await prisma.pageView.create({
      data: {
        visitorId: visitor.id,
        page,
        title: title || null,
        referrer: referrer || null
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      visitorId: visitor.id 
    })
    
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json({ 
      error: 'Failed to track visitor' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const activeOnly = searchParams.get('active') === 'true'
    
    const where = activeOnly ? {
      isActive: true,
      lastSeen: {
        gte: new Date(Date.now() - 5 * 60 * 1000) // Active in last 5 minutes
      }
    } : {}
    
    const visitors = await prisma.visitor.findMany({
      where,
      orderBy: { lastSeen: 'desc' },
      take: limit,
      include: {
        pageViews: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      visitors 
    })
    
  } catch (error) {
    console.error('Error fetching visitors:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch visitors' 
    }, { status: 500 })
  }
}
