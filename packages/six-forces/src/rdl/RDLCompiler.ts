import { RealmDefinition } from '../types'
import { RDLParser } from './RDLParser'

/**
 * RDL Compiler - Realm Definition Language Compiler
 * 
 * Compiles RDL into executable realm definitions and decompiles
 * realm definitions back into readable RDL format.
 */
export class RDLCompiler {
  private parser: RDLParser

  constructor() {
    this.parser = new RDLParser()
  }

  /**
   * Compile RDL string into a RealmDefinition
   */
  compile(rdl: string): RealmDefinition {
    try {
      const parseResult = this.parser.parseWithValidation(rdl)
      
      if (!parseResult.success) {
        throw new Error(`RDL compilation failed:\n${parseResult.errors.join('\n')}`)
      }

      return parseResult.realm!
    } catch (error) {
      throw new Error(`RDL compilation error: ${error}`)
    }
  }

  /**
   * Decompile a RealmDefinition back into RDL format
   */
  decompile(realm: RealmDefinition): string {
    try {
      const rdl: string[] = []

      // Header comment
      rdl.push('# Realm Definition Language (RDL)')
      rdl.push(`# Generated on ${new Date().toISOString()}`)
      rdl.push('')

      // Realm section
      rdl.push('realm:')
      rdl.push(`  name: "${realm.name}"`)
      rdl.push(`  vision: "${realm.vision}"`)
      
      if (realm.template) {
        rdl.push(`  template: "${realm.template}"`)
      }
      
      rdl.push(`  target_audience: "${realm.target_audience}"`)
      rdl.push(`  timeline: ${realm.timeline}`)
      rdl.push('')

      // Forces section
      rdl.push('forces:')
      rdl.push('')

      // Flame force
      rdl.push('  flame:')
      if (realm.forces.flame.strategy) rdl.push(`    strategy: "${realm.forces.flame.strategy}"`)
      if (realm.forces.flame.business_model) rdl.push(`    business_model: "${realm.forces.flame.business_model}"`)
      if (realm.forces.flame.growth_vector) rdl.push(`    growth_vector: "${realm.forces.flame.growth_vector}"`)
      if (realm.forces.flame.target_market) rdl.push(`    target_market: "${realm.forces.flame.target_market}"`)
      if (realm.forces.flame.monetization_approach) rdl.push(`    monetization_approach: "${realm.forces.flame.monetization_approach}"`)
      rdl.push('')

      // Form force
      rdl.push('  form:')
      if (realm.forces.form.aesthetic) rdl.push(`    aesthetic: "${realm.forces.form.aesthetic}"`)
      if (realm.forces.form.primary_colors.length > 0) {
        rdl.push(`    primary_colors: [${realm.forces.form.primary_colors.map(c => `"${c}"`).join(', ')}]`)
      }
      if (realm.forces.form.architecture) rdl.push(`    architecture: "${realm.forces.form.architecture}"`)
      if (realm.forces.form.brand_personality) rdl.push(`    brand_personality: "${realm.forces.form.brand_personality}"`)
      if (realm.forces.form.visual_style) rdl.push(`    visual_style: "${realm.forces.form.visual_style}"`)
      rdl.push('')

      // Lore force
      rdl.push('  lore:')
      if (realm.forces.lore.origin_myth) rdl.push(`    origin_myth: "${realm.forces.lore.origin_myth}"`)
      if (realm.forces.lore.core_conflicts.length > 0) {
        rdl.push(`    core_conflicts: [${realm.forces.lore.core_conflicts.map(c => `"${c}"`).join(', ')}]`)
      }
      if (realm.forces.lore.hero_journey) rdl.push(`    hero_journey: "${realm.forces.lore.hero_journey}"`)
      if (realm.forces.lore.community_values.length > 0) {
        rdl.push(`    community_values: [${realm.forces.lore.community_values.map(v => `"${v}"`).join(', ')}]`)
      }
      if (realm.forces.lore.narrative_themes.length > 0) {
        rdl.push(`    narrative_themes: [${realm.forces.lore.narrative_themes.map(t => `"${t}"`).join(', ')}]`)
      }
      rdl.push('')

      // Resonance force
      rdl.push('  resonance:')
      if (realm.forces.resonance.soundscape) rdl.push(`    soundscape: "${realm.forces.resonance.soundscape}"`)
      if (realm.forces.resonance.voice_style) rdl.push(`    voice_style: "${realm.forces.resonance.voice_style}"`)
      if (realm.forces.resonance.music_genres.length > 0) {
        rdl.push(`    music_genres: [${realm.forces.resonance.music_genres.map(g => `"${g}"`).join(', ')}]`)
      }
      if (realm.forces.resonance.emotional_tones.length > 0) {
        rdl.push(`    emotional_tones: [${realm.forces.resonance.emotional_tones.map(t => `"${t}"`).join(', ')}]`)
      }
      if (realm.forces.resonance.audio_branding) rdl.push(`    audio_branding: "${realm.forces.resonance.audio_branding}"`)
      rdl.push('')

      // Synthesis force
      rdl.push('  synthesis:')
      if (realm.forces.synthesis.tech_stack.length > 0) {
        rdl.push(`    tech_stack: [${realm.forces.synthesis.tech_stack.map(t => `"${t}"`).join(', ')}]`)
      }
      if (realm.forces.synthesis.integrations.length > 0) {
        rdl.push(`    integrations: [${realm.forces.synthesis.integrations.map(i => `"${i}"`).join(', ')}]`)
      }
      if (realm.forces.synthesis.performance_requirements) rdl.push(`    performance_requirements: "${realm.forces.synthesis.performance_requirements}"`)
      if (realm.forces.synthesis.scalability_plan) rdl.push(`    scalability_plan: "${realm.forces.synthesis.scalability_plan}"`)
      if (realm.forces.synthesis.security_approach) rdl.push(`    security_approach: "${realm.forces.synthesis.security_approach}"`)
      rdl.push('')

      // Manifestation force
      rdl.push('  manifestation:')
      rdl.push('    digital:')
      rdl.push(`      web_platform: ${realm.forces.manifestation.digital.web_platform}`)
      rdl.push(`      mobile_app: ${realm.forces.manifestation.digital.mobile_app}`)
      rdl.push(`      desktop_client: ${realm.forces.manifestation.digital.desktop_client}`)
      if (realm.forces.manifestation.digital.social_presence.length > 0) {
        rdl.push(`      social_presence: [${realm.forces.manifestation.digital.social_presence.map(s => `"${s}"`).join(', ')}]`)
      }
      if (realm.forces.manifestation.digital.content_channels.length > 0) {
        rdl.push(`      content_channels: [${realm.forces.manifestation.digital.content_channels.map(c => `"${c}"`).join(', ')}]`)
      }
      
      rdl.push('    physical:')
      if (realm.forces.manifestation.physical.merchandise) rdl.push(`      merchandise: "${realm.forces.manifestation.physical.merchandise}"`)
      if (realm.forces.manifestation.physical.events) rdl.push(`      events: "${realm.forces.manifestation.physical.events}"`)
      if (realm.forces.manifestation.physical.locations) rdl.push(`      locations: "${realm.forces.manifestation.physical.locations}"`)
      if (realm.forces.manifestation.physical.partnerships.length > 0) {
        rdl.push(`      partnerships: [${realm.forces.manifestation.physical.partnerships.map(p => `"${p}"`).join(', ')}]`)
      }
      
      rdl.push('    business:')
      if (realm.forces.manifestation.business.launch_strategy) rdl.push(`      launch_strategy: "${realm.forces.manifestation.business.launch_strategy}"`)
      if (realm.forces.manifestation.business.revenue_streams.length > 0) {
        rdl.push(`      revenue_streams: [${realm.forces.manifestation.business.revenue_streams.map(r => `"${r}"`).join(', ')}]`)
      }
      if (realm.forces.manifestation.business.timeline) rdl.push(`      timeline: "${realm.forces.manifestation.business.timeline}"`)

      return rdl.join('\n')

    } catch (error) {
      throw new Error(`RDL decompilation error: ${error}`)
    }
  }

