export interface RegionalSettings {
  region: 'BD' | 'EU' | 'DE' | 'NL' | 'OTHER'
  currency: 'BDT' | 'EUR'
  language: 'en' | 'de' | 'nl'
  deliveryDays: {
    normal: number
    express?: number
  }
  deliveryCharge: {
    free: number // minimum order for free delivery
    standard: number // standard delivery charge
  }
  moneyBackGuarantee: number // days
  currencyMultiplier: number // BDT to local currency conversion
}

export const REGIONAL_CONFIGS: Record<string, RegionalSettings> = {
  BD: {
    region: 'BD',
    currency: 'BDT',
    language: 'en',
    deliveryDays: { normal: 7 },
    deliveryCharge: { free: 2000, standard: 110 },
    moneyBackGuarantee: 7,
    currencyMultiplier: 1
  },
  DE: {
    region: 'DE',
    currency: 'EUR',
    language: 'de',
    deliveryDays: { normal: 15 },
    deliveryCharge: { free: 20000, standard: 0 },
    moneyBackGuarantee: 15,
    currencyMultiplier: 0.14 // 1 BDT = 0.14 EUR (approximate)
  },
  NL: {
    region: 'NL',
    currency: 'EUR',
    language: 'nl',
    deliveryDays: { normal: 15 },
    deliveryCharge: { free: 20000, standard: 0 },
    moneyBackGuarantee: 15,
    currencyMultiplier: 0.14
  },
  EU: {
    region: 'EU',
    currency: 'EUR',
    language: 'en',
    deliveryDays: { normal: 15 },
    deliveryCharge: { free: 20000, standard: 0 },
    moneyBackGuarantee: 15,
    currencyMultiplier: 0.14
  },
  OTHER: {
    region: 'OTHER',
    currency: 'BDT',
    language: 'en',
    deliveryDays: { normal: 10 },
    deliveryCharge: { free: 2000, standard: 110 },
    moneyBackGuarantee: 7,
    currencyMultiplier: 1
  }
}

export function detectUserRegion(): string {
  if (typeof window === 'undefined') return 'BD'
  
  // Check if we have stored region preference
  const storedRegion = localStorage.getItem('user-region')
  if (storedRegion && REGIONAL_CONFIGS[storedRegion]) {
    return storedRegion
  }
  
  // Try to detect from timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  if (timezone.includes('Europe/Berlin') || timezone.includes('Europe/Berlin')) {
    return 'DE'
  }
  
  if (timezone.includes('Europe/Amsterdam') || timezone.includes('Europe/Brussels')) {
    return 'NL'
  }
  
  if (timezone.startsWith('Europe/')) {
    return 'EU'
  }
  
  // Default to Bangladesh
  return 'BD'
}

export function getRegionalSettings(region?: string): RegionalSettings {
  const detectedRegion = region || detectUserRegion()
  return REGIONAL_CONFIGS[detectedRegion] || REGIONAL_CONFIGS.BD
}

export function convertPrice(priceInBDT: number, region: string): number {
  const settings = getRegionalSettings(region)
  return Math.round(priceInBDT * settings.currencyMultiplier * 100) / 100
}

export function formatPrice(price: number, region: string): string {
  const settings = getRegionalSettings(region)
  
  if (settings.currency === 'EUR') {
    return `€${price.toFixed(2)}`
  }
  
  return `৳${price.toLocaleString()}`
}

export function getDeliveryInfo(region: string) {
  const settings = getRegionalSettings(region)
  
  return {
    days: settings.deliveryDays.normal,
    freeDeliveryMin: settings.deliveryCharge.free,
    standardCharge: settings.deliveryCharge.standard,
    moneyBackDays: settings.moneyBackGuarantee,
    isFreeDelivery: settings.deliveryCharge.standard === 0
  }
}
