// Banner cache service for ultra-fast loading
class BannerCache {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  get(key: string) {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  clear() {
    this.cache.clear()
  }

  // Preload banner data
  async preloadBanners(position?: string) {
    const cacheKey = `banners-${position || 'all'}`
    
    // Check if already cached
    if (this.get(cacheKey)) {
      return this.get(cacheKey)
    }

    try {
      const url = position 
        ? `/api/cms/banners?position=${encodeURIComponent(position)}`
        : '/api/cms/banners'
      
      const response = await fetch(url, {
        cache: 'force-cache',
        headers: { 'Cache-Control': 'max-age=1800' }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          this.set(cacheKey, data.data)
          return data.data
        }
      }
    } catch (error) {
      console.error('Failed to preload banners:', error)
    }

    return null
  }
}

export const bannerCache = new BannerCache()

