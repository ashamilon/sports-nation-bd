import Currency from 'currency.js'

// Delivery policies - only Bangladesh supported
export const DELIVERY_POLICIES = {
  bangladesh: {
    deliveryTime: '2-5 days',
    freeShippingThreshold: 2000, // BDT
    shippingCost: 110, // BDT
    moneyBackGuarantee: 7, // days
    currency: 'BDT',
    partialPayment: true,
    partialPaymentPercentage: 20
  }
}

export function detectUserLocation(): 'bangladesh' {
  // Always return Bangladesh since we only support Bangladesh
  return 'bangladesh'
}

export function getCurrencyForLocation(location: 'bangladesh'): string {
  return 'BDT'
}

export function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): number {
  // Since we only support BDT, no conversion is needed
  return amount
}

export function formatCurrency(
  amount: number, 
  currency: string, 
  location: 'bangladesh'
): string {
  const locale = 'bn-BD'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export function getLanguageForLocation(location: 'bangladesh'): string {
  return 'en' // Always English for Bangladesh
}

export function getDeliveryPolicy(location: 'bangladesh') {
  return DELIVERY_POLICIES[location]
}

export function calculateShippingCost(
  orderTotal: number, 
  location: 'bangladesh'
): number {
  const policy = getDeliveryPolicy(location)
  
  if (orderTotal >= policy.freeShippingThreshold) {
    return 0
  }
  
  return policy.shippingCost
}

export function isPartialPaymentAvailable(location: 'bangladesh'): boolean {
  return getDeliveryPolicy(location).partialPayment
}

export function getPartialPaymentAmount(
  totalAmount: number, 
  location: 'bangladesh'
): number {
  const policy = getDeliveryPolicy(location)
  
  if (!policy.partialPayment) {
    return totalAmount
  }
  
  return Currency(totalAmount).multiply(policy.partialPaymentPercentage / 100).value
}
