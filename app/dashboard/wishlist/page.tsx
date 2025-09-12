import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import WishlistItems from '@/components/dashboard/wishlist-items'

export const metadata: Metadata = {
  title: 'My Wishlist | Sports Nation BD',
  description: 'Your saved favorite products',
}

export default function WishlistPage() {
  return (
    <DashboardLayout>
      <WishlistItems />
    </DashboardLayout>
  )
}
