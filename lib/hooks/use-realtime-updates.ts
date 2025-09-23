"use client"

import { useEffect } from 'react'

// Hook to handle real-time updates for collections and other CMS data
export function useRealtimeUpdates() {
  useEffect(() => {
    // Intercept fetch requests to detect when collections are updated
    const originalFetch = window.fetch
    
    window.fetch = async (...args) => {
      const response = await originalFetch(...args)
      
      // Check if this is a collections API call that resulted in an update
      const url = args[0]?.toString() || ''
      const options = args[1] as RequestInit || {}
      const method = options.method || 'GET'
      
      const isCollectionsUpdate = url.includes('/api/collections') && 
        (method === 'POST' || method === 'PUT' || method === 'DELETE')
      
      if (isCollectionsUpdate && response.headers.get('X-Collections-Updated') === 'true') {
        console.log('Collections updated detected, triggering real-time update event')
        
        // Dispatch custom event to notify components
        window.dispatchEvent(new CustomEvent('collections-updated', {
          detail: { timestamp: Date.now() }
        }))
      }
      
      return response
    }
    
    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch
    }
  }, [])
}

// Hook to listen for specific real-time update events
export function useRealtimeEventListener(eventName: string, callback: () => void) {
  useEffect(() => {
    const handleEvent = () => {
      console.log(`Real-time update event received: ${eventName}`)
      callback()
    }
    
    window.addEventListener(eventName, handleEvent)
    
    return () => {
      window.removeEventListener(eventName, handleEvent)
    }
  }, [eventName, callback])
}

