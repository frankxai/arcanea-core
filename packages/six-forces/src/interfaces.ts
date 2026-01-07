/**
 * Extended interfaces for the Six Forces Framework
 * 
 * These interfaces complement the core types with additional
 * functionality and helper interfaces used throughout the system.
 */

import { GuardianType, RealmDefinition, ManifestationResult, VisionAnalysis } from './types'

// Realm Builder Interfaces
export interface RealmBuilder {
  id: string
  profile: BuilderProfile
  createdRealms: string[]
  collaborativeRealms: string[]
  expertise: GuardianType[]
  reputation: ReputationScore
  preferences: BuilderPreferences
}

export interface BuilderProfile {
  displayName: string
  bio: string
  avatar?: string
  website?: string
  socialLinks: Record<string, string>
  location?: string
  timezone: string
  languages: string[]
}

export interface ReputationScore {
  overall: number
  breakdown: Record<GuardianType, number>
  badges: string[]
  testimonials: string[]
  portfolioHighlights: string[]
}

export interface BuilderPreferences {
  preferredForces: GuardianType[]
  collaborationStyle: 'solo' | 'small_team' | 'community' | 'enterprise'
  notificationSettings: NotificationSettings
  workflowPreferences: WorkflowPreferences
}

export interface NotificationSettings {
  realmUpdates: boolean
  collaborationInvites: boolean
  communityActivity: boolean
  systemUpdates: boolean
  marketingCommunications: boolean
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'never'
}

export interface WorkflowPreferences {
  defaultTimeline: 'rapid' | 'standard' | 'comprehensive'
  autoSave: boolean
  collaborativeEditing: boolean
  versionControl: 'manual' | 'automatic'
  reviewProcess: 'self' | 'peer' | 'community'
}

// Collaboration Interfaces
export interface CollaborationSession {
  id: string
  realmId: string
  participants: string[]
  activeForces: GuardianType[]
  sessionType: 'creative' | 'review' | 'planning' | 'implementation'
  startTime: Date
  endTime?: Date
  status: 'active' | 'paused' | 'completed'
  sharedWorkspace: SharedWorkspace
}

export interface SharedWorkspace {
  currentFocus: GuardianType
  liveChanges: WorkspaceChange[]
  permissions: Record<string, Permission[]>
  communicationChannel: string
  resources: SharedResource[]
}

export interface WorkspaceChange {
  id: string
  userId: string
  force: GuardianType
  changeType: 'create' | 'update' | 'delete'
  data: any
  timestamp: Date
  applied: boolean
}

export interface SharedResource {
  id: string
  name: string
  type: 'document' | 'image' | 'audio' | 'video' | 'data' | 'code'
  url: string
  uploadedBy: string
  uploadedAt: Date
  permissions: Permission[]
}

export type Permission = 'view' | 'edit' | 'comment' | 'share' | 'delete'

// Community Interfaces
export interface Community {
  id: string
  name: string
  description: string
  type: 'public' | 'private' | 'invite-only'
  categories: string[]
  memberCount: number
  createdAt: Date
  governance: CommunityGovernance
  features: CommunityFeatures
}

export interface CommunityGovernance {
  moderators: string[]
  rules: CommunityRule[]
  votingSystem: VotingSystem
  conflictResolution: ConflictResolutionProcess
}

export interface CommunityRule {
  id: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'violation' | 'ban'
  consequences: string[]
}

export interface VotingSystem {
  enabled: boolean
  quorum: number
  votingDuration: string
  eligibleVoters: 'all' | 'active' | 'moderators'
}

export interface ConflictResolutionProcess {
  steps: string[]
  mediators: string[]
  escalationPath: string[]
  timeouts: Record<string, number>
}

export interface CommunityFeatures {
  forums: boolean
  realmShowcase: boolean
  collaborativeProjects: boolean
  mentorship: boolean
  events: boolean
  marketplace: boolean
}

// Template and Generator Interfaces
export interface RealmTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimatedTime: string
  prerequisites: string[]
  template: Partial<RealmDefinition>
  customization: TemplateCustomization
  examples: string[]
  createdBy: string
  usage: number
  rating: number
}

export interface TemplateCustomization {
  requiredFields: string[]
  optionalFields: string[]
  fieldTypes: Record<string, 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date'>
  validation: Record<string, ValidationRule[]>
  dependencies: Record<string, string[]>
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
}

