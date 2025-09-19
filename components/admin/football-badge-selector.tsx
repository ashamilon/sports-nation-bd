"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Badge {
  id: string
  name: string
  description?: string
  image: string
  category: string
  price: number
  isActive: boolean
}

interface FootballBadgeSelectorProps {
  selectedBadges: string[]
  onBadgeSelect: (badgeIds: string[]) => void
  maxSelections?: number
}

const badgeCategories = [
  { id: 'premier-league', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'la-liga', name: 'La Liga', icon: '🇪🇸' },
  { id: 'serie-a', name: 'Serie A', icon: '🇮🇹' },
  { id: 'bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
  { id: 'champions-league', name: 'UEFA Competitions', icon: '🏆' },
  { id: 'national-teams', name: 'National Teams', icon: '🌍' },
  { id: 'other', name: 'Other', icon: '⚽' }
]

export default function FootballBadgeSelector({ 
  selectedBadges, 
  onBadgeSelect, 
  maxSelections = 3 
}: FootballBadgeSelectorProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/badges?isActive=true')
      const data = await response.json()

      if (response.ok) {
        setBadges(data.badges || [])
      } else {
        toast.error('Failed to load badges')
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
      toast.error('Failed to load badges')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (badge.description && badge.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleBadgeToggle = (badgeId: string) => {
    if (selectedBadges.includes(badgeId)) {
      onBadgeSelect(selectedBadges.filter(id => id !== badgeId))
    } else if (selectedBadges.length < maxSelections) {
      onBadgeSelect([...selectedBadges, badgeId])
    }
  }

  const removeBadge = (badgeId: string) => {
    onBadgeSelect(selectedBadges.filter(id => id !== badgeId))
  }

  const getSelectedBadgeDetails = () => {
    return selectedBadges.map(id => badges.find(badge => badge.id === id)).filter(Boolean) as Badge[]
  }

  const selectedBadgeDetails = getSelectedBadgeDetails()
  const totalPrice = selectedBadgeDetails.reduce((sum, badge) => sum + badge.price, 0)

  return (
    <div className="space-y-4">
      {/* Selected Badges Display */}
      {selectedBadgeDetails.length > 0 && (
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Selected Badges</h3>
            <div className="text-sm text-muted-foreground">
              {selectedBadgeDetails.length}/{maxSelections} selected
            </div>
          </div>
          
          <div className="space-y-2">
            {selectedBadgeDetails.map((badge) => (
              <div key={badge.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white border-2 border-border">
                    <img 
                      src={badge.image} 
                      alt={badge.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-badge.svg'
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">৳{badge.price}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeBadge(badge.id)}
                  className="text-destructive hover:text-destructive/80 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {totalPrice > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total Badge Cost:</span>
                  <span className="font-bold text-primary">৳{totalPrice}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badge Selector */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Football Badges</h3>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="glass-button px-3 py-2 rounded-lg text-sm"
          >
            {isOpen ? 'Hide' : 'Select Badges'}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search badges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input w-full pl-10 pr-3 py-2 rounded-lg text-sm"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    All
                  </button>
                  {badgeCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges Grid */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2 text-sm">Loading badges...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredBadges.map((badge) => {
                    const isSelected = selectedBadges.includes(badge.id)
                    const isDisabled = !isSelected && selectedBadges.length >= maxSelections
                    
                    return (
                      <motion.div
                        key={badge.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : isDisabled
                            ? 'border-muted bg-muted/30 opacity-50 cursor-not-allowed'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        onClick={() => !isDisabled && handleBadgeToggle(badge.id)}
                      >
                        <div className="p-3">
                          <div className="aspect-square w-full mb-2 rounded-lg overflow-hidden bg-white border border-border">
                            <img 
                              src={badge.image} 
                              alt={badge.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder-badge.svg'
                              }}
                            />
                          </div>
                          
                          <div className="text-center">
                            <h4 className="font-medium text-foreground text-xs mb-1 line-clamp-2">
                              {badge.name}
                            </h4>
                            <p className="text-primary font-semibold text-xs">
                              ৳{badge.price}
                            </p>
                          </div>

                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </div>
                          )}

                          {badge.category === 'champions-league' && (
                            <div className="absolute top-2 left-2">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                  {filteredBadges.length === 0 && (
                    <div className="text-center py-8 col-span-full">
                      <p className="text-muted-foreground">No badges found matching your criteria.</p>
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Selection Info */}
              <div className="text-center text-sm text-muted-foreground">
                Select up to {maxSelections} badges for customization
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
