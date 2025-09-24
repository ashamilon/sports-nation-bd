"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Watch, Shirt, Footprints, ShirtIcon, Scissors, Crown } from 'lucide-react'
import MobileCategorySlideshow from './mobile-category-slideshow'

const categories = [
  {
    name: 'Watches',
    slug: 'watch',
    icon: Watch,
    description: 'Premium timepieces for champions',
    image: '⌚',
    color: 'from-blue-500/20 to-blue-600/20',
    href: '/category/watch'
  },
  {
    name: 'Jerseys',
    slug: 'jersey',
    icon: Shirt,
    description: 'Fan & Player versions available',
    image: '⚽',
    color: 'from-green-500/20 to-green-600/20',
    href: '/category/jersey'
  },
  {
    name: 'Sneakers',
    slug: 'sneaker',
    icon: Footprints,
    description: 'Top brands & latest models',
    image: '👟',
    color: 'from-purple-500/20 to-purple-600/20',
    href: '/category/sneaker'
  },
  {
    name: 'Shorts',
    slug: 'short',
    icon: ShirtIcon,
    description: 'Match your jersey perfectly',
    image: '🩳',
    color: 'from-orange-500/20 to-orange-600/20',
    href: '/category/short'
  },
  {
    name: 'Custom Jerseys',
    slug: 'custom-jersey',
    icon: Scissors,
    description: 'Minimum 11 pieces order',
    image: '✂️',
    color: 'from-red-500/20 to-red-600/20',
    href: '/category/custom-jersey'
  },
  {
    name: 'Badges',
    slug: 'badge',
    icon: Crown,
    description: 'League, UCL & FIFA badges',
    image: '🏆',
    color: 'from-yellow-500/20 to-yellow-600/20',
    href: '/category/badge'
  }
]

export default function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of premium sports gear and accessories
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.href}>
                <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 category-card hover:shadow-lg hover:shadow-[#27355C]/20" style={{ backgroundColor: '#F8F9FB', border: '1px solid rgba(39, 53, 92, 0.1)' }}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                      <category.icon className="h-8 w-8 dark:text-white category-icon" style={{ color: '#27355C' }} />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300 category-title" style={{ color: '#27355C' }}>
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground category-description" style={{ color: '#27355C' }}>
                        {category.description}
                      </p>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                      {category.image}
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slideshow */}
        <div className="md:hidden -mt-4">
          <MobileCategorySlideshow 
            categories={categories.map(cat => ({
              ...cat,
              emoji: cat.image
            }))}
          />
        </div>

        {/* Special offer banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 lg:p-12">
            <div className="relative z-10 text-center text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Custom Jersey Special Offer
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Order 11+ custom jerseys and get 10% discount + free delivery
              </p>
              <Link
                href="/custom-jerseys"
                className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors font-medium"
              >
                Order Now
                <Crown className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-32 -translate-x-32" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
