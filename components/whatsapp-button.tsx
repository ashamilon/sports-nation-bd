'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { generateWhatsAppUrl, isBusinessOpen } from '@/lib/config/whatsapp'

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const whatsappUrl = generateWhatsAppUrl()
    window.open(whatsappUrl, '_blank')
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Main WhatsApp Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppClick}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Support text - only visible on hover */}
        <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="font-medium">Need Help?</div>
          <div className="text-gray-500 dark:text-gray-400">
            {isBusinessOpen() ? "We're here to assist you!" : "We'll respond when we're back!"}
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-white dark:border-l-gray-800"></div>
        </div>
      </motion.button>
    </motion.div>
  )
}
