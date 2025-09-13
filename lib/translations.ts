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
    customerSupport: 'Customer Support',
    
    // Regional
    selectRegion: 'Select Region',
    bangladesh: 'Bangladesh',
    germany: 'Germany',
    netherlands: 'Netherlands',
    europe: 'Europe',
    other: 'Other'
  },
  
  de: {
    // Common
    home: 'Startseite',
    shop: 'Einkaufen',
    cart: 'Warenkorb',
    wishlist: 'Wunschliste',
    account: 'Konto',
    search: 'Suchen',
    login: 'Anmelden',
    signup: 'Registrieren',
    logout: 'Abmelden',
    
    // Navigation
    watches: 'Uhren',
    sneakers: 'Sneaker',
    jerseys: 'Trikots',
    shorts: 'Shorts',
    customJerseys: 'Individuelle Trikots',
    about: 'Über uns',
    contact: 'Kontakt',
    
    // Product
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt kaufen',
    outOfStock: 'Nicht auf Lager',
    inStock: 'Auf Lager',
    price: 'Preis',
    comparePrice: 'Vergleichen bei',
    save: 'Sparen',
    
    // Delivery & Returns
    freeDelivery: 'Kostenlose Lieferung',
    deliveryDays: 'Lieferung in {days} Tagen',
    moneyBackGuarantee: '{days} Tage Geld-zurück-Garantie',
    minimumOrder: 'Mindestbestellwert {amount} für kostenlose Lieferung',
    deliveryCharge: 'Liefergebühr: {amount}',
    
    // Footer
    company: 'Unternehmen',
    support: 'Support',
    legal: 'Rechtliches',
    newsletter: 'Newsletter',
    subscribe: 'Abonnieren',
    stayUpdated: 'Bleiben Sie auf dem Laufenden',
    newProducts: 'Erhalten Sie Updates zu neuen Produkten und exklusiven Angeboten',
    
    // Features
    premiumQuality: 'Premium-Qualität',
    authenticProducts: 'Authentische Produkte',
    securePayment: 'Sichere Zahlung',
    customerSupport: 'Kundensupport',
    
    // Regional
    selectRegion: 'Region auswählen',
    bangladesh: 'Bangladesch',
    germany: 'Deutschland',
    netherlands: 'Niederlande',
    europe: 'Europa',
    other: 'Andere'
  },
  
  nl: {
    // Common
    home: 'Home',
    shop: 'Winkelen',
    cart: 'Winkelwagen',
    wishlist: 'Verlanglijst',
    account: 'Account',
    search: 'Zoeken',
    login: 'Inloggen',
    signup: 'Registreren',
    logout: 'Uitloggen',
    
    // Navigation
    watches: 'Horloges',
    sneakers: 'Sneakers',
    jerseys: 'Truien',
    shorts: 'Shorts',
    customJerseys: 'Aangepaste Truien',
    about: 'Over ons',
    contact: 'Contact',
    
    // Product
    addToCart: 'Toevoegen aan winkelwagen',
    buyNow: 'Nu kopen',
    outOfStock: 'Niet op voorraad',
    inStock: 'Op voorraad',
    price: 'Prijs',
    comparePrice: 'Vergelijken bij',
    save: 'Besparen',
    
    // Delivery & Returns
    freeDelivery: 'Gratis bezorging',
    deliveryDays: 'Bezorging in {days} dagen',
    moneyBackGuarantee: '{days} dagen geld-terug-garantie',
    minimumOrder: 'Minimum bestelling {amount} voor gratis bezorging',
    deliveryCharge: 'Bezorgkosten: {amount}',
    
    // Footer
    company: 'Bedrijf',
    support: 'Ondersteuning',
    legal: 'Juridisch',
    newsletter: 'Nieuwsbrief',
    subscribe: 'Abonneren',
    stayUpdated: 'Blijf op de hoogte',
    newProducts: 'Ontvang updates over nieuwe producten en exclusieve aanbiedingen',
    
    // Features
    premiumQuality: 'Premium Kwaliteit',
    authenticProducts: 'Authentieke producten',
    securePayment: 'Veilige betaling',
    customerSupport: 'Klantenservice',
    
    // Regional
    selectRegion: 'Selecteer regio',
    bangladesh: 'Bangladesh',
    germany: 'Duitsland',
    netherlands: 'Nederland',
    europe: 'Europa',
    other: 'Andere'
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
