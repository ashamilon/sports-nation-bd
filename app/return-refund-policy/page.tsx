import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Return and Refund Policy - Sports Nation BD",
  description: "Return and Refund Policy for Sports Nation BD - Information about returns, exchanges, and refunds",
}

export default function ReturnRefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground dark:text-white-100 mb-8">
            Return and Refund Policy
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground dark:text-white-80 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                1. Return Policy Overview
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                At Sports Nation BD, we want you to be completely satisfied with your purchase. We offer a comprehensive return and refund policy to ensure your shopping experience is positive.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                2. Return Timeframe
              </h2>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg mb-4">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Standard Return Period:</strong> 7 to 10 working days from the date of delivery
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Processing Time:</strong> 7 to 10 working days for refund processing
                </p>
              </div>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                You have 7 to 10 working days from the date of delivery to initiate a return. All returns must be initiated within this timeframe to be eligible for a refund or exchange.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                3. Eligibility for Returns
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Items are eligible for return if they meet the following criteria:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>Item is in original condition with tags attached</li>
                <li>Item has not been worn, used, or damaged</li>
                <li>Original packaging is intact</li>
                <li>Return is initiated within the specified timeframe</li>
                <li>Item is not a custom-made product (unless defective)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                4. Non-Returnable Items
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>Custom jerseys with personalized names and numbers</li>
                <li>Items that have been worn or used</li>
                <li>Items without original tags or packaging</li>
                <li>Items damaged by customer misuse</li>
                <li>Items returned after the specified timeframe</li>
                <li>Gift cards and digital products</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                5. How to Initiate a Return
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                To initiate a return, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>Contact our customer service team within 7-10 working days of delivery</li>
                <li>Provide your order number and reason for return</li>
                <li>Our team will provide you with a Return Authorization Number (RAN)</li>
                <li>Package the item securely with the RAN clearly visible</li>
                <li>Ship the item back to our address</li>
                <li>Wait for processing confirmation</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                6. Return Shipping
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                <strong>Customer Responsibility:</strong> Return shipping costs are the responsibility of the customer unless the return is due to our error or a defective product.
              </p>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                <strong>Our Responsibility:</strong> We will cover return shipping costs if the return is due to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 mb-4 space-y-2">
                <li>Wrong item shipped</li>
                <li>Defective product</li>
                <li>Damage during shipping</li>
                <li>Our error in processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                7. Refund Process
              </h2>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg mb-4">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Processing Time:</strong> 7 to 10 working days after we receive your returned item
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Refund Method:</strong> Refunds will be processed to the original payment method
                </p>
              </div>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Once we receive and inspect your returned item, we will process your refund within 7 to 10 working days. You will receive an email confirmation once the refund has been processed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                8. Exchange Policy
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We offer exchanges for items in different sizes or colors, subject to availability. Exchange requests must be made within the same timeframe as returns (7-10 working days).
              </p>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                If the exchange item is of higher value, you will need to pay the difference. If it's of lower value, we will refund the difference.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                9. Defective Products
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                If you receive a defective product, please contact us immediately. We will arrange for a replacement or full refund at no cost to you, including return shipping.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                10. Contact Information
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                For returns, exchanges, or refund inquiries, please contact us:
              </p>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Email:</strong> returns@sportsnationbd.com
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Phone:</strong> +880 1647 429992
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Address:</strong> 4th Floor, Ananda City Center, Kandirpar, Cumilla
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Business Hours:</strong> Sunday to Thursday, 9:00 AM - 6:00 PM
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                11. Policy Updates
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                We reserve the right to update this Return and Refund Policy at any time. Changes will be posted on this page with an updated revision date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
