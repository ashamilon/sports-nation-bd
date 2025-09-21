'use client'

interface VisitorData {
  sessionId: string
  page: string
  title?: string
  referrer?: string
}

class VisitorTracker {
  private sessionId: string
  private startTime: number
  private currentPage: string

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.startTime = Date.now()
    this.currentPage = window.location.pathname
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('visitor_session_id')
    if (!sessionId) {
      sessionId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('visitor_session_id', sessionId)
    }
    return sessionId
  }

  private async trackPageView(data: VisitorData) {
    try {
      await fetch('/api/visitors/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.error('Error tracking visitor:', error)
    }
  }

  public trackPage(page: string, title?: string) {
    const referrer = document.referrer || undefined
    
    this.trackPageView({
      sessionId: this.sessionId,
      page,
      title: title || document.title,
      referrer
    })
    
    this.currentPage = page
  }

  public trackCurrentPage() {
    this.trackPage(
      window.location.pathname,
      document.title
    )
  }

  public trackPageExit() {
    // Calculate time spent on page
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000)
    
    // Send exit tracking (optional - for more detailed analytics)
    if (timeSpent > 5) { // Only track if spent more than 5 seconds
      this.trackPageView({
        sessionId: this.sessionId,
        page: this.currentPage,
        title: document.title,
        referrer: document.referrer || undefined
      })
    }
  }

  public getSessionId(): string {
    return this.sessionId
  }
}

// Global visitor tracker instance
let visitorTracker: VisitorTracker | null = null

export function initVisitorTracker(): VisitorTracker {
  if (!visitorTracker) {
    visitorTracker = new VisitorTracker()
    
    // Track initial page load
    visitorTracker.trackCurrentPage()
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        visitorTracker?.trackCurrentPage()
      }
    })
    
    // Track before page unload
    window.addEventListener('beforeunload', () => {
      visitorTracker?.trackPageExit()
    })
    
    // Track page changes for SPA navigation
    let lastUrl = window.location.href
    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href
      if (currentUrl !== lastUrl) {
        visitorTracker?.trackPage(
          window.location.pathname,
          document.title
        )
        lastUrl = currentUrl
      }
    })
    
    observer.observe(document, { subtree: true, childList: true })
  }
  
  return visitorTracker
}

export function getVisitorTracker(): VisitorTracker | null {
  return visitorTracker
}

export default VisitorTracker
