import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions - Sports Nation BD",
  description: "Terms and Conditions for Sports Nation BD - Buy Your Dream Here",
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground dark:text-white-100 mb-8">
            Terms and Conditions
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground dark:text-white-80 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                By accessing and using Sports Nation BD's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                2. Company Information
              </h2>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg mb-4">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Company Name:</strong> Sports Nation BD
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Trade License:</strong> 2101021100033934
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Shop Address:</strong> 4th Floor, Ananda City Center, Kandirpar, Cumilla
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Registered Address:</strong> 4th Floor, Ananda City Center, Kandirpar, Cumilla
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                3. Products and Services
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Sports Nation BD offers premium sports gear, jerseys, watches, sneakers, and custom club jerseys. All products are subject to availability and we reserve the right to discontinue any product at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                4. Orders and Payment
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Payment must be made in full before order processing begins.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                5. Delivery
              </h2>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg mb-4">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Inside Dhaka:</strong> 5 working days
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Outside Dhaka:</strong> 10 working days
                </p>
              </div>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Delivery times are estimates and may vary due to circumstances beyond our control. We are not liable for delays caused by third-party delivery services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                6. Returns and Refunds
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Please refer to our <a href="/return-refund-policy" className="text-primary hover:underline">Return and Refund Policy</a> for detailed information about returns and refunds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                7. Privacy
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Your privacy is important to us. Please review our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Sports Nation BD shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                9. Governing Law
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of Bangladesh.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                10. Contact Information
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Email:</strong> info@sportsnationbd.com
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Phone:</strong> +880 1647 429992
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Address:</strong> 4th Floor, Ananda City Center, Kandirpar, Cumilla
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
