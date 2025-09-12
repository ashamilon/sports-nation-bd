import Currency from 'currency.js'

// Currency conversion rates (1 BDT = ? EUR)
const CURRENCY_RATES = {
  BDT_TO_EUR: 0.0085, // 1 BDT = 0.0085 EUR (approximate)
  EUR_TO_BDT: 117.65  // 1 EUR = 117.65 BDT (approximate)
}

// Language mappings
const LANGUAGE_MAP = {
  'BD': 'en', // Bangladesh - English
  'DE': 'de', // Germany - German
  'FR': 'fr', // France - French
  'IT': 'it', // Italy - Italian
  'ES': 'es', // Spain - Spanish
  'NL': 'nl', // Netherlands - Dutch
  'AT': 'de', // Austria - German
  'BE': 'nl', // Belgium - Dutch
  'CH': 'de', // Switzerland - German
  'SE': 'sv', // Sweden - Swedish
  'NO': 'no', // Norway - Norwegian
  'DK': 'da', // Denmark - Danish
  'FI': 'fi', // Finland - Finnish
  'PL': 'pl', // Poland - Polish
  'CZ': 'cs', // Czech Republic - Czech
  'HU': 'hu', // Hungary - Hungarian
  'RO': 'ro', // Romania - Romanian
  'BG': 'bg', // Bulgaria - Bulgarian
  'HR': 'hr', // Croatia - Croatian
  'SI': 'sl', // Slovenia - Slovenian
  'SK': 'sk', // Slovakia - Slovak
  'EE': 'et', // Estonia - Estonian
  'LV': 'lv', // Latvia - Latvian
  'LT': 'lt', // Lithuania - Lithuanian
  'MT': 'mt', // Malta - Maltese
  'CY': 'el', // Cyprus - Greek
  'IE': 'en', // Ireland - English
  'LU': 'fr', // Luxembourg - French
  'PT': 'pt', // Portugal - Portuguese
  'GR': 'el', // Greece - Greek
}

// Delivery policies
export const DELIVERY_POLICIES = {
  bangladesh: {
    deliveryTime: '2-5 days',
    freeShippingThreshold: 2000, // BDT
    shippingCost: 110, // BDT
    moneyBackGuarantee: 7, // days
    currency: 'BDT',
    partialPayment: true,
    partialPaymentPercentage: 20
  },
  europe: {
    deliveryTime: '10-15 days',
    freeShippingThreshold: 20000, // BDT equivalent
    shippingCost: 0, // Free shipping
    moneyBackGuarantee: 15, // days
    currency: 'EUR',
    partialPayment: false,
    partialPaymentPercentage: 0
  }
}

export function detectUserLocation(): 'bangladesh' | 'europe' {
  // This would typically use a geolocation service
  // For now, we'll use a simple approach based on timezone or IP
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // European timezones
  const europeanTimezones = [
    'Europe/Amsterdam', 'Europe/Berlin', 'Europe/Paris', 'Europe/Rome',
    'Europe/Madrid', 'Europe/London', 'Europe/Stockholm', 'Europe/Oslo',
    'Europe/Copenhagen', 'Europe/Helsinki', 'Europe/Warsaw', 'Europe/Prague',
    'Europe/Budapest', 'Europe/Bucharest', 'Europe/Sofia', 'Europe/Zagreb',
    'Europe/Ljubljana', 'Europe/Bratislava', 'Europe/Tallinn', 'Europe/Riga',
    'Europe/Vilnius', 'Europe/Valletta', 'Europe/Nicosia', 'Europe/Dublin',
    'Europe/Luxembourg', 'Europe/Lisbon', 'Europe/Athens'
  ]
  
  return europeanTimezones.includes(timezone) ? 'europe' : 'bangladesh'
}

export function getCurrencyForLocation(location: 'bangladesh' | 'europe'): string {
  return location === 'bangladesh' ? 'BDT' : 'EUR'
}

export function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount
  
  if (fromCurrency === 'BDT' && toCurrency === 'EUR') {
    return Currency(amount).multiply(CURRENCY_RATES.BDT_TO_EUR).value
  }
  
  if (fromCurrency === 'EUR' && toCurrency === 'BDT') {
    return Currency(amount).multiply(CURRENCY_RATES.EUR_TO_BDT).value
  }
  
  return amount
}

export function formatCurrency(
  amount: number, 
  currency: string, 
  location: 'bangladesh' | 'europe'
): string {
  const locale = location === 'bangladesh' ? 'bn-BD' : 'en-EU'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export function getLanguageForLocation(location: 'bangladesh' | 'europe'): string {
  return location === 'bangladesh' ? 'en' : 'en' // Default to English for now
}

export function getDeliveryPolicy(location: 'bangladesh' | 'europe') {
  return DELIVERY_POLICIES[location]
}

export function calculateShippingCost(
  orderTotal: number, 
  location: 'bangladesh' | 'europe'
): number {
  const policy = getDeliveryPolicy(location)
  
  if (orderTotal >= policy.freeShippingThreshold) {
    return 0
  }
  
  return policy.shippingCost
}

export function isPartialPaymentAvailable(location: 'bangladesh' | 'europe'): boolean {
  return getDeliveryPolicy(location).partialPayment
}

export function getPartialPaymentAmount(
  totalAmount: number, 
  location: 'bangladesh' | 'europe'
): number {
  const policy = getDeliveryPolicy(location)
  
  if (!policy.partialPayment) {
    return totalAmount
  }
  
  return Currency(totalAmount).multiply(policy.partialPaymentPercentage / 100).value
}
