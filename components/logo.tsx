"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative overflow-hidden rounded-lg flex items-center justify-center`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Brand Logo */}
        <div className="w-full h-full flex items-center justify-center">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 120 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
                <stop offset="30%" style={{stopColor:'#4F46E5', stopOpacity:1}} />
                <stop offset="70%" style={{stopColor:'#7C3AED', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
              </linearGradient>
              <pattern id="texture" patternUnits="userSpaceOnUse" width="8" height="8">
                <rect width="8" height="8" fill="url(#logoGradient)"/>
                <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.15)"/>
                <circle cx="6" cy="6" r="0.5" fill="rgba(255,255,255,0.08)"/>
                <circle cx="4" cy="4" r="0.3" fill="rgba(255,255,255,0.05)"/>
              </pattern>
            </defs>
            
            {/* Main logo shape - stylized N/SN with rounded corners */}
            <g>
              {/* Left segment with rounded corners */}
              <path d="M24 12 C24 8, 28 8, 32 8 L40 8 C44 8, 48 12, 48 16 L48 24 L40 24 L40 16 L32 16 L32 104 L40 104 L40 96 L48 96 C48 100, 44 104, 40 104 L32 104 C28 104, 24 100, 24 96 Z" fill="url(#texture)"/>
              
              {/* Right segment with rounded corners */}
              <path d="M96 12 C96 8, 92 8, 88 8 L80 8 C76 8, 72 12, 72 16 L72 24 L80 24 L80 16 L88 16 L88 104 L80 104 L80 96 L72 96 C72 100, 76 104, 80 104 L88 104 C92 104, 96 100, 96 96 Z" fill="url(#texture)"/>
              
              {/* Diagonal connector with smooth curves */}
              <path d="M48 24 L52 24 L52 32 L56 32 L56 24 L60 24 L60 32 L64 32 L64 24 L68 24 L68 32 L72 32 L72 24 L76 24 L76 32 L80 32 L80 24 L84 24 L84 32 L88 32 L88 24 L92 24 L92 32 L96 32 L96 24 L100 24 L100 32 L96 32 L96 40 L92 40 L92 32 L88 32 L88 40 L84 40 L84 32 L80 32 L80 40 L76 40 L76 32 L72 32 L72 40 L68 40 L68 32 L64 32 L64 40 L60 40 L60 32 L56 32 L56 40 L52 40 L52 32 L48 32 Z" fill="url(#texture)"/>
            </g>
          </svg>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer" />
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-display font-bold text-foreground hidden sm:block`}>
            Sports Nation BD
          </h1>
          <h1 className={`text-lg font-display font-bold text-foreground sm:hidden`}>
            SN BD
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Premium Sports Gear</p>
        </div>
      )}
    </Link>
  )
}
