"use client"

import { useState } from 'react'
import { useRegionalStore } from '@/lib/store/regional-store'
import { useTranslation } from '@/lib/translations'
import { Globe, Check } from 'lucide-react'

const regions = [
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'EU', name: 'Europe', flag: '🇪🇺' },
  { code: 'OTHER', name: 'Other', flag: '🌍' }
]

export function RegionalSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { region, settings, setRegion } = useRegionalStore()
  const t = useTranslation(settings.language)

  const currentRegion = regions.find(r => r.code === region) || regions[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentRegion.flag} {currentRegion.name}</span>
        <span className="sm:hidden">{currentRegion.flag}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                {t('selectRegion')}
              </div>
              {regions.map((regionOption) => (
                <button
                  key={regionOption.code}
                  onClick={() => {
                    setRegion(regionOption.code)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{regionOption.flag}</span>
                    <span>{regionOption.name}</span>
                  </div>
                  {region === regionOption.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
