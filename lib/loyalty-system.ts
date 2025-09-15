import { prisma } from '@/lib/prisma'

export type LoyaltyLevel = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface LoyaltyLevelConfig {
  name: string
  displayName: string
  color: string
  icon: string
  discount: number
  promotionRequirements: {
    orders: number
    periodMonths: number
    minOrderAmount: number
  }
  demotionRequirements: {
    minOrdersPerMonth: number
    gracePeriodMonths: number
  }
  specialRules?: {
    monthlyLimit?: boolean // For platinum
    firstOrderBonus?: boolean // For iron
  }
}

export const LOYALTY_LEVELS: Record<LoyaltyLevel, LoyaltyLevelConfig> = {
  bronze: {
    name: 'bronze',
    displayName: 'Bronze',
    color: '#CD7F32',
    icon: '🥉',
    discount: 50,
    promotionRequirements: {
      orders: 10,
      periodMonths: 3,
      minOrderAmount: 1000
    },
    demotionRequirements: {
      minOrdersPerMonth: 2,
      gracePeriodMonths: 1
    },
    specialRules: {
      firstOrderBonus: true
    }
  },
  silver: {
    name: 'silver',
    displayName: 'Silver',
    color: '#C0C0C0',
    icon: '🥈',
    discount: 150,
    promotionRequirements: {
      orders: 30,
      periodMonths: 3,
      minOrderAmount: 1000
    },
    demotionRequirements: {
      minOrdersPerMonth: 3,
      gracePeriodMonths: 1
    }
  },
  gold: {
    name: 'gold',
    displayName: 'Gold',
    color: '#FFD700',
    icon: '🥇',
    discount: 220,
    promotionRequirements: {
      orders: 50,
      periodMonths: 3,
      minOrderAmount: 1000
    },
    demotionRequirements: {
      minOrdersPerMonth: 5,
      gracePeriodMonths: 1
    }
  },
  platinum: {
    name: 'platinum',
    displayName: 'Platinum',
    color: '#E5E4E2',
    icon: '💎',
    discount: 400,
    promotionRequirements: {
      orders: 50,
      periodMonths: 3,
      minOrderAmount: 1000
    },
    demotionRequirements: {
      minOrdersPerMonth: 8,
      gracePeriodMonths: 1
    }
  }
}

export class LoyaltySystem {
  /**
   * Check if user is eligible for loyalty program (Bangladesh only)
   */
  static isEligibleForLoyalty(userCountry: string): boolean {
    return userCountry?.toLowerCase() === 'bangladesh' || userCountry?.toLowerCase() === 'bd'
  }

  /**
   * Get user's current loyalty level configuration
   */
  static getUserLevelConfig(level: LoyaltyLevel): LoyaltyLevelConfig {
    return LOYALTY_LEVELS[level]
  }

  /**
   * Calculate discount for a user based on their loyalty level
   */
  static calculateDiscount(
    userId: string,
    userLevel: LoyaltyLevel,
    orderAmount: number,
    isFirstOrder: boolean = false
  ): number {
    const config = LOYALTY_LEVELS[userLevel]
    
    // Check minimum order amount requirement
    if (orderAmount < 1000) {
      return 0
    }

    // Special first order bonus for Bronze level
    if (userLevel === 'bronze' && isFirstOrder && config.specialRules?.firstOrderBonus) {
      return 50
    }

    // Platinum gets 400৳ discount on every order
    if (userLevel === 'platinum') {
      return config.discount
    }

    return config.discount
  }

