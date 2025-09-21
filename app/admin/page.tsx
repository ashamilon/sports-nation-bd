import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import AdminOverviewSimple from '@/components/admin/admin-overview-simple'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Sports Nation BD',
  description: 'Admin dashboard for managing Sports Nation BD e-commerce platform',
}

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminOverviewSimple />
    </AdminLayout>
  )
}
