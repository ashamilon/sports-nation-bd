export interface Translations {
  [key: string]: string | Translations
}

export const translations: Record<string, Translations> = {
  en: {
    // Common
    home: 'Home',
    shop: 'Shop',
    cart: 'Cart',
    wishlist: 'Wishlist',
    account: 'Account',
    search: 'Search',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    
    // Navigation
    watches: 'Watches',
    sneakers: 'Sneakers',
    jerseys: 'Jerseys',
    shorts: 'Shorts',
    customJerseys: 'Custom Jerseys',
    about: 'About',
    contact: 'Contact',
    
    // Product
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    price: 'Price',
    comparePrice: 'Compare at',
    save: 'Save',
    
    // Delivery & Returns
    freeDelivery: 'Free Delivery',
    deliveryDays: 'Delivery in {days} days',
    moneyBackGuarantee: '{days} days money back guarantee',
    minimumOrder: 'Minimum order {amount} for free delivery',
    deliveryCharge: 'Delivery Charge: {amount}',
    
    // Footer
    company: 'Company',
    support: 'Support',
    legal: 'Legal',
    newsletter: 'Newsletter',
    subscribe: 'Subscribe',
    stayUpdated: 'Stay Updated',
    newProducts: 'Get updates on new products and exclusive offers',
    
    // Features
    premiumQuality: 'Premium Quality',
    authenticProducts: 'Authentic products',
    securePayment: 'Secure Payment',
    customerSupport: 'Customer Support'
  }
}

export function getTranslation(key: string, language: string = 'en', params?: Record<string, string | number>): string {
  const keys = key.split('.')
  let translation: any = translations[language] || translations.en
  
  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k]
    } else {
      // Fallback to English
      translation = translations.en
      for (const fallbackKey of keys) {
        if (translation && typeof translation === 'object' && fallbackKey in translation) {
          translation = translation[fallbackKey]
        } else {
          return key // Return key if no translation found
        }
      }
      break
    }
  }
  
  if (typeof translation !== 'string') {
    return key
  }
  
  // Replace parameters
  if (params) {
    return translation.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param]?.toString() || match
    })
  }
  
  return translation
}

export function useTranslation(language: string = 'en') {
  return (key: string, params?: Record<string, string | number>) => 
    getTranslation(key, language, params)
}
