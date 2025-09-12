import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import DashboardOverview from '@/components/dashboard/dashboard-overview'

export const metadata: Metadata = {
  title: 'Dashboard | Sports Nation BD',
  description: 'Manage your account, orders, and preferences',
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}