// Analytics and Insights Interfaces
export interface RealmAnalytics {
  realmId: string
  period: AnalyticsPeriod
  metrics: RealmMetrics
  insights: RealmInsights
  recommendations: RealmRecommendation[]
  trends: RealmTrend[]
  comparisons: RealmComparison[]
}

export interface AnalyticsPeriod {
  start: Date
  end: Date
  granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
}

export interface RealmMetrics {
  engagement: EngagementMetrics
  performance: PerformanceMetrics
  business: BusinessMetrics
  technical: TechnicalMetrics
  community: CommunityMetrics
}

export interface EngagementMetrics {
  uniqueVisitors: number
  activeUsers: number
  sessionDuration: number
  bounceRate: number
  retentionRate: number
  conversionRate: number
}

export interface PerformanceMetrics {
  loadTime: number
  responseTime: number
  availability: number
  errorRate: number
  throughput: number
  resourceUtilization: Record<string, number>
}

export interface BusinessMetrics {
  revenue: number
  growth: number
  customerAcquisitionCost: number
  lifetimeValue: number
  churnRate: number
  marketShare: number
}

export interface TechnicalMetrics {
  codeQuality: number
  testCoverage: number
  deploymentFrequency: number
  leadTime: number
  changeFailureRate: number
  recoveryTime: number
}

export interface CommunityMetrics {
  memberGrowth: number
  activityLevel: number
  contentCreation: number
  collaborationIndex: number
  satisfactionScore: number
  networkEffect: number
}

export interface RealmInsights {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  keyDrivers: string[]
  bottlenecks: string[]
}

export interface RealmRecommendation {
  id: string
  type: 'optimization' | 'feature' | 'strategy' | 'technical' | 'community'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  expectedImpact: string
  effort: 'small' | 'medium' | 'large' | 'xl'
  timeline: string
  dependencies: string[]
}

export interface RealmTrend {
  metric: string
  direction: 'up' | 'down' | 'stable'
  magnitude: number
  confidence: number
  timeframe: string
  forecast: number[]
}

export interface RealmComparison {
  comparisonType: 'industry' | 'peers' | 'historical' | 'goals'
  metrics: Record<string, ComparisonPoint>
  summary: string
}

export interface ComparisonPoint {
  current: number
  comparison: number
  difference: number
  percentageChange: number
  ranking?: number
}

// API and Integration Interfaces
export interface APIConfig {
  version: string
  baseUrl: string
  authentication: AuthenticationConfig
  rateLimit: RateLimitConfig
  endpoints: APIEndpoint[]
}

export interface AuthenticationConfig {
  type: 'jwt' | 'oauth' | 'api-key'
  settings: Record<string, any>
  scopes: string[]
}

export interface RateLimitConfig {
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
  burstAllowance: number
}

export interface APIEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  parameters: APIParameter[]
  responses: APIResponse[]
  examples: APIExample[]
}

export interface APIParameter {
  name: string
  type: string
  required: boolean
  description: string
  validation?: ValidationRule[]
}

export interface APIResponse {
  statusCode: number
  description: string
  schema: any
  examples: any[]
}

export interface APIExample {
  name: string
  description: string
  request: any
  response: any
}

// Workflow and Process Interfaces
export interface RealmWorkflow {
  id: string
  name: string
  description: string
  stages: WorkflowStage[]
  triggers: WorkflowTrigger[]
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  approvals: ApprovalProcess[]
}

export interface WorkflowStage {
  id: string
  name: string
  description: string
  order: number
  requiredForces: GuardianType[]
  estimatedDuration: string
  dependencies: string[]
  outputs: string[]
}

export interface WorkflowTrigger {
  id: string
  type: 'manual' | 'automatic' | 'scheduled' | 'event'
  conditions: any
  priority: number
}

export interface WorkflowCondition {
  id: string
  type: 'field' | 'status' | 'time' | 'user' | 'custom'
  operator: string
  value: any
  logic: 'and' | 'or'
}

export interface WorkflowAction {
  id: string
  type: 'notify' | 'update' | 'create' | 'delete' | 'integrate' | 'custom'
  parameters: Record<string, any>
  conditions: string[]
}

export interface ApprovalProcess {
  id: string
  name: string
  approvers: string[]
  requiredApprovals: number
  timeout: string
  escalation: EscalationRule[]
}

export interface EscalationRule {
  delay: string
  action: 'notify' | 'reassign' | 'auto-approve' | 'reject'
  parameters: Record<string, any>
}