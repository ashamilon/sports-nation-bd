"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount?: number
}

interface HeaderDropdownProps {
  collections: Collection[]
  title: string
  href?: string
}

export default function HeaderDropdown({ collections, title, href = '#' }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center space-x-1 px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 group"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Explore our {title.toLowerCase()} collection
              </p>
            </div>

            {/* Collections Grid */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2">
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                    >
                      {/* Collection Image */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {collection.image ? (
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                              {collection.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Collection Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {collection.name}
                        </h4>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {collection.description}
                          </p>
                        )}
                        {collection.productCount && (
                          <p className="text-xs text-muted-foreground">
                            {collection.productCount} products
                          </p>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <ArrowRight 
                        className={`w-4 h-4 text-muted-foreground transition-all duration-200 ${
                          hoveredIndex === index ? 'translate-x-1 text-primary' : ''
                        }`} 
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              {href && href !== '#' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={href}
                    className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors duration-200 group"
                  >
                    <span>View All {title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
