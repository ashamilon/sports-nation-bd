import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Sports Nation BD",
  description: "Privacy Policy for Sports Nation BD - How we collect, use, and protect your information",
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground dark:text-white-100 mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground dark:text-white-80 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Sports Nation BD ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-foreground dark:text-white-100 mb-3">
                Personal Information
              </h3>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>Register for an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                This information may include your name, email address, phone number, shipping address, billing address, and payment information.
              </p>

              <h3 className="text-xl font-semibold text-foreground dark:text-white-100 mb-3">
                Automatically Collected Information
              </h3>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We automatically collect certain information when you visit our website, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website</li>
                <li>Device information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support</li>
                <li>Send you order confirmations and shipping updates</li>
                <li>Improve our website and services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                4. Information Sharing
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>With service providers who assist us in operating our website and conducting our business</li>
                <li>With shipping companies to deliver your orders</li>
                <li>With payment processors to process your payments</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                5. Data Security
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                7. Your Rights
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                8. Data Retention
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                11. Contact Us
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Email:</strong> privacy@sportsnationbd.com
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
