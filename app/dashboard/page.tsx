import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import DashboardOverviewReal from '@/components/dashboard/dashboard-overview-real'

export const metadata: Metadata = {
  title: 'Dashboard | Sports Nation BD',
  description: 'Manage your account, orders, and preferences',
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverviewReal />
    </DashboardLayout>
  )
}
