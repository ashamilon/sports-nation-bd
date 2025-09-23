"use client"

import { useRealtimeUpdates } from '@/lib/hooks/use-realtime-updates'

export default function RealtimeUpdates() {
  // Initialize real-time updates
  useRealtimeUpdates()
  
  // This component doesn't render anything, it just sets up the real-time update listeners
  return null
}

