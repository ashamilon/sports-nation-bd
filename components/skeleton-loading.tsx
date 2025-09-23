"use client"

import { motion } from 'framer-motion'

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
        </div>
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export function SkeletonBanner() {
  return (
    <motion.div 
      className="w-full h-64 md:h-80 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: '200% 100%'
      }}
    />
  )
}

export function SkeletonCountdown() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="flex space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="h-12 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse mt-2 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonCategory() {
  return (
    <div className="text-center space-y-3">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto" />
    </div>
  )
}

export function SkeletonCollection() {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="h-6 bg-gray-300 rounded animate-pulse w-32 mb-2" />
          <div className="h-4 bg-gray-300 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonSection({ title, children, className = "" }: { 
  title?: string
  children: React.ReactNode
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-6 ${className}`}
    >
      {title && (
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto" />
        </div>
      )}
      {children}
    </motion.div>
  )
}
