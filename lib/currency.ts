import Currency from 'currency.js'

export type CurrencyCode = 'BDT'

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
  }
}

export function getCurrencyFromCountry(country: string): CurrencyCode {
  // Always return BDT since we only support Bangladesh
  return 'BDT'
}

export function formatCurrency(amount: number | undefined | null, currency: CurrencyCode = 'BDT'): string {
  // Handle undefined, null, or NaN values
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0
  }
  
  const config = CURRENCIES[currency]
  const currencyAmount = new Currency(amount * config.rate, { 
    symbol: config.symbol,
    precision: 0,
    separator: '',
    decimal: ''
  })
  
  return currencyAmount.format()
}

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  // Since we only support BDT, no conversion is needed
  return amount
}

export function getDeliveryInfo(country: string) {
  // Always return Bangladesh delivery info since we only support Bangladesh
  return {
    deliveryTime: '2-5 days',
    freeDeliveryMin: 2000, // BDT
    deliveryCharge: 110, // BDT
    moneyBackGuarantee: '7 days',
    partialPayment: true
  }
}
