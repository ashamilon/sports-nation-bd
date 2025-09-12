import { Metadata } from 'next'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import ProfileForm from '@/components/dashboard/profile-form'

export const metadata: Metadata = {
  title: 'Profile Settings | Sports Nation BD',
  description: 'Manage your profile information',
}

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfileForm />
    </DashboardLayout>
  )
}
