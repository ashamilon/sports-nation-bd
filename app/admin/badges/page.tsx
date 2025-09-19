import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import BadgeManagement from '@/components/admin/badge-management'

export const metadata: Metadata = {
  title: 'Badge Management',
  description: 'Manage football badges for product customization',
}

export default function AdminBadgesPage() {
  return (
    <AdminLayout>
      <BadgeManagement />
    </AdminLayout>
  )
}
