"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export default function Logo({ className = '', showText = true, size = 'md', href = '/' }: LogoProps) {
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

  const logoContent = (
    <div className="flex items-center space-x-2">
      <motion.div
        className={`${sizeClasses[size]} relative overflow-hidden rounded-lg flex items-center justify-center`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Brand Logo */}
        <div className="w-full h-full flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Sports Nation BD Logo"
          width={40}
          height={40}
          className="w-full h-full object-contain drop-shadow-sm"
          priority
        />
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer" />
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-display font-bold text-brand-dark dark:text-brand-light hidden sm:block`}>
            Sports Nation BD
          </h1>
          <p className="text-xs text-brand-medium dark:text-brand-light-gray hidden sm:block">Premium Sports Gear</p>
        </div>
      )}
    </div>
  )

  return (
    <div className={className}>
      {href ? (
        <Link href={href}>
          {logoContent}
        </Link>
      ) : (
        logoContent
      )}
    </div>
  )
}
