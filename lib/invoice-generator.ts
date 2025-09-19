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
}

export function generateInvoiceHTML(invoiceData: InvoiceData): string {
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
                <h1>INVOICE</h1>
                <p>Sports Nation BD - Premium Sports Gear</p>
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
                                    ${item.customOptions ? `<div class="custom-options">Custom: ${item.customOptions.name || 'N/A'} - #${item.customOptions.number || 'N/A'}</div>` : ''}
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
            </div>
            
            <div class="footer">
                <p><strong>Thank you for your business!</strong></p>
                <p>Sports Nation BD - Premium Sports Gear & Jerseys</p>
                <p>For support, contact us at support@sportsnationbd.com</p>
            </div>
        </div>
    </body>
    </html>
  `
}

export function downloadInvoice(invoiceData: InvoiceData, filename: string = '') {
  const html = generateInvoiceHTML(invoiceData)
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
