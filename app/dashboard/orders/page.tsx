import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import OrdersList from '@/components/dashboard/orders-list'

export const metadata: Metadata = {
  title: 'My Orders | Sports Nation BD',
  description: 'View and track your orders',
}

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <OrdersList />
    </DashboardLayout>
  )
}
