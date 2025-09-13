import Header from '@/components/header'
import Footer from '@/components/footer'

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">📦 Enter Tracking Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Number</label>
                    <input 
                      type="text" 
                      placeholder="Enter your order number"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Track Order
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📋 Order Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Order Confirmed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Shipped</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Out for Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Delivered</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Need Help?</h3>
                <p className="text-muted-foreground mb-3">
                  If you're having trouble tracking your order or have any questions, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: info@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1234 567890</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder tracking page. You can integrate with your actual shipping provider's tracking system here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
