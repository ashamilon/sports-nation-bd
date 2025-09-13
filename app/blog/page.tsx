import Header from '@/components/header'
import Footer from '@/components/footer'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sports Nation BD Blog</h1>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold mb-2">🏆 Latest Sports News & Updates</h2>
                  <p className="text-muted-foreground">Stay updated with the latest in sports, gear reviews, and industry insights.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">⚽ Football Season 2025: Must-Have Jerseys</h3>
                    <p className="text-sm text-muted-foreground mb-2">January 15, 2025</p>
                    <p className="text-sm text-muted-foreground">Discover the top football jerseys every fan needs for the upcoming season...</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">👟 Choosing the Right Sports Shoes</h3>
                    <p className="text-sm text-muted-foreground mb-2">January 10, 2025</p>
                    <p className="text-sm text-muted-foreground">A comprehensive guide to selecting the perfect sports shoes for your activity...</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">⌚ Naviforce Watches: Style Meets Function</h3>
                    <p className="text-sm text-muted-foreground mb-2">January 5, 2025</p>
                    <p className="text-sm text-muted-foreground">Explore the features and benefits of our premium Naviforce watch collection...</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">🏃‍♂️ Sports Gear Maintenance Tips</h3>
                    <p className="text-sm text-muted-foreground mb-2">December 28, 2024</p>
                    <p className="text-sm text-muted-foreground">Learn how to properly care for and maintain your sports equipment...</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">📚 Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Football</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Basketball</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Sneakers</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Watches</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Reviews</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Tips</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">📧 Subscribe to Our Newsletter</h3>
              <p className="text-muted-foreground mb-4">Get the latest sports news, product updates, and exclusive offers delivered to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is a placeholder blog page. You can customize this with your actual blog posts, categories, and content management system here later.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
