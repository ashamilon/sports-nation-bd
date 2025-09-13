import Header from '@/components/header'
import Footer from '@/components/footer'

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Partnership Opportunities</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">🤝 Partner With Us</h3>
                <p className="text-muted-foreground">
                  At Sports Nation BD, we believe in the power of partnerships. We're always looking for like-minded businesses, sports teams, and organizations to collaborate with and create mutual value.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🎯 Partnership Types</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🏆 Sports Teams</h4>
                    <p className="text-sm text-muted-foreground">Official jersey and equipment supplier partnerships with local sports teams and clubs.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🏪 Retail Partners</h4>
                    <p className="text-sm text-muted-foreground">Wholesale partnerships with sports stores and retailers across Bangladesh.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📱 Influencer Collaborations</h4>
                    <p className="text-sm text-muted-foreground">Partnerships with sports influencers and content creators.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🏢 Corporate Partnerships</h4>
                    <p className="text-sm text-muted-foreground">Bulk orders and corporate gifting solutions for companies.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">💼 Benefits of Partnership</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Competitive wholesale pricing</li>
                  <li>• Priority customer support</li>
                  <li>• Custom branding options</li>
                  <li>• Marketing support and co-promotion</li>
                  <li>• Flexible payment terms</li>
                  <li>• Dedicated account management</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📋 Partnership Requirements</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Established business or organization</li>
                  <li>• Valid business registration</li>
                  <li>• Minimum order quantities (varies by partnership type)</li>
                  <li>• Commitment to quality and customer service</li>
                  <li>• Alignment with our brand values</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Get Started</h3>
                <p className="text-muted-foreground mb-3">
                  Interested in partnering with us? Let's discuss how we can work together:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: partnerships@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1234 567890</p>
                  <p className="text-sm">📧 General: info@sportsnationbd.com</p>
                </div>
                <div className="mt-4">
                  <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Submit Partnership Inquiry
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder partnership page. You can customize this with your actual partnership programs, requirements, and application process here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
