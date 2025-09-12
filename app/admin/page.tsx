import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import AdminOverview from '@/components/admin/admin-overview'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Sports Nation BD',
  description: 'Admin dashboard for managing Sports Nation BD e-commerce platform',
}

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminOverview />
    </AdminLayout>
  )
}
