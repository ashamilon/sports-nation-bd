import Header from '@/components/header'
import Footer from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Last updated: January 2025</p>
                <p className="text-muted-foreground">
                  Welcome to Sports Nation BD. These Terms of Service govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🛒 Orders and Payment</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• All orders are subject to availability and acceptance</li>
                  <li>• Prices are subject to change without notice</li>
                  <li>• Payment must be made at the time of order</li>
                  <li>• We accept various payment methods including cards and mobile banking</li>
                  <li>• 20% down payment option is available for select products</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🚚 Shipping and Delivery</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Free delivery on orders over ৳2,000</li>
                  <li>• Delivery charge of ৳100 for orders under ৳2,000</li>
                  <li>• Delivery times: 3-5 days (Dhaka), 5-7 days (other cities)</li>
                  <li>• We are not responsible for delays caused by shipping carriers</li>
                  <li>• Risk of loss transfers to you upon delivery</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔄 Returns and Refunds</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• 7-15 days money back guarantee</li>
                  <li>• Items must be in original condition with tags</li>
                  <li>• Customized items (names/numbers) cannot be returned</li>
                  <li>• Return shipping costs are the customer's responsibility</li>
                  <li>• Refunds processed within 5-7 business days</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">⚖️ Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  Sports Nation BD shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📝 Modifications</h3>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Contact Information</h3>
                <p className="text-muted-foreground mb-3">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: legal@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1234 567890</p>
                  <p className="text-sm">📧 General: info@sportsnationbd.com</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder terms of service. You should consult with a legal professional to create comprehensive terms that comply with applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
