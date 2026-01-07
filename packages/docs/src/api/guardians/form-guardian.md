# Form Guardian API

The **Form Guardian** is the aesthetic architect of the Six Forces, specializing in visual design, user experience, brand identity, and design system creation.

## Class: FormGuardian

```typescript
import { FormGuardian } from '@arcanea/six-forces/guardians'
```

### Constructor

```typescript
new FormGuardian(config: GuardianConfig)
```

## Methods

### generateDesignSystem()

Create comprehensive design systems with visual identity, component libraries, and brand guidelines.

```typescript
async generateDesignSystem(request: {
  vision: string
  brandPersonality: string[]
  targetAudience: string
  platform: 'web' | 'mobile' | 'desktop' | 'multiplatform'
  style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'professional' | 'custom'
  accessibility: boolean
  darkMode: boolean
}): Promise<DesignSystem>
```

#### Parameters

- `vision` (`string`) - The realm vision to translate into visual design
- `brandPersonality` (`string[]`) - Brand personality traits (e.g., ['innovative', 'trustworthy', 'accessible'])
- `targetAudience` (`string`) - Primary audience for design decisions
- `platform` - Target platform(s) for the design system
- `style` - Overall aesthetic direction
- `accessibility` (`boolean`) - Whether to include accessibility features
- `darkMode` (`boolean`) - Whether to include dark mode variants

#### Returns

`Promise<DesignSystem>` - Comprehensive design system

```typescript
interface DesignSystem {
  // Brand Identity
  brand: {
    name: string
    tagline: string
    personality: string[]
    tone: string
    positioning: string
  }
  
  // Visual Identity
  colors: {
    primary: {
      main: string
      light: string
      dark: string
      contrast: string
    }
    secondary: {
      main: string
      light: string
      dark: string
      contrast: string
    }
    neutral: {
      50: string
      100: string
      200: string
      // ... up to 900
    }
    semantic: {
      success: string
      warning: string
      error: string
      info: string
    }
    darkMode?: {
      // Dark mode variants of all colors
    }
  }
  
  // Typography
  typography: {
    fontFamily: {
      primary: string
      secondary?: string
      monospace: string
    }
    scale: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
    }
    weights: {
      light: number
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  
  // Spacing & Layout
  spacing: {
    unit: number // Base spacing unit in px
    scale: number[] // Spacing scale multipliers
  }
  
  // Component Library
  components: {
    buttons: ComponentSpec[]
    inputs: ComponentSpec[]
    cards: ComponentSpec[]
    navigation: ComponentSpec[]
    feedback: ComponentSpec[]
    layout: ComponentSpec[]
  }
  
  // Assets
  assets: {
    logos: {
      primary: string // SVG or PNG URL
      secondary?: string
      icon: string
      favicon: string
    }
    illustrations: {
      hero: string
      empty_states: string[]
      onboarding: string[]
    }
    icons: {
      style: 'outlined' | 'filled' | 'duotone'
      library: Record<string, string> // icon name -> SVG
    }
  }
  
  // Guidelines
  guidelines: {
    usage: string[]
    dosDonts: Array<{
      do: string
      dont: string
      context: string
    }>
    accessibility: {
      colorContrast: string
      focusManagement: string
      keyboardNavigation: string
      screenReader: string
    }
  }
}
```

#### Example

```typescript
const formGuardian = new FormGuardian(config)

const designSystem = await formGuardian.generateDesignSystem({
  vision: "AI-powered fitness platform that adapts to each user's unique body and goals",
  brandPersonality: ['energetic', 'trustworthy', 'innovative', 'accessible'],
  targetAudience: "health-conscious millennials aged 25-40",
  platform: 'multiplatform',
  style: 'bold',
  accessibility: true,
  darkMode: true
})

console.log(designSystem.brand.positioning)
// "The intelligent fitness companion that evolves with you"

console.log(designSystem.colors.primary.main)
// "#FF6B35" (energetic orange)
```

### createUserInterface()

Generate complete user interface designs and prototypes.

```typescript
async createUserInterface(request: {
  designSystem: DesignSystem
  userFlows: Array<{
    name: string
    steps: string[]
    userType: string
  }>
  features: string[]
  platform: 'web' | 'mobile' | 'desktop'
  fidelity: 'wireframe' | 'mockup' | 'prototype'
}): Promise<{
  screens: Array<{
    name: string
    type: 'page' | 'modal' | 'component'
    description: string
    wireframe: string // SVG or image URL
    mockup?: string
    prototype?: string
    components: string[]
  }>
  userFlows: Array<{
    name: string
    screens: string[]
    interactions: Array<{
      trigger: string
      action: string
      result: string
    }>
  }>
  componentSpecs: Array<{
    name: string
    purpose: string
    variants: string[]
    states: string[]
    code?: string // React/Vue component code
  }>
  designTokens: {
    colors: Record<string, string>
    typography: Record<string, any>
    spacing: Record<string, string>
    shadows: Record<string, string>
    animations: Record<string, string>
  }
}>
```

