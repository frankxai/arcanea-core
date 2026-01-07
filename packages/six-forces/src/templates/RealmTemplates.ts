import { RealmTemplate } from '../interfaces'
import { BusinessRealmGenerator } from './BusinessRealmGenerator'
import { EducationRealmGenerator } from './EducationRealmGenerator'
import { GamingRealmGenerator } from './GamingRealmGenerator'
import { WellnessRealmGenerator } from './WellnessRealmGenerator'

/**
 * RealmTemplates - Central registry for all realm templates
 * 
 * Provides access to pre-built templates for different types of multiverses,
 * making it easy for realm builders to start with proven patterns.
 */
export class RealmTemplates {
  private templates: Map<string, RealmTemplate> = new Map()
  private generators: Map<string, any> = new Map()

  constructor() {
    this.initializeGenerators()
    this.loadBuiltInTemplates()
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): RealmTemplate | undefined {
    return this.templates.get(id)
  }

  /**
   * Get all templates in a category
   */
  getTemplatesByCategory(category: string): RealmTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.category === category)
      .sort((a, b) => b.rating - a.rating)
  }

  /**
   * Get templates suitable for a specific audience
   */
  getTemplatesForAudience(audience: string): RealmTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => {
        const audienceMatch = template.template.target_audience?.toLowerCase().includes(audience.toLowerCase())
        return audienceMatch
      })
      .sort((a, b) => b.usage - a.usage)
  }

  /**
   * Get templates by difficulty level
   */
  getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'): RealmTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.difficulty === difficulty)
      .sort((a, b) => b.rating - a.rating)
  }

  /**
   * Search templates by keywords
   */
  searchTemplates(query: string): RealmTemplate[] {
    const lowercaseQuery = query.toLowerCase()
    
    return Array.from(this.templates.values())
      .filter(template => 
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.category.toLowerCase().includes(lowercaseQuery) ||
        template.template.vision?.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => b.rating - a.rating)
  }

  /**
   * Get recommended templates based on vision analysis
   */
  getRecommendedTemplates(visionKeywords: string[], targetAudience: string): RealmTemplate[] {
    const scored = Array.from(this.templates.values()).map(template => {
      let score = 0
      
      // Audience match
      if (template.template.target_audience?.toLowerCase().includes(targetAudience.toLowerCase())) {
        score += 50
      }

      // Keyword matches
      visionKeywords.forEach(keyword => {
        const lowerKeyword = keyword.toLowerCase()
        if (template.description.toLowerCase().includes(lowerKeyword)) score += 10
        if (template.name.toLowerCase().includes(lowerKeyword)) score += 15
        if (template.template.vision?.toLowerCase().includes(lowerKeyword)) score += 20
      })

      // Usage and rating boost
      score += template.rating * 5
      score += Math.min(template.usage / 100, 10)

      return { template, score }
    })

    return scored
      .filter(item => item.score > 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.template)
  }

  /**
   * Generate a custom template from a successful realm
   */
  async generateTemplateFromRealm(realmId: string, templateMetadata: {
    name: string
    description: string
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    createdBy: string
  }): Promise<RealmTemplate> {
    // In a real implementation, this would fetch the realm from storage
    // For now, we'll create a basic template structure
    
    const template: RealmTemplate = {
      id: `custom_${Date.now()}`,
      name: templateMetadata.name,
      description: templateMetadata.description,
      category: templateMetadata.category,
      difficulty: templateMetadata.difficulty,
      estimatedTime: this.estimateTimeFromDifficulty(templateMetadata.difficulty),
      prerequisites: this.getPrerequisitesForDifficulty(templateMetadata.difficulty),
      template: {
        vision: 'Custom realm vision based on successful implementation',
        name: 'Generated from Template',
        target_audience: 'custom',
        timeline: 'standard',
        forces: {
          flame: { strategy: '', business_model: '', growth_vector: '', target_market: '', monetization_approach: '' },
          form: { aesthetic: '', primary_colors: [], architecture: '', brand_personality: '', visual_style: '' },
          lore: { origin_myth: '', core_conflicts: [], hero_journey: '', community_values: [], narrative_themes: [] },
          resonance: { soundscape: '', voice_style: '', music_genres: [], emotional_tones: [], audio_branding: '' },
          synthesis: { tech_stack: [], integrations: [], performance_requirements: '', scalability_plan: '', security_approach: '' },
          manifestation: { 
            digital: { web_platform: false, mobile_app: false, desktop_client: false, social_presence: [], content_channels: [] },
            physical: { merchandise: '', events: '', locations: '', partnerships: [], physical_touchpoints: [] },
            business: { launch_strategy: '', revenue_streams: [], timeline: '', success_metrics: [], partnership_strategy: '' },
            timeline: '',
            success_metrics: []
          }
        }
      },
      customization: {
        requiredFields: ['vision', 'name', 'target_audience'],
        optionalFields: ['template'],
        fieldTypes: {
          vision: 'text',
          name: 'text',
          target_audience: 'select'
        },
        validation: {},
        dependencies: {}
      },
      examples: ['Example realm manifestation using this template'],
      createdBy: templateMetadata.createdBy,
      usage: 0,
      rating: 4.5
    }

    this.templates.set(template.id, template)
    return template
  }

  /**
   * Get template categories with counts
   */
  getCategories(): Array<{ name: string; count: number; description: string }> {
    const categoryMap = new Map<string, number>()
    
    Array.from(this.templates.values()).forEach(template => {
      categoryMap.set(template.category, (categoryMap.get(template.category) || 0) + 1)
    })

    const categoryDescriptions = {
      'business': 'Templates for business and enterprise applications',
      'education': 'Templates for learning and educational platforms',
      'gaming': 'Templates for interactive experiences and games',
      'wellness': 'Templates for health, mindfulness, and personal growth',
      'creative': 'Templates for artistic and creative communities',
      'social': 'Templates for social networks and community platforms',
      'startup': 'Templates for entrepreneur and startup ecosystems',
      'enterprise': 'Templates for large-scale organizational solutions'
    }

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      description: categoryDescriptions[name as keyof typeof categoryDescriptions] || 'Custom template category'
    }))
  }

  /**
   * Get featured templates
   */
  getFeaturedTemplates(limit: number = 6): RealmTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.rating >= 4.0 && template.usage >= 50)
      .sort((a, b) => (b.rating * b.usage) - (a.rating * a.usage))
      .slice(0, limit)
  }

  /**
   * Get beginner-friendly templates
   */
  getBeginnerTemplates(): RealmTemplate[] {
    return this.getTemplatesByDifficulty('beginner')
      .filter(template => template.prerequisites.length <= 2)
      .slice(0, 4)
  }

  private initializeGenerators(): void {
    this.generators.set('business', new BusinessRealmGenerator())
    this.generators.set('education', new EducationRealmGenerator())
    this.generators.set('gaming', new GamingRealmGenerator())
    this.generators.set('wellness', new WellnessRealmGenerator())
  }

  private loadBuiltInTemplates(): void {
    // Business Templates
    const businessGenerator = this.generators.get('business')
    this.templates.set('saas-platform', businessGenerator.createSaaSTemplate())
    this.templates.set('marketplace', businessGenerator.createMarketplaceTemplate())
    this.templates.set('enterprise-solution', businessGenerator.createEnterpriseTemplate())

    // Education Templates
    const educationGenerator = this.generators.get('education')
    this.templates.set('online-course', educationGenerator.createOnlineCourseTemplate())
    this.templates.set('skill-platform', educationGenerator.createSkillPlatformTemplate())
    this.templates.set('research-community', educationGenerator.createResearchCommunityTemplate())

    // Gaming Templates
    const gamingGenerator = this.generators.get('gaming')
    this.templates.set('indie-game', gamingGenerator.createIndieGameTemplate())
    this.templates.set('social-game', gamingGenerator.createSocialGameTemplate())
    this.templates.set('educational-game', gamingGenerator.createEducationalGameTemplate())

    // Wellness Templates
    const wellnessGenerator = this.generators.get('wellness')
    this.templates.set('meditation-app', wellnessGenerator.createMeditationTemplate())
    this.templates.set('fitness-platform', wellnessGenerator.createFitnessTemplate())
    this.templates.set('mental-health', wellnessGenerator.createMentalHealthTemplate())

    // Add creative and social templates
    this.addCreativeTemplates()
    this.addSocialTemplates()
  }

  private addCreativeTemplates(): void {
    const creativeTemplates = [
      {
        id: 'artist-collective',
        name: 'Artist Collective Platform',
        description: 'Community platform for artists to collaborate, showcase, and monetize their work',
        category: 'creative',
        difficulty: 'intermediate' as const,
        estimatedTime: '3-6 months',
        template: {
          vision: 'Empowering artists to build sustainable creative careers through community and technology',
          name: 'Creative Collective',
          target_audience: 'visual artists, designers, and creative professionals',
          timeline: 'standard' as const,
          forces: {
            flame: {
              strategy: 'Creator economy platform with community focus',
              business_model: 'Commission-based marketplace with premium memberships',
              growth_vector: 'Artist referrals and portfolio virality',
              target_market: 'Independent artists and small creative agencies',
              monetization_approach: 'Marketplace commissions and premium tools'
            },
            form: {
              aesthetic: 'Bold and artistic with gallery-quality presentation',
              primary_colors: ['#dc2626', '#f59e0b', '#8b5cf6', '#1f2937'],
              architecture: 'Portfolio-first design with social features',
              brand_personality: 'Creative, inspiring, supportive',
              visual_style: 'Modern gallery aesthetic with artistic flair'
            },
            lore: {
              origin_myth: 'Founded by artists who believed creativity should never be constrained by business complexity',
              core_conflicts: ['Individual expression vs. commercial success', 'Artistic integrity vs. market demands'],
              hero_journey: 'From struggling artist to thriving creative entrepreneur',
              community_values: ['Artistic freedom', 'Mutual support', 'Creative integrity', 'Fair compensation'],
              narrative_themes: ['Creativity', 'Community', 'Success', 'Authenticity']
            },
            resonance: {
              soundscape: 'Inspiring creative workspace ambience',
              voice_style: 'Encouraging and artistic',
              music_genres: ['Ambient', 'Lo-fi', 'Instrumental', 'World Music'],
              emotional_tones: ['Inspiring', 'Focused', 'Uplifting', 'Contemplative'],
              audio_branding: 'Artistic soundscapes that enhance creative flow'
            },
            synthesis: {
              tech_stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Cloudinary'],
              integrations: ['Payment processing', 'Image optimization', 'Social sharing', 'Portfolio hosting'],
              performance_requirements: 'Fast image loading, responsive design, mobile optimization',
              scalability_plan: 'CDN-based scaling with edge optimization',
              security_approach: 'Artist portfolio protection with usage rights management'
            },
            manifestation: {
              digital: {
                web_platform: true,
                mobile_app: true,
                desktop_client: false,
                social_presence: ['Instagram', 'Behance', 'Dribbble', 'Twitter'],
                content_channels: ['Artist blog', 'Tutorial series', 'Community forum']
              },
              physical: {
                merchandise: 'Artist-designed prints, tools, and branded merchandise',
                events: 'Gallery openings, creative workshops, art fairs',
                locations: 'Pop-up galleries in creative districts',
                partnerships: ['Art galleries', 'Creative agencies', 'Art schools'],
                physical_touchpoints: ['Business cards with portfolio QR codes', 'Gallery displays']
              },
              business: {
                launch_strategy: 'Artist referral network with showcase events',
                revenue_streams: ['Marketplace commissions', 'Premium memberships', 'Print sales', 'Workshop fees'],
                timeline: '6-month beta with artist early adopters',
                success_metrics: ['Artist revenue growth', 'Portfolio engagement', 'Community activity'],
                partnership_strategy: 'Collaborate with art institutions and creative organizations'
              },
              timeline: '8-month development with 3-month beta',
              success_metrics: ['Artist income increase', 'Portfolio views', 'Community engagement', 'Repeat usage']
            }
          }
        }
      }
    ]

    creativeTemplates.forEach(template => {
      const realmTemplate: RealmTemplate = {
        ...template,
        prerequisites: ['Basic understanding of creative markets', 'Community management experience'],
        customization: {
          requiredFields: ['vision', 'name', 'target_audience'],
          optionalFields: ['aesthetic', 'primary_colors', 'community_values'],
          fieldTypes: {
            vision: 'text',
            name: 'text',
            target_audience: 'text',
            aesthetic: 'text',
            primary_colors: 'multiselect'
          },
          validation: {
            vision: [{ type: 'required', message: 'Vision is required' }],
            name: [{ type: 'required', message: 'Name is required' }]
          },
          dependencies: {}
        },
        examples: [
          'Digital art marketplace with community features',
          'Creative agency portfolio platform',
          'Artist collective with exhibition spaces'
        ],
        createdBy: 'ARCANEA Core Team',
        usage: 156,
        rating: 4.7
      }

      this.templates.set(template.id, realmTemplate)
    })
  }

  private addSocialTemplates(): void {
    const socialTemplates = [
      {
        id: 'community-platform',
        name: 'Community Platform',
        description: 'Build engaged communities around shared interests and goals',
        category: 'social',
        difficulty: 'intermediate' as const,
        estimatedTime: '4-8 months',
        template: {
          vision: 'Creating meaningful connections and shared experiences around common interests',
          name: 'Community Hub',
          target_audience: 'community builders and enthusiasts',
          timeline: 'standard' as const,
          forces: {
            flame: {
              strategy: 'Community-first growth with engagement monetization',
              business_model: 'Freemium community with premium features',
              growth_vector: 'Member referrals and content virality',
              target_market: 'Community organizers and active participants',
              monetization_approach: 'Premium memberships and community tools'
            },
            form: {
              aesthetic: 'Welcoming and inclusive with clear navigation',
              primary_colors: ['#10b981', '#3b82f6', '#f8fafc', '#374151'],
              architecture: 'Community-centric design with social features',
              brand_personality: 'Friendly, inclusive, supportive',
              visual_style: 'Clean and accessible with community focus'
            },
            lore: {
              origin_myth: 'Born from the belief that genuine community can transform lives',
              core_conflicts: ['Individual needs vs. community harmony', 'Growth vs. intimacy'],
              hero_journey: 'From isolated individual to empowered community member',
              community_values: ['Inclusivity', 'Mutual support', 'Authentic connection', 'Shared growth'],
              narrative_themes: ['Belonging', 'Growth', 'Connection', 'Purpose']
            },
            resonance: {
              soundscape: 'Warm social ambience with collaborative energy',
              voice_style: 'Friendly and encouraging',
              music_genres: ['Ambient', 'Acoustic', 'World Music'],
              emotional_tones: ['Welcoming', 'Supportive', 'Inspiring', 'Calm'],
              audio_branding: 'Community-focused audio that encourages participation'
            },
            synthesis: {
              tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'WebSocket'],
              integrations: ['Real-time chat', 'Event management', 'Member directory', 'Content moderation'],
              performance_requirements: 'Real-time messaging, fast content loading, mobile responsive',
              scalability_plan: 'Horizontal scaling with community sharding',
              security_approach: 'Privacy-focused with community moderation tools'
            },
            manifestation: {
              digital: {
                web_platform: true,
                mobile_app: true,
                desktop_client: false,
                social_presence: ['Discord', 'Twitter', 'LinkedIn', 'Facebook'],
                content_channels: ['Community blog', 'Newsletter', 'Event announcements']
              },
              physical: {
                merchandise: 'Community-branded items and member exclusives',
                events: 'Regular meetups, conferences, and social gatherings',
                locations: 'Co-working spaces and community centers',
                partnerships: ['Local venues', 'Related organizations', 'Event organizers'],
                physical_touchpoints: ['Name badges with community QR codes', 'Welcome packages']
              },
              business: {
                launch_strategy: 'Invite-only beta with key community influencers',
                revenue_streams: ['Premium memberships', 'Event tickets', 'Sponsored content', 'Community tools'],
                timeline: '4-month MVP with gradual feature rollout',
                success_metrics: ['Member engagement', 'Event attendance', 'Content creation', 'Member retention'],
                partnership_strategy: 'Partner with existing communities and organizations'
              },
              timeline: '6-month development with 2-month beta',
              success_metrics: ['Daily active members', 'Community content creation', 'Event participation', 'Member satisfaction']
            }
          }
        }
      }
    ]

    socialTemplates.forEach(template => {
      const realmTemplate: RealmTemplate = {
        ...template,
        prerequisites: ['Community management experience', 'Understanding of social dynamics'],
        customization: {
          requiredFields: ['vision', 'name', 'target_audience', 'community_values'],
          optionalFields: ['aesthetic', 'events', 'partnerships'],
          fieldTypes: {
            vision: 'text',
            name: 'text',
            target_audience: 'text',
            community_values: 'multiselect',
            events: 'text'
          },
          validation: {
            vision: [{ type: 'required', message: 'Vision is required' }],
            name: [{ type: 'required', message: 'Name is required' }],
            community_values: [{ type: 'required', message: 'At least one community value is required' }]
          },
          dependencies: {
            events: ['physical.events'],
            partnerships: ['physical.partnerships']
          }
        },
        examples: [
          'Professional networking community',
          'Hobby enthusiast group platform',
          'Local community organization hub'
        ],
        createdBy: 'ARCANEA Core Team',
        usage: 89,
        rating: 4.3
      }

      this.templates.set(template.id, realmTemplate)
    })
  }

  private estimateTimeFromDifficulty(difficulty: string): string {
    const timeMap = {
      'beginner': '2-4 weeks',
      'intermediate': '1-3 months',
      'advanced': '3-6 months',
      'expert': '6-12 months'
    }
    return timeMap[difficulty as keyof typeof timeMap] || '1-3 months'
  }

  private getPrerequisitesForDifficulty(difficulty: string): string[] {
    const prerequisiteMap = {
      'beginner': ['Basic computer skills', 'Clear vision for your realm'],
      'intermediate': ['Some technical or business experience', 'Understanding of target audience'],
      'advanced': ['Significant domain expertise', 'Team coordination experience', 'Technical knowledge'],
      'expert': ['Deep industry expertise', 'Large-scale project management', 'Advanced technical skills', 'Business development experience']
    }
    return prerequisiteMap[difficulty as keyof typeof prerequisiteMap] || []
  }

  /**
   * Import templates from external sources
   */
  async importTemplates(source: 'github' | 'community' | 'marketplace', query?: string): Promise<RealmTemplate[]> {
    // This would integrate with external template repositories
    // For now, return empty array as placeholder
    return []
  }

  /**
   * Export template for sharing
   */
  exportTemplate(templateId: string, format: 'json' | 'rdl' | 'yaml'): string {
    const template = this.templates.get(templateId)
    if (!template) throw new Error(`Template ${templateId} not found`)

    switch (format) {
      case 'json':
        return JSON.stringify(template, null, 2)
      case 'rdl':
        // Would use RDLCompiler to convert template.template to RDL
        return '# RDL export not yet implemented'
      case 'yaml':
        // Would convert to YAML format
        return '# YAML export not yet implemented'
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }
}

export default RealmTemplates