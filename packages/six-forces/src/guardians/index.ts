/**
 * AI Guardians - The Six Forces of Reality Creation
 * 
 * Each Guardian is a specialized AI entity that masters one of the 
 * fundamental cosmic forces of multiverse creation.
 */

export { FlameGuardian } from './FlameGuardian'
export { FormGuardian } from './FormGuardian'
export { LoreGuardian } from './LoreGuardian'
export { ResonanceGuardian } from './ResonanceGuardian'
export { SynthesisGuardian } from './SynthesisGuardian'
export { ManifestationGuardian } from './ManifestationGuardian'

// Guardian Types and Utilities
import { GuardianType } from '../types'
export { GuardianType }

export const GUARDIAN_SPECIALIZATIONS = {
  flame: {
    force: 'Vision & Strategy',
    symbol: '🔥',
    description: 'The spark that ignites new realities through strategic thinking and business vision',
    expertise: ['Business Models', 'Market Analysis', 'Growth Strategies', 'Vision Articulation']
  },
  form: {
    force: 'Visual & Aesthetic',
    symbol: '🎨',
    description: 'The power to shape what can be seen through visual design and brand identity',
    expertise: ['Brand Design', '3D Worlds', 'UI/UX', 'Aesthetic Systems']
  },
  lore: {
    force: 'Story & Meaning',
    symbol: '📜',
    description: 'The weave of narratives that give worlds soul through mythology and community values',
    expertise: ['Mythology', 'Character Arcs', 'World Building', 'Cultural Design']
  },
  resonance: {
    force: 'Sound & Frequency',
    symbol: '🎵',
    description: 'The vibrations that move hearts and minds through audio and emotional resonance',
    expertise: ['Soundscapes', 'Music Composition', 'Voice Synthesis', 'Audio Branding']
  },
  synthesis: {
    force: 'Integration & Systems',
    symbol: '⚡',
    description: 'The bridges that unite all forces through technical architecture and systems',
    expertise: ['Architecture', 'APIs', 'Databases', 'Performance']
  },
  manifestation: {
    force: 'Physical Reality',
    symbol: '🚀',
    description: 'The alchemy that births dreams into the world through deployment and scaling',
    expertise: ['Marketing', 'Sales', 'Scaling', 'Physical Presence']
  }
} as const

// Guardian Communication Helpers
import { GuardianMessage } from '../types'
export { GuardianMessage }

export class GuardianCommunicationHub {
  private guardians: Map<GuardianType, any> = new Map()
  
  registerGuardian(type: GuardianType, guardian: any): void {
    this.guardians.set(type, guardian)
  }
  
  async facilitateCollaboration(message: GuardianMessage): Promise<void> {
    for (const targetType of message.to) {
      const targetGuardian = this.guardians.get(targetType)
      if (targetGuardian && targetGuardian !== this.guardians.get(message.from)) {
        await targetGuardian.collaborate({
          collaboration_type: message.type,
          initiator: message.from,
          content: message.content,
          timestamp: message.timestamp
        })
      }
    }
  }
}