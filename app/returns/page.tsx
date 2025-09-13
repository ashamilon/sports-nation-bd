import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Returns & Exchanges</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">🔄 Return Policy</h3>
                <p className="text-muted-foreground">
                  We offer a 7-15 days money back guarantee on all products. Items must be in original condition with tags attached.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📋 Return Conditions</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Items must be unworn and in original condition</li>
                  <li>• Original tags and packaging must be included</li>
                  <li>• Personalized items (custom jerseys with names/numbers) cannot be returned</li>
                  <li>• Returns must be initiated within 7 days of delivery</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔄 Exchange Process</h3>
                <p className="text-muted-foreground">
                  For size exchanges, contact us within 7 days of delivery. We'll arrange a pickup and send the correct size.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">💰 Refund Process</h3>
                <p className="text-muted-foreground">
                  Refunds will be processed within 5-7 business days after we receive the returned item. Refunds will be issued to the original payment method.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 How to Return</h3>
                <ol className="text-muted-foreground space-y-2">
                  <li>1. Contact us at info@sportsnationbd.com or call +880 1234 567890</li>
                  <li>2. Provide your order number and reason for return</li>
                  <li>3. We'll arrange pickup or provide return address</li>
                  <li>4. Package the item securely with original packaging</li>
                  <li>5. Refund will be processed once item is received</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder returns page. You can customize the return policy, conditions, and process here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
