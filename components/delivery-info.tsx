"use client"

import { useRegionalStore } from '@/lib/store/regional-store'
import { useTranslation } from '@/lib/translations'
import { Truck, Shield, Clock } from 'lucide-react'

interface DeliveryInfoProps {
  className?: string
  compact?: boolean
}

export function DeliveryInfo({ className = "", compact = false }: DeliveryInfoProps) {
  const { getDeliveryInfo, settings, formatPrice } = useRegionalStore()
  const t = useTranslation(settings.language)
  
  const deliveryInfo = getDeliveryInfo()

  if (compact) {
    return (
      <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
        <div className="flex items-center gap-1">
          <Truck className="h-4 w-4" />
          <span>{t('deliveryDays', { days: deliveryInfo.days })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          <span>{t('moneyBackGuarantee', { days: deliveryInfo.moneyBackDays })}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Truck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">
            {deliveryInfo.isFreeDelivery ? t('freeDelivery') : t('deliveryCharge', { amount: formatPrice(deliveryInfo.standardCharge) })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('deliveryDays', { days: deliveryInfo.days })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">
            {t('moneyBackGuarantee', { days: deliveryInfo.moneyBackDays })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('minimumOrder', { amount: formatPrice(deliveryInfo.freeDeliveryMin) })}
          </p>
        </div>
      </div>
    </div>
  )
}
