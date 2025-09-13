import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import OrderTracking from '@/components/dashboard/order-tracking'

export const metadata: Metadata = {
  title: 'Order Tracking | Sports Nation BD',
  description: 'Track your orders and delivery status',
}

export default function TrackingPage() {
  return (
    <DashboardLayout>
      <OrderTracking />
    </DashboardLayout>
  )
}
