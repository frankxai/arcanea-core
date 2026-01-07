# Flame Guardian API

The **Flame Guardian** is the strategic mastermind of the Six Forces, specializing in vision analysis, business strategy, market intelligence, and revenue architecture.

## Class: FlameGuardian

```typescript
import { FlameGuardian } from '@arcanea/six-forces/guardians'
```

### Constructor

```typescript
new FlameGuardian(config: GuardianConfig)
```

## Methods

### analyzeVision()

Transform a raw vision into comprehensive strategic analysis with business model and market positioning.

```typescript
async analyzeVision(request: {
  vision: string
  template?: string
  target_market: string
  timeline: 'rapid' | 'standard' | 'comprehensive'
  constraints?: {
    budget?: number
    resources?: string[]
    regulations?: string[]
    timeline_months?: number
  }
}): Promise<VisionAnalysis>
```

#### Parameters

- `vision` (`string`) - The core vision or business idea to analyze
- `template` (`string`, optional) - Template to use as foundation for analysis
- `target_market` (`string`) - Primary target market or audience
- `timeline` (`'rapid' | 'standard' | 'comprehensive'`) - Analysis depth and detail level
- `constraints` (optional) - Business constraints and limitations

#### Returns

`Promise<VisionAnalysis>` - Comprehensive strategic analysis

```typescript
interface VisionAnalysis {
  // Core Strategy
  strategy: {
    positioning: string
    valueProposition: string
    competitiveAdvantage: string
    marketEntry: string
    scalingPlan: string
  }
  
  // Market Intelligence
  market: {
    size: string
    growth: string
    segments: Array<{
      name: string
      size: string
      characteristics: string[]
      needs: string[]
    }>
    competitors: Array<{
      name: string
      strengths: string[]
      weaknesses: string[]
      marketShare: string
    }>
    trends: string[]
    opportunities: string[]
    threats: string[]
  }
  
  // Business Model
  businessModel: {
    type: string
    revenueStreams: Array<{
      name: string
      description: string
      potential: 'low' | 'medium' | 'high'
      timeline: string
    }>
    costStructure: {
      fixed: string[]
      variable: string[]
      majorExpenses: string[]
    }
    keyMetrics: Array<{
      name: string
      target: string
      measurement: string
    }>
  }
  
  // Financial Projections
  financial: {
    projections: {
      year1: { revenue: string, costs: string, profit: string }
      year2: { revenue: string, costs: string, profit: string }
      year3: { revenue: string, costs: string, profit: string }
    }
    fundingNeeds: {
      amount: string
      use: string[]
      timeline: string
      milestones: string[]
    }
    breakeven: {
      timeline: string
      requirements: string[]
    }
  }
  
  // Risk Assessment
  risks: Array<{
    type: 'market' | 'technical' | 'financial' | 'operational'
    description: string
    probability: 'low' | 'medium' | 'high'
    impact: 'low' | 'medium' | 'high'
    mitigation: string[]
  }>
  
  // Strategic Recommendations
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
    guardianCollaboration: {
      form: string[]
      lore: string[]
      resonance: string[]
      synthesis: string[]
      manifestation: string[]
    }
  }
}
```

#### Example

```typescript
const flameGuardian = new FlameGuardian(config)

const analysis = await flameGuardian.analyzeVision({
  vision: "AI-powered fitness platform that adapts to each user's unique body and goals",
  target_market: "health-conscious millennials aged 25-40",
  timeline: "comprehensive",
  constraints: {
    budget: 500000,
    timeline_months: 12,
    regulations: ['HIPAA', 'FDA-digital-health']
  }
})

console.log(analysis.strategy.positioning)
// "Premium AI fitness platform positioned as the 'personal trainer in your pocket'"

console.log(analysis.businessModel.revenueStreams)
// [
//   { name: "Premium Subscriptions", potential: "high", timeline: "Month 3" },
//   { name: "Corporate Wellness", potential: "high", timeline: "Month 8" },
//   { name: "Nutrition Partnerships", potential: "medium", timeline: "Month 6" }
// ]
```

### validateBusinessModel()

Validate and refine business model components for feasibility and optimization.

```typescript
async validateBusinessModel(model: {
  description: string
  revenueStreams: string[]
  targetMarket: string
  competitiveAdvantage: string
}): Promise<{
  validation: {
    feasibility: 'high' | 'medium' | 'low'
    marketFit: 'strong' | 'moderate' | 'weak'
    scalability: 'high' | 'medium' | 'low'
    risks: string[]
  }
  optimizations: {
    revenueEnhancements: string[]
    costReductions: string[]
    marketExpansion: string[]
    competitiveStrengthening: string[]
  }
  refinedModel: VisionAnalysis['businessModel']
}>
```

### analyzeCompetition()

Deep competitive analysis and market positioning intelligence.

