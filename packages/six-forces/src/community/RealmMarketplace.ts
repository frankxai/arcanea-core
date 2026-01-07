import { EventEmitter } from 'events'
import { RealmTemplate } from '../interfaces'
import { RealmDefinition, ManifestationResult, GuardianType } from '../types'

/**
 * RealmMarketplace - Community Marketplace for Realm Assets
 * 
 * A thriving marketplace where realm builders share templates, components,
 * AI Guardian configurations, and complete realm blueprints.
 */
export class RealmMarketplace extends EventEmitter {
  private listings: Map<string, MarketplaceListing> = new Map()
  private transactions: Map<string, MarketplaceTransaction> = new Map()
  private reviews: Map<string, MarketplaceReview[]> = new Map()

  constructor(private config: any) {
    super()
  }

  /**
   * List a realm asset for sale or sharing
   */
  async createListing(listing: {
    sellerId: string
    title: string
    description: string
    type: 'template' | 'component' | 'guardian-config' | 'complete-realm' | 'asset-pack'
    category: string
    price: number // 0 for free
    currency: 'USD' | 'credits'
    asset: any
    preview: {
      images: string[]
      demo_url?: string
      video_url?: string
    }
    tags: string[]
    forces: GuardianType[]
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    license: 'mit' | 'commercial' | 'attribution' | 'custom'
  }): Promise<MarketplaceListing> {
    try {
      const listingId = this.generateListingId()
      
      const marketplaceListing: MarketplaceListing = {
        id: listingId,
        sellerId: listing.sellerId,
        title: listing.title,
        description: listing.description,
        type: listing.type,
        category: listing.category,
        price: listing.price,
        currency: listing.currency,
        asset: listing.asset,
        preview: listing.preview,
        tags: listing.tags,
        forces: listing.forces,
        difficulty: listing.difficulty,
        license: listing.license,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 0,
        revenue: 0,
        rating: 0,
        reviewCount: 0,
        featured: false
      }

      this.listings.set(listingId, marketplaceListing)
      this.emit('marketplace:listing-created', marketplaceListing)

      return marketplaceListing

    } catch (error) {
      this.emit('marketplace:listing-failed', { listing, error })
      throw error
    }
  }

  /**
   * Purchase or download a marketplace item
   */
  async acquireAsset(params: {
    listingId: string
    buyerId: string
    paymentMethod?: 'card' | 'credits' | 'free'
  }): Promise<{
    transactionId: string
    asset: any
    accessUrl: string
    license: string
    downloadExpiry?: Date
  }> {
    try {
      const listing = this.listings.get(params.listingId)
      if (!listing) {
        throw new Error(`Listing ${params.listingId} not found`)
      }

      if (listing.status !== 'active') {
        throw new Error('Listing is not available for purchase')
      }

      const transactionId = this.generateTransactionId()
      
      // Process payment if required
      if (listing.price > 0) {
        await this.processPayment(params.buyerId, listing.price, listing.currency, params.paymentMethod)
      }

      // Create transaction record
      const transaction: MarketplaceTransaction = {
        id: transactionId,
        listingId: params.listingId,
        buyerId: params.buyerId,
        sellerId: listing.sellerId,
        amount: listing.price,
        currency: listing.currency,
        status: 'completed',
        timestamp: new Date(),
        license: listing.license
      }

      this.transactions.set(transactionId, transaction)

      // Update listing stats
      listing.downloads++
      listing.revenue += listing.price

      // Generate access
      const accessUrl = this.generateAssetAccessUrl(transactionId, listing.asset)
      
      this.emit('marketplace:asset-acquired', { transaction, listing })

      return {
        transactionId,
        asset: listing.asset,
        accessUrl,
        license: listing.license,
        downloadExpiry: listing.license === 'commercial' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
      }

    } catch (error) {
      this.emit('marketplace:acquisition-failed', { params, error })
      throw error
    }
  }

  /**
   * Search and discover marketplace assets
   */
  async searchMarketplace(query: {
    searchTerm?: string
    category?: string
    type?: string[]
    forces?: GuardianType[]
    priceRange?: { min: number; max: number }
    difficulty?: string[]
    sortBy?: 'relevance' | 'rating' | 'downloads' | 'recent' | 'price'
    limit?: number
  }): Promise<{
    results: MarketplaceListing[]
    totalCount: number
    facets: {
      categories: Record<string, number>
      types: Record<string, number>
      priceRanges: Record<string, number>
      forces: Record<GuardianType, number>
    }
  }> {
    let results = Array.from(this.listings.values())
      .filter(listing => listing.status === 'active')

    // Apply filters
    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase()
      results = results.filter(listing =>
        listing.title.toLowerCase().includes(term) ||
        listing.description.toLowerCase().includes(term) ||
        listing.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    if (query.category) {
      results = results.filter(listing => listing.category === query.category)
    }

    if (query.type) {
      results = results.filter(listing => query.type!.includes(listing.type))
    }

    if (query.forces) {
      results = results.filter(listing =>
        query.forces!.some(force => listing.forces.includes(force))
      )
    }

    if (query.priceRange) {
      results = results.filter(listing =>
        listing.price >= query.priceRange!.min &&
        listing.price <= query.priceRange!.max
      )
    }

    if (query.difficulty) {
      results = results.filter(listing => query.difficulty!.includes(listing.difficulty))
    }

    // Sort results
    results = this.sortListings(results, query.sortBy || 'relevance')

    // Limit results
    const limit = query.limit || 20
    const paginatedResults = results.slice(0, limit)

    // Calculate facets
    const facets = this.calculateSearchFacets(results)

    return {
      results: paginatedResults,
      totalCount: results.length,
      facets
    }
  }

  /**
   * Submit a review for a marketplace asset
   */
  async submitReview(params: {
    listingId: string
    reviewerId: string
    rating: number // 1-5
    title: string
    content: string
    pros: string[]
    cons: string[]
    usageContext: string
  }): Promise<{
    reviewId: string
    updatedRating: number
    reviewCount: number
  }> {
    try {
      const listing = this.listings.get(params.listingId)
      if (!listing) {
        throw new Error(`Listing ${params.listingId} not found`)
      }

      const reviewId = this.generateReviewId()
      
      const review: MarketplaceReview = {
        id: reviewId,
        listingId: params.listingId,
        reviewerId: params.reviewerId,
        rating: params.rating,
        title: params.title,
        content: params.content,
        pros: params.pros,
        cons: params.cons,
        usageContext: params.usageContext,
        timestamp: new Date(),
        helpful: 0,
        verified: this.hasVerifiedPurchase(params.reviewerId, params.listingId)
      }

      // Add review
      const listingReviews = this.reviews.get(params.listingId) || []
      listingReviews.push(review)
      this.reviews.set(params.listingId, listingReviews)

      // Update listing rating
      const updatedRating = this.calculateAverageRating(listingReviews)
      listing.rating = updatedRating
      listing.reviewCount = listingReviews.length

      this.emit('marketplace:review-submitted', { review, listing })

      return {
        reviewId,
        updatedRating,
        reviewCount: listingReviews.length
      }

    } catch (error) {
      this.emit('marketplace:review-failed', { params, error })
      throw error
    }
  }

  /**
   * Get trending and featured marketplace content
   */
  async getFeaturedContent(): Promise<{
    trending: MarketplaceListing[]
    newAndNoteworthy: MarketplaceListing[]
    topRated: MarketplaceListing[]
    mostDownloaded: MarketplaceListing[]
    editorsPicks: MarketplaceListing[]
  }> {
    const allListings = Array.from(this.listings.values())
      .filter(listing => listing.status === 'active')

    return {
      trending: this.getTrendingListings(allListings),
      newAndNoteworthy: this.getNewListings(allListings),
      topRated: this.getTopRatedListings(allListings),
      mostDownloaded: this.getMostDownloadedListings(allListings),
      editorsPicks: this.getEditorsPickListings(allListings)
    }
  }

  // Private helper methods
  private generateListingId(): string {
    return `listing_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  }

  private generateReviewId(): string {
    return `review_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  }

  private async processPayment(buyerId: string, amount: number, currency: string, method?: string): Promise<void> {
    // Simulate payment processing
    this.emit('marketplace:payment-processed', { buyerId, amount, currency, method })
  }

  private generateAssetAccessUrl(transactionId: string, asset: any): string {
    return `https://assets.arcanea.app/download/${transactionId}`
  }

  private hasVerifiedPurchase(reviewerId: string, listingId: string): boolean {
    return Array.from(this.transactions.values())
      .some(txn => txn.buyerId === reviewerId && txn.listingId === listingId && txn.status === 'completed')
  }

  private calculateAverageRating(reviews: MarketplaceReview[]): number {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }

  private sortListings(listings: MarketplaceListing[], sortBy: string): MarketplaceListing[] {
    switch (sortBy) {
      case 'rating':
        return listings.sort((a, b) => b.rating - a.rating)
      case 'downloads':
        return listings.sort((a, b) => b.downloads - a.downloads)
      case 'recent':
        return listings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      case 'price':
        return listings.sort((a, b) => a.price - b.price)
      default:
        return listings.sort((a, b) => (b.rating * b.downloads) - (a.rating * a.downloads))
    }
  }

  private calculateSearchFacets(listings: MarketplaceListing[]): any {
    const facets = {
      categories: {} as Record<string, number>,
      types: {} as Record<string, number>,
      priceRanges: {} as Record<string, number>,
      forces: {} as Record<GuardianType, number>
    }

    listings.forEach(listing => {
      // Category facets
      facets.categories[listing.category] = (facets.categories[listing.category] || 0) + 1
      
      // Type facets
      facets.types[listing.type] = (facets.types[listing.type] || 0) + 1
      
      // Price range facets
      const priceRange = listing.price === 0 ? 'Free' :
                        listing.price < 10 ? '$1-$9' :
                        listing.price < 50 ? '$10-$49' :
                        listing.price < 100 ? '$50-$99' : '$100+'
      facets.priceRanges[priceRange] = (facets.priceRanges[priceRange] || 0) + 1
      
      // Force facets
      listing.forces.forEach(force => {
        facets.forces[force] = (facets.forces[force] || 0) + 1
      })
    })

    return facets
  }

  private getTrendingListings(listings: MarketplaceListing[]): MarketplaceListing[] {
    return listings
      .filter(listing => listing.downloads > 10)
      .sort((a, b) => {
        const aScore = a.downloads * (7 - this.daysSinceCreated(a)) * (a.rating + 1)
        const bScore = b.downloads * (7 - this.daysSinceCreated(b)) * (b.rating + 1)
        return bScore - aScore
      })
      .slice(0, 10)
  }

  private getNewListings(listings: MarketplaceListing[]): MarketplaceListing[] {
    return listings
      .filter(listing => this.daysSinceCreated(listing) <= 30)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
  }

  private getTopRatedListings(listings: MarketplaceListing[]): MarketplaceListing[] {
    return listings
      .filter(listing => listing.reviewCount >= 3)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
  }

  private getMostDownloadedListings(listings: MarketplaceListing[]): MarketplaceListing[] {
    return listings
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10)
  }

  private getEditorsPickListings(listings: MarketplaceListing[]): MarketplaceListing[] {
    return listings
      .filter(listing => listing.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }

  private daysSinceCreated(listing: MarketplaceListing): number {
    return Math.floor((Date.now() - listing.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  }
}

// Marketplace interfaces
export interface MarketplaceListing {
  id: string
  sellerId: string
  title: string
  description: string
  type: 'template' | 'component' | 'guardian-config' | 'complete-realm' | 'asset-pack'
  category: string
  price: number
  currency: 'USD' | 'credits'
  asset: any
  preview: {
    images: string[]
    demo_url?: string
    video_url?: string
  }
  tags: string[]
  forces: GuardianType[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  license: 'mit' | 'commercial' | 'attribution' | 'custom'
  status: 'active' | 'paused' | 'removed'
  createdAt: Date
  updatedAt: Date
  downloads: number
  revenue: number
  rating: number
  reviewCount: number
  featured: boolean
}

export interface MarketplaceTransaction {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  timestamp: Date
  license: string
}

export interface MarketplaceReview {
  id: string
  listingId: string
  reviewerId: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  usageContext: string
  timestamp: Date
  helpful: number
  verified: boolean
}

export default RealmMarketplace