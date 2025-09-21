import Header from '@/components/header'
import Footer from '@/components/footer'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Careers</h1>
          <div className="bg-card p-6 rounded-lg border">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">💼 Join Our Team</h3>
                <p className="text-muted-foreground">
                  At Sports Nation BD, we're always looking for passionate individuals who share our love for sports and commitment to excellence. Join us in our mission to provide the best sports gear to customers across Bangladesh.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🌟 Why Work With Us</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Dynamic and growing company environment</li>
                  <li>• Opportunity to work with sports industry</li>
                  <li>• Competitive salary and benefits</li>
                  <li>• Professional development opportunities</li>
                  <li>• Flexible working arrangements</li>
                  <li>• Team-oriented culture</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">🎯 Current Openings</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Customer Service Representative</h4>
                    <p className="text-sm text-muted-foreground">Full-time • Dhaka</p>
                    <p className="text-sm text-muted-foreground mt-2">Handle customer inquiries, orders, and provide excellent support.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Marketing Specialist</h4>
                    <p className="text-sm text-muted-foreground">Full-time • Dhaka</p>
                    <p className="text-sm text-muted-foreground mt-2">Develop and execute marketing strategies to grow our brand.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Warehouse Assistant</h4>
                    <p className="text-sm text-muted-foreground">Full-time • Dhaka</p>
                    <p className="text-sm text-muted-foreground mt-2">Manage inventory, packing, and shipping operations.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">📧 How to Apply</h3>
                <p className="text-muted-foreground mb-3">
                  Interested in joining our team? Send us your resume and cover letter:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">📧 Email: careers@sportsnationbd.com</p>
                  <p className="text-sm">📞 Phone: +880 1868 556390</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder careers page. You can customize this with your actual job openings, company culture, and application process here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