```typescript
async analyzeCompetition(params: {
  industry: string
  targetMarket: string
  proposedSolution: string
  geographicScope: 'local' | 'national' | 'global'
}): Promise<{
  landscape: {
    directCompetitors: Array<{
      name: string
      marketShare: string
      strengths: string[]
      weaknesses: string[]
      pricing: string
      differentiation: string
    }>
    indirectCompetitors: Array<{
      name: string
      substituteThreat: 'low' | 'medium' | 'high'
      strengths: string[]
    }>
    marketGaps: string[]
    barriers: string[]
  }
  positioning: {
    recommendedPosition: string
    differentiationStrategy: string
    pricingStrategy: string
    messagingFramework: string
  }
  opportunities: {
    whiteSpace: string[]
    partnershipOpportunities: string[]
    acquisitionTargets: string[]
    marketingChannels: string[]
  }
}>
```

### generateGrowthStrategy()

Create comprehensive growth and scaling strategies.

```typescript
async generateGrowthStrategy(vision: string, currentState: {
  stage: 'idea' | 'mvp' | 'early' | 'growth' | 'scale'
  metrics?: Record<string, number>
  resources?: {
    team: number
    budget: number
    timeframe: number
  }
}): Promise<{
  strategy: {
    phases: Array<{
      name: string
      duration: string
      objectives: string[]
      metrics: string[]
      resources: string[]
    }>
    channels: Array<{
      name: string
      potential: 'high' | 'medium' | 'low'
      cost: 'high' | 'medium' | 'low'
      timeline: string
    }>
    partnerships: string[]
    expansion: {
      geographic: string[]
      demographic: string[]
      product: string[]
    }
  }
  execution: {
    immediate: string[]
    month1: string[]
    month3: string[]
    month6: string[]
    year1: string[]
  }
  tracking: {
    kpis: string[]
    milestones: Array<{
      name: string
      deadline: string
      criteria: string[]
    }>
    reportingFrequency: string
  }
}>
```

## Configuration

### Guardian Configuration

```typescript
interface FlameGuardianConfig extends GuardianConfig {
  // AI Model Settings
  model: 'gpt-4' | 'claude-3' | 'custom'
  temperature: number        // 0.0-1.0, affects creativity
  maxTokens: number         // Maximum response length
  
  // Strategic Focus
  analysisDepth: 'surface' | 'standard' | 'deep'
  marketScope: 'local' | 'national' | 'global'
  industryExpertise: string[]
  
  // Business Intelligence
  dataAccess: {
    marketData: boolean
    competitorIntel: boolean
    industryReports: boolean
    economicIndicators: boolean
  }
  
  // Collaboration
  collaborationMode: 'autonomous' | 'guided' | 'supervised'
  crossGuardianComms: boolean
  
  // Enterprise Features
  enterprise?: {
    customPrompts: boolean
    auditTrails: boolean
    governanceIntegration: boolean
    complianceChecks: string[]
  }
}
```

### Example Configuration

```typescript
const flameConfig: FlameGuardianConfig = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 4000,
  analysisDepth: 'deep',
  marketScope: 'global',
  industryExpertise: ['fintech', 'healthtech', 'edtech'],
  dataAccess: {
    marketData: true,
    competitorIntel: true,
    industryReports: true,
    economicIndicators: true
  },
  collaborationMode: 'guided',
  crossGuardianComms: true,
  enterprise: {
    customPrompts: true,
    auditTrails: true,
    governanceIntegration: true,
    complianceChecks: ['SOC2', 'GDPR']
  }
}
```

## Events

```typescript
flameGuardian.on('vision:analysis-started', (data) => {
  console.log(`Strategic analysis started for vision: ${data.vision}`)
})

flameGuardian.on('vision:analysis-completed', (data) => {
  console.log(`Strategic analysis completed with ${data.recommendationsCount} recommendations`)
})

flameGuardian.on('collaboration:cross-guardian', (data) => {
  console.log(`Flame Guardian collaborating with ${data.targetGuardian}`)
})

flameGuardian.on('error', (error) => {
  console.error('Flame Guardian error:', error)
})
```

## Best Practices

### 1. Vision Clarity
Provide specific, measurable visions for better strategic analysis:

```typescript
// ❌ Vague vision
"Make a good app"

// ✅ Clear vision  
"AI-powered personal finance app that helps millennials save 20% more money through behavioral insights and automated optimization"
```

### 2. Market Context
Always include target market information for relevant strategy:

```typescript
const analysis = await flameGuardian.analyzeVision({
  vision: "Sustainable fashion marketplace",
  target_market: "environmentally conscious consumers aged 18-35 in urban areas",
  timeline: "comprehensive"
})
```

### 3. Constraint Integration
Include real constraints for practical strategies:

```typescript
const analysis = await flameGuardian.analyzeVision({
  vision: "EdTech platform for coding education",
  target_market: "career switchers aged 25-45",
  timeline: "standard",
  constraints: {
    budget: 100000,
    timeline_months: 6,
    resources: ["2 developers", "1 designer"],
    regulations: ["COPPA", "FERPA"]
  }
})
```

## Related APIs

- [Form Guardian](/api/guardians/form-guardian.md) - Visual implementation of Flame strategies
- [Lore Guardian](/api/guardians/lore-guardian.md) - Content strategy and messaging
- [Manifestation Guardian](/api/guardians/manifestation-guardian.md) - Strategy implementation
- [Business Manifester](/api/manifestation/business-manifester.md) - Business strategy execution