  /**
   * Check if user can use platinum discount this month
   */
  static async canUsePlatinumDiscount(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { platinumDiscountUsed: true }
    })

    if (!user?.platinumDiscountUsed) {
      return true
    }

    const lastUsed = new Date(user.platinumDiscountUsed)
    const now = new Date()
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    return lastUsed < monthAgo
  }

  /**
   * Update user's loyalty level based on order completion
   */
  static async updateUserLoyalty(userId: string, orderAmount: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { orders: true }
    })

    if (!user || !this.isEligibleForLoyalty(user.country || '')) {
      return
    }

    const now = new Date()
    const currentLevel = user.loyaltyLevel as LoyaltyLevel
    const currentConfig = LOYALTY_LEVELS[currentLevel]

    // Update basic stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalOrders: user.totalOrders + 1,
        totalSpent: user.totalSpent + orderAmount,
        lastOrderDate: now
      }
    })

    // Check for promotion
    await this.checkPromotion(userId, currentLevel, now)
    
    // Check for demotion (run after promotion check)
    await this.checkDemotion(userId, currentLevel, now)
  }

  /**
   * Check if user should be promoted to next level
   */
  private static async checkPromotion(userId: string, currentLevel: LoyaltyLevel, now: Date): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { orders: true }
    })

    if (!user) return

    const currentConfig = LOYALTY_LEVELS[currentLevel]
    const nextLevel = this.getNextLevel(currentLevel)
    
    if (!nextLevel) return // Already at highest level

    const nextConfig = LOYALTY_LEVELS[nextLevel]
    const periodStart = user.currentPeriodStart || user.createdAt
    const periodEnd = new Date(periodStart.getTime() + (nextConfig.promotionRequirements.periodMonths * 30 * 24 * 60 * 60 * 1000))

    // Count orders in current period
    const ordersInPeriod = user.orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= periodStart && orderDate <= periodEnd && order.status === 'completed'
    })

    const totalSpentInPeriod = ordersInPeriod.reduce((sum, order) => sum + order.total, 0)

    // Check promotion requirements
    if (
      ordersInPeriod.length >= nextConfig.promotionRequirements.orders &&
      totalSpentInPeriod >= nextConfig.promotionRequirements.minOrderAmount
    ) {
      await this.promoteUser(userId, currentLevel, nextLevel, ordersInPeriod.length, periodStart, periodEnd, totalSpentInPeriod)
    }
  }

  /**
   * Check if user should be demoted to previous level
   */
  private static async checkDemotion(userId: string, currentLevel: LoyaltyLevel, now: Date): Promise<void> {
    if (currentLevel === 'bronze') return // Can't demote from bronze

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { orders: true }
    })

    if (!user || !user.lastOrderDate) return

    const currentConfig = LOYALTY_LEVELS[currentLevel]
    const gracePeriodEnd = new Date(user.lastOrderDate.getTime() + (currentConfig.demotionRequirements.gracePeriodMonths * 30 * 24 * 60 * 60 * 1000))

    // Check if grace period has passed
    if (now > gracePeriodEnd) {
      // Count orders in the last month
      const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      const recentOrders = user.orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= oneMonthAgo && order.status === 'completed'
      })

      if (recentOrders.length < currentConfig.demotionRequirements.minOrdersPerMonth) {
        const previousLevel = this.getPreviousLevel(currentLevel)
        if (previousLevel) {
          await this.demoteUser(userId, currentLevel, previousLevel, recentOrders.length, oneMonthAgo, now, 0)
        }
      }
    }
  }

  /**
   * Promote user to next level
   */
  private static async promoteUser(
    userId: string,
    fromLevel: LoyaltyLevel,
    toLevel: LoyaltyLevel,
    ordersCount: number,
    periodStart: Date,
    periodEnd: Date,
    totalSpent: number
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update user level
      await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyLevel: toLevel,
          currentPeriodOrders: 0,
          currentPeriodStart: new Date()
        }
      })

      // Record in loyalty history
      await tx.loyaltyHistory.create({
        data: {
          userId,
          fromLevel,
          toLevel,
          reason: 'promotion',
          ordersCount,
          periodStart,
          periodEnd,
          totalSpent
        }
      })
    })
  }

  /**
   * Demote user to previous level
   */
  private static async demoteUser(
    userId: string,
    fromLevel: LoyaltyLevel,
    toLevel: LoyaltyLevel,
    ordersCount: number,
    periodStart: Date,
    periodEnd: Date,
    totalSpent: number
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update user level
      await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyLevel: toLevel,
          currentPeriodOrders: 0,
          currentPeriodStart: new Date()
        }
      })

      // Record in loyalty history
      await tx.loyaltyHistory.create({
        data: {
          userId,
          fromLevel,
          toLevel,
          reason: 'demotion',
          ordersCount,
          periodStart,
          periodEnd,
          totalSpent
        }
      })
    })
  }

  /**
   * Get next loyalty level
   */
  private static getNextLevel(currentLevel: LoyaltyLevel): LoyaltyLevel | null {
    const levels: LoyaltyLevel[] = ['bronze', 'silver', 'gold', 'platinum']
    const currentIndex = levels.indexOf(currentLevel)
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null
  }

  /**
   * Get previous loyalty level
   */
  private static getPreviousLevel(currentLevel: LoyaltyLevel): LoyaltyLevel | null {
    const levels: LoyaltyLevel[] = ['bronze', 'silver', 'gold', 'platinum']
    const currentIndex = levels.indexOf(currentLevel)
    return currentIndex > 0 ? levels[currentIndex - 1] : null
  }

  /**
   * Get user's loyalty status and benefits
   */
  static async getUserLoyaltyStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        loyaltyHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!user) return null

    const currentConfig = LOYALTY_LEVELS[user.loyaltyLevel as LoyaltyLevel]
    const nextLevel = this.getNextLevel(user.loyaltyLevel as LoyaltyLevel)
    const nextConfig = nextLevel ? LOYALTY_LEVELS[nextLevel] : null

    return {
      currentLevel: user.loyaltyLevel,
      currentConfig,
      nextLevel,
      nextConfig,
      totalOrders: user.totalOrders,
      totalSpent: user.totalSpent,
      isEligible: this.isEligibleForLoyalty(user.country || ''),
      history: user.loyaltyHistory,
      canUsePlatinumDiscount: user.loyaltyLevel === 'platinum' ? await this.canUsePlatinumDiscount(userId) : true
    }
  }
}
