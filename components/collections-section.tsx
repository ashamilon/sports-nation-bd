"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ArrowRight, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  isFeatured: boolean
  _count?: {
    products: number
  }
}

interface CollectionsSectionProps {
  collections: Collection[]
}

export default function CollectionsSection({ collections }: CollectionsSectionProps) {

  if (collections.length === 0) {
    return null // Don't show section if no collections
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Shop by Collection</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our curated collections featuring the best products in each category
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group glass-card p-6 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all duration-300 rounded-xl"
          >
            {/* Collection Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {collection._count?.products || 0} products
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Featured
              </Badge>
            </div>

            {/* Collection Description */}
            {collection.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {collection.description}
              </p>
            )}

            {/* Collection Image */}
            <div className="mb-4">
              <div className="relative aspect-video bg-muted rounded-xl overflow-hidden group/collection shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover/collection:scale-110 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No image available</p>
                    </div>
                  </div>
                )}
                
                {/* Collection overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/collection:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                  <div className="text-center text-white transform translate-y-4 group-hover/collection:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium mb-1 drop-shadow-lg">
                      {collection.name}
                    </p>
                    <p className="text-xs opacity-90 drop-shadow-md">
                      {collection._count?.products || 0} products
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-muted-foreground">
                  Featured Collection
                </span>
              </div>
              
              <Link href={`/collections/${collection.slug}`}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20 group-hover:-translate-y-0.5 active:scale-95 transition-all duration-300 rounded-lg"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Horizontal Scrolling */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex-shrink-0 w-[calc(50%-0.5rem)]"
            >
              <Link href={`/collections/${collection.slug}`}>
                <div className="glass-card p-4 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all duration-300 rounded-xl h-full">
                  {/* Collection Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                        {collection.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {collection._count?.products || 0} products
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  </div>

                  {/* Collection Description */}
                  {collection.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {collection.description}
                    </p>
                  )}

                  {/* Collection Image */}
                  <div className="mb-3">
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group/collection shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                      {collection.image ? (
                        <Image
                          src={collection.image}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover/collection:scale-110 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <div className="text-center">
                            <Package className="h-8 w-8 text-primary/50 mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">No image</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Collection overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/collection:opacity-100 transition-all duration-300 flex items-end justify-center pb-2">
                        <div className="text-center text-white transform translate-y-2 group-hover/collection:translate-y-0 transition-transform duration-300">
                          <p className="text-xs font-medium mb-1 drop-shadow-lg">
                            {collection.name}
                          </p>
                          <p className="text-xs opacity-90 drop-shadow-md">
                            {collection._count?.products || 0} products
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collection Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-muted-foreground">
                        Featured
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20 group-hover:-translate-y-0.5 active:scale-95 transition-all duration-300 rounded-lg text-xs px-2 py-1 h-6"
                    >
                      View
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All Collections Button */}
      <div className="text-center mt-8">
        <Link href="/collections">
          <Button 
            variant="outline" 
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all duration-300 rounded-xl"
          >
            <Eye className="h-5 w-5 mr-2" />
            View All Collections
          </Button>
        </Link>
      </div>
    </section>
  )
}
