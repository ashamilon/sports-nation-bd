export interface FootballBadge {
  id: string
  name: string
  image: string
  category: 'premier-league' | 'la-liga' | 'serie-a' | 'bundesliga' | 'champions-league' | 'national-teams' | 'other'
  price: number
  description: string
}

export const footballBadges: FootballBadge[] = [
  // Premier League
  {
    id: 'arsenal',
    name: 'Arsenal FC',
    image: '/badges/arsenal.svg',
    category: 'premier-league',
    price: 150,
    description: 'Official Arsenal FC badge'
  },
  {
    id: 'chelsea',
    name: 'Chelsea FC',
    image: '/badges/chelsea.svg',
    category: 'premier-league',
    price: 150,
    description: 'Official Chelsea FC badge'
  },
  {
    id: 'liverpool',
    name: 'Liverpool FC',
    image: '/badges/liverpool.svg',
    category: 'premier-league',
    price: 150,
    description: 'Official Liverpool FC badge'
  },
  {
    id: 'manchester-city',
    name: 'Manchester City',
    image: '/badges/manchester-city.png',
    category: 'premier-league',
    price: 150,
    description: 'Official Manchester City badge'
  },
  {
    id: 'manchester-united',
    name: 'Manchester United',
    image: '/badges/manchester-united.png',
    category: 'premier-league',
    price: 150,
    description: 'Official Manchester United badge'
  },
  {
    id: 'tottenham',
    name: 'Tottenham Hotspur',
    image: '/badges/tottenham.png',
    category: 'premier-league',
    price: 150,
    description: 'Official Tottenham Hotspur badge'
  },

  // La Liga
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    image: '/badges/real-madrid.svg',
    category: 'la-liga',
    price: 150,
    description: 'Official Real Madrid badge'
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    image: '/badges/barcelona.svg',
    category: 'la-liga',
    price: 150,
    description: 'Official FC Barcelona badge'
  },
  {
    id: 'atletico-madrid',
    name: 'Atletico Madrid',
    image: '/badges/atletico-madrid.png',
    category: 'la-liga',
    price: 150,
    description: 'Official Atletico Madrid badge'
  },

  // Serie A
  {
    id: 'juventus',
    name: 'Juventus FC',
    image: '/badges/juventus.png',
    category: 'serie-a',
    price: 150,
    description: 'Official Juventus FC badge'
  },
  {
    id: 'ac-milan',
    name: 'AC Milan',
    image: '/badges/ac-milan.png',
    category: 'serie-a',
    price: 150,
    description: 'Official AC Milan badge'
  },
  {
    id: 'inter-milan',
    name: 'Inter Milan',
    image: '/badges/inter-milan.png',
    category: 'serie-a',
    price: 150,
    description: 'Official Inter Milan badge'
  },

  // Bundesliga
  {
    id: 'bayern-munich',
    name: 'Bayern Munich',
    image: '/badges/bayern-munich.png',
    category: 'bundesliga',
    price: 150,
    description: 'Official Bayern Munich badge'
  },
  {
    id: 'borussia-dortmund',
    name: 'Borussia Dortmund',
    image: '/badges/borussia-dortmund.png',
    category: 'bundesliga',
    price: 150,
    description: 'Official Borussia Dortmund badge'
  },

  // Champions League
  {
    id: 'champions-league',
    name: 'UEFA Champions League',
    image: '/badges/champions-league.png',
    category: 'champions-league',
    price: 200,
    description: 'Official UEFA Champions League badge'
  },
  {
    id: 'europa-league',
    name: 'UEFA Europa League',
    image: '/badges/europa-league.png',
    category: 'champions-league',
    price: 180,
    description: 'Official UEFA Europa League badge'
  },

  // National Teams
  {
    id: 'brazil',
    name: 'Brazil National Team',
    image: '/badges/brazil.png',
    category: 'national-teams',
    price: 120,
    description: 'Official Brazil National Team badge'
  },
  {
    id: 'argentina',
    name: 'Argentina National Team',
    image: '/badges/argentina.png',
    category: 'national-teams',
    price: 120,
    description: 'Official Argentina National Team badge'
  },
  {
    id: 'france',
    name: 'France National Team',
    image: '/badges/france.png',
    category: 'national-teams',
    price: 120,
    description: 'Official France National Team badge'
  },
  {
    id: 'germany',
    name: 'Germany National Team',
    image: '/badges/germany.png',
    category: 'national-teams',
    price: 120,
    description: 'Official Germany National Team badge'
  },
  {
    id: 'spain',
    name: 'Spain National Team',
    image: '/badges/spain.png',
    category: 'national-teams',
    price: 120,
    description: 'Official Spain National Team badge'
  },
  {
    id: 'england',
    name: 'England National Team',
    image: '/badges/england.png',
    category: 'national-teams',
    price: 120,
    description: 'Official England National Team badge'
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh National Team',
    image: '/badges/bangladesh.svg',
    category: 'national-teams',
    price: 100,
    description: 'Official Bangladesh National Team badge'
  },

  // Other
  {
    id: 'world-cup',
    name: 'FIFA World Cup',
    image: '/badges/world-cup.png',
    category: 'other',
    price: 200,
    description: 'Official FIFA World Cup badge'
  },
  {
    id: 'euro-cup',
    name: 'UEFA European Championship',
    image: '/badges/euro-cup.png',
    category: 'other',
    price: 180,
    description: 'Official UEFA European Championship badge'
  }
]

export const badgeCategories = [
  { id: 'premier-league', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'la-liga', name: 'La Liga', icon: '🇪🇸' },
  { id: 'serie-a', name: 'Serie A', icon: '🇮🇹' },
  { id: 'bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
  { id: 'champions-league', name: 'UEFA Competitions', icon: '🏆' },
  { id: 'national-teams', name: 'National Teams', icon: '🌍' },
  { id: 'other', name: 'Other', icon: '⚽' }
]

export const getBadgesByCategory = (category: string) => {
  return footballBadges.filter(badge => badge.category === category)
}

export const getBadgeById = (id: string) => {
  return footballBadges.find(badge => badge.id === id)
}
