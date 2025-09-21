import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import DashboardOverviewOptimized from '@/components/dashboard/dashboard-overview-optimized'

export const metadata: Metadata = {
  title: 'Dashboard | Sports Nation BD',
  description: 'Manage your account, orders, and preferences',
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverviewOptimized />
    </DashboardLayout>
  )
}
