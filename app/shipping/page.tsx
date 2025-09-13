import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">🚚 Free Delivery</h3>
                <p className="text-muted-foreground">
                  Free delivery on all orders over ৳2,000 within Bangladesh. Orders under ৳2,000 have a delivery charge of ৳100.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">⏱️ Delivery Time</h3>
                <p className="text-muted-foreground">
                  Standard delivery: 3-5 business days within Dhaka, 5-7 business days for other cities in Bangladesh.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📍 Delivery Areas</h3>
                <p className="text-muted-foreground">
                  We deliver to all major cities and districts in Bangladesh including Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, and more.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📦 Order Processing</h3>
                <p className="text-muted-foreground">
                  Orders are processed within 1-2 business days. You will receive a tracking number once your order is shipped.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔄 Order Tracking</h3>
                <p className="text-muted-foreground">
                  Track your order using the tracking number provided in your order confirmation email.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder shipping information page. You can customize the delivery details, areas, and policies here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
