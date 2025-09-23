// WhatsApp Configuration
export const whatsappConfig = {
  // Replace with your actual WhatsApp number (include country code without +)
  phoneNumber: '8801647429992', // Your actual WhatsApp number
  
  // Default message when user clicks the button
  defaultMessage: 'Hello! I need help with my order from Sports Nation BD.',
  
  // Business hours (optional - for display purposes)
  businessHours: {
    enabled: true,
    timezone: 'Asia/Dhaka',
    hours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '10:00', close: '16:00' }
    }
  }
}

// Helper function to generate WhatsApp URL
export function generateWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || whatsappConfig.defaultMessage
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodedMessage}`
}

// Helper function to check if business is open (optional)
export function isBusinessOpen(): boolean {
  if (!whatsappConfig.businessHours.enabled) return true
  
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof whatsappConfig.businessHours.hours
  const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  
  const dayHours = whatsappConfig.businessHours.hours[dayName]
  if (!dayHours) return false
  
  return currentTime >= dayHours.open && currentTime <= dayHours.close
}
