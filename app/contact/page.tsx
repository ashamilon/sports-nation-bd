import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="bg-card p-6 rounded-lg border">
            <p className="text-muted-foreground mb-4">
              We'd love to hear from you! Get in touch with us for any questions, support, or feedback.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">📧 Email</h3>
                <p className="text-muted-foreground">info@sportsnationbd.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📞 Phone</h3>
                <p className="text-muted-foreground">+880 1234 567890</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📍 Address</h3>
                <p className="text-muted-foreground">Dhaka, Bangladesh</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a placeholder page. You can add your actual contact information and contact form here later.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
