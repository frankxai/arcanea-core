import { RealmDefinition } from '../types'

/**
 * RDL Parser - Realm Definition Language Parser
 * 
 * Parses the RDL syntax into structured realm definitions.
 * RDL is a YAML-like language optimized for defining multiverses.
 */
export class RDLParser {
  
  /**
   * Parse RDL string into a RealmDefinition object
   */
  parse(rdl: string): RealmDefinition {
    try {
      const lines = rdl.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      const realm: Partial<RealmDefinition> = {
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
      }

      let currentSection = ''
      let currentForce = ''

      for (const line of lines) {
        if (line.startsWith('#')) continue // Skip comments

        if (line.endsWith(':') && !line.includes('  ')) {
          // Top-level section
          currentSection = line.slice(0, -1).toLowerCase()
          currentForce = ''
          continue
        }

        if (line.startsWith('  ') && line.endsWith(':')) {
          // Force section
          currentForce = line.trim().slice(0, -1).toLowerCase()
          continue
        }

        // Parse key-value pairs
        const match = line.match(/^(\s*)([^:]+):\s*(.*)$/)
        if (match) {
          const [, indent, key, value] = match
          const cleanKey = key.trim()
          const cleanValue = value.trim()

          if (currentSection === 'realm') {
            this.parseRealmProperty(realm, cleanKey, cleanValue)
          } else if (currentSection === 'forces' && currentForce) {
            this.parseForceProperty(realm, currentForce, cleanKey, cleanValue)
          }
        }
      }

      return this.validateAndFillDefaults(realm as RealmDefinition)

    } catch (error) {
      throw new Error(`RDL parsing failed: ${error}`)
    }
  }

  private parseRealmProperty(realm: Partial<RealmDefinition>, key: string, value: string): void {
    switch (key) {
      case 'name':
        realm.name = value
        break
      case 'vision':
        realm.vision = value
        break
      case 'template':
        realm.template = value
        break
      case 'target_audience':
        realm.target_audience = value
        break
      case 'timeline':
        if (['rapid', 'standard', 'comprehensive'].includes(value)) {
          realm.timeline = value as 'rapid' | 'standard' | 'comprehensive'
        }
        break
    }
  }

  private parseForceProperty(realm: Partial<RealmDefinition>, force: string, key: string, value: string): void {
    const forces = realm.forces!

    switch (force) {
      case 'flame':
        this.parseFlameProperty(forces.flame, key, value)
        break
      case 'form':
        this.parseFormProperty(forces.form, key, value)
        break
      case 'lore':
        this.parseLoreProperty(forces.lore, key, value)
        break
      case 'resonance':
        this.parseResonanceProperty(forces.resonance, key, value)
        break
      case 'synthesis':
        this.parseSynthesisProperty(forces.synthesis, key, value)
        break
      case 'manifestation':
        this.parseManifestationProperty(forces.manifestation, key, value)
        break
    }
  }

  private parseFlameProperty(flame: any, key: string, value: string): void {
    switch (key) {
      case 'strategy':
        flame.strategy = value
        break
      case 'business_model':
        flame.business_model = value
        break
      case 'growth_vector':
        flame.growth_vector = value
        break
      case 'target_market':
        flame.target_market = value
        break
      case 'monetization_approach':
        flame.monetization_approach = value
        break
    }
  }

  private parseFormProperty(form: any, key: string, value: string): void {
    switch (key) {
      case 'aesthetic':
        form.aesthetic = value
        break
      case 'primary_colors':
        form.primary_colors = this.parseArray(value)
        break
      case 'architecture':
        form.architecture = value
        break
      case 'brand_personality':
        form.brand_personality = value
        break
      case 'visual_style':
        form.visual_style = value
        break
    }
  }

  private parseLoreProperty(lore: any, key: string, value: string): void {
    switch (key) {
      case 'origin_myth':
        lore.origin_myth = value
        break
      case 'core_conflicts':
        lore.core_conflicts = this.parseArray(value)
        break
      case 'hero_journey':
        lore.hero_journey = value
        break
      case 'community_values':
        lore.community_values = this.parseArray(value)
        break
      case 'narrative_themes':
        lore.narrative_themes = this.parseArray(value)
        break
    }
  }

