'use client'

interface BehaviorData {
  sessionId: string
  visitorId?: string
  userId?: string
  behavior: 'cart_add' | 'checkout' | 'payment_success'
  productId?: string
  productName?: string
  value?: number
  metadata?: any
}

class BehaviorTracker {
  private sessionId: string
  private visitorId: string | null = null

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.visitorId = this.getVisitorId()
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = sessionStorage.getItem('behavior_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('behavior_session_id', sessionId)
    }
    return sessionId
  }

  private getVisitorId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('visitor_id')
  }

  async trackBehavior(data: Omit<BehaviorData, 'sessionId' | 'visitorId'>): Promise<boolean> {
    try {
      const behaviorData: BehaviorData = {
        sessionId: this.sessionId,
        visitorId: this.visitorId || undefined,
        ...data
      }

      const response = await fetch('/api/visitors/behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behaviorData),
      })

      if (!response.ok) {
        console.error('Failed to track behavior:', response.statusText)
        return false
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Error tracking behavior:', error)
      return false
    }
  }

  // Track when customer adds product to cart
  async trackCartAdd(productId: string, productName: string, price: number): Promise<boolean> {
    return this.trackBehavior({
      behavior: 'cart_add',
      productId,
      productName,
      value: price,
      metadata: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    })
  }

  // Track when customer reaches checkout page
  async trackCheckout(cartValue: number, itemCount: number): Promise<boolean> {
    return this.trackBehavior({
      behavior: 'checkout',
      value: cartValue,
      metadata: {
        timestamp: new Date().toISOString(),
        itemCount,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    })
  }

  // Track when payment is successful
  async trackPaymentSuccess(orderValue: number, orderId?: string): Promise<boolean> {
    return this.trackBehavior({
      behavior: 'payment_success',
      value: orderValue,
      metadata: {
        timestamp: new Date().toISOString(),
        orderId,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    })
  }
}

// Create a singleton instance
export const behaviorTracker = new BehaviorTracker()

// Export the class for custom usage
export { BehaviorTracker }
export type { BehaviorData }
