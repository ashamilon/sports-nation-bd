"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Shield,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'SMS Config', href: '/admin/sms-config', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Mock admin data - replace with actual admin data from auth
  const admin = {
    name: 'Admin User',
    email: '
    
    
    admin@sportsnationbd.com',
    avatar: '/api/placeholder/40/40',
    role: 'Super Admin',
    lastLogin: '2024-01-15 10:30 AM'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Admin Panel</span>
            </Link>
            <button
              className="lg:hidden glass-button p-2 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b border-border/50 flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src={admin.avatar} alt="Admin Avatar" layout="fill" objectFit="cover" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{admin.name}</p>
              <p className="text-sm text-muted-foreground">{admin.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent/50'
                    } glass-button`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Today's Sales</span>
              <span className="font-semibold text-green-500">৳12,450</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New Orders</span>
              <span className="font-semibold text-blue-500">23</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Users</span>
              <span className="font-semibold text-purple-500">156</span>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border/50">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-3 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors duration-200 glass-button"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col flex-1">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 glass-nav border-b border-border/50">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden glass-button p-2 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button p-2 rounded-lg"
                title="View Live Site"
              >
                <Eye className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button p-2 rounded-lg"
                title="Sales Report"
              >
                <TrendingUp className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button p-2 rounded-lg"
                title="Revenue"
              >
                <DollarSign className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Bell className="h-6 w-6 text-foreground" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">5</span>
            </div>

            {/* Admin Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src={admin.avatar} alt="Admin Avatar" layout="fill" objectFit="cover" />
            </div>
          </div>
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
