'use client'

import { useGlobalLoading } from '@/lib/use-global-loading'
import { Button } from '@/components/ui/button'

export default function LoadingDemo() {
  const { showLoading, hideLoading, withLoading } = useGlobalLoading()

  const handleShowLoading = () => {
    showLoading('Processing your request...')
    setTimeout(() => {
      hideLoading()
    }, 3000)
  }

  const handleAsyncOperation = async () => {
    await withLoading(async () => {
      // Simulate an async operation
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Operation completed!')
    }, 'Performing async operation...')
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Loading Demo</h2>
      <p className="text-muted-foreground">
        Click the buttons below to see the global loading animation with rotating logo.
      </p>
      
      <div className="flex gap-4">
        <Button onClick={handleShowLoading}>
          Show Loading (3s)
        </Button>
        
        <Button onClick={handleAsyncOperation} variant="outline">
          Async Operation (2s)
        </Button>
      </div>
    </div>
  )
}
