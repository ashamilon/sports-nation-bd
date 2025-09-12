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
        {/* Logo Background - Blue to Purple Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 rounded-lg" />
        
        {/* Logo Shape - Stylized N */}
        <div className="relative w-6 h-8 flex items-center justify-center">
          {/* Main N shape */}
          <div className="absolute inset-0 bg-white/90 rounded-sm" />
          
          {/* Diagonal cuts */}
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-black transform -translate-x-1/2 rotate-12" />
          <div className="absolute bottom-0 right-1/2 w-0.5 h-full bg-black transform translate-x-1/2 -rotate-12" />
          
          {/* Texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-sm" />
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer" />
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-display font-bold text-foreground`}>
            Sports Nation BD
          </h1>
          <p className="text-xs text-muted-foreground">Premium Sports Gear</p>
        </div>
      )}
    </Link>
  )
}
