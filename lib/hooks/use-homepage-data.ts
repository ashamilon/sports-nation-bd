"use client"

import { useState, useEffect } from 'react'

interface HomepageData {
  banners: {
    homeTop: any[]
    homeHero: any[]
  }
  countdowns: any[]
  settings: any[]
  products: any[]
  collections: any[]
}

interface HomepageDataState {
  data: HomepageData | null
  loading: boolean
  error: string | null
  isHydrated: boolean
}

// Cache for homepage data
let homepageCache: HomepageData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useHomepageData() {
  const [state, setState] = useState<HomepageDataState>({
    data: null,
    loading: true,
    error: null,
    isHydrated: false
  })

  useEffect(() => {
    setState(prev => ({ ...prev, isHydrated: true }))
    
    const fetchHomepageData = async () => {
      // Check cache first
      const now = Date.now()
      if (homepageCache && (now - cacheTimestamp) < CACHE_DURATION) {
        setState({
          data: homepageCache,
          loading: false,
          error: null,
          isHydrated: true
        })
        return
      }

      try {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // Fetch all data in parallel
        const [
          homeTopBannersResponse,
          homeHeroBannersResponse,
          countdownsResponse,
          settingsResponse,
          productsResponse,
          collectionsResponse
        ] = await Promise.allSettled([
          fetch('/api/cms/banners?position=home_top'),
          fetch('/api/cms/banners?position=home_hero'),
          fetch('/api/cms/countdowns?position=home'),
          fetch('/api/cms/homepage-settings'),
          fetch('/api/products?featured=true&limit=6'),
          fetch('/api/collections?isActive=true&isFeatured=true')
        ])

        // Process responses
        const homeTopBanners = homeTopBannersResponse.status === 'fulfilled' 
          ? await homeTopBannersResponse.value.json().then((data: any) => data.success ? data.data : [])
          : []

        const homeHeroBanners = homeHeroBannersResponse.status === 'fulfilled'
          ? await homeHeroBannersResponse.value.json().then((data: any) => data.success ? data.data : [])
          : []

        const countdowns = countdownsResponse.status === 'fulfilled'
          ? await countdownsResponse.value.json()
          : []

        const settings = settingsResponse.status === 'fulfilled'
          ? await settingsResponse.value.json().then((data: any) => data.success ? data.data : [])
          : []

        const products = productsResponse.status === 'fulfilled'
          ? await productsResponse.value.json().then((data: any) => data.success ? data.data : [])
          : []

        const collections = collectionsResponse.status === 'fulfilled'
          ? await collectionsResponse.value.json().then((data: any) => data.success ? data.data : [])
          : []

        const homepageData: HomepageData = {
          banners: {
            homeTop: homeTopBanners,
            homeHero: homeHeroBanners
          },
          countdowns,
          settings,
          products,
          collections
        }

        // Update cache
        homepageCache = homepageData
        cacheTimestamp = now

        setState({
          data: homepageData,
          loading: false,
          error: null,
          isHydrated: true
        })

      } catch (error) {
        console.error('Error fetching homepage data:', error)
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load homepage data',
          isHydrated: true
        })
      }
    }

    fetchHomepageData()
  }, [])

  const isSectionVisible = (sectionKey: string): boolean => {
    if (!state.data?.settings) return true // Default to visible if no settings
    const setting = state.data.settings.find((s: any) => s.sectionKey === sectionKey)
    return setting ? setting.isVisible : true
  }

  return {
    ...state,
    isSectionVisible
  }
}
