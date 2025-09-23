import path from 'path'
import fs from 'fs/promises'

interface PaymentInfo {
  id: string
  amount: number
  status: string
  paymentMethod: string
  transactionId?: string
  metadata?: string
  createdAt: string
}

interface InvoiceData {
  orderNumber: string
  orderDate: string
  customer: {
    name: string
    email: string
  }
  shippingAddress: any
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
    customOptions: any
  }>
  subtotal: number
  shippingCost: number
  tipAmount: number
  total: number
  currency: string
  status: string
  paymentStatus: string
  paymentMethod?: string
  trackingNumber?: string
  payments?: PaymentInfo[]
}

// Function to convert image to base64
async function getLogoBase64(): Promise<string> {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png')
    const logoBuffer = await fs.readFile(logoPath)
    const base64 = logoBuffer.toString('base64')
    console.log('Logo converted to base64 successfully, length:', base64.length)
    return `data:image/png;base64,${base64}`
  } catch (error) {
    console.error('Error reading logo file:', error)
    // Fallback to absolute URL
    const fallbackUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/logo.png`
    console.log('Using fallback URL:', fallbackUrl)
    return fallbackUrl
  }
}

export async function generateInvoiceHTML(invoiceData: InvoiceData): Promise<string> {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`
  }

  // Helper function to calculate payment breakdown
  const getPaymentBreakdown = () => {
    const totalAmount = invoiceData.total || 0
    const paidAmount = invoiceData.payments?.reduce((sum, payment) => {
      if (payment.status === 'completed' || payment.status === 'paid') {
        return sum + payment.amount
      }
      return sum
    }, 0) || 0

    const isPartialPayment = invoiceData.paymentStatus === 'partial' || invoiceData.paymentMethod === 'partial_payment'
    const dueAmount = totalAmount - paidAmount

    // Try to get remaining amount from payment metadata
    let remainingAmount = dueAmount
    if (invoiceData.payments && invoiceData.payments.length > 0) {
      try {
        const metadata = JSON.parse(invoiceData.payments[0].metadata || '{}')
        if (metadata.remainingAmount) {
          remainingAmount = metadata.remainingAmount
        }
      } catch (e) {
        // Use calculated due amount if metadata parsing fails
      }
    }

    return {
      totalAmount,
      paidAmount,
      dueAmount: Math.max(0, dueAmount),
      remainingAmount: Math.max(0, remainingAmount),
      isPartialPayment,
      paymentType: isPartialPayment ? 'Partial Payment' : 'Full Payment'
    }
  }

  // Get logo as base64
  const logoBase64 = await getLogoBase64()

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${invoiceData.orderNumber}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #f8f9fa;
                padding: 20px;
            }
            
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px;
                text-align: center;
                position: relative;
            }
            
            .header .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            
            .header .logo img {
                width: 60px;
                height: 60px;
                object-fit: contain;
                display: block;
                margin: 0 auto;
            }
            
            .header .logo img:not([src]) {
                display: none;
            }
            
            .header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                font-weight: 700;
            }
            
            .header p {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px;
            }
            
            .invoice-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
            }
            
            .info-section h3 {
                color: #667eea;
                margin-bottom: 15px;
                font-size: 1.2rem;
                border-bottom: 2px solid #667eea;
                padding-bottom: 5px;
            }
            
            .info-section p {
                margin-bottom: 8px;
                color: #666;
            }
            
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .items-table th {
                background: #667eea;
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
            }
            
            .items-table td {
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .items-table tr:last-child td {
                border-bottom: none;
            }
            
            .items-table tr:nth-child(even) {
                background: #f8f9fa;
            }
            
            .custom-options {
                font-size: 0.9rem;
                color: #666;
                font-style: italic;
                margin-top: 5px;
            }
            
            .badge-details {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 10px;
                margin-top: 8px;
                font-size: 0.85rem;
            }
            
            .badge-details h4 {
                color: #667eea;
                margin-bottom: 5px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .badge-list {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 5px;
            }
            
            .badge-item {
                background: #667eea;
                color: white;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .totals {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 5px 0;
            }
            
            .total-row.final {
                border-top: 2px solid #667eea;
                margin-top: 15px;
                padding-top: 15px;
                font-weight: bold;
                font-size: 1.1rem;
                color: #667eea;
            }
            
            .payment-breakdown {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }
            
            .payment-breakdown h3 {
                color: #667eea;
                margin-bottom: 15px;
                font-size: 1.1rem;
                font-weight: 600;
                border-bottom: 1px solid #e9ecef;
                padding-bottom: 8px;
            }
            
            .breakdown-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 5px 0;
            }
            
            .payment-type {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 600;
            }
            
            .payment-type.partial {
                background: #fff3cd;
                color: #856404;
            }
            
            .payment-type.full {
                background: #d4edda;
                color: #155724;
            }
            
            .paid-amount {
                color: #28a745;
                font-weight: 600;
            }
            
            .remaining-amount {
                color: #fd7e14;
                font-weight: 600;
            }
            
            .breakdown-row.due-amount {
                border-top: 1px solid #e9ecef;
                margin-top: 10px;
                padding-top: 10px;
                font-weight: bold;
                color: #dc3545;
            }
            
            .breakdown-row.fully-paid {
                border-top: 1px solid #e9ecef;
                margin-top: 10px;
                padding-top: 10px;
                font-weight: bold;
                color: #28a745;
            }
            
            .status-badges {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .status-badge {
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .status-badge.processing {
                background: #fff3cd;
                color: #856404;
            }
            
            .status-badge.shipped {
                background: #cce5ff;
                color: #004085;
            }
            
            .status-badge.delivered {
                background: #d4edda;
                color: #155724;
            }
            
            .status-badge.paid {
                background: #d4edda;
                color: #155724;
            }
            
            .status-badge.pending {
                background: #f8d7da;
                color: #721c24;
            }
            
            .footer {
                background: #f8f9fa;
                padding: 30px 40px;
                text-align: center;
                color: #666;
                border-top: 1px solid #eee;
            }
            
            .footer p {
                margin-bottom: 10px;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                
                .invoice-container {
                    box-shadow: none;
                    border-radius: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <div class="logo">
                    <img src="${logoBase64}" alt="Sports Nation BD Logo" />
                </div>
                <h1>INVOICE</h1>
                <p>Sports Nation BD - Buy Your Dream Here</p>
            </div>
            
            <div class="content">
                <div class="invoice-info">
                    <div class="info-section">
                        <h3>Invoice Details</h3>
                        <p><strong>Invoice #:</strong> ${invoiceData.orderNumber}</p>
                        <p><strong>Date:</strong> ${formatDate(invoiceData.orderDate)}</p>
                        <p><strong>Status:</strong> ${invoiceData.status}</p>
                        <p><strong>Payment:</strong> ${invoiceData.paymentStatus}</p>
                        ${invoiceData.trackingNumber ? `<p><strong>Tracking:</strong> ${invoiceData.trackingNumber}</p>` : ''}
                    </div>
                    
                    <div class="info-section">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${invoiceData.customer.name}</p>
                        <p><strong>Email:</strong> ${invoiceData.customer.email}</p>
                        <p><strong>Address:</strong> ${invoiceData.shippingAddress.address || 'N/A'}</p>
                        <p><strong>City:</strong> ${invoiceData.shippingAddress.city || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="status-badges">
                    <span class="status-badge ${invoiceData.status}">${invoiceData.status}</span>
                    <span class="status-badge ${invoiceData.paymentStatus}">${invoiceData.paymentStatus}</span>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceData.items.map(item => `
                            <tr>
                                <td>
                                    <strong>${item.name}</strong>
                                    ${item.customOptions ? `
                                        <div class="custom-options">
                                            <div>Custom: ${item.customOptions.name || 'N/A'} - #${item.customOptions.number || 'N/A'}</div>
                                            ${item.customOptions.badgeDetails && item.customOptions.badgeDetails.length > 0 ? `
                                                <div class="badge-details">
                                                    <h4>Football Badges Added:</h4>
                                                    <div class="badge-list">
                                                        ${item.customOptions.badgeDetails.map((badge: any) => `
                                                            <span class="badge-item">${badge.name || `Badge ${badge.id}`}</span>
                                                        `).join('')}
                                                    </div>
                                                    ${item.customOptions.badgeTotal ? `<div style="margin-top: 5px; font-weight: 600; color: #667eea;">Badge Total: ${formatCurrency(item.customOptions.badgeTotal)}</div>` : ''}
                                                </div>
                                            ` : ''}
                                        </div>
                                    ` : ''}
                                </td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.unitPrice)}</td>
                                <td>${formatCurrency(item.totalPrice)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${formatCurrency(invoiceData.subtotal)}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>${formatCurrency(invoiceData.shippingCost)}</span>
                    </div>
                    ${invoiceData.tipAmount > 0 ? `
                    <div class="total-row">
                        <span>Tip:</span>
                        <span>${formatCurrency(invoiceData.tipAmount)}</span>
                    </div>
                    ` : ''}
                    <div class="total-row final">
                        <span>Total:</span>
                        <span>${formatCurrency(invoiceData.total)}</span>
                    </div>
                </div>
                
                ${(() => {
                  const breakdown = getPaymentBreakdown()
                  return `
                <div class="payment-breakdown">
                    <h3>Payment Breakdown</h3>
                    <div class="breakdown-row">
                        <span>Payment Type:</span>
                        <span class="payment-type ${breakdown.isPartialPayment ? 'partial' : 'full'}">${breakdown.paymentType}</span>
                    </div>
                    <div class="breakdown-row">
                        <span>Total Order Amount:</span>
                        <span>${formatCurrency(breakdown.totalAmount)}</span>
                    </div>
                    <div class="breakdown-row">
                        <span>Amount Paid:</span>
                        <span class="paid-amount">${formatCurrency(breakdown.paidAmount)}</span>
                    </div>
                    ${breakdown.isPartialPayment && breakdown.remainingAmount > 0 ? `
                    <div class="breakdown-row">
                        <span>Remaining Amount:</span>
                        <span class="remaining-amount">${formatCurrency(breakdown.remainingAmount)}</span>
                    </div>
                    ` : ''}
                    ${breakdown.dueAmount > 0 ? `
                    <div class="breakdown-row due-amount">
                        <span>Amount Due:</span>
                        <span>${formatCurrency(breakdown.dueAmount)}</span>
                    </div>
                    ` : ''}
                    ${breakdown.paidAmount >= breakdown.totalAmount ? `
                    <div class="breakdown-row fully-paid">
                        <span>Payment Status:</span>
                        <span>Fully Paid</span>
                    </div>
                    ` : ''}
                </div>
                  `
                })()}
            </div>
            
            <div class="footer">
                <p><strong>Thank you for your business!</strong></p>
                <p>Sports Nation BD - Buy Your Dream Here</p>
                <p>For support, contact us at support@sportsnationbd.com</p>
            </div>
        </div>
    </body>
    </html>
  `
}

export async function downloadInvoice(invoiceData: InvoiceData, filename: string = '') {
  const html = await generateInvoiceHTML(invoiceData)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `invoice-${invoiceData.orderNumber}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
