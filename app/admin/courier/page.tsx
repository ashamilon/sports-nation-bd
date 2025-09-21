import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import CourierDashboard from '@/components/admin/courier-dashboard'

export const metadata: Metadata = {
  title: 'Courier Management | Sports Nation BD Admin',
  description: 'Manage and track courier orders',
}

export default function CourierManagementPage() {
  return (
    <AdminLayout>
      <CourierDashboard />
    </AdminLayout>
  )
}