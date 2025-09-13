import Header from '@/components/header'
import Footer from '@/components/footer'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Last updated: January 2025</p>
                <p className="text-muted-foreground">
                  This Cookie Policy explains how Sports Nation BD uses cookies and similar technologies when you visit our website. By using our website, you consent to the use of cookies as described in this policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🍪 What Are Cookies?</h3>
                <p className="text-muted-foreground">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and analyzing how you use our site.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔧 Types of Cookies We Use</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Essential Cookies</h4>
                    <p className="text-sm text-muted-foreground">These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-muted-foreground">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Functional Cookies</h4>
                    <p className="text-sm text-muted-foreground">These cookies enable enhanced functionality and personalization, such as remembering your preferences and cart contents.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-muted-foreground">These cookies are used to track visitors across websites to display relevant and engaging advertisements.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">⚙️ Managing Cookies</h3>
                <p className="text-muted-foreground mb-3">
                  You can control and manage cookies in various ways:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
                  <li>• <strong>Cookie Preferences:</strong> Use our cookie preference center (if available)</li>
                  <li>• <strong>Opt-out:</strong> You can opt out of certain tracking cookies</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📊 Third-Party Cookies</h3>
                <p className="text-muted-foreground">
                  We may use third-party services that set their own cookies, including:
                </p>
                <ul className="text-muted-foreground space-y-2 mt-2">
                  <li>• Google Analytics for website analytics</li>
                  <li>• SSL Commerz for payment processing</li>
                  <li>• Social media platforms for sharing features</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Contact Us</h3>
                <p className="text-muted-foreground mb-3">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: privacy@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1234 567890</p>
                  <p className="text-sm">📧 General: info@sportsnationbd.com</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder cookie policy. You should customize this based on the actual cookies and tracking technologies used on your website.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
