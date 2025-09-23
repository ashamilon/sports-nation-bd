"use client"

import { useRegionalStore } from '@/lib/store/regional-store'

interface PriceDisplayProps {
  price: number // Price in BDT
  comparePrice?: number // Compare price in BDT
  className?: string
  showOriginal?: boolean
}

export function PriceDisplay({ 
  price, 
  comparePrice, 
  className = "",
  showOriginal = false 
}: PriceDisplayProps) {
  const { convertPrice, formatPrice, settings } = useRegionalStore()
  
  const regionalPrice = convertPrice(price)
  const regionalComparePrice = comparePrice ? convertPrice(comparePrice) : undefined
  
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-primary">
          {formatPrice(regionalPrice)}
        </span>
        {regionalComparePrice && regionalComparePrice > 0 && (
          <span className="text-sm text-red-500 line-through">
            {formatPrice(regionalComparePrice)}
          </span>
        )}
      </div>
      
      {showOriginal && settings.region !== 'BD' && (
        <div className="text-xs text-muted-foreground">
          Original: ৳{price.toLocaleString()}
        </div>
      )}
      
      {regionalComparePrice && regionalComparePrice > regionalPrice && (
        <div className="text-xs text-green-600 font-medium">
          Save {formatPrice(regionalComparePrice - regionalPrice)}
        </div>
      )}
    </div>
  )
}
