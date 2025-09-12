import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import OrdersManagement from '@/components/admin/orders-management'

export const metadata: Metadata = {
  title: 'Orders Management | Admin Dashboard',
  description: 'Manage customer orders and fulfillment',
}

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrdersManagement />
    </AdminLayout>
  )
}
