"use client"

import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/components/logo'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = 2025

  const footerLinks = {
    shop: [
      { name: 'Watches', href: '/category/watches' },
      { name: 'Jerseys', href: '/category/jerseys' },
      { name: 'Sneakers', href: '/category/sneakers' },
      { name: 'Shorts', href: '/category/shorts' },
      { name: 'Custom Jerseys', href: '/custom-jerseys' },
      { name: 'Badges', href: '/category/badges' }
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Track Order', href: '/track-order' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/our-story' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Partnership', href: '/partnership' },
      { name: 'Blog', href: '/blog' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Warranty', href: '/warranty' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/sportsnationbd' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/sportsnationbd' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/sportsnationbd' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/sportsnationbd' }
  ]

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <Logo size="sm" />
            
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for premium sports gear, custom jerseys, 
              and authentic sports accessories.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1868 556390</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@sportsnationbd.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-b">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold mb-2">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get updates on new products and exclusive offers
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods Banner */}
        <div className="py-6 border-t">
          <div className="text-center">
            <Image 
              src="/payment-banner.png" 
              alt="Payment Methods - VISA, Mastercard, bKash, Nagad, SSLCommerz and more" 
              width={1200}
              height={200}
              className="max-w-full h-auto mx-auto"
              priority={false}
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Sports Nation BD. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>🚚 Free delivery on orders over ৳2,000</span>
            <span>💳 20% down payment available</span>
            <span>🔄 7-15 days money back guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
