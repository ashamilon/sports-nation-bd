"use client"

import { useState, useEffect, useCallback } from 'react'
import { bannerCache } from '@/lib/banner-cache'

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

// Function to clear homepage cache
export function clearHomepageCache() {
  homepageCache = null
  cacheTimestamp = 0
}

// Function to preload banner data
export async function preloadBannerData() {
  try {
    await Promise.all([
      bannerCache.preloadBanners('home_top'),
      bannerCache.preloadBanners('home_hero')
    ])
  } catch (error) {
    console.error('Failed to preload banner data:', error)
  }
}

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        ...options.headers
      }
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export function useHomepageData() {
  console.log('🏠 useHomepageData hook initialized')
  
  const [state, setState] = useState<HomepageDataState>({
    data: null,
    loading: true,
    error: null,
    isHydrated: false
  })

  const fetchData = useCallback(async () => {
    let timeoutId: NodeJS.Timeout | null = null
    
    try {
      console.log('🚀 Starting homepage data fetch...')
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      // Add a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.log('⏰ Data fetch timeout - using fallback data')
        setState(prev => ({
          ...prev,
          data: {
            banners: {
              homeTop: [],
              homeHero: [],
            },
            countdowns: [],
            settings: [
              { sectionKey: 'banner', isVisible: true, sortOrder: 1, id: 'banner-section' },
              { sectionKey: 'hero', isVisible: false, sortOrder: 2, id: 'hero-section' },
              { sectionKey: 'categories', isVisible: true, sortOrder: 3, id: 'categories-section' },
              { sectionKey: 'collections', isVisible: true, sortOrder: 4, id: 'collections-section' },
              { sectionKey: 'featured-products', isVisible: false, sortOrder: 5, id: 'featured-products-section' },
              { sectionKey: 'countdown', isVisible: true, sortOrder: 6, id: 'countdown-section' },
              { sectionKey: 'exclusive-products', isVisible: true, sortOrder: 7, id: 'exclusive-products-section' },
              { sectionKey: 'reviews-carousel', isVisible: true, sortOrder: 8, id: 'reviews-carousel-section' },
            ],
            products: [],
            collections: []
          },
          loading: false,
          error: null,
          isHydrated: true
        }))
      }, 5000) // 5 second timeout

      // Check cache first
      const now = Date.now()
      if (homepageCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('📦 Using cached homepage data')
        setState(prev => ({
          ...prev,
          data: homepageCache,
          loading: false,
          isHydrated: true
        }))
        return
      }

      console.log('🌐 Fetching fresh data from CMS APIs...')

      // Fetch data with detailed error handling
      const apiCalls = [
        { name: 'banners-top', url: '/api/cms/banners?position=home_top' },
        { name: 'banners-hero', url: '/api/cms/banners?position=home_hero' },
        { name: 'countdowns', url: '/api/cms/countdowns?position=home' },
        { name: 'homepage-settings', url: '/api/cms/homepage-settings' },
        { name: 'featured-products', url: '/api/products?featured=true&limit=6' },
        { name: 'collections', url: '/api/collections?isActive=true&isFeatured=true' }
      ]

      const results = await Promise.allSettled(
        apiCalls.map(async (call) => {
          try {
            console.log(`🔄 Fetching ${call.name} from ${call.url}`)
            const response = await fetch(call.url, { 
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json',
              }
            })
            
            if (!response.ok) {
              throw new Error(`${call.name}: HTTP ${response.status} ${response.statusText}`)
            }
            
            const data = await response.json()
            console.log(`✅ ${call.name}:`, data)
            return { name: call.name, data }
          } catch (error) {
            console.error(`❌ Error fetching ${call.name}:`, error)
            throw error
          }
        })
      )

      // Process results with detailed logging
      const processedResults: any = {}
      const errors: string[] = []

      results.forEach((result, index) => {
        const callName = apiCalls[index].name
        if (result.status === 'fulfilled') {
          processedResults[callName] = result.value.data
          console.log(`✅ ${callName} completed successfully`)
        } else {
          const error = result.reason?.message || 'Unknown error'
          errors.push(`${callName}: ${error}`)
          console.error(`❌ ${callName} failed:`, error)
          processedResults[callName] = { data: [] } // Fallback to empty data
        }
      })

      // Log any errors but continue with available data
      if (errors.length > 0) {
        console.warn('⚠️ Some API calls failed:', errors)
      }

      const homepageData: HomepageData = {
        banners: {
          homeTop: processedResults['banners-top']?.data || [],
          homeHero: processedResults['banners-hero']?.data || [],
        },
        countdowns: processedResults['countdowns']?.data || [],
        settings: processedResults['homepage-settings']?.data || [],
        products: processedResults['featured-products']?.data || [],
        collections: processedResults['collections']?.data || []
      }

      console.log('📊 Final homepage data:', homepageData)
      console.log('🎯 Settings for visibility check:', homepageData.settings)

      // Update cache
      homepageCache = homepageData
      cacheTimestamp = Date.now()

            setState(prev => ({
              ...prev,
              data: homepageData,
              loading: false,
              isHydrated: true,
              error: errors.length > 0 ? `Some data failed to load: ${errors.join(', ')}` : null
            }))

            if (timeoutId) clearTimeout(timeoutId) // Clear the timeout since we got data
            console.log('✅ Homepage data fetch completed successfully')

    } catch (error) {
      console.error('💥 Critical error in fetchData:', error)
      if (timeoutId) clearTimeout(timeoutId) // Clear the timeout on error
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Failed to load homepage data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isHydrated: true
      }))
    }
  }, [])

  useEffect(() => {
    console.log('🔄 useEffect called - fetching real data from CMS')
    // Fetch real data from CMS
    fetchData()

    // Listen for homepage settings updates
    const handleHomepageUpdate = () => {
      console.log('🔄 Homepage settings updated - refetching data')
      clearHomepageCache()
      fetchData()
    }

    window.addEventListener('homepage-settings-updated', handleHomepageUpdate)

    return () => {
      window.removeEventListener('homepage-settings-updated', handleHomepageUpdate)
    }
  }, []) // Remove fetchData from dependencies to avoid infinite loop

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
