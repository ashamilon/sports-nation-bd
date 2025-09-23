import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { RegionalSettings, detectUserRegion, getRegionalSettings } from '@/lib/regional-settings'

interface RegionalStore {
  settings: RegionalSettings
  convertPrice: (priceInBDT: number) => number
  formatPrice: (price: number) => string
  getDeliveryInfo: () => {
    days: number
    freeDeliveryMin: number
    standardCharge: number
    moneyBackDays: number
    isFreeDelivery: boolean
  }
}

export const useRegionalStore = create<RegionalStore>()(
  (set, get) => ({
    settings: getRegionalSettings('BD'),

    convertPrice: (priceInBDT: number) => {
      const { settings } = get()
      return Math.round(priceInBDT * settings.currencyMultiplier * 100) / 100
    },

    formatPrice: (price: number) => {
      // Always format as BDT since we only support Bangladesh
      return `৳${price.toLocaleString()}`
    },

    getDeliveryInfo: () => {
      const { settings } = get()
      
      return {
        days: settings.deliveryDays.normal,
        freeDeliveryMin: settings.deliveryCharge.free,
        standardCharge: settings.deliveryCharge.standard,
        moneyBackDays: settings.moneyBackGuarantee,
        isFreeDelivery: settings.deliveryCharge.standard === 0
      }
    }
  })
)