  private parseResonanceProperty(resonance: any, key: string, value: string): void {
    switch (key) {
      case 'soundscape':
        resonance.soundscape = value
        break
      case 'voice_style':
        resonance.voice_style = value
        break
      case 'music_genres':
        resonance.music_genres = this.parseArray(value)
        break
      case 'emotional_tones':
        resonance.emotional_tones = this.parseArray(value)
        break
      case 'audio_branding':
        resonance.audio_branding = value
        break
    }
  }

  private parseSynthesisProperty(synthesis: any, key: string, value: string): void {
    switch (key) {
      case 'tech_stack':
        synthesis.tech_stack = this.parseArray(value)
        break
      case 'integrations':
        synthesis.integrations = this.parseArray(value)
        break
      case 'performance_requirements':
        synthesis.performance_requirements = value
        break
      case 'scalability_plan':
        synthesis.scalability_plan = value
        break
      case 'security_approach':
        synthesis.security_approach = value
        break
    }
  }

  private parseManifestationProperty(manifestation: any, key: string, value: string): void {
    switch (key) {
      case 'timeline':
        manifestation.timeline = value
        break
      case 'success_metrics':
        manifestation.success_metrics = this.parseArray(value)
        break
      // Handle nested properties for digital, physical, business
      case 'web_platform':
        manifestation.digital.web_platform = this.parseBoolean(value)
        break
      case 'mobile_app':
        manifestation.digital.mobile_app = this.parseBoolean(value)
        break
      case 'merchandise':
        manifestation.physical.merchandise = value
        break
      case 'events':
        manifestation.physical.events = value
        break
      case 'launch_strategy':
        manifestation.business.launch_strategy = value
        break
    }
  }

  private parseArray(value: string): string[] {
    if (value.startsWith('[') && value.endsWith(']')) {
      // Parse JSON-style array
      try {
        return JSON.parse(value)
      } catch {
        return value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''))
      }
    } else {
      // Parse comma-separated values
      return value.split(',').map(s => s.trim()).filter(s => s.length > 0)
    }
  }

  private parseBoolean(value: string): boolean {
    return ['true', 'yes', '1', 'on'].includes(value.toLowerCase())
  }

  private validateAndFillDefaults(realm: RealmDefinition): RealmDefinition {
    // Ensure all required fields have defaults
    if (!realm.timeline) realm.timeline = 'standard'
    if (!realm.vision) throw new Error('Vision is required in RDL')
    if (!realm.name) throw new Error('Name is required in RDL')
    if (!realm.target_audience) realm.target_audience = 'general'

    return realm
  }

  /**
   * Parse RDL with syntax validation and error reporting
   */
  parseWithValidation(rdl: string): {
    success: boolean
    realm?: RealmDefinition
    errors: string[]
    warnings: string[]
  } {
    try {
      const realm = this.parse(rdl)
      const validation = this.validateSyntax(rdl)
      
      return {
        success: validation.errors.length === 0,
        realm: validation.errors.length === 0 ? realm : undefined,
        errors: validation.errors,
        warnings: validation.warnings
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      }
    }
  }

  private validateSyntax(rdl: string): { errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    const lines = rdl.split('\n')

    let hasRealmSection = false
    let hasForcesSection = false
    let currentSection = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lineNumber = i + 1

      if (line.length === 0 || line.startsWith('#')) continue

      // Check section headers
      if (line === 'realm:') {
        hasRealmSection = true
        currentSection = 'realm'
      } else if (line === 'forces:') {
        hasForcesSection = true
        currentSection = 'forces'
      }

      // Validate indentation
      if (line.startsWith('  ') && !line.startsWith('    ')) {
        // Two-space indentation (force or property)
        if (currentSection !== 'forces' && currentSection !== 'realm') {
          errors.push(`Line ${lineNumber}: Unexpected indentation outside of realm or forces section`)
        }
      } else if (line.startsWith('    ')) {
        // Four-space indentation (nested property)
        if (currentSection !== 'forces') {
          warnings.push(`Line ${lineNumber}: Deep nesting detected, ensure proper structure`)
        }
      }

      // Validate key-value format
      if (line.includes(':') && !line.endsWith(':')) {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        
        if (!value) {
          errors.push(`Line ${lineNumber}: Empty value for key '${key.trim()}'`)
        }
      }
    }

    if (!hasRealmSection) {
      errors.push('Missing required "realm:" section')
    }

    if (!hasForcesSection) {
      warnings.push('No "forces:" section found - realm will use defaults')
    }

    return { errors, warnings }
  }
}

export default RDLParser