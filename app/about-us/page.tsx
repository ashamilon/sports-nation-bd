import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Sports Nation BD",
  description: "Learn about Sports Nation BD - Buy Your Dream Here. Our company, management, and commitment to quality.",
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground dark:text-white-100 mb-8">
            About Sports Nation BD
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Sports Nation BD is a leading provider of premium sports gear, jerseys, watches, and sneakers in Bangladesh. Founded with a passion for sports and quality, we have been serving athletes, sports enthusiasts, and fans across the country with authentic and high-quality products.
              </p>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Our commitment to excellence and customer satisfaction has made us a trusted name in the sports industry. We believe that every athlete deserves access to the best equipment and gear to perform at their highest level.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Company Information
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
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Registered Address:</strong> 4th Floor, Ananda City Center, Kandirpar, Cumilla
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Business Type:</strong> Sports Equipment and Apparel Retail
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                To provide athletes and sports enthusiasts with access to premium quality sports gear, jerseys, and equipment that enhance their performance and passion for sports. We strive to be the go-to destination for authentic sports products in Bangladesh.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                To become the most trusted and comprehensive sports equipment provider in Bangladesh, supporting the growth of sports culture and helping athletes achieve their dreams through quality products and exceptional service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                What We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground dark:text-white-100 mb-3">
                    Buy Your Dream Here
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 space-y-2">
                    <li>Authentic jerseys and team wear</li>
                    <li>Professional sports equipment</li>
                    <li>Training and fitness gear</li>
                    <li>Sports accessories</li>
                  </ul>
                </div>
                <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-foreground dark:text-white-100 mb-3">
                    Custom Services
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground dark:text-white-80 space-y-2">
                    <li>Custom club jerseys</li>
                    <li>Personalized names and numbers</li>
                    <li>Custom badges and logos</li>
                    <li>Bulk orders for teams</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Our Values
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-4">
                <div className="text-center">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-white-100 mb-2">
                    Quality
                  </h3>
                  <p className="text-muted-foreground dark:text-white-80 text-sm">
                    We ensure every product meets the highest standards of quality and authenticity.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-white-100 mb-2">
                    Trust
                  </h3>
                  <p className="text-muted-foreground dark:text-white-80 text-sm">
                    Building long-lasting relationships with our customers through honest and transparent business practices.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-white-100 mb-2">
                    Excellence
                  </h3>
                  <p className="text-muted-foreground dark:text-white-80 text-sm">
                    Committed to delivering exceptional service and supporting athletes in their journey to excellence.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Management Team
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Our management team consists of experienced professionals with deep knowledge of the sports industry and a passion for serving our customers. We are committed to continuous improvement and innovation in all aspects of our business.
              </p>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Leadership:</strong> Our team is led by experienced professionals with extensive backgrounds in sports retail, customer service, and business management.
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Expertise:</strong> We combine industry knowledge with customer-focused approaches to deliver the best possible experience.
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Commitment:</strong> Every team member is dedicated to upholding our values and ensuring customer satisfaction.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Delivery Information
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
                We are committed to delivering your orders promptly and safely. Our delivery network covers all major cities and districts across Bangladesh.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Contact Information
              </h2>
              <div className="bg-muted/30 dark:bg-black-80/30 p-6 rounded-lg">
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Email:</strong> info@sportsnationbd.com
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Phone:</strong> +880 1647 429992
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Address:</strong> 4th Floor, Ananda City Center, Kandirpar, Cumilla
                </p>
                <p className="text-muted-foreground dark:text-white-80 mb-2">
                  <strong>Business Hours:</strong> Sunday to Thursday, 9:00 AM - 6:00 PM
                </p>
                <p className="text-muted-foreground dark:text-white-80">
                  <strong>Trade License:</strong> 2101021100033934
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white-100 mb-4">
                Our Commitment
              </h2>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                At Sports Nation BD, we are committed to providing our customers with the best possible shopping experience. From the quality of our products to the excellence of our customer service, we strive to exceed expectations in everything we do.
              </p>
              <p className="text-muted-foreground dark:text-white-80 mb-4">
                Thank you for choosing Sports Nation BD as your trusted partner in sports. We look forward to serving you and supporting your athletic journey.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
