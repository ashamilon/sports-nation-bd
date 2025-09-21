import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import PathaoCourierDashboard from '@/components/admin/pathao-courier-dashboard'

export const metadata: Metadata = {
  title: 'Pathao Courier Management | Sports Nation BD Admin',
  description: 'Manage and track Pathao courier orders with analytics and reporting',
}

export default function PathaoCourierManagementPage() {
  return (
    <AdminLayout>
      <PathaoCourierDashboard />
    </AdminLayout>
  )
}
