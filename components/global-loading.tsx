'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface GlobalLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLogo?: boolean
  text?: string
  fullScreen?: boolean
  className?: string
}

export default function GlobalLoading({ 
  size = 'lg', 
  showLogo = true, 
  text = 'Loading...',
  fullScreen = false,
  className = ''
}: GlobalLoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex flex-col items-center justify-center space-y-4'

  return (
    <div className={`${containerClasses} ${className}`}>
      {showLogo && (
        <motion.div
          className={`${sizeClasses[size]} relative`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/logo.png"
            alt="Sports Nation BD Logo"
            width={80}
            height={80}
            className="w-full h-full object-contain"
            priority
          />
        </motion.div>
      )}
      
      <motion.div
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="w-2 h-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-primary/70 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-primary/50 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </motion.div>
      
      <motion.p
        className={`${textSizeClasses[size]} text-primary font-medium`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {text}
      </motion.p>
    </div>
  )
}
