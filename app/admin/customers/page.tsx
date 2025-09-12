import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import CustomersManagement from '@/components/admin/customers-management'

export const metadata: Metadata = {
  title: 'Customers Management | Admin Dashboard',
  description: 'Manage customer accounts and information',
}

export default function AdminCustomersPage() {
  return (
    <AdminLayout>
      <CustomersManagement />
    </AdminLayout>
  )
}
