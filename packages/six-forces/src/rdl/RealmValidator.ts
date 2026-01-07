import { RealmDefinition, GuardianType } from '../types'

/**
 * RealmValidator - Validates realm definitions for completeness and quality
 * 
 * Ensures realm definitions meet quality standards and can be successfully
 * manifested by the Six Forces framework.
 */
export class RealmValidator {
  
  /**
   * Validate a realm definition
   */
  async validate(realm: RealmDefinition): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
    score: number
    completeness: Record<GuardianType, number>
  }> {
    const errors: string[] = []
    const warnings: string[] = []
    const completeness: Record<GuardianType, number> = {
      flame: 0,
      form: 0,
      lore: 0,
      resonance: 0,
      synthesis: 0,
      manifestation: 0
    }

    // Validate required fields
    const requiredFieldErrors = this.validateRequiredFields(realm)
    errors.push(...requiredFieldErrors)

    // Validate each force
    const flameValidation = this.validateFlameForce(realm.forces.flame)
    errors.push(...flameValidation.errors)
    warnings.push(...flameValidation.warnings)
    completeness.flame = flameValidation.score

    const formValidation = this.validateFormForce(realm.forces.form)
    errors.push(...formValidation.errors)
    warnings.push(...formValidation.warnings)
    completeness.form = formValidation.score

    const loreValidation = this.validateLoreForce(realm.forces.lore)
    errors.push(...loreValidation.errors)
    warnings.push(...loreValidation.warnings)
    completeness.lore = loreValidation.score

    const resonanceValidation = this.validateResonanceForce(realm.forces.resonance)
    errors.push(...resonanceValidation.errors)
    warnings.push(...resonanceValidation.warnings)
    completeness.resonance = resonanceValidation.score

    const synthesisValidation = this.validateSynthesisForce(realm.forces.synthesis)
    errors.push(...synthesisValidation.errors)
    warnings.push(...synthesisValidation.warnings)
    completeness.synthesis = synthesisValidation.score

    const manifestationValidation = this.validateManifestationForce(realm.forces.manifestation)
    errors.push(...manifestationValidation.errors)
    warnings.push(...manifestationValidation.warnings)
    completeness.manifestation = manifestationValidation.score

    // Cross-force validation
    const crossValidation = this.validateCrossForceAlignment(realm)
    warnings.push(...crossValidation.warnings)

    // Calculate overall score
    const score = this.calculateOverallScore(completeness, errors.length, warnings.length)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
      completeness
    }
  }

  /**
   * Quick validation for essential elements only
   */
  validateEssentials(realm: Partial<RealmDefinition>): {
    isValid: boolean
    missingEssentials: string[]
  } {
    const missingEssentials: string[] = []

    if (!realm.vision) missingEssentials.push('Vision statement')
    if (!realm.name) missingEssentials.push('Realm name')
    if (!realm.target_audience) missingEssentials.push('Target audience')

    return {
      isValid: missingEssentials.length === 0,
      missingEssentials
    }
  }

  /**
   * Validate specific force configuration
   */
  validateForce(force: GuardianType, config: any): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    suggestions: string[]
  } {
    switch (force) {
      case 'flame':
        return this.validateFlameForce(config)
      case 'form':
        return this.validateFormForce(config)
      case 'lore':
        return this.validateLoreForce(config)
      case 'resonance':
        return this.validateResonanceForce(config)
      case 'synthesis':
        return this.validateSynthesisForce(config)
      case 'manifestation':
        return this.validateManifestationForce(config)
      default:
        return { isValid: false, errors: [`Unknown force: ${force}`], warnings: [], suggestions: [] }
    }
  }

  // Required fields validation
  private validateRequiredFields(realm: RealmDefinition): string[] {
    const errors: string[] = []

    if (!realm.vision) errors.push('Vision is required')
    if (!realm.name) errors.push('Name is required')
    if (!realm.target_audience) errors.push('Target audience is required')
    if (!realm.timeline) errors.push('Timeline is required')
    if (!['rapid', 'standard', 'comprehensive'].includes(realm.timeline)) {
      errors.push('Timeline must be rapid, standard, or comprehensive')
    }

    return errors
  }

  // Force-specific validation methods
  private validateFlameForce(flame: any): { errors: string[]; warnings: string[]; score: number; suggestions?: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    let score = 0

    if (flame.strategy) score += 25
    else warnings.push('Strategy not defined - consider adding strategic direction')

    if (flame.business_model) score += 25
    else warnings.push('Business model not specified - important for manifestation planning')

    if (flame.target_market) score += 20
    else warnings.push('Target market not defined - affects all other forces')

    if (flame.monetization_approach) score += 20
    else warnings.push('Monetization approach unclear - needed for business viability')

    if (flame.growth_vector) score += 10
    else warnings.push('Growth vector not specified - limits scaling potential')

    return { errors, warnings, score }
  }

  private validateFormForce(form: any): { errors: string[]; warnings: string[]; score: number; suggestions?: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    let score = 0

    if (form.aesthetic) score += 20
    else warnings.push('Aesthetic direction not defined')

    if (form.primary_colors && form.primary_colors.length > 0) {
      score += 30
      // Validate color format
      const invalidColors = form.primary_colors.filter((color: string) => !this.isValidHexColor(color))
      if (invalidColors.length > 0) {
        errors.push(`Invalid color format: ${invalidColors.join(', ')}`)
      }
    } else {
      warnings.push('Primary colors not defined - visual identity will be incomplete')
    }

    if (form.visual_style) score += 20
    else warnings.push('Visual style not specified')

    if (form.brand_personality) score += 15
    else warnings.push('Brand personality not defined')

    if (form.architecture) score += 15
    else warnings.push('Architecture approach not specified')

    return { errors, warnings, score }
  }

  private validateLoreForce(lore: any): { errors: string[]; warnings: string[]; score: number; suggestions?: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    let score = 0

    if (lore.origin_myth) score += 25
    else warnings.push('Origin myth not defined - helps establish realm identity')

    if (lore.hero_journey) score += 20
    else warnings.push('Hero journey not specified - important for user experience')

    if (lore.community_values && lore.community_values.length > 0) score += 25
    else warnings.push('Community values not defined - essential for community building')

    if (lore.narrative_themes && lore.narrative_themes.length > 0) score += 15
    else warnings.push('Narrative themes not specified')

    if (lore.core_conflicts && lore.core_conflicts.length > 0) score += 15
    else warnings.push('Core conflicts not defined - helps drive engagement')

    return { errors, warnings, score }
  }

  private validateResonanceForce(resonance: any): { errors: string[]; warnings: string[]; score: number; suggestions?: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    let score = 0

    if (resonance.soundscape) score += 25
    else warnings.push('Soundscape not defined - audio identity missing')

    if (resonance.voice_style) score += 20
    else warnings.push('Voice style not specified')

    if (resonance.music_genres && resonance.music_genres.length > 0) score += 20
    else warnings.push('Music genres not defined')

    if (resonance.emotional_tones && resonance.emotional_tones.length > 0) score += 20
    else warnings.push('Emotional tones not specified')

    if (resonance.audio_branding) score += 15
    else warnings.push('Audio branding strategy not defined')

    return { errors, warnings, score }
  }

  private validateSynthesisForce(synthesis: any): { errors: string[]; warnings: string[]; score: number; suggestions?: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    let score = 0

    if (synthesis.tech_stack && synthesis.tech_stack.length > 0) {
      score += 30
      // Validate technology choices
      const validTechs = this.validateTechnologyChoices(synthesis.tech_stack)
      if (validTechs.warnings.length > 0) {
        warnings.push(...validTechs.warnings)
      }
    } else {
      warnings.push('Technology stack not defined - essential for technical planning')
    }

    if (synthesis.performance_requirements) score += 20
    else warnings.push('Performance requirements not specified')

    if (synthesis.security_approach) score += 25
    else warnings.push('Security approach not defined - critical for production deployment')

    if (synthesis.scalability_plan) score += 15
    else warnings.push('Scalability plan not specified')

    if (synthesis.integrations && synthesis.integrations.length > 0) score += 10
    else warnings.push('No integrations specified - may limit functionality')

    return { errors, warnings, score }
  }

  private validateManifestationForce(manifestation: any): { errors: string[]; warnings: string[]; score: number; suggestions?: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    let score = 0

    // Validate digital presence
    const digitalPresence = manifestation.digital
    if (digitalPresence.web_platform || digitalPresence.mobile_app || digitalPresence.desktop_client) {
      score += 20
    } else {
      warnings.push('No digital platforms specified - realm will have limited reach')
    }

    // Validate business configuration
    if (manifestation.business && manifestation.business.launch_strategy) score += 25
    else warnings.push('Launch strategy not defined')

    if (manifestation.business && manifestation.business.revenue_streams && manifestation.business.revenue_streams.length > 0) {
      score += 20
    } else {
      warnings.push('Revenue streams not specified - business viability unclear')
    }

    if (manifestation.timeline) score += 15
    else warnings.push('Manifestation timeline not specified')

    if (manifestation.success_metrics && manifestation.success_metrics.length > 0) score += 20
    else warnings.push('Success metrics not defined - difficult to measure progress')

    return { errors, warnings, score }
  }

  // Cross-force validation
  private validateCrossForceAlignment(realm: RealmDefinition): { warnings: string[] } {
    const warnings: string[] = []

    // Check alignment between flame and manifestation
    if (realm.forces.flame.business_model && realm.forces.manifestation.business.revenue_streams.length === 0) {
      warnings.push('Business model defined in flame but no revenue streams in manifestation')
    }

    // Check alignment between form and lore
    if (realm.forces.form.brand_personality && realm.forces.lore.community_values.length === 0) {
      warnings.push('Brand personality defined but community values missing - may cause inconsistency')
    }

    // Check technical feasibility
    if (realm.forces.manifestation.digital.ar_vr_experiences && 
        !realm.forces.synthesis.tech_stack.some(tech => tech.toLowerCase().includes('three') || tech.toLowerCase().includes('unity'))) {
      warnings.push('AR/VR experiences planned but no 3D technologies in tech stack')
    }

    return { warnings }
  }

  // Helper validation methods
  private validateTechnologyChoices(techStack: string[]): { warnings: string[] } {
    const warnings: string[] = []
    
    const hasDatabase = techStack.some(tech => 
      ['postgresql', 'mongodb', 'mysql', 'sqlite', 'redis'].some(db => 
        tech.toLowerCase().includes(db)
      )
    )
    if (!hasDatabase) {
      warnings.push('No database technology specified in tech stack')
    }

    const hasFramework = techStack.some(tech =>
      ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt'].some(fw =>
        tech.toLowerCase().includes(fw)
      )
    )
    if (!hasFramework) {
      warnings.push('No frontend framework specified in tech stack')
    }

    return { warnings }
  }

  private isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
  }

  private calculateOverallScore(completeness: Record<GuardianType, number>, errorCount: number, warningCount: number): number {
    const averageCompleteness = Object.values(completeness).reduce((sum, score) => sum + score, 0) / 6
    const errorPenalty = errorCount * 10
    const warningPenalty = warningCount * 2
    
    return Math.max(0, Math.min(100, averageCompleteness - errorPenalty - warningPenalty))
  }

  /**
   * Suggest improvements for a realm definition
   */
  suggestImprovements(realm: RealmDefinition): Array<{
    force: GuardianType
    priority: 'low' | 'medium' | 'high'
    suggestion: string
    benefit: string
  }> {
    const suggestions = []

    // Analyze each force for improvement opportunities
    if (!realm.forces.flame.strategy) {
      suggestions.push({
        force: 'flame' as GuardianType,
        priority: 'high' as const,
        suggestion: 'Define a clear strategic approach',
        benefit: 'Provides direction for all other forces and improves manifestation success'
      })
    }

    if (realm.forces.form.primary_colors.length < 2) {
      suggestions.push({
        force: 'form' as GuardianType,
        priority: 'medium' as const,
        suggestion: 'Expand color palette to at least 2-3 colors',
        benefit: 'Creates more sophisticated and flexible visual identity'
      })
    }

    if (realm.forces.lore.community_values.length === 0) {
      suggestions.push({
        force: 'lore' as GuardianType,
        priority: 'high' as const,
        suggestion: 'Define community values to guide culture',
        benefit: 'Establishes foundation for sustainable community growth'
      })
    }

    if (!realm.forces.resonance.soundscape) {
      suggestions.push({
        force: 'resonance' as GuardianType,
        priority: 'medium' as const,
        suggestion: 'Create audio identity and soundscape',
        benefit: 'Enhances emotional connection and brand memorability'
      })
    }

    if (realm.forces.synthesis.tech_stack.length === 0) {
      suggestions.push({
        force: 'synthesis' as GuardianType,
        priority: 'high' as const,
        suggestion: 'Specify technology stack for implementation',
        benefit: 'Enables accurate development planning and resource estimation'
      })
    }

    if (realm.forces.manifestation.business.revenue_streams.length === 0) {
      suggestions.push({
        force: 'manifestation' as GuardianType,
        priority: 'high' as const,
        suggestion: 'Define revenue streams and business model',
        benefit: 'Ensures business viability and sustainable growth'
      })
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  /**
   * Check if realm is ready for manifestation
   */
  isManifestationReady(realm: RealmDefinition): {
    ready: boolean
    blockers: string[]
    recommendations: string[]
  } {
    const validation = this.validate(realm)
    const suggestions = this.suggestImprovements(realm)
    
    const blockers = validation.errors
    const highPrioritySuggestions = suggestions
      .filter(s => s.priority === 'high')
      .map(s => s.suggestion)

    return {
      ready: validation.isValid && validation.score >= 70,
      blockers,
      recommendations: highPrioritySuggestions
    }
  }

  /**
   * Generate quality report for a realm
   */
  generateQualityReport(realm: RealmDefinition): {
    overallScore: number
    forceScores: Record<GuardianType, number>
    strengths: string[]
    improvements: string[]
    readinessAssessment: string
  } {
    const validation = this.validate(realm)
    const suggestions = this.suggestImprovements(realm)
    const readiness = this.isManifestationReady(realm)

    const strengths = []
    const improvements = []

    // Identify strengths
    Object.entries(validation.completeness).forEach(([force, score]) => {
      if (score >= 80) {
        strengths.push(`${force.charAt(0).toUpperCase() + force.slice(1)} force is well-defined`)
      } else if (score < 50) {
        improvements.push(`${force.charAt(0).toUpperCase() + force.slice(1)} force needs significant development`)
      }
    })

    // Add specific improvements
    suggestions.slice(0, 3).forEach(suggestion => {
      improvements.push(suggestion.suggestion)
    })

    const readinessAssessment = readiness.ready 
      ? 'Realm is ready for manifestation'
      : `Realm needs improvement in: ${readiness.blockers.concat(readiness.recommendations).join(', ')}`

    return {
      overallScore: validation.score,
      forceScores: validation.completeness,
      strengths,
      improvements,
      readinessAssessment
    }
  }
}

export default RealmValidator