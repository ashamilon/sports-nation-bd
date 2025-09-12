// Payment Gateway Configuration
export const paymentConfig = {
  // SSL Commerz Configuration (Bangladesh)
  sslcommerz: {
    storeId: process.env.SSLCOMMERZ_STORE_ID || '',
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
    sandbox: process.env.SSLCOMMERZ_SANDBOX === 'true',
    baseUrl: process.env.SSLCOMMERZ_SANDBOX === 'true' 
      ? 'https://sandbox.sslcommerz.com' 
      : 'https://securepay.sslcommerz.com'
  },
  
}

// Currency and region mapping
export const getPaymentGateway = (currency: string, country?: string) => {
  // For now, only use SSL Commerz
  return 'sslcommerz'
}

// Supported currencies
export const supportedCurrencies = {
  sslcommerz: ['BDT']
}

// Payment status mapping
export const paymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
}
