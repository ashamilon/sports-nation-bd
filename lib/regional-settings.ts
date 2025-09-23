export interface RegionalSettings {
  region: 'BD'
  currency: 'BDT'
  language: 'en'
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
  }
}

export function detectUserRegion(): string {
  // Always return Bangladesh as the only supported region
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
  // Always format as BDT since we only support Bangladesh
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
