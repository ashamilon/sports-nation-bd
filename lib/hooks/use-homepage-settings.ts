import { useState, useEffect } from 'react'

interface HomepageSetting {
  id: string
  sectionKey: string
  sectionName: string
  isVisible: boolean
  sortOrder: number
  metadata: string | null
  createdAt: string
  updatedAt: string
}

export function useHomepageSettings() {
  const [settings, setSettings] = useState<HomepageSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/cms/homepage-settings')
        const data = await response.json()
        
        if (data.success) {
          setSettings(data.data)
        }
      } catch (error) {
        console.error('Error fetching homepage settings:', error)
      } finally {
        setLoading(false)
        setIsHydrated(true)
      }
    }

    fetchSettings()
  }, [])

  const isSectionVisible = (sectionKey: string): boolean => {
    const setting = settings.find(s => s.sectionKey === sectionKey)
    return setting ? setting.isVisible : true // Default to visible if not found
  }

  return {
    settings,
    loading,
    isHydrated,
    isSectionVisible
  }
}

