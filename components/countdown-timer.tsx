"use client"

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string
  title?: string
  description?: string
  onComplete?: () => void
  className?: string
}

export default function CountdownTimer({ 
  targetDate, 
  title, 
  description, 
  onComplete,
  className = ""
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Set hydrated to true after component mounts
    setIsHydrated(true)
    
    const target = new Date(targetDate).getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
        onComplete?.()
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  // Show loading state during hydration to prevent mismatch
  if (!isHydrated) {
    return (
      <div className={`text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-lg ${className}`}>
        {title && (
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        )}
        {description && (
          <p className="text-muted-foreground mb-4">{description}</p>
        )}
        
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
              --
            </div>
            <div className="text-xs text-muted-foreground mt-1">Days</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
              --
            </div>
            <div className="text-xs text-muted-foreground mt-1">Hours</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
              --
            </div>
            <div className="text-xs text-muted-foreground mt-1">Minutes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
              --
            </div>
            <div className="text-xs text-muted-foreground mt-1">Seconds</div>
          </div>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className={`text-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Offer Expired</h3>
        <p className="text-red-600 dark:text-red-400">This offer has ended</p>
      </div>
    )
  }

  return (
    <div className={`text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-lg ${className}`}>
      {title && (
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Days</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Hours</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Minutes</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[60px] shadow-sm">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Seconds</div>
        </div>
      </div>
    </div>
  )
}
