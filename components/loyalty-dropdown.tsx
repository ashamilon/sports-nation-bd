"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Crown, Star, Gift } from 'lucide-react'

interface LoyaltyDropdownProps {
  title: string
}

export default function LoyaltyDropdown({ title }: LoyaltyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const loyaltyItems = [
    {
      name: 'Loyalty Status',
      href: '/loyalty-status',
      description: 'Check your loyalty level and benefits',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      name: 'Loyalty Demo',
      href: '/loyalty-demo',
      description: 'See how loyalty program works',
      icon: Gift,
      color: 'text-purple-500'
    }
  ]

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
        <Crown className="w-4 h-4 text-yellow-500" />
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
            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-foreground">Loyalty Program</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Unlock exclusive benefits and rewards
              </p>
            </div>

            {/* Loyalty Items */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2">
                {loyaltyItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-5 h-5 ${item.color}`} />
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>

                        {/* Arrow Icon */}
                        <div 
                          className={`w-4 h-4 text-muted-foreground transition-all duration-200 ${
                            hoveredIndex === index ? 'translate-x-1 text-primary' : ''
                          }`} 
                        >
                          →
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Loyalty Benefits Info */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">Loyalty Benefits</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Earn points, get exclusive discounts, and unlock premium features
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
