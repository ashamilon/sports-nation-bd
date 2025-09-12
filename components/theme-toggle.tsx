"use client"

import { useTheme } from '@/lib/theme-provider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />
    if (theme === 'dark') return <Moon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const getThemeLabel = () => {
    if (theme === 'light') return 'Switch to dark mode'
    if (theme === 'dark') return 'Switch to system mode'
    return 'Switch to light mode'
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="glass-button relative p-2 rounded-lg"
      title={getThemeLabel()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {getThemeIcon()}
      </motion.div>
      
      {/* Theme indicator dots */}
      <div className="absolute -bottom-1 -right-1 flex gap-0.5">
        <div 
          className={`w-1 h-1 rounded-full transition-colors ${
            theme === 'light' ? 'bg-yellow-400' : 'bg-muted-foreground/30'
          }`} 
        />
        <div 
          className={`w-1 h-1 rounded-full transition-colors ${
            theme === 'dark' ? 'bg-blue-400' : 'bg-muted-foreground/30'
          }`} 
        />
        <div 
          className={`w-1 h-1 rounded-full transition-colors ${
            theme === 'system' ? 'bg-green-400' : 'bg-muted-foreground/30'
          }`} 
        />
      </div>
    </motion.button>
  )
}
