import { EventEmitter } from 'events'
import { GuardianType, GuardianMessage } from '../types'
import { GuardianCommunicationHub } from '../guardians'

/**
 * ForceOrchestrator - Coordinates the Six Forces
 * 
 * Manages the interaction and collaboration between the Six Forces,
 * ensuring they work in harmony to create cohesive multiverses.
 */
export class ForceOrchestrator extends EventEmitter {
  private communicationHub: GuardianCommunicationHub
  private activeForces: Set<GuardianType> = new Set()
  private forceStatuses: Map<GuardianType, 'idle' | 'active' | 'collaborating' | 'error'> = new Map()

  constructor() {
    super()
    this.communicationHub = new GuardianCommunicationHub()
    this.initializeForceStatuses()
  }

  /**
   * Register a guardian with the orchestrator
   */
  registerGuardian(type: GuardianType, guardian: any): void {
    this.communicationHub.registerGuardian(type, guardian)
    this.activeForces.add(type)
    this.forceStatuses.set(type, 'idle')
    this.emit('force:registered', { type, guardian })
  }

  /**
   * Orchestrate collaboration between specific forces
   */
  async orchestrateCollaboration(collaboration: {
    initiator: GuardianType
    collaborators: GuardianType[]
    task: string
    context: any
  }): Promise<any> {
    try {
      this.emit('orchestration:started', collaboration)

      // Set all involved forces to collaborating status
      const allForces = [collaboration.initiator].concat(collaboration.collaborators)
      allForces.forEach(force => {
        this.forceStatuses.set(force, 'collaborating')
      })

      // Create collaboration message
      const message: GuardianMessage = {
        from: collaboration.initiator,
        to: collaboration.collaborators,
        type: 'collaboration',
        content: {
          task: collaboration.task,
          context: collaboration.context
        },
        timestamp: new Date()
      }

      // Facilitate the collaboration
      await this.communicationHub.facilitateCollaboration(message)

      // Reset force statuses
      const allForcesReset = [collaboration.initiator].concat(collaboration.collaborators)
      allForcesReset.forEach(force => {
        this.forceStatuses.set(force, 'idle')
      })

      this.emit('orchestration:completed', collaboration)
      return { success: true, collaboration }

    } catch (error) {
      // Set error status for failed forces
      [collaboration.initiator, ...collaboration.collaborators].forEach(force => {
        this.forceStatuses.set(force, 'error')
      })

      this.emit('orchestration:failed', { collaboration, error })
      throw error
    }
  }

  /**
   * Get current status of all forces
   */
  getForceStatuses(): Record<GuardianType, 'idle' | 'active' | 'collaborating' | 'error'> {
    const statuses: any = {}
    this.forceStatuses.forEach((status, force) => {
      statuses[force] = status
    })
    return statuses
  }

  /**
   * Check if specific forces are available for work
   */
  aresForcesAvailable(forces: GuardianType[]): boolean {
    return forces.every(force => 
      this.activeForces.has(force) && 
      this.forceStatuses.get(force) === 'idle'
    )
  }

  /**
   * Get recommendations for force collaboration based on task type
   */
  getCollaborationRecommendations(taskType: string): {
    primary: GuardianType
    collaborators: GuardianType[]
    reasoning: string
  } {
    const collaborationMatrix: Record<string, { primary: GuardianType; collaborators: GuardianType[]; reasoning: string }> = {
      'brand-development': {
        primary: 'form',
        collaborators: ['flame', 'lore'],
        reasoning: 'Brand development requires visual design (form) guided by strategy (flame) and story (lore)'
      },
      'user-experience': {
        primary: 'form',
        collaborators: ['lore', 'resonance', 'synthesis'],
        reasoning: 'UX needs visual design (form) with narrative flow (lore), audio feedback (resonance), and technical feasibility (synthesis)'
      },
      'business-strategy': {
        primary: 'flame',
        collaborators: ['manifestation', 'synthesis'],
        reasoning: 'Strategy development requires business thinking (flame) with deployment reality (manifestation) and technical constraints (synthesis)'
      },
      'technical-architecture': {
        primary: 'synthesis',
        collaborators: ['flame', 'manifestation'],
        reasoning: 'Technical architecture needs systems thinking (synthesis) aligned with business goals (flame) and deployment requirements (manifestation)'
      },
      'community-building': {
        primary: 'lore',
        collaborators: ['resonance', 'manifestation', 'form'],
        reasoning: 'Community building centers on narrative (lore) with emotional connection (resonance), engagement strategies (manifestation), and visual identity (form)'
      },
      'product-launch': {
        primary: 'manifestation',
        collaborators: ['flame', 'form', 'lore', 'resonance'],
        reasoning: 'Product launch requires deployment expertise (manifestation) coordinated with strategy (flame), branding (form), messaging (lore), and audio identity (resonance)'
      },
      'content-creation': {
        primary: 'lore',
        collaborators: ['form', 'resonance'],
        reasoning: 'Content creation is narrative-driven (lore) with visual presentation (form) and audio enhancement (resonance)'
      },
      'performance-optimization': {
        primary: 'synthesis',
        collaborators: ['manifestation'],
        reasoning: 'Performance optimization requires technical expertise (synthesis) informed by deployment reality (manifestation)'
      }
    }

    return collaborationMatrix[taskType] || {
      primary: 'flame',
      collaborators: ['form', 'lore'],
      reasoning: 'Default collaboration starting with strategic thinking and core creative forces'
    }
  }

