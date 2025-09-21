import GlobalLoading from '@/components/global-loading'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <GlobalLoading 
        size="lg"
        text="Loading page..."
      />
    </div>
  )
}