  /**
   * Compile with optimization suggestions
   */
  compileWithOptimization(rdl: string): {
    realm: RealmDefinition
    optimizations: Array<{
      type: 'performance' | 'clarity' | 'best-practice' | 'completeness'
      message: string
      suggestion: string
    }>
  } {
    const realm = this.compile(rdl)
    const optimizations = this.generateOptimizations(realm)
    
    return { realm, optimizations }
  }

  /**
   * Generate RDL template for a specific use case
   */
  generateTemplate(templateType: string): string {
    const templates = {
      minimal: this.generateMinimalTemplate(),
      business: this.generateBusinessTemplate(),
      creative: this.generateCreativeTemplate(),
      educational: this.generateEducationalTemplate(),
      enterprise: this.generateEnterpriseTemplate()
    }

    return templates[templateType as keyof typeof templates] || templates.minimal
  }

  private generateOptimizations(realm: RealmDefinition): Array<{
    type: 'performance' | 'clarity' | 'best-practice' | 'completeness'
    message: string
    suggestion: string
  }> {
    const optimizations = []

    // Check for completeness
    if (!realm.forces.flame.strategy) {
      optimizations.push({
        type: 'completeness' as const,
        message: 'Missing strategic foundation',
        suggestion: 'Add a strategy statement to the flame force for stronger business direction'
      })
    }

    if (realm.forces.form.primary_colors.length === 0) {
      optimizations.push({
        type: 'completeness' as const,
        message: 'No color palette defined',
        suggestion: 'Define primary colors in the form force for consistent visual identity'
      })
    }

    // Check for best practices
    if (realm.forces.synthesis.tech_stack.length === 0) {
      optimizations.push({
        type: 'best-practice' as const,
        message: 'No technology stack specified',
        suggestion: 'Define your tech stack in synthesis force for proper technical planning'
      })
    }

    return optimizations
  }