  /**
   * Monitor force health and performance
   */
  async monitorForceHealth(): Promise<Record<GuardianType, {
    status: string
    performance: number
    lastActivity: Date
    collaborationCount: number
  }>> {
    const health: any = {}

    for (const force of this.activeForces) {
      health[force] = {
        status: this.forceStatuses.get(force) || 'unknown',
        performance: this.calculateForcePerformance(force),
        lastActivity: new Date(), // Would be tracked in real implementation
        collaborationCount: this.getCollaborationCount(force)
      }
    }

    return health
  }

  /**
   * Suggest optimal force sequencing for a manifestation
   */
  suggestForceSequence(realmType: string, complexity: 'simple' | 'moderate' | 'complex'): {
    sequence: GuardianType[]
    parallelizable: GuardianType[][]
    reasoning: string
  } {
    const sequences = {
      'business': {
        simple: ['flame', 'form', 'synthesis', 'manifestation'],
        moderate: ['flame', 'form', 'lore', 'synthesis', 'manifestation'],
        complex: ['flame', 'form', 'lore', 'resonance', 'synthesis', 'manifestation']
      },
      'creative': {
        simple: ['form', 'lore', 'resonance', 'manifestation'],
        moderate: ['flame', 'form', 'lore', 'resonance', 'manifestation'],
        complex: ['flame', 'form', 'lore', 'resonance', 'synthesis', 'manifestation']
      },
      'educational': {
        simple: ['lore', 'form', 'synthesis', 'manifestation'],
        moderate: ['flame', 'lore', 'form', 'synthesis', 'manifestation'],
        complex: ['flame', 'lore', 'form', 'resonance', 'synthesis', 'manifestation']
      }
    }

    const sequence = sequences[realmType as keyof typeof sequences]?.[complexity] || 
                    sequences.business[complexity]

    const parallelizable = this.identifyParallelizableForces(sequence)

    return {
      sequence,
      parallelizable,
      reasoning: `Optimized sequence for ${realmType} realm with ${complexity} complexity level`
    }
  }

  private initializeForceStatuses(): void {
    const allForces: GuardianType[] = ['flame', 'form', 'lore', 'resonance', 'synthesis', 'manifestation']
    allForces.forEach(force => {
      this.forceStatuses.set(force, 'idle')
    })
  }

  private calculateForcePerformance(force: GuardianType): number {
    // Would calculate based on actual performance metrics
    return 0.92 + Math.random() * 0.08 // Simulated high performance
  }

  private getCollaborationCount(force: GuardianType): number {
    // Would track actual collaboration count
    return Math.floor(Math.random() * 10) + 5 // Simulated collaboration activity
  }

  private identifyParallelizableForces(sequence: GuardianType[]): GuardianType[][] {
    // Identify which forces can work in parallel
    const parallelizable: GuardianType[][] = []

    // Form and Lore can often work in parallel after Flame
    if (sequence.includes('form') && sequence.includes('lore') && sequence.includes('flame')) {
      const flameIndex = sequence.indexOf('flame')
      const formIndex = sequence.indexOf('form')
      const loreIndex = sequence.indexOf('lore')
      
      if (formIndex > flameIndex && loreIndex > flameIndex && Math.abs(formIndex - loreIndex) <= 1) {
        parallelizable.push(['form', 'lore'])
      }
    }

    // Resonance can often work in parallel with Synthesis
    if (sequence.includes('resonance') && sequence.includes('synthesis')) {
      const resonanceIndex = sequence.indexOf('resonance')
      const synthesisIndex = sequence.indexOf('synthesis')
      
      if (Math.abs(resonanceIndex - synthesisIndex) <= 1) {
        parallelizable.push(['resonance', 'synthesis'])
      }
    }

    return parallelizable
  }
}

export default ForceOrchestrator