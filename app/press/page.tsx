import Header from '@/components/header'
import Footer from '@/components/footer'

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Press & Media</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">📰 Press Releases</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Sports Nation BD Launches Premium Jersey Collection</h4>
                    <p className="text-sm text-muted-foreground">January 2025</p>
                    <p className="text-sm text-muted-foreground mt-1">Introducing our new line of premium sports jerseys with custom printing options.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Expanding Delivery Network Across Bangladesh</h4>
                    <p className="text-sm text-muted-foreground">December 2024</p>
                    <p className="text-sm text-muted-foreground mt-1">We're excited to announce expanded delivery services to more cities.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📸 Media Kit</h3>
                <p className="text-muted-foreground mb-3">
                  Download our media kit for logos, product images, and company information:
                </p>
                <div className="space-y-2">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Download Media Kit (PDF)
                  </button>
                  <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors ml-2">
                    Download Logo Pack (ZIP)
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Media Contact</h3>
                <p className="text-muted-foreground mb-3">
                  For media inquiries, interviews, or press requests, please contact:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: press@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1868 556390</p>
                  <p className="text-sm">📧 General: info@sportsnationbd.com</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🏆 Awards & Recognition</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🏆</span>
                    </div>
                    <div>
                      <p className="font-semibold">Best Online Sports Store 2024</p>
                      <p className="text-sm text-muted-foreground">Bangladesh E-commerce Awards</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⭐</span>
                    </div>
                    <div>
                      <p className="font-semibold">Customer Service Excellence</p>
                      <p className="text-sm text-muted-foreground">Sports Industry Recognition 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder press page. You can customize this with your actual press releases, media kit downloads, and company achievements here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
