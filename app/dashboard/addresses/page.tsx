import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import AddressBook from '@/components/dashboard/address-book'

export const metadata: Metadata = {
  title: 'Address Book | Sports Nation BD',
  description: 'Manage your shipping and billing addresses',
}

export default function AddressesPage() {
  return (
    <DashboardLayout>
      <AddressBook />
    </DashboardLayout>
  )
}
