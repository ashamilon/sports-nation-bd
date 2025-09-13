import Header from '@/components/header'
import Footer from '@/components/footer'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Last updated: January 2025</p>
                <p className="text-muted-foreground">
                  At Sports Nation BD, we want you to be completely satisfied with your purchase. This Refund Policy outlines the terms and conditions for returns and refunds.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔄 Return Eligibility</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Items must be returned within 7 days of delivery</li>
                  <li>• Products must be in original, unworn condition</li>
                  <li>• Original tags and packaging must be included</li>
                  <li>• Items must not be damaged or altered</li>
                  <li>• Customized items (names/numbers) cannot be returned</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">❌ Non-Returnable Items</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Custom jerseys with names and numbers</li>
                  <li>• Personalized or monogrammed items</li>
                  <li>• Items damaged by customer misuse</li>
                  <li>• Items without original packaging</li>
                  <li>• Sale or clearance items (unless defective)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📋 Return Process</h3>
                <ol className="text-muted-foreground space-y-2">
                  <li>1. Contact us at info@sportsnationbd.com or call +880 1234 567890</li>
                  <li>2. Provide your order number and reason for return</li>
                  <li>3. We'll provide return instructions and authorization</li>
                  <li>4. Package the item securely with original packaging</li>
                  <li>5. Ship the item back to us (return shipping at your cost)</li>
                  <li>6. We'll process your refund once item is received and inspected</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">💰 Refund Processing</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Refunds are processed within 5-7 business days</li>
                  <li>• Refunds are issued to the original payment method</li>
                  <li>• Return shipping costs are deducted from refund amount</li>
                  <li>• Original shipping costs are non-refundable</li>
                  <li>• Bank processing fees may apply for certain payment methods</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔄 Exchanges</h3>
                <p className="text-muted-foreground">
                  We offer size exchanges for unworn items in original condition. Contact us within 7 days of delivery to arrange an exchange. Exchange shipping costs are the customer's responsibility.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🚨 Defective Items</h3>
                <p className="text-muted-foreground">
                  If you receive a defective or damaged item, contact us immediately. We'll arrange a replacement or full refund at no cost to you, including return shipping.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Contact Us</h3>
                <p className="text-muted-foreground mb-3">
                  For any questions about returns or refunds, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: returns@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1234 567890</p>
                  <p className="text-sm">📧 General: info@sportsnationbd.com</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder refund policy. You should customize this based on your actual return and refund procedures.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
