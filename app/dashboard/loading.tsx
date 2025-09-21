import GlobalLoading from '@/components/global-loading'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <GlobalLoading 
        size="lg"
        text="Loading dashboard..."
      />
    </div>
  )
}
