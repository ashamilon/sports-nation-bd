"use client"

import { useRegionalStore } from '@/lib/store/regional-store'
import { useTranslation } from '@/lib/translations'

export function RegionalTopBar() {
  const { getDeliveryInfo, settings, formatPrice } = useRegionalStore()
  const t = useTranslation(settings.language)
  
  const deliveryInfo = getDeliveryInfo()

  const getDeliveryText = () => {
    if (deliveryInfo.isFreeDelivery) {
      return t('freeDelivery')
    } else {
      return t('deliveryCharge', { amount: formatPrice(deliveryInfo.standardCharge) })
    }
  }

  const getMoneyBackText = () => {
    return t('moneyBackGuarantee', { days: deliveryInfo.moneyBackDays })
  }

  const getMinOrderText = () => {
    return t('minimumOrder', { amount: formatPrice(deliveryInfo.freeDeliveryMin) })
  }

  return (
    <div className="glass-topbar text-primary-foreground py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Desktop View */}
        <div className="hidden md:flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>🚚 {getDeliveryText()}</span>
            <span>💳 20% down payment available</span>
            <span>🔄 {getMoneyBackText()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>📞 +880 1234 567890</span>
            <span>📧 info@sportsnationbd.com</span>
          </div>
        </div>
        
        {/* Mobile View - Auto Scrolling */}
        <div className="md:hidden">
          <div className="flex items-center text-sm whitespace-nowrap animate-scroll">
            <span className="mr-8">🚚 {getDeliveryText()}</span>
            <span className="mr-8">💳 20% down payment available</span>
            <span className="mr-8">🔄 {getMoneyBackText()}</span>
            <span className="mr-8">📞 +880 1234 567890</span>
            <span className="mr-8">📧 info@sportsnationbd.com</span>
            <span className="mr-8">⏰ {t('deliveryDays', { days: deliveryInfo.days })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
