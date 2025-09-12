import { NextRequest, NextResponse } from 'next/server'
import { 
  detectUserLocation, 
  getDeliveryPolicy, 
  calculateShippingCost,
  convertCurrency,
  getCurrencyForLocation
} from '@/lib/localization'

export async function POST(request: NextRequest) {
  try {
    const { 
      orderTotal, 
      location, 
      items 
    } = await request.json()

    // Detect location if not provided
    const userLocation = location || detectUserLocation()
    const policy = getDeliveryPolicy(userLocation)
    const currency = getCurrencyForLocation(userLocation)

    // Calculate shipping cost
    const shippingCost = calculateShippingCost(orderTotal, userLocation)

    // Convert currency if needed
    let convertedOrderTotal = orderTotal
    let convertedShippingCost = shippingCost

    if (userLocation === 'europe') {
      convertedOrderTotal = convertCurrency(orderTotal, 'BDT', 'EUR')
      convertedShippingCost = convertCurrency(shippingCost, 'BDT', 'EUR')
    }

    // Calculate total with shipping
    const totalWithShipping = convertedOrderTotal + convertedShippingCost

    // Calculate delivery estimate
    const deliveryDate = new Date()
    const deliveryDays = parseInt(policy.deliveryTime.split('-')[1]) // Get max days
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays)

    return NextResponse.json({
      location: userLocation,
      currency,
      orderTotal: convertedOrderTotal,
      shippingCost: convertedShippingCost,
      totalWithShipping,
      deliveryTime: policy.deliveryTime,
      estimatedDeliveryDate: deliveryDate.toISOString(),
      freeShippingThreshold: policy.freeShippingThreshold,
      moneyBackGuarantee: policy.moneyBackGuarantee,
      partialPaymentAvailable: policy.partialPayment,
      partialPaymentPercentage: policy.partialPaymentPercentage
    })

  } catch (error) {
    console.error('Delivery calculation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
