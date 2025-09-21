import GlobalLoading from '@/components/global-loading'

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <GlobalLoading 
        size="lg"
        text="Loading admin panel..."
      />
    </div>
  )
}
