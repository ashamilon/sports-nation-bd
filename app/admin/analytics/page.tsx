import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import AnalyticsDashboard from '@/components/admin/analytics-dashboard'

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Admin Dashboard',
  description: 'View sales analytics and business insights',
}

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <AnalyticsDashboard />
    </AdminLayout>
  )
}
