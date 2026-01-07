/**
 * Configuration types and defaults for the Six Forces Framework
 */

import { GuardianConfig } from './types'

export interface SixForcesConfig {
  version: string
  name: string
  guardians: Record<string, GuardianConfig>
  manifestation: ManifestationConfig
  templates: Record<string, string>
  api?: APIConfig
  monitoring?: MonitoringConfig
}

export interface ManifestationConfig {
  digital: {
    platforms: string[]
    deployment: string[]
  }
  physical: {
    channels: string[]
    partnerships: string[]
  }
  business: {
    models: string[]
    metrics: string[]
  }
}

export interface APIConfig {
  rateLimit: {
    requestsPerMinute: number
    requestsPerHour: number
  }
  authentication: {
    required: boolean
    methods: string[]
  }
  versioning: {
    strategy: 'header' | 'path' | 'query'
    currentVersion: string
  }
}

export interface MonitoringConfig {
  metrics: {
    enabled: boolean
    provider: string
    retention: string
  }
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    outputs: string[]
  }
  alerts: {
    enabled: boolean
    channels: string[]
  }
}

// Default configuration
export const DEFAULT_CONFIG: SixForcesConfig = {
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

// Configuration utilities
export class ConfigManager {
  private config: SixForcesConfig

  constructor(config: SixForcesConfig = DEFAULT_CONFIG) {
    this.config = config
  }

  getGuardianConfig(guardianType: string): GuardianConfig {
    const guardianConfig = this.config.guardians[guardianType]
    if (!guardianConfig) {
      throw new Error(`Guardian configuration not found for: ${guardianType}`)
    }
    return guardianConfig
  }

  getManifestationConfig(): ManifestationConfig {
    return this.config.manifestation
  }

  updateGuardianConfig(guardianType: string, updates: Partial<GuardianConfig>): void {
    this.config.guardians[guardianType] = {
      ...this.config.guardians[guardianType],
      ...updates
    }
  }

  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate required fields
    if (!this.config.version) errors.push('Version is required')
    if (!this.config.name) errors.push('Name is required')

    // Validate guardians
    const requiredGuardians = ['flame', 'form', 'lore', 'resonance', 'synthesis', 'manifestation']
    requiredGuardians.forEach(guardian => {
      if (!this.config.guardians[guardian]) {
        errors.push(`Guardian configuration missing for: ${guardian}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  static fromJSON(json: string): ConfigManager {
    try {
      const config = JSON.parse(json)
      return new ConfigManager(config)
    } catch (error) {
      throw new Error(`Failed to parse configuration JSON: ${error}`)
    }
  }
}

// Environment-specific configurations
export const DEVELOPMENT_CONFIG: Partial<SixForcesConfig> = {
  api: {
    rateLimit: {
      requestsPerMinute: 1000,
      requestsPerHour: 10000
    },
    authentication: {
      required: false,
      methods: ['development-key']
    },
    versioning: {
      strategy: 'header',
      currentVersion: 'dev-1.0.0'
    }
  },
  monitoring: {
    metrics: {
      enabled: true,
      provider: 'development',
      retention: '7 days'
    },
    logging: {
      level: 'debug',
      outputs: ['console', 'file']
    },
    alerts: {
      enabled: false,
      channels: []
    }
  }
}

export const PRODUCTION_CONFIG: Partial<SixForcesConfig> = {
  api: {
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerHour: 1000
    },
    authentication: {
      required: true,
      methods: ['jwt', 'api-key']
    },
    versioning: {
      strategy: 'header',
      currentVersion: '1.0.0'
    }
  },
  monitoring: {
    metrics: {
      enabled: true,
      provider: 'datadog',
      retention: '30 days'
    },
    logging: {
      level: 'info',
      outputs: ['structured-logs', 'sentry']
    },
    alerts: {
      enabled: true,
      channels: ['slack', 'email', 'pagerduty']
    }
  }
}

// Utility functions
export function createConfig(environment: 'development' | 'production' | 'test' = 'development'): SixForcesConfig {
  const envConfigs = {
    development: DEVELOPMENT_CONFIG,
    production: PRODUCTION_CONFIG,
    test: { ...DEVELOPMENT_CONFIG, monitoring: { ...DEVELOPMENT_CONFIG.monitoring, logging: { level: 'warn' as const, outputs: ['console'] } } }
  }

  return {
    ...DEFAULT_CONFIG,
    ...envConfigs[environment]
  } as SixForcesConfig
}

export function validateEnvironmentConfig(environment: string): boolean {
  return ['development', 'production', 'test'].includes(environment)
}

export default DEFAULT_CONFIG