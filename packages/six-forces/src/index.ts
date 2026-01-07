/**
 * @arcanea/six-forces - The Six Forces Framework
 * 
 * The core engine for manifesting multiverses from imagination to reality.
 * Every realm is shaped by six primordial cosmic forces, each guided by
 * specialized AI Guardians that understand and amplify creative vision.
 */

// Core Framework
export { RealmBuilder } from './core/RealmBuilder'
export { MultiverseEngine } from './core/MultiverseEngine'
export { ForceOrchestrator } from './core/ForceOrchestrator'
export { ManifestationEngine } from './core/ManifestationEngine'

// AI Guardians - One for each Force
export { FlameGuardian } from './guardians/FlameGuardian'
export { FormGuardian } from './guardians/FormGuardian'  
export { LoreGuardian } from './guardians/LoreGuardian'
export { ResonanceGuardian } from './guardians/ResonanceGuardian'
export { SynthesisGuardian } from './guardians/SynthesisGuardian'
export { ManifestationGuardian } from './guardians/ManifestationGuardian'

// Realm Definition Language (RDL)
export { RDLParser } from './rdl/RDLParser'
export { RDLCompiler } from './rdl/RDLCompiler'
export { RealmValidator } from './rdl/RealmValidator'

// Templates & Generators
export { RealmTemplates } from './templates/RealmTemplates'
export { BusinessRealmGenerator } from './templates/BusinessRealmGenerator'
export { EducationRealmGenerator } from './templates/EducationRealmGenerator'
export { GamingRealmGenerator } from './templates/GamingRealmGenerator'
export { WellnessRealmGenerator } from './templates/WellnessRealmGenerator'

// Manifestation Engines
export { DigitalManifester } from './manifestation/DigitalManifester'
export { PhysicalManifester } from './manifestation/PhysicalManifester'
export { BusinessManifester } from './manifestation/BusinessManifester'

// Types and Interfaces
export * from './types'
export * from './interfaces'

// Configuration
export * from './config'

/**
 * The Six Forces of Reality Creation
 * 
 * Every multiverse is shaped by these fundamental forces:
 * 
 * 🔥 FLAME - Vision & Strategy
 * The spark that ignites new realities. Strategic thinking, market analysis,
 * business models, and the core vision that drives everything forward.
 * 
 * 🎨 FORM - Visual & Aesthetic  
 * The power to shape what can be seen. Visual design, 3D worlds, user
 * interfaces, brand identity, and aesthetic coherence across all touchpoints.
 * 
 * 📜 LORE - Story & Meaning
 * The weave of narratives that give worlds soul. Mythology, character arcs,
 * user journeys, cultural values, and the stories that bind communities.
 * 
 * 🎵 RESONANCE - Sound & Frequency
 * The vibrations that move hearts and minds. Audio design, music, voice,
 * emotional resonance, and the sonic identity that defines the realm.
 * 
 * ⚡ SYNTHESIS - Integration & Systems
 * The bridges that unite all forces. Technical architecture, APIs, 
 * databases, integrations, and the systems that make everything work.
 * 
 * 🚀 MANIFESTATION - Physical Reality
 * The alchemy that births dreams into the world. Deployment, marketing,
 * scaling, physical presence, and the strategies that bring realms to life.
 */

// Default Configuration for Quick Start
export const ARCANEA_CONFIG = {
  version: '1.0.0',
  name: 'ARCANEA Six Forces Engine',
  
  guardians: {
    flame: {
      models: ['claude-3-opus', 'gpt-4', 'gemini-pro'],
      specialization: 'strategic_thinking',
      focus: ['business_models', 'market_analysis', 'growth_strategies', 'vision_articulation']
    },
    form: {
      models: ['dall-e-3', 'midjourney', 'stable-diffusion', 'ideogram'],
      specialization: 'visual_creation',
      focus: ['brand_design', '3d_worlds', 'ui_ux', 'aesthetic_systems']
    },
    lore: {
      models: ['claude-3-sonnet', 'gpt-4-turbo', 'mixtral-8x7b'],
      specialization: 'narrative_architecture', 
      focus: ['mythology', 'character_arcs', 'world_building', 'cultural_design']
    },
    resonance: {
      models: ['musicgen', 'audiocraft', 'bark', 'elevenlabs'],
      specialization: 'audio_creation',
      focus: ['soundscapes', 'music_composition', 'voice_synthesis', 'audio_branding']
    },
    synthesis: {
      models: ['codex', 'deepseek-coder', 'starcoder', 'claude-3-haiku'],
      specialization: 'technical_integration',
      focus: ['architecture', 'apis', 'databases', 'performance']
    },
    manifestation: {
      models: ['business-gpt', 'marketing-ai', 'claude-3-opus'],
      specialization: 'reality_deployment',
      focus: ['marketing', 'sales', 'scaling', 'physical_presence']
    }
  },
  
  manifestation: {
    digital: {
      platforms: ['web', 'mobile', 'desktop', 'ar', 'vr'],
      deployment: ['vercel', 'aws', 'gcp', 'azure', 'railway']
    },
    physical: {
      channels: ['events', 'merchandise', 'locations', 'experiences'],
      partnerships: ['venues', 'manufacturers', 'distributors']
    },
    business: {
      models: ['subscription', 'marketplace', 'enterprise', 'freemium'],
      metrics: ['user_growth', 'revenue', 'retention', 'satisfaction']
    }
  },
  
  templates: {
    education: 'Learning academies and skill development platforms',
    business: 'Corporate training and business ecosystems', 
    gaming: 'Interactive worlds and gaming experiences',
    wellness: 'Therapeutic and mindfulness environments',
    startup: 'Entrepreneur communities and incubators',
    creative: 'Artist collectives and creative platforms',
    social: 'Community spaces and social networks',
    enterprise: 'Large-scale business solutions'
  }
}

// Quick Start Function
export const createRealm = async (vision: string, options: {
  template?: keyof typeof ARCANEA_CONFIG.templates
  forces?: ('flame' | 'form' | 'lore' | 'resonance' | 'synthesis' | 'manifestation')[]
  target?: 'digital' | 'physical' | 'hybrid'
  timeline?: 'rapid' | 'standard' | 'comprehensive'
} = {}) => {
  const engine = new MultiverseEngine(ARCANEA_CONFIG)
  
  return await engine.manifestRealm({
    vision,
    template: options.template || 'business',
    forces: options.forces || ['flame', 'form', 'lore', 'resonance', 'synthesis', 'manifestation'],
    target: options.target || 'hybrid',
    timeline: options.timeline || 'standard'
  })
}

// Export everything for advanced users
export * from './guardians'
export * from './core'
export * from './rdl'
export * from './templates'
export * from './manifestation'