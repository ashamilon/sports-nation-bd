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
    // Fetch real user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            orders: true,
            reviews: true
          }
        }
      }
    })

    if (!user) {
      return (
        <div className="space-y-1 p-1 pt-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">User not found</p>
          </div>
        </div>
      )
    }

    // Calculate real stats
    const totalOrders = user._count.orders
    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0)
    const totalReviews = user._count.reviews
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
            Welcome back, {user.name || 'User'}!
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
          <SimpleLoyaltyStatus />
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
              {user.orders.length > 0 ? (
                user.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium text-foreground">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">৳{order.total.toLocaleString()}</p>
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
          <p className="text-muted-foreground mb-6">Error loading dashboard data</p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    )
  }
}

