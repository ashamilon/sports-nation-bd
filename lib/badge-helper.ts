export interface Badge {
  id: string
  name: string
  description: string
  image: string
  category: string
  price: number
  isActive: boolean
  createdAt: string
}

// Function to resolve badge IDs to names using API route
export async function resolveBadgeNames(badgeIds: string[]): Promise<string[]> {
  if (!badgeIds || badgeIds.length === 0) {
    return []
  }

  try {
    const response = await fetch('/api/badges/resolve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ badgeIds }),
    })

    if (!response.ok) {
      throw new Error('Failed to resolve badge names')
    }

    const data = await response.json()
    return data.badgeNames || badgeIds // Fallback to IDs if API fails
  } catch (error) {
    console.error('Error resolving badge names:', error)
    return badgeIds // Fallback to IDs if API fails
  }
}