### optimizeUserExperience()

Analyze and optimize user experience based on usage patterns and feedback.

```typescript
async optimizeUserExperience(params: {
  currentDesign: any
  usageAnalytics?: {
    userFlows: Array<{
      path: string[]
      completionRate: number
      dropoffPoints: string[]
    }>
    heatmaps?: Record<string, any>
    feedbackData?: Array<{
      type: 'usability' | 'aesthetic' | 'functionality'
      rating: number
      comments: string[]
    }>
  }
  optimizationGoals: Array<'conversion' | 'engagement' | 'accessibility' | 'performance' | 'satisfaction'>
}): Promise<{
  analysis: {
    currentStrengths: string[]
    usabilityIssues: Array<{
      issue: string
      impact: 'high' | 'medium' | 'low'
      screen: string
      recommendation: string
    }>
    accessibilityGaps: string[]
    performanceBottlenecks: string[]
  }
  optimizations: {
    immediate: Array<{
      change: string
      impact: string
      effort: 'low' | 'medium' | 'high'
      implementation: string
    }>
    shortTerm: string[]
    longTerm: string[]
  }
  redesignedComponents: Array<{
    component: string
    changes: string[]
    rationale: string
    code?: string
  }>
}>
```

## Configuration

### Form Guardian Configuration

```typescript
interface FormGuardianConfig extends GuardianConfig {
  // Design Capabilities
  designTools: {
    generativeAI: boolean
    templateLibrary: boolean
    assetGeneration: boolean
    prototyping: boolean
  }
  
  // Style Preferences
  defaultStyles: {
    colorTheory: 'complementary' | 'analogous' | 'triadic' | 'monochromatic'
    designTrends: 'current' | 'timeless' | 'cutting-edge'
    accessibility: 'basic' | 'enhanced' | 'wcag-aaa'
  }
  
  // Platform Optimization
  platforms: {
    web: { responsive: boolean, progressive: boolean }
    mobile: { native: boolean, adaptive: boolean }
    desktop: { os: string[], styling: 'native' | 'custom' }
  }
  
  // Asset Generation
  assets: {
    logoGeneration: boolean
    iconLibrary: boolean
    illustrationStyle: 'vector' | 'raster' | 'mixed'
    animationLevel: 'none' | 'subtle' | 'engaging' | 'immersive'
  }
  
  // Collaboration
  designReview: {
    stakeholderFeedback: boolean
    iterationTracking: boolean
    versionControl: boolean
  }
}
```

## Events

```typescript
formGuardian.on('design:generation-started', (data) => {
  console.log(`Design generation started for ${data.vision}`)
})

formGuardian.on('design:system-created', (data) => {
  console.log(`Design system created with ${data.componentCount} components`)
})

formGuardian.on('ui:screens-generated', (data) => {
  console.log(`Generated ${data.screenCount} UI screens`)
})

formGuardian.on('optimization:completed', (data) => {
  console.log(`UX optimization completed with ${data.improvementCount} enhancements`)
})
```

## Advanced Features

### Cross-Guardian Collaboration

The Form Guardian automatically collaborates with other forces:

```typescript
// Integrates with Flame Guardian strategy
const designSystem = await formGuardian.generateDesignSystem({
  vision: visionAnalysis.strategy.positioning, // From Flame
  brandPersonality: visionAnalysis.brand.personality,
  targetAudience: visionAnalysis.market.segments[0].name
})

// Provides assets to Lore Guardian
await loreGuardian.generateContent({
  designAssets: designSystem.assets,
  brandGuidelines: designSystem.guidelines
})
```

### Enterprise Integration

```typescript
// Enterprise design governance
const enterpriseDesign = await formGuardian.generateDesignSystem({
  vision: "Enterprise HR platform",
  brandPersonality: ['professional', 'trustworthy', 'efficient'],
  targetAudience: "HR professionals in mid-to-large enterprises",
  platform: 'web',
  style: 'professional',
  accessibility: true,
  governance: {
    approvalProcess: true,
    brandCompliance: ['corporate-guidelines'],
    auditTrails: true
  }
})
```

## Error Handling

```typescript
try {
  const designSystem = await formGuardian.generateDesignSystem(request)
} catch (error) {
  switch (error.code) {
    case 'INVALID_BRAND_PERSONALITY':
      // Handle invalid brand personality traits
      break
    case 'DESIGN_GENERATION_FAILED':
      // Handle design generation service issues
      break
    case 'ACCESSIBILITY_REQUIREMENTS_CONFLICT':
      // Handle accessibility constraint conflicts
      break
    default:
      // Handle general errors
      console.error('Form Guardian error:', error)
  }
}
```

## Related APIs

- [Flame Guardian](/api/guardians/flame-guardian.md) - Strategic foundation for design decisions
- [Lore Guardian](/api/guardians/lore-guardian.md) - Content that complements visual design
- [Synthesis Guardian](/api/guardians/synthesis-guardian.md) - Technical implementation of designs
- [Digital Manifester](/api/manifestation/digital-manifester.md) - Converting designs to code