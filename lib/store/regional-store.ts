import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { RegionalSettings, detectUserRegion, getRegionalSettings } from '@/lib/regional-settings'

interface RegionalStore {
  region: string
  settings: RegionalSettings
  isLoading: boolean
  setRegion: (region: string) => void
  detectAndSetRegion: () => void
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
  persist(
    (set, get) => ({
      region: 'BD',
      settings: getRegionalSettings('BD'),
      isLoading: false,

      setRegion: (region: string) => {
        const settings = getRegionalSettings(region)
        set({ region, settings })
      },

      detectAndSetRegion: () => {
        set({ isLoading: true })
        const detectedRegion = detectUserRegion()
        const settings = getRegionalSettings(detectedRegion)
        set({ region: detectedRegion, settings, isLoading: false })
      },

      convertPrice: (priceInBDT: number) => {
        const { settings } = get()
        return Math.round(priceInBDT * settings.currencyMultiplier * 100) / 100
      },

      formatPrice: (price: number) => {
        const { settings } = get()
        
        if (settings.currency === 'EUR') {
          return `€${price.toFixed(2)}`
        }
        
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
    }),
    {
      name: 'regional-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ region: state.region }),
      skipHydration: true,
    }
  )
)
