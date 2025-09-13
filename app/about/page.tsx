import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Sports Nation BD</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">🏆 Our Mission</h3>
                <p className="text-muted-foreground">
                  At Sports Nation BD, we're passionate about providing premium sports gear and jerseys to athletes and sports enthusiasts across Bangladesh. We believe everyone deserves access to high-quality sports equipment that enhances their performance and style.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🎯 What We Offer</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Premium quality jerseys (Fan & Player versions)</li>
                  <li>• Custom name and number printing</li>
                  <li>• High-quality sneakers and sports shoes</li>
                  <li>• Professional sports watches (Naviforce)</li>
                  <li>• Sports shorts and accessories</li>
                  <li>• Premium badges and customization options</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🌟 Why Choose Us</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Authentic products with quality guarantee</li>
                  <li>• Fast and reliable delivery across Bangladesh</li>
                  <li>• 20% down payment option available</li>
                  <li>• 7-15 days money back guarantee</li>
                  <li>• Excellent customer service</li>
                  <li>• Competitive prices</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📈 Our Commitment</h3>
                <p className="text-muted-foreground">
                  We're committed to continuously improving our product range and customer experience. Your satisfaction is our priority, and we strive to exceed your expectations with every order.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder about page. You can customize this content with your actual company story, mission, and values here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
