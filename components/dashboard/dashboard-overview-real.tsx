import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SimpleLoyaltyStatus from '@/components/simple-loyalty-status'
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  User,
  MapPin
} from 'lucide-react'

// Wrapper component to handle loyalty status errors gracefully
function LoyaltyStatusWrapper() {
  try {
    return <SimpleLoyaltyStatus />
  } catch (error) {
    console.error('Error in loyalty status wrapper:', error)
    return (
      <div className="glass-card p-4 rounded-2xl">
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold mb-2">Loyalty Status</h3>
          <p className="text-muted-foreground text-sm">
            Loyalty status temporarily unavailable
          </p>
        </div>
      </div>
    )
  }
}

export default async function DashboardOverviewReal() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <div className="space-y-1 p-1 pt-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Welcome to Sports Nation BD</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your dashboard</p>
          <Link 
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  try {
    // Debug: Log session information
    console.log('Dashboard session:', {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      sessionFull: session
    })

    // Fetch real user data with error handling
    console.log('Attempting to find user with ID:', session.user.id)
    
    // First, get the user without the problematic relations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        loyaltyLevel: true,
        createdAt: true
      }
    }).catch((dbError) => {
      console.error('Database error in dashboard:', dbError)
      console.error('Error details:', {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      })
      return null
    })
    
    console.log('Database query result:', user ? 'User found' : 'User not found')
    if (user) {
      console.log('User data:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country
      })
    }

    let finalUser = user

    if (!finalUser) {
      // Try to find user by email as fallback
      console.log('Trying to find user by email...')
      const userByEmail = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          country: true,
          loyaltyLevel: true,
          createdAt: true
        }
      }).catch((dbError) => {
        console.error('Database error finding user by email:', dbError)
        return null
      })

      if (userByEmail) {
        console.log('User found by email, using that data')
        finalUser = userByEmail
      } else {
        return (
          <div className="space-y-1 p-1 pt-4">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
              <p className="text-muted-foreground mb-6">User account not found</p>
              <div className="bg-muted/50 p-4 rounded-lg mb-4 text-left max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">Debug Information:</p>
                <p className="text-xs text-muted-foreground mb-1">
                  Session User ID: {session.user.id}
                </p>
                <p className="text-xs text-muted-foreground mb-1">
                  Session Email: {session.user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  This information is being logged to the console for debugging.
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your session is valid, but we couldn't find your user account in our database.
                This usually means there's a mismatch between your session and database records.
              </p>
              <div className="space-y-2">
                <Link 
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mr-2"
                >
                  Sign In Again
                </Link>
                <Link 
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )
      }
    }

    // Fetch real order data from database
    const [orderStats, recentOrders] = await Promise.all([
      // Get order statistics
      prisma.order.aggregate({
        where: { userId: finalUser.id },
        _count: { id: true },
        _sum: { total: true }
      }).catch(() => ({ _count: { id: 0 }, _sum: { total: 0 } })),
      
      // Get recent orders
      prisma.order.findMany({
        where: { userId: finalUser.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          OrderItem: {
            include: {
              Product: true
            }
          }
        }
      }).catch(() => [])
    ])

    const totalOrders = orderStats._count.id || 0
    const totalSpent = orderStats._sum.total || 0
    const totalReviews = 0 // TODO: Implement reviews functionality
    const wishlistCount = 0 // TODO: Implement wishlist functionality

    const stats = [
      {
        title: 'Total Orders',
        value: totalOrders.toString(),
        change: totalOrders > 0 ? `৳${totalSpent.toLocaleString()} total spent` : 'No orders yet',
        icon: ShoppingBag,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
      },
      {
        title: 'Wishlist Items',
        value: wishlistCount.toString(),
        change: wishlistCount > 0 ? 'Items saved for later' : 'No items saved',
        icon: Heart,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10'
      },
      {
        title: 'Total Spent',
        value: `৳${totalSpent.toLocaleString()}`,
        change: totalOrders > 0 ? `${totalOrders} orders completed` : 'Start shopping!',
        icon: TrendingUp,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10'
      },
      {
        title: 'Reviews Given',
        value: totalReviews.toString(),
        change: totalReviews > 0 ? 'Thank you for your feedback!' : 'Share your experience',
        icon: Star,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10'
      }
    ]

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'completed':
          return <CheckCircle className="h-4 w-4 text-green-500" />
        case 'shipped':
          return <Package className="h-4 w-4 text-blue-500" />
        case 'processing':
          return <Clock className="h-4 w-4 text-yellow-500" />
        case 'cancelled':
          return <XCircle className="h-4 w-4 text-red-500" />
        default:
          return <Clock className="h-4 w-4 text-gray-500" />
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed':
          return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
        case 'shipped':
          return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
        case 'processing':
          return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
        case 'cancelled':
          return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
        default:
          return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
      }
    }

    return (
      <div className="space-y-1 p-1 pt-4">
        {/* Header */}
        <div>
          <h1 className="text-base font-bold text-foreground">
            Welcome back, {finalUser.name || 'User'}!
          </h1>
          <p className="text-muted-foreground text-xs">
            Here's what's happening with your account.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="glass-card p-4 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Loyalty Status */}
        <div>
          <LoyaltyStatusWrapper />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Recent Orders */}
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
              <Link 
                href="/dashboard/orders"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.OrderItem.length} item{order.OrderItem.length !== 1 ? 's' : ''} • ৳{order.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start shopping to see your orders here!
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/dashboard/orders"
                className="flex items-center gap-3 p-3 glass-card rounded-lg hover:bg-primary/5 transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">View All Orders</p>
                  <p className="text-sm text-muted-foreground">Track your order history</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/wishlist"
                className="flex items-center gap-3 p-3 glass-card rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">My Wishlist</p>
                  <p className="text-sm text-muted-foreground">View saved items</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/profile"
                className="flex items-center gap-3 p-3 glass-card rounded-lg hover:bg-primary/5 transition-colors"
              >
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Edit Profile</p>
                  <p className="text-sm text-muted-foreground">Update your information</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    return (
      <div className="space-y-1 p-1 pt-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
          <p className="text-muted-foreground mb-6">Unable to load dashboard data</p>
          <p className="text-sm text-muted-foreground mb-4">
            There was an issue loading your dashboard information. This might be due to:
          </p>
          <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto mb-6">
            <li>• Database connection issues</li>
            <li>• Missing user data</li>
            <li>• Authentication problems</li>
          </ul>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mr-2"
            >
              Refresh Page
            </button>
            <Link 
              href="/auth/signin"
              className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Sign In Again
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

