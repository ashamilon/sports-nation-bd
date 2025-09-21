import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import LiveVisitors from '@/components/admin/live-visitors'

export const metadata: Metadata = {
  title: 'Live Visitors | Admin Dashboard',
  description: 'Real-time visitor tracking and analytics',
}

export default function VisitorsPage() {
  return (
    <AdminLayout>
      <LiveVisitors />
    </AdminLayout>
  )
}
