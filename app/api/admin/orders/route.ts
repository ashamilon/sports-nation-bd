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
                  id: true,
                  name: true,
                  images: true
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
    const formattedOrders = await Promise.all(orders.map(async order => {
      // Parse shipping address if it's a JSON string
      let shippingAddress = {}
      try {
        shippingAddress = typeof order.shippingAddress === 'string' 
          ? JSON.parse(order.shippingAddress) 
          : order.shippingAddress || {}
      } catch (e) {
        shippingAddress = {}
      }

      return {
        id: order.id,
        customer: {
          name: order.User?.name || 'Unknown Customer',
          email: order.User?.email || '',
          phone: shippingAddress.phone || shippingAddress.mobile || ''
        },
        items: await Promise.all(order.OrderItem.map(async item => {
          // Parse custom options if they exist
          let customOptions = null
          try {
            customOptions = item.customOptions ? JSON.parse(item.customOptions) : null
            
            // If badges are present, fetch badge details from database
            if (customOptions && customOptions.badges && Array.isArray(customOptions.badges) && customOptions.badges.length > 0) {
              try {
                const badgeDetails = await prisma.badges.findMany({
                  where: {
                    id: {
                      in: customOptions.badges
                    }
                  },
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    price: true,
                    description: true
                  }
                })
                
                // Map badge details to the customOptions
                customOptions.badgeDetails = badgeDetails
                
                // If some badges weren't found, add a note
                if (badgeDetails.length < customOptions.badges.length) {
                  const foundIds = badgeDetails.map(b => b.id)
                  const missingIds = customOptions.badges.filter((id: string) => !foundIds.includes(id))
                  customOptions.badgeNote = `Some badges not found: ${missingIds.join(', ')}`
                }
              } catch (badgeError) {
                console.error('Error fetching badge details:', badgeError)
                customOptions.badgeNote = `${customOptions.badges.length} badge(s) selected (details unavailable)`
              }
            }
          } catch (e) {
            customOptions = null
          }

          return {
            product: {
              name: item.Product.name
            },
            quantity: item.quantity,
            price: item.price,
            customOptions: customOptions
          }
        })),
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod || 'Unknown',
        courierService: order.courierService,
        courierTrackingId: order.courierTrackingId,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt.toISOString(),
        orderDate: order.createdAt.toLocaleDateString(),
        deliveryDate: order.status === 'completed' ? order.updatedAt.toLocaleDateString() : null,
        shippingAddress: {
          address: shippingAddress.address || '',
          city: shippingAddress.city || '',
          postalCode: shippingAddress.postalCode || '',
          ...shippingAddress
        }
      }
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