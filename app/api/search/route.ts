import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        results: {
          products: [],
          categories: [],
          suggestions: [],
          total: 0
        }
      })
    }

    // Build search conditions with fuzzy matching
    const searchTerms = query.toLowerCase().trim().split(/\s+/)
    const fuzzyConditions = []
    
    // Exact match (highest priority)
    fuzzyConditions.push(
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { slug: { contains: query, mode: 'insensitive' } }
    )
    
    // Partial word matching for each search term
    searchTerms.forEach(term => {
      if (term.length >= 2) { // Only for terms with 2+ characters
        fuzzyConditions.push(
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } }
        )
      }
    })
    
    // Fuzzy matching for common misspellings and variations
    const fuzzyVariations = generateFuzzyVariations(query)
    fuzzyVariations.forEach(variation => {
      if (variation.length >= 2) {
        fuzzyConditions.push(
          { name: { contains: variation, mode: 'insensitive' } },
          { description: { contains: variation, mode: 'insensitive' } }
        )
      }
    })

    const where: any = {
      isActive: true,
      OR: fuzzyConditions
    }

    // Add category filter
    if (category) {
      where.Category = {
        slug: category
      }
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Build sort order
    let orderBy: any = { createdAt: 'desc' }
    if (sortBy === 'price-low') {
      orderBy = { price: 'asc' }
    } else if (sortBy === 'price-high') {
      orderBy = { price: 'desc' }
    } else if (sortBy === 'name') {
      orderBy = { name: 'asc' }
    } else if (sortBy === 'relevance') {
      // For relevance, we'll use a combination of factors
      orderBy = [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }

    // Search products
    const [products, totalProducts, categories, popularSearches] = await Promise.all([
      // Products search
      prisma.product.findMany({
        where,
        include: {
          Category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          ProductVariant: true,
          Review: {
            where: {
              isApproved: true
            },
            select: {
              rating: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),

      // Total count
      prisma.product.count({ where }),

      // Related categories with fuzzy matching
      prisma.category.findMany({
        where: {
          OR: fuzzyConditions.filter(condition => 
            condition.name || condition.description
          ).map(condition => ({
            ...condition,
            // Remove product-specific fields for category search
            name: condition.name,
            description: condition.description
          }))
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          _count: {
            select: {
              Product: true
            }
          }
        },
        take: 5
      }),

      // Popular searches (mock data for now)
      []
    ])

    // Calculate average ratings for products
    const productsWithRatings = products.map(product => {
      const ratings = product.Review.map(r => r.rating)
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0

      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length
      }
    })

    // Generate search suggestions based on query
    const suggestions = await generateSearchSuggestions(query)

    return NextResponse.json({
      success: true,
      results: {
        products: productsWithRatings,
        categories,
        suggestions,
        total: totalProducts,
        hasMore: offset + limit < totalProducts
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateFuzzyVariations(query: string): string[] {
  const variations = new Set<string>()
  const lowerQuery = query.toLowerCase()
  
  // Add exact query
  variations.add(lowerQuery)
  
  // Common misspellings and variations for sports-related terms
  const commonVariations: { [key: string]: string[] } = {
    'jersey': ['jersy', 'jersie', 'jersay', 'jerzy'],
    'football': ['fotball', 'footbal', 'futball', 'futbal'],
    'soccer': ['socer', 'sokcer'],
    'basketball': ['basketbal', 'basktball'],
    'shirt': ['shrt', 'shirts'],
    'shorts': ['short'],
    'sports': ['sport', 'sportz', 'sportss'],
    'team': ['teem', 'teams'],
    'player': ['playr', 'players'],
    'uniform': ['unifrom', 'uniforms'],
    'apparel': ['aparel', 'apparels'],
    'athletic': ['athletik', 'athletics'],
    'training': ['trainig', 'trainning'],
    'performance': ['performace', 'performence'],
    'comfortable': ['comfortabl', 'comfotable'],
    'breathable': ['breathabl', 'breathible'],
    'moisture': ['moistur', 'moistrue'],
    'wicking': ['wickng'],
    'polyester': ['polyest'],
    'cotton': ['coton'],
    'nike': ['nikee'],
    'adidas': ['adiddas'],
    'puma': ['pumma'],
    'argentina': ['argentna'],
    'brazil': ['brazl'],
    'germany': ['germny'],
    'france': ['franc'],
    'spain': ['spn'],
    'england': ['englad'],
    'messi': ['mesi'],
    'ronaldo': ['ronldo'],
    'neymar': ['neymr']
  }
  
  // Add variations from common misspellings
  Object.keys(commonVariations).forEach(correct => {
    if (lowerQuery.includes(correct)) {
      commonVariations[correct].forEach(variation => {
        variations.add(lowerQuery.replace(correct, variation))
      })
    }
  })
  
  // Add reverse lookup - if query is a misspelling, add the correct version
  Object.keys(commonVariations).forEach(correct => {
    commonVariations[correct].forEach(misspelling => {
      if (lowerQuery.includes(misspelling)) {
        variations.add(lowerQuery.replace(misspelling, correct))
      }
    })
  })
  
  // Add simple character variations for common typos
  const charSubstitutions: { [key: string]: string[] } = {
    'e': ['a', 'i'],
    'a': ['e', 'i'],
    'i': ['e', 'a'],
    'o': ['e', 'a'],
    'u': ['o'],
    'c': ['k', 's'],
    'k': ['c'],
    's': ['c', 'z'],
    'z': ['s']
  }
  
  for (let i = 0; i < lowerQuery.length; i++) {
    const char = lowerQuery[i]
    if (charSubstitutions[char]) {
      charSubstitutions[char].forEach(sub => {
        const variation = lowerQuery.substring(0, i) + sub + lowerQuery.substring(i + 1)
        variations.add(variation)
      })
    }
  }
  
  return Array.from(variations).slice(0, 15) // Limit to 15 variations
}

async function generateSearchSuggestions(query: string) {
  try {
    // Generate fuzzy variations for suggestions
    const fuzzyVariations = generateFuzzyVariations(query)
    const suggestionConditions = [
      { name: { contains: query, mode: 'insensitive' } }
    ]
    
    // Add fuzzy variations for suggestions
    fuzzyVariations.slice(0, 5).forEach(variation => {
      suggestionConditions.push({ name: { contains: variation, mode: 'insensitive' } })
    })

    // Get product names that match the query and variations
    const products = await prisma.product.findMany({
      where: {
        OR: suggestionConditions,
        isActive: true
      },
      select: {
        name: true
      },
      take: 5
    })

    // Get category names that match the query and variations
    const categories = await prisma.category.findMany({
      where: {
        OR: suggestionConditions
      },
      select: {
        name: true
      },
      take: 3
    })

    // Combine and format suggestions
    const suggestions = [
      ...products.map(p => ({ text: p.name, type: 'product' })),
      ...categories.map(c => ({ text: c.name, type: 'category' }))
    ]

    return suggestions.slice(0, 8)
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return []
  }
}
