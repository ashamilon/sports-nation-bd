import Header from '@/components/header'
import Footer from '@/components/footer'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards (VISA, Mastercard, American Express), mobile financial services (bKash, Nagad, Rocket), and bank transfers. We also offer 20% down payment option.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How long does delivery take?</h3>
                <p className="text-muted-foreground">
                  Standard delivery takes 3-5 business days within Dhaka and 5-7 business days for other cities in Bangladesh. Free delivery on orders over ৳2,000.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Can I customize jerseys with names and numbers?</h3>
                <p className="text-muted-foreground">
                  Yes! We offer custom name and number printing on jerseys for an additional ৳250. Custom jerseys cannot be returned once personalized.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">What's the difference between Fan and Player versions?</h3>
                <p className="text-muted-foreground">
                  Fan versions are made with lighter materials for casual wear, while Player versions use premium materials designed for actual sports performance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Do you offer international shipping?</h3>
                <p className="text-muted-foreground">
                  Currently, we only ship within Bangladesh. International shipping options may be available in the future.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How can I track my order?</h3>
                <p className="text-muted-foreground">
                  You'll receive a tracking number via email once your order is shipped. Use this number to track your package's delivery status.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">What if I receive a damaged item?</h3>
                <p className="text-muted-foreground">
                  Contact us immediately if you receive a damaged item. We'll arrange a replacement or full refund at no cost to you.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Do you have a physical store?</h3>
                <p className="text-muted-foreground">
                  We are currently an online-only store. You can visit our website 24/7 to browse and purchase our products.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder FAQ page. You can add more questions and customize the answers based on your specific business needs.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
