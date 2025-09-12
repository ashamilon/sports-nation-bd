import Currency from 'currency.js'

export type CurrencyCode = 'BDT' | 'EUR'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  rate: number // Rate relative to BDT
  locale: string
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  BDT: {
    code: 'BDT',
    symbol: '৳',
    rate: 1,
    locale: 'bn-BD'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.14, // 1 BDT = 0.14 EUR (approximately 7 BDT = 1 EUR)
    locale: 'de-DE'
  }
}

export function getCurrencyFromCountry(country: string): CurrencyCode {
  const europeanCountries = [
    'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI',
    'PL', 'CZ', 'HU', 'SK', 'SI', 'HR', 'BG', 'RO', 'LT', 'LV', 'EE', 'IE',
    'PT', 'GR', 'CY', 'MT', 'LU', 'IS', 'LI', 'MC', 'SM', 'VA', 'AD'
  ]
  
  return europeanCountries.includes(country.toUpperCase()) ? 'EUR' : 'BDT'
}

export function formatCurrency(amount: number | undefined | null, currency: CurrencyCode = 'BDT'): string {
  // Handle undefined, null, or NaN values
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0
  }
  
  const config = CURRENCIES[currency]
  const currencyAmount = new Currency(amount * config.rate, { 
    symbol: config.symbol,
    precision: currency === 'EUR' ? 2 : 0,
    separator: currency === 'EUR' ? ',' : '',
    decimal: currency === 'EUR' ? '.' : ''
  })
  
  return currencyAmount.format()
}

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount
  
  const fromConfig = CURRENCIES[from]
  const toConfig = CURRENCIES[to]
  
  // Convert to BDT first, then to target currency
  const bdtAmount = amount / fromConfig.rate
  return bdtAmount * toConfig.rate
}

export function getDeliveryInfo(country: string) {
  const isEurope = getCurrencyFromCountry(country) === 'EUR'
  
  if (isEurope) {
    return {
      deliveryTime: '10-15 days',
      freeDeliveryMin: 20000, // BDT
      deliveryCharge: 0,
      moneyBackGuarantee: '15 days',
      partialPayment: false
    }
  } else {
    return {
      deliveryTime: '2-5 days',
      freeDeliveryMin: 2000, // BDT
      deliveryCharge: 110, // BDT
      moneyBackGuarantee: '7 days',
      partialPayment: true
    }
  }
}
