import Header from '@/components/header'
import Footer from '@/components/footer'

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Our Story</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">🚀 The Beginning</h3>
                <p className="text-muted-foreground">
                  Sports Nation BD was born from a simple idea: to bring premium sports gear and authentic jerseys to sports enthusiasts in Bangladesh. We started as a small team with a big dream to make quality sports equipment accessible to everyone.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">💪 Our Journey</h3>
                <p className="text-muted-foreground">
                  From our humble beginnings, we've grown to become a trusted name in the sports gear industry in Bangladesh. We've built strong relationships with suppliers and manufacturers to ensure we only offer the highest quality products to our customers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🏅 Our Values</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>Quality First:</strong> We never compromise on product quality</li>
                  <li>• <strong>Customer Focus:</strong> Your satisfaction is our success</li>
                  <li>• <strong>Authenticity:</strong> We provide genuine products only</li>
                  <li>• <strong>Innovation:</strong> We continuously improve our offerings</li>
                  <li>• <strong>Community:</strong> We support local sports communities</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🎯 Looking Forward</h3>
                <p className="text-muted-foreground">
                  As we continue to grow, we remain committed to our core mission of providing exceptional sports gear and outstanding customer service. We're excited about the future and the opportunity to serve even more sports enthusiasts across Bangladesh.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder story page. You can customize this with your actual company history, milestones, and achievements here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