  private generateMinimalTemplate(): string {
    return `# Minimal Realm Template
realm:
  name: "My New Realm"
  vision: "A transformative space that..."
  target_audience: "creative professionals"
  timeline: standard

forces:
  flame:
    strategy: "Core strategic approach"
    business_model: "Platform/Service model"
  
  form:
    aesthetic: "Modern and clean"
    primary_colors: ["#2563eb", "#64748b"]
  
  manifestation:
    digital:
      web_platform: true
      mobile_app: false`
  }

  private generateBusinessTemplate(): string {
    return `# Business Realm Template
realm:
  name: "Enterprise Solution"
  vision: "Revolutionizing business operations through..."
  target_audience: "enterprise leaders"
  timeline: comprehensive

forces:
  flame:
    strategy: "B2B SaaS growth strategy"
    business_model: "Enterprise subscription model"
    growth_vector: "Enterprise sales and partnerships"
    target_market: "Fortune 500 companies"
    monetization_approach: "Tiered subscription with enterprise features"
  
  form:
    aesthetic: "Professional and trustworthy"
    primary_colors: ["#1e293b", "#3b82f6"]
    brand_personality: "Authoritative yet approachable"
    visual_style: "Clean enterprise design"
  
  synthesis:
    tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "AWS"]
    security_approach: "Enterprise-grade security with SOC 2 compliance"
    performance_requirements: "Sub-2s load times, 99.9% uptime"
  
  manifestation:
    digital:
      web_platform: true
      desktop_client: true
    business:
      launch_strategy: "Enterprise sales with pilot programs"
      revenue_streams: ["Subscription fees", "Professional services", "Enterprise support"]`
  }

  private generateCreativeTemplate(): string {
    return `# Creative Realm Template
realm:
  name: "Creative Platform"
  vision: "Empowering artists to manifest their creative visions..."
  target_audience: "creative professionals"
  timeline: standard

forces:
  form:
    aesthetic: "Artistic and inspiring"
    primary_colors: ["#dc2626", "#f59e0b", "#8b5cf6"]
    visual_style: "Bold and expressive"
  
  lore:
    origin_myth: "Born from the belief that every creative vision deserves to flourish"
    community_values: ["Creative freedom", "Artistic integrity", "Collaborative growth"]
    narrative_themes: ["Creativity", "Expression", "Community"]
  
  resonance:
    soundscape: "Inspiring creative ambience"
    music_genres: ["Ambient", "Lo-fi", "Instrumental"]
    emotional_tones: ["Inspiring", "Focused", "Uplifting"]
  
  manifestation:
    digital:
      web_platform: true
      mobile_app: true
    physical:
      events: "Creative workshops and art showcases"
      merchandise: "Artist-designed creative tools and apparel"`
  }

