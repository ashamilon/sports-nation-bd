import { Metadata } from 'next'
import SimpleBadgeManagement from '@/components/admin/simple-badge-management'

export const metadata: Metadata = {
  title: 'Badge Management',
  description: 'Manage football badges for product customization',
}

export default function SimpleBadgeManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Badge Management</h1>
          <p className="text-muted-foreground mt-2">Manage football badges for product customization</p>
        </div>
        <SimpleBadgeManagement />
      </div>
    </div>
  )
}
