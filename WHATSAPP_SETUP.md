# WhatsApp Customer Support Setup

## Overview
A floating WhatsApp button has been added to provide instant customer support. The button appears on the right side of the screen and allows customers to quickly contact support via WhatsApp.

## Features
- ✅ **Floating WhatsApp Button**: Fixed position on the right side of the screen
- ✅ **Animated Entry**: Smooth spring animation when the page loads
- ✅ **Pulse Effect**: Eye-catching pulse animation to draw attention
- ✅ **Hover Tooltip**: Shows "Chat with us on WhatsApp" on hover
- ✅ **Support Text**: "Need Help?" message with business hours indicator
- ✅ **Dark Mode Support**: Adapts to light/dark theme
- ✅ **Business Hours**: Shows different messages based on business hours
- ✅ **Configurable**: Easy to update phone number and message

## Configuration

### Update WhatsApp Number
Edit `lib/config/whatsapp.ts`:

```typescript
export const whatsappConfig = {
  // Replace with your actual WhatsApp number (include country code without +)
  phoneNumber: '8801868556390', // Your actual number here
  
  // Default message when user clicks the button
  defaultMessage: 'Hello! I need help with my order from Sports Nation BD.',
  
  // Business hours configuration
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
```

### Customize Message
You can customize the default message that appears when customers click the button:

```typescript
defaultMessage: 'Hello! I need help with my order from Sports Nation BD.',
```

### Business Hours
The button shows different messages based on business hours:
- **During business hours**: "We're here to assist you!"
- **Outside business hours**: "We'll respond when we're back!"

## Files Added/Modified

### New Files:
- `components/whatsapp-button.tsx` - Main WhatsApp button component
- `lib/config/whatsapp.ts` - Configuration file for WhatsApp settings
- `WHATSAPP_SETUP.md` - This setup guide

### Modified Files:
- `app/layout.tsx` - Added WhatsApp button to the main layout

## How It Works

1. **Button Appearance**: The button appears 2 seconds after page load with a smooth animation
2. **Click Action**: When clicked, it opens WhatsApp with a pre-filled message
3. **Business Hours**: The support text changes based on current time and configured business hours
4. **Responsive**: Works on all screen sizes and devices

## Testing

1. **Update the phone number** in `lib/config/whatsapp.ts`
2. **Test the button** by clicking it - it should open WhatsApp
3. **Verify the message** is pre-filled correctly
4. **Check business hours** - the support text should change based on time

## Customization Options

### Change Button Position
Edit `components/whatsapp-button.tsx`:
```typescript
className="fixed bottom-6 right-6 z-50" // Change bottom-6 right-6 to desired position
```

### Change Animation Timing
```typescript
transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }} // Adjust delay and animation
```

### Disable Business Hours
```typescript
businessHours: {
  enabled: false, // Set to false to always show "We're here to assist you!"
}
```

## Support

The WhatsApp button is now live and ready to help your customers get instant support! 🚀
