import { Metadata } from 'next'
import Header from '@/components/header'
import CartSidebar from '@/components/cart-sidebar'
import Footer from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, MapPin, Clock, Gift } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Sports Nation BD',
  description: 'Terms and conditions for Sports Nation BD including loyalty program rules',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our services
            </p>
          </div>

          {/* General Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>General Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using Sports Nation BD website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website.
              </p>
              <p>
                All products sold are subject to availability. We reserve the right to discontinue any product at any time.
              </p>
            </CardContent>
          </Card>

          {/* Loyalty Program Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Loyalty Program Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Program Overview</h3>
                <p className="text-muted-foreground mb-4">
                  Our loyalty program consists of 4 levels: Bronze, Silver, Gold, and Platinum. Each level offers increasing benefits and discounts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Eligibility
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Available only to customers in Bangladesh</li>
                  <li>Must have a registered account with Sports Nation BD</li>
                  <li>All orders must be worth at least ৳1,000 to count towards loyalty progression</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Loyalty Levels and Benefits</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-orange-600 mb-2">🥉 Bronze Level (Starting Level)</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>50৳ discount on first order only</li>
                      <li>Access to exclusive deals and promotions</li>
                      <li>Advance to Silver: Complete 10 orders in 3 months</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-600 mb-2">🥈 Silver Level</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>150৳ discount on every order</li>
                      <li>Priority customer support</li>
                      <li>Early access to sales and new products</li>
                      <li>Advance to Gold: Complete 30 orders in 3 months</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-600 mb-2">🥇 Gold Level</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>220৳ discount on every order</li>
                      <li>Free express shipping on all orders</li>
                      <li>Personal shopping assistant</li>
                      <li>Advance to Platinum: Complete 50 orders in 3 months</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-purple-600 mb-2">💎 Platinum Level (Highest Level)</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>400৳ discount on every order</li>
                      <li>VIP customer support with dedicated account manager</li>
                      <li>Exclusive access to special events and product launches</li>
                      <li>Custom product requests and personalization services</li>
                      <li>Maximum level achieved - no further advancement</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Level Maintenance and Demotion Rules
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Bronze Level:</strong> No demotion - this is the starting level</li>
                  <li><strong>Silver Level:</strong> Must maintain at least 2 orders per month, or demote to Bronze after 1 month grace period</li>
                  <li><strong>Gold Level:</strong> Must maintain at least 3 orders per month, or demote to Silver after 1 month grace period</li>
                  <li><strong>Platinum Level:</strong> Must maintain at least 5 orders per month, or demote to Gold after 1 month grace period</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Discount Usage Rules
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All discounts are applied automatically at checkout</li>
                  <li>Discounts cannot be combined with other promotional offers unless specifically stated</li>
                  <li>Bronze level first-order discount can only be used once per account</li>
                  <li>Platinum level 400৳ discount is available on every order (no monthly limit)</li>
                  <li>All orders must meet the minimum ৳1,000 requirement to qualify for loyalty benefits</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Loyalty levels are calculated based on completed orders only</li>
                  <li>Cancelled or returned orders do not count towards loyalty progression</li>
                  <li>We reserve the right to modify loyalty program terms with 30 days notice</li>
                  <li>Fraudulent activity or abuse of the loyalty program may result in account suspension</li>
                  <li>Loyalty benefits are non-transferable and cannot be sold or exchanged</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We accept various payment methods including credit cards, mobile banking, and cash on delivery.
              </p>
              <p>
                For orders over ৳2,000, we offer 20% down payment with the rest payable on delivery.
              </p>
              <p>
                All prices are in Bangladeshi Taka (৳) and include applicable taxes.
              </p>
            </CardContent>
          </Card>

          {/* Delivery Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Delivery Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Standard delivery within Bangladesh takes 7-15 business days.
              </p>
              <p>
                Delivery charges apply as follows:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Standard delivery: ৳110</li>
                <li>Free delivery on orders over ৳2,000</li>
                <li>Gold and Platinum members: Free express shipping</li>
              </ul>
            </CardContent>
          </Card>

          {/* Return Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Return and Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We offer a 7-day money-back guarantee on all products.
              </p>
              <p>
                Items must be returned in original condition with tags attached.
              </p>
              <p>
                Custom jerseys and personalized items are non-returnable unless there is a manufacturing defect.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                For questions about these terms and conditions or our loyalty program, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>📞 Phone: +880 1234 567890</p>
                <p>📧 Email: info@sportsnationbd.com</p>
                <p>🌐 Website: www.sportsnationbd.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}