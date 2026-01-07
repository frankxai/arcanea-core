/**
 * Type definitions for the Six Forces Framework
 */

// Core Framework Types
export interface RealmDefinition {
  vision: string
  name: string
  template?: string
  target_audience: string
  timeline: 'rapid' | 'standard' | 'comprehensive'
  forces: SixForces
}

export interface SixForces {
  flame: FlameForceConfig
  form: FormForceConfig
  lore: LoreForceConfig
  resonance: ResonanceForceConfig
  synthesis: SynthesisForceConfig
  manifestation: ManifestationForceConfig
}

// Force-specific configurations
export interface FlameForceConfig {
  strategy: string
  business_model: string
  growth_vector: string
  target_market: string
  monetization_approach: string
}

export interface FormForceConfig {
  aesthetic: string
  primary_colors: string[]
  architecture: string
  brand_personality: string
  visual_style: string
}

export interface LoreForceConfig {
  origin_myth: string
  core_conflicts: string[]
  hero_journey: string
  community_values: string[]
  narrative_themes: string[]
}

export interface ResonanceForceConfig {
  soundscape: string
  voice_style: string
  music_genres: string[]
  emotional_tones: string[]
  audio_branding: string
}

export interface SynthesisForceConfig {
  tech_stack: string[]
  integrations: string[]
  performance_requirements: string
  scalability_plan: string
  security_approach: string
}

export interface ManifestationForceConfig {
  digital: DigitalPresence
  physical: PhysicalPresence
  business: BusinessPresence
  timeline: string
  success_metrics: string[]
}

// Guardian Configuration
export interface GuardianConfig {
  models: string[]
  specialization: string
  focus: string[]
  api_keys?: Record<string, string>
  rate_limits?: {
    requests_per_minute: number
    max_concurrent: number
  }
}

// Analysis Results
export interface VisionAnalysis {
  realm_name: string
  mission_statement: string
  core_values: string[]
  unique_value_proposition: string
  
  market_opportunity: number
  target_personas: string[]
  competitive_positioning: string
  market_gaps: string[]
  
  business_model: BusinessModel
  revenue_projections: RevenueProjections
  monetization_strategy: string[]
  pricing_strategy: PricingStrategy
  
  go_to_market_strategy: string[]
  scaling_milestones: Milestone[]
  scale_projections: any
  partnership_opportunities: string[]
  
  risk_factors: string[]
  success_metrics: string[]
  critical_assumptions: string[]
  
  immediate_priorities: string[]
  team_requirements: TeamRequirements
  resource_requirements: ResourceRequirements
  
  confidence_score: number
  analysis_date: Date
  guardian_insights: string[]
}

export interface BusinessModel {
  business_type: string
  revenue_streams: string[]
  cost_structure: string[]
  value_propositions: string[]
  key_partnerships: string[]
  key_resources: string[]
  key_activities: string[]
  customer_segments: string[]
  customer_relationships: string[]
  channels: string[]
  pricing: PricingStrategy
}

export interface PricingStrategy {
  model: string
  tiers: PricingTier[]
  competitive_position: string
}

export interface PricingTier {
  name: string
  price: number
  features: string
  target_segment: string
}

export interface RevenueProjections {
  year_1: number
  year_2: number
  year_3: number
  assumptions: string[]
}

export interface MarketAnalysis {
  opportunity_size: number
  personas: string[]
  growth_rate: number
  key_trends: string[]
}

export interface TeamRequirements {
  core_roles: string[]
  growth_roles: string[]
  advisory_roles: string[]
}

export interface ResourceRequirements {
  funding_requirements: number
  team_size: number
  technology_requirements: string[]
  timeline_estimate: string
}

export interface Milestone {
  phase: string
  target: string
  timeline: string
  success_criteria: string[]
}

// Manifestation Results
export interface ManifestationResult {
  id: string
  name: string
  vision: string
  status: 'planning' | 'building' | 'manifested' | 'evolved'
  
  forces: {
    flame: VisionAnalysis
    form: VisualIdentity
    lore: NarrativeFramework
    resonance: AudioEcosystem
    synthesis: TechnicalArchitecture
    manifestation: DeploymentPlan
  }
  
  manifestation: {
    digital: DigitalPresence
    physical: PhysicalPresence
    business: BusinessPresence
    timeline: string[]
    next_steps: string[]
  }
  
  metrics: {
    estimated_build_time: string
    projected_revenue: RevenueProjections
    success_probability: number
    key_risks: string[]
  }
  
  created_at: Date
  manifest_url?: string
}

export interface VisualIdentity {
  brand_identity: {
    logo_concepts: string[]
    color_palette: string[]
    typography: string[]
    visual_style: string
  }
  user_experience: {
    wireframes: string[]
    user_flows: string[]
    design_system: any
  }
  visual_assets: {
    imagery_style: string
    icon_system: any
    illustration_style: string
  }
}

export interface NarrativeFramework {
  origin_story: string
  user_journeys: UserJourney[]
  community_culture: CommunityValues
  content_strategy: ContentStrategy
}

export interface UserJourney {
  persona: string
  stages: JourneyStage[]
  emotions: string[]
  touchpoints: string[]
}

export interface JourneyStage {
  name: string
  description: string
  actions: string[]
  emotions: string[]
  pain_points: string[]
  opportunities: string[]
}

export interface CommunityValues {
  core_principles: string[]
  behavioral_norms: string[]
  conflict_resolution: string
  growth_philosophy: string
}

export interface ContentStrategy {
  content_pillars: string[]
  content_types: string[]
  publishing_schedule: any
  voice_and_tone: string
}

export interface AudioEcosystem {
  brand_voice: VoiceProfile
  soundscape_layers: SoundscapeLayers
  musical_identity: MusicalIdentity
  adaptive_audio: AdaptiveAudioConfig
}

export interface VoiceProfile {
  tone: string
  pace: string
  personality: string
  accent: string
}

export interface SoundscapeLayers {
  ambient: string
  interactive: string
  transitional: string
}

export interface MusicalIdentity {
  genre: string
  instruments: string[]
  emotional_range: string
  signature_elements: string[]
}

export interface AdaptiveAudioConfig {
  user_mood_detection: boolean
  contextual_music: string
  spatial_audio: string
}

export interface TechnicalArchitecture {
  system_architecture: SystemArchitecture
  technology_stack: TechStack
  performance_optimization: PerformanceConfig
  security_implementation: SecurityConfig
  scalability_plan: ScalabilityConfig
}

export interface SystemArchitecture {
  architectural_pattern: string
  core_components: string[]
  data_flow: any
  integration_points: string[]
}

export interface TechStack {
  frontend: string[]
  backend: string[]
  database: string[]
  infrastructure: string[]
  monitoring: string[]
}

export interface PerformanceConfig {
  response_time_targets: Record<string, number>
  throughput_requirements: Record<string, number>
  optimization_strategies: string[]
}

export interface SecurityConfig {
  authentication: string
  authorization: string
  data_protection: string[]
  compliance_requirements: string[]
}

export interface ScalabilityConfig {
  horizontal_scaling: string[]
  vertical_scaling: string[]
  auto_scaling_triggers: any
  capacity_planning: any
}

export interface DeploymentPlan {
  digital_presence: DigitalPresence
  physical_presence: PhysicalPresence
  business_model: BusinessModel
  launch_timeline: string[]
  immediate_actions: string[]
  primary_url?: string
  build_estimate: string
}

export interface DigitalPresence {
  web_platform: boolean
  mobile_app: boolean
  desktop_client: boolean
  ar_vr_experiences?: boolean
  social_presence: string[]
  content_channels: string[]
}

export interface PhysicalPresence {
  merchandise: string
  events: string
  locations: string
  partnerships: string[]
  physical_touchpoints: string[]
}

export interface BusinessPresence {
  launch_strategy: string
  revenue_streams: string[]
  timeline: string
  success_metrics: string[]
  partnership_strategy: string
}

// Guardian Communication
export interface GuardianMessage {
  from: GuardianType
  to: GuardianType[]
  type: 'collaboration' | 'feedback' | 'request'
  content: any
  timestamp: Date
}

export type GuardianType = 'flame' | 'form' | 'lore' | 'resonance' | 'synthesis' | 'manifestation'

// Events
export interface RealmEvent {
  type: string
  realm_id: string
  data: any
  timestamp: Date
  guardian?: GuardianType
}

// Utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}