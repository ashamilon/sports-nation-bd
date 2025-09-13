import Header from '@/components/header'
import Footer from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Last updated: January 2025</p>
                <p className="text-muted-foreground">
                  At Sports Nation BD, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📋 Information We Collect</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Personal information (name, email, phone number)</li>
                  <li>• Shipping and billing addresses</li>
                  <li>• Payment information (processed securely through SSL Commerz)</li>
                  <li>• Order history and preferences</li>
                  <li>• Website usage data and analytics</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔒 How We Use Your Information</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Process and fulfill your orders</li>
                  <li>• Provide customer support</li>
                  <li>• Send order updates and confirmations</li>
                  <li>• Improve our website and services</li>
                  <li>• Send promotional offers (with your consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🛡️ Data Security</h3>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are processed securely through SSL Commerz.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🍪 Cookies</h3>
                <p className="text-muted-foreground">
                  We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser preferences.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Contact Us</h3>
                <p className="text-muted-foreground mb-3">
                  If you have any questions about this Privacy Policy, please contact us:
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
                <strong>Note:</strong> This is a placeholder privacy policy. You should consult with a legal professional to create a comprehensive privacy policy that complies with applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
