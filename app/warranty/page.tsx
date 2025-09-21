import Header from '@/components/header'
import Footer from '@/components/footer'

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Warranty Information</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Last updated: January 2025</p>
                <p className="text-muted-foreground">
                  At Sports Nation BD, we stand behind the quality of our products. This warranty information outlines the coverage and terms for our sports gear and accessories.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🛡️ Warranty Coverage</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Jerseys & Apparel</h4>
                    <p className="text-sm text-muted-foreground">30 days warranty against manufacturing defects in materials and workmanship.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Sneakers & Shoes</h4>
                    <p className="text-sm text-muted-foreground">90 days warranty against manufacturing defects in materials and construction.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Watches (Naviforce)</h4>
                    <p className="text-sm text-muted-foreground">1 year warranty against manufacturing defects in materials and workmanship.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Accessories & Badges</h4>
                    <p className="text-sm text-muted-foreground">30 days warranty against manufacturing defects.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">✅ What's Covered</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Manufacturing defects in materials</li>
                  <li>• Workmanship defects</li>
                  <li>• Premature wear under normal use</li>
                  <li>• Defective zippers, buttons, or closures</li>
                  <li>• Color fading due to manufacturing issues</li>
                  <li>• Stitching defects</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">❌ What's Not Covered</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Normal wear and tear</li>
                  <li>• Damage from misuse or abuse</li>
                  <li>• Damage from accidents or negligence</li>
                  <li>• Damage from improper care or cleaning</li>
                  <li>• Modifications or alterations</li>
                  <li>• Damage from exposure to extreme conditions</li>
                  <li>• Customized items (names/numbers)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📋 Warranty Claims Process</h3>
                <ol className="text-muted-foreground space-y-2">
                  <li>1. Contact us within the warranty period</li>
                  <li>2. Provide proof of purchase (order number or receipt)</li>
                  <li>3. Describe the defect and provide photos if possible</li>
                  <li>4. We'll evaluate the claim and provide instructions</li>
                  <li>5. Return the item if required (we'll cover return shipping)</li>
                  <li>6. We'll repair, replace, or refund as appropriate</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🔧 Warranty Remedies</h3>
                <p className="text-muted-foreground">
                  For valid warranty claims, we will, at our discretion, either repair the item, replace it with a similar product, or provide a full refund. Warranty repairs and replacements are free of charge.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📞 Contact Us</h3>
                <p className="text-muted-foreground mb-3">
                  For warranty claims or questions, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: warranty@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1868 556390</p>
                  <p className="text-sm">📧 General: info@sportsnationbd.com</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder warranty policy. You should customize this based on your actual warranty terms and manufacturer warranties for your products.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