  private generateEducationalTemplate(): string {
    return `# Educational Realm Template  
realm:
  name: "Learning Academy"
  vision: "Transforming education through immersive learning experiences..."
  target_audience: "students and educators"
  timeline: comprehensive

forces:
  flame:
    strategy: "Educational impact through technology"
    business_model: "Freemium with institutional licensing"
    target_market: "Educational institutions and learners"
  
  lore:
    hero_journey: "From curious student to empowered creator"
    community_values: ["Lifelong learning", "Knowledge sharing", "Inclusive education"]
    narrative_themes: ["Discovery", "Growth", "Empowerment"]
  
  manifestation:
    digital:
      web_platform: true
      mobile_app: true
    physical:
      events: "Educational workshops and conferences"
      partnerships: ["Universities", "Schools", "Educational nonprofits"]`
  }

  private generateEnterpriseTemplate(): string {
    return `# Enterprise Realm Template
realm:
  name: "Enterprise Transformation Platform"
  vision: "Enabling large organizations to manifest innovation at scale..."
  target_audience: "enterprise organizations"
  timeline: comprehensive

forces:
  flame:
    strategy: "Enterprise digital transformation"
    business_model: "Enterprise platform with professional services"
    monetization_approach: "Annual licenses with implementation services"
  
  synthesis:
    tech_stack: ["Kubernetes", "PostgreSQL", "Redis", "Enterprise APIs"]
    security_approach: "Zero-trust security with enterprise compliance"
    scalability_plan: "Multi-tenant architecture with dedicated instances"
    integrations: ["Salesforce", "SAP", "Microsoft 365", "Slack"]
  
  manifestation:
    digital:
      web_platform: true
      desktop_client: true
    business:
      launch_strategy: "Direct enterprise sales with proof of concepts"
      revenue_streams: ["Platform licenses", "Implementation services", "Training programs", "Premium support"]`
  }

  /**
   * Validate RDL syntax without full compilation
   */
  validateSyntax(rdl: string): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    suggestions: string[]
  } {
    try {
      const parseResult = this.parser.parseWithValidation(rdl)
      const suggestions = this.generateSyntaxSuggestions(rdl, parseResult)

      return {
        isValid: parseResult.success,
        errors: parseResult.errors,
        warnings: parseResult.warnings,
        suggestions
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: [],
        suggestions: []
      }
    }
  }

  /**
   * Auto-format RDL with proper indentation and structure
   */
  format(rdl: string): string {
    try {
      const realm = this.compile(rdl)
      return this.decompile(realm)
    } catch (error) {
      throw new Error(`Cannot format invalid RDL: ${error}`)
    }
  }

  /**
   * Merge two RDL definitions
   */
  merge(baseRdl: string, overlayRdl: string): string {
    try {
      const baseRealm = this.compile(baseRdl)
      const overlayRealm = this.compile(overlayRdl)
      
      const mergedRealm = this.deepMerge(baseRealm, overlayRealm)
      return this.decompile(mergedRealm)
    } catch (error) {
      throw new Error(`RDL merge failed: ${error}`)
    }
  }

  private generateSyntaxSuggestions(rdl: string, parseResult: any): string[] {
    const suggestions = []

    if (!rdl.includes('realm:')) {
      suggestions.push('Add a "realm:" section to define basic realm properties')
    }

    if (!rdl.includes('forces:')) {
      suggestions.push('Add a "forces:" section to configure the Six Forces')
    }

    if (!rdl.includes('vision:')) {
      suggestions.push('Define a clear vision statement in the realm section')
    }

    const forceMentions = ['flame:', 'form:', 'lore:', 'resonance:', 'synthesis:', 'manifestation:']
    const mentionedForces = forceMentions.filter(force => rdl.includes(force))
    
    if (mentionedForces.length < 3) {
      suggestions.push('Consider configuring more of the Six Forces for a complete realm definition')
    }

    return suggestions
  }

  private deepMerge(base: any, overlay: any): any {
    const result = { ...base }
    
    for (const key in overlay) {
      if (overlay[key] && typeof overlay[key] === 'object' && !Array.isArray(overlay[key])) {
        result[key] = this.deepMerge(base[key] || {}, overlay[key])
      } else {
        result[key] = overlay[key]
      }
    }
    
    return result
  }
}

export default RDLCompiler