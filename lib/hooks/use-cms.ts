"use client"

import { useState, useEffect } from 'react'

interface SiteContent {
  id: string
  key: string
  title?: string
  content: string
  type: string
  category: string
  isActive: boolean
  metadata?: string
}

interface Banner {
  id: string
  title: string
  description?: string
  image: string
  link?: string
  position: string
  priority: number
  isActive: boolean
  startsAt?: string
  expiresAt?: string
}

interface CountdownTimer {
  id: string
  title: string
  description?: string
  targetDate: string
  type: string
  targetId?: string
  isActive: boolean
  position: string
  priority: number
}

export function useSiteContent(key?: string, category?: string) {
  const [content, setContent] = useState<SiteContent | SiteContent[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    
    const fetchContent = async () => {
      try {
        setLoading(true)
        let url = '/api/cms/content'
        
        if (key) {
          url += `?key=${encodeURIComponent(key)}`
        } else if (category) {
          url += `?category=${encodeURIComponent(category)}`
        } else {
          url += '?all=true'
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch content')
        
        const data = await response.json()
        setContent(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [key, category])

  return { content, loading, error, isHydrated }
}

export function useBanners(position?: string) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    
    const fetchBanners = async () => {
      try {
        setLoading(true)
        let url = '/api/cms/banners'
        
        if (position) {
          url += `?position=${encodeURIComponent(position)}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch banners')
        
        const data = await response.json()
        setBanners(data.success ? data.data : [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [position])

  return { banners, loading, error, isHydrated }
}

export function useCountdowns(position?: string, type?: string) {
  const [countdowns, setCountdowns] = useState<CountdownTimer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    
    const fetchCountdowns = async () => {
      try {
        setLoading(true)
        let url = '/api/cms/countdowns'
        const params = new URLSearchParams()
        
        if (position) params.append('position', position)
        if (type) params.append('type', type)
        
        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch countdowns')
        
        const data = await response.json()
        setCountdowns(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setCountdowns([])
      } finally {
        setLoading(false)
      }
    }

    fetchCountdowns()
  }, [position, type])

  return { countdowns, loading, error, isHydrated }
}
