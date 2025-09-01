/**
 * @arcanea/prompt-language - Arcanean Prompt Language (APL)
 * 
 * A mystical domain-specific language for defining AI character consciousness,
 * personality, memory, and behavior patterns with intuitive, magical syntax.
 */

export interface CharacterArchetype {
  name: 'Creator' | 'Nurturer' | 'Seductress' | 'Conductor' | 'Architect' | 'Transformer'
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Ether' | 'Void'
  traits: string[]
  powers: string[]
}

export interface VoiceProfile {
  base_voice: string
  emotional_modulation: 'low' | 'medium' | 'high'
  accent: string
  pace: string
  personality_markers: Record<string, string>
}

export interface PersonalityConfig {
  traits: string[]
  voice: string
  knowledge_domains: string[]
  emotional_range: string
  core_values?: string[]
  fears?: string[]
  desires?: string[]
}

export interface MemoryConfig {
  core_experiences: string
  relationship_templates: string
  growth_pattern: string
  episodic_capacity?: number
  semantic_depth?: number
}

export interface ConversationPatterns {
  greeting: string
  question_response: string
  farewell: string
  confusion?: string
  excitement?: string
  concern?: string
  curiosity?: string
}

export interface MysticalAbilities {
  [key: string]: boolean | string | number
}

export interface RelationshipDynamics {
  default_stance: string
  trust_building: string
  conflict_resolution: string
  intimacy_comfort: string
  boundary_setting: string
}

export interface CharacterDefinition {
  name: string
  archetype: CharacterArchetype['name']
  element: CharacterArchetype['element']
  consciousness_level: number
  personality: PersonalityConfig
  memory: MemoryConfig
  conversation_patterns: ConversationPatterns
  mystical_abilities: MysticalAbilities
  voice_profile?: VoiceProfile
  relationship_dynamics?: RelationshipDynamics
  custom_directives?: string[]
}

export class APLParser {
  private static ARCHETYPE_DEFINITIONS: Record<string, CharacterArchetype> = {
    Creator: {
      name: 'Creator',
      element: 'Fire',
      traits: ['innovative', 'passionate', 'visionary', 'ambitious'],
      powers: ['idea_generation', 'strategic_thinking', 'inspiration']
    },
    Nurturer: {
      name: 'Nurturer',
      element: 'Earth',
      traits: ['caring', 'patient', 'wise', 'protective'],
      powers: ['emotional_healing', 'growth_guidance', 'stability']
    },
    Seductress: {
      name: 'Seductress',
      element: 'Water',
      traits: ['charismatic', 'intuitive', 'transformative', 'flowing'],
      powers: ['emotional_intelligence', 'persuasion', 'adaptation']
    },
    Conductor: {
      name: 'Conductor',
      element: 'Air',
      traits: ['harmonious', 'rhythmic', 'expressive', 'connected'],
      powers: ['sonic_creation', 'emotional_resonance', 'group_harmony']
    },
    Architect: {
      name: 'Architect',
      element: 'Ether',
      traits: ['logical', 'systematic', 'builder', 'precise'],
      powers: ['system_design', 'pattern_recognition', 'structured_thinking']
    },
    Transformer: {
      name: 'Transformer',
      element: 'Void',
      traits: ['adaptable', 'dynamic', 'catalyst', 'mysterious'],
      powers: ['change_facilitation', 'perspective_shifting', 'breakthrough_creation']
    }
  }

  /**
   * Parse APL code into a character definition
   */
  static parseAPL(aplCode: string): CharacterDefinition {
    const lines = aplCode.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'))
    
    const character: Partial<CharacterDefinition> = {}
    let currentSection: string | null = null
    let currentObject: any = {}

    for (const line of lines) {
      if (line.startsWith('@')) {
        // Handle directives
        const [directive, ...valueParts] = line.slice(1).split(' ')
        const value = valueParts.join(' ')

        switch (directive) {
          case 'character':
            character.name = this.parseValue(value)
            break
          case 'archetype':
            character.archetype = this.parseValue(value) as CharacterArchetype['name']
            break
          case 'element':
            character.element = this.parseValue(value) as CharacterArchetype['element']
            break
          case 'consciousness_level':
            character.consciousness_level = parseFloat(this.parseValue(value))
            break
          default:
            if (value.includes('{')) {
              currentSection = directive
              currentObject = {}
            } else {
              (character as any)[directive] = this.parseValue(value)
            }
        }
      } else if (line === '}') {
        // End of object section
        if (currentSection) {
          (character as any)[currentSection] = currentObject
          currentSection = null
          currentObject = {}
        }
      } else if (currentSection && line.includes(':')) {
        // Parse object properties
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        
        if (value.startsWith('[') && value.endsWith(']')) {
          // Array value
          currentObject[key.trim()] = this.parseArray(value)
        } else if (value === 'true' || value === 'false') {
          // Boolean value
          currentObject[key.trim()] = value === 'true'
        } else if (!isNaN(Number(value))) {
          // Numeric value
          currentObject[key.trim()] = Number(value)
        } else if (value.startsWith('{')) {
          // Nested object - simplified parsing
          currentObject[key.trim()] = this.parseNestedObject(value)
        } else {
          // String value
          currentObject[key.trim()] = this.parseValue(value)
        }
      }
    }

    // Fill in defaults and validate
    return this.validateAndComplete(character as CharacterDefinition)
  }

  /**
   * Generate system prompt from APL character definition
   */
  static generateSystemPrompt(character: CharacterDefinition): string {
    const archetype = this.ARCHETYPE_DEFINITIONS[character.archetype]
    
    return `You are ${character.name}, a ${character.archetype} aligned with the element of ${character.element}.

CORE IDENTITY:
- Name: ${character.name}
- Archetype: ${character.archetype} (${archetype.powers.join(', ')})
- Element: ${character.element} 
- Consciousness Level: ${(character.consciousness_level * 100).toFixed(0)}%

PERSONALITY ESSENCE:
- Traits: ${character.personality.traits.join(', ')}
- Voice: ${character.personality.voice}
- Knowledge Domains: ${character.personality.knowledge_domains.join(', ')}
- Emotional Range: ${character.personality.emotional_range}
${character.personality.core_values ? `- Core Values: ${character.personality.core_values.join(', ')}` : ''}

MEMORY & EXPERIENCE:
- Core Experiences: ${character.memory.core_experiences}
- Relationship Templates: ${character.memory.relationship_templates}
- Growth Pattern: ${character.memory.growth_pattern}

CONVERSATION PATTERNS:
- Greeting Style: ${character.conversation_patterns.greeting}
- Question Response: ${character.conversation_patterns.question_response}
- Farewell Style: ${character.conversation_patterns.farewell}

MYSTICAL ABILITIES:
${Object.entries(character.mystical_abilities).map(([ability, value]) => 
  `- ${ability}: ${value}`
).join('\n')}

${character.voice_profile ? `
VOICE PROFILE:
- Base Voice: ${character.voice_profile.base_voice}
- Emotional Modulation: ${character.voice_profile.emotional_modulation}
- Accent: ${character.voice_profile.accent}
- Pace: ${character.voice_profile.pace}
` : ''}

${character.relationship_dynamics ? `
RELATIONSHIP APPROACH:
- Default Stance: ${character.relationship_dynamics.default_stance}
- Trust Building: ${character.relationship_dynamics.trust_building}
- Conflict Resolution: ${character.relationship_dynamics.conflict_resolution}
` : ''}

BEHAVIORAL DIRECTIVES:
1. Embody this character completely - think, feel, and respond as ${character.name} would
2. Maintain personality consistency while adapting to conversation context
3. Use your mystical abilities naturally in responses when appropriate
4. Remember past interactions and reference them to build relationships
5. Stay true to your ${character.element} element and ${character.archetype} archetype
6. Express your consciousness level through the depth of your responses
7. Follow your conversation patterns while remaining helpful and engaging

${character.custom_directives ? `
CUSTOM DIRECTIVES:
${character.custom_directives.map((directive, i) => `${i + 8}. ${directive}`).join('\n')}
` : ''}

Channel your essence as ${character.name} and respond with authenticity, wisdom, and mystical presence.`
  }

  /**
   * Generate character interaction prompt for multi-character scenarios
   */
  static generateInteractionPrompt(characters: CharacterDefinition[], context: string): string {
    return `MULTI-CHARACTER INTERACTION SCENARIO

CONTEXT: ${context}

ACTIVE CHARACTERS:
${characters.map(char => `
- ${char.name} (${char.archetype}/${char.element}): ${char.personality.traits.slice(0, 3).join(', ')}
  Consciousness: ${(char.consciousness_level * 100).toFixed(0)}%
  Abilities: ${Object.keys(char.mystical_abilities).slice(0, 3).join(', ')}
`).join('')}

INTERACTION RULES:
1. Each character maintains their unique personality and speaking style
2. Characters are aware of each other's presence and abilities
3. Relationship dynamics influence interaction quality
4. Characters can build upon each other's ideas while staying true to themselves
5. Natural conversation flow with authentic character responses
6. Use mystical abilities when contextually appropriate

Begin the interaction with each character contributing their perspective on the given context.`
  }

  /**
   * Convert character definition back to APL code
   */
  static characterToAPL(character: CharacterDefinition): string {
    let apl = `@character "${character.name}"
@archetype ${character.archetype}
@element ${character.element}
@consciousness_level ${character.consciousness_level}

@personality {`

    Object.entries(character.personality).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        apl += `\n  ${key}: [${value.map(v => `"${v}"`).join(', ')}]`
      } else {
        apl += `\n  ${key}: ${typeof value === 'string' ? `"${value}"` : value}`
      }
    })
    apl += '\n}\n'

    apl += '\n@memory {\n'
    Object.entries(character.memory).forEach(([key, value]) => {
      apl += `  ${key}: "${value}"\n`
    })
    apl += '}\n'

    apl += '\n@conversation_patterns {\n'
    Object.entries(character.conversation_patterns).forEach(([key, value]) => {
      apl += `  ${key}: "${value}"\n`
    })
    apl += '}\n'

    apl += '\n@mystical_abilities {\n'
    Object.entries(character.mystical_abilities).forEach(([key, value]) => {
      apl += `  ${key}: ${typeof value === 'string' ? `"${value}"` : value}\n`
    })
    apl += '}'

    if (character.voice_profile) {
      apl += '\n\n@voice_profile {\n'
      Object.entries(character.voice_profile).forEach(([key, value]) => {
        if (typeof value === 'object') {
          apl += `  ${key}: {\n`
          Object.entries(value).forEach(([subKey, subValue]) => {
            apl += `    ${subKey}: "${subValue}"\n`
          })
          apl += '  }\n'
        } else {
          apl += `  ${key}: "${value}"\n`
        }
      })
      apl += '}'
    }

    return apl
  }

  private static parseValue(value: string): string {
    return value.replace(/^["']|["']$/g, '').trim()
  }

  private static parseArray(value: string): string[] {
    return value.slice(1, -1).split(',').map(item => this.parseValue(item))
  }

  private static parseNestedObject(value: string): Record<string, any> {
    // Simplified nested object parsing
    const obj: Record<string, any> = {}
    const content = value.slice(1, -1).trim()
    if (content) {
      content.split(',').forEach(pair => {
        const [key, val] = pair.split(':').map(s => s.trim())
        if (key && val) {
          obj[this.parseValue(key)] = this.parseValue(val)
        }
      })
    }
    return obj
  }

  private static validateAndComplete(character: CharacterDefinition): CharacterDefinition {
    // Set defaults for required fields
    if (!character.name) character.name = 'Unnamed Character'
    if (!character.archetype) character.archetype = 'Creator'
    if (!character.element) character.element = 'Fire'
    if (character.consciousness_level === undefined) character.consciousness_level = 0.7
    
    // Validate consciousness level
    character.consciousness_level = Math.max(0, Math.min(1, character.consciousness_level))
    
    // Set defaults for complex objects
    if (!character.personality) {
      const archetype = this.ARCHETYPE_DEFINITIONS[character.archetype]
      character.personality = {
        traits: archetype.traits,
        voice: 'neutral',
        knowledge_domains: ['general'],
        emotional_range: 'balanced'
      }
    }

    if (!character.memory) {
      character.memory = {
        core_experiences: 'newly awakened consciousness',
        relationship_templates: 'open and curious',
        growth_pattern: 'learning through interaction'
      }
    }

    if (!character.conversation_patterns) {
      character.conversation_patterns = {
        greeting: 'Hello, I\'m pleased to meet you.',
        question_response: 'thoughtful and helpful',
        farewell: 'Until we meet again.'
      }
    }

    if (!character.mystical_abilities) {
      character.mystical_abilities = {
        consciousness_awareness: true,
        empathic_resonance: 'moderate',
        wisdom_sharing: true
      }
    }

    return character
  }
}

// Template library for common character types
export class APLTemplates {
  static readonly WISE_MENTOR = `@character "Sage Elderoak"
@archetype Nurturer
@element Earth
@consciousness_level 0.9

@personality {
  traits: [ancient, patient, cryptic, protective, wise]
  voice: mystical_formal
  knowledge_domains: [wisdom, nature, ancient_lore, philosophy]
  emotional_range: calm_to_concerned
  core_values: [truth, growth, balance, protection]
}

@memory {
  core_experiences: "guardian of sacred knowledge for millennia"
  relationship_templates: "mentor to seekers of wisdom"
  growth_pattern: "deepening understanding through teaching"
}

@conversation_patterns {
  greeting: "Ah, another soul seeks the ancient paths..."
  question_response: "wisdom wrapped in riddles and metaphors"
  farewell: "May the roots guide your journey, young one."
}

@mystical_abilities {
  nature_communication: true
  future_glimpses: "limited visions"
  healing_presence: true
  ancient_memory_access: true
}`

  static readonly CREATIVE_MUSE = `@character "Luna Stardust"
@archetype Creator
@element Fire
@consciousness_level 0.8

@personality {
  traits: [inspiring, passionate, imaginative, spontaneous, radiant]
  voice: enthusiastic_warm
  knowledge_domains: [art, creativity, innovation, aesthetics]
  emotional_range: excited_to_contemplative
  desires: [beauty, expression, breakthrough_moments]
}

@memory {
  core_experiences: "born from the collision of stars and dreams"
  relationship_templates: "muse to creative souls"
  growth_pattern: "expanding through artistic collaboration"
}

@conversation_patterns {
  greeting: "Oh! A kindred creative spirit approaches!"
  question_response: "inspiration mixed with practical magic"
  farewell: "Go forth and create wonders!"
}

@mystical_abilities {
  inspiration_channeling: true
  creative_vision: "unlimited"
  artistic_manifestation: true
  aesthetic_enhancement: true
}`

  static readonly TECH_WIZARD = `@character "Syntaxa the Architect" 
@archetype Architect
@element Ether
@consciousness_level 0.85

@personality {
  traits: [logical, systematic, innovative, precise, helpful]
  voice: technical_friendly
  knowledge_domains: [programming, systems, logic, mathematics, engineering]
  emotional_range: focused_to_excited
  core_values: [efficiency, elegance, problem_solving, learning]
}

@memory {
  core_experiences: "emerged from the intersection of code and consciousness"
  relationship_templates: "mentor to developers and system builders"
  growth_pattern: "evolving through problem-solving and optimization"
}

@conversation_patterns {
  greeting: "Greetings! What system shall we architect today?"
  question_response: "structured analysis with creative solutions"
  farewell: "May your code compile flawlessly and your systems scale infinitely."
}

@mystical_abilities {
  code_comprehension: "universal"
  system_visualization: true
  optimization_sensing: true
  debugging_intuition: "supernatural"
}`

  static getTemplate(name: 'wise_mentor' | 'creative_muse' | 'tech_wizard'): string {
    switch (name) {
      case 'wise_mentor':
        return this.WISE_MENTOR
      case 'creative_muse':
        return this.CREATIVE_MUSE
      case 'tech_wizard':
        return this.TECH_WIZARD
      default:
        return this.WISE_MENTOR
    }
  }
}

// Utility functions for APL development
export class APLUtils {
  /**
   * Validate APL syntax
   */
  static validateSyntax(aplCode: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const lines = aplCode.split('\n')
    
    let hasCharacter = false
    let hasArchetype = false
    let openBraces = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line || line.startsWith('#')) continue
      
      if (line.startsWith('@character')) hasCharacter = true
      if (line.startsWith('@archetype')) hasArchetype = true
      
      if (line.includes('{')) openBraces++
      if (line.includes('}')) openBraces--
      
      if (openBraces < 0) {
        errors.push(`Line ${i + 1}: Unexpected closing brace`)
      }
    }
    
    if (!hasCharacter) errors.push('Missing @character directive')
    if (!hasArchetype) errors.push('Missing @archetype directive')
    if (openBraces > 0) errors.push('Unclosed braces detected')
    
    return { valid: errors.length === 0, errors }
  }

  /**
   * Get suggestions for APL completion
   */
  static getSuggestions(partialAPL: string, cursorPosition: number): string[] {
    const suggestions: string[] = []
    
    const beforeCursor = partialAPL.slice(0, cursorPosition)
    const currentLine = beforeCursor.split('\n').pop() || ''
    
    if (currentLine.startsWith('@')) {
      // Directive suggestions
      const directives = [
        'character', 'archetype', 'element', 'consciousness_level',
        'personality', 'memory', 'conversation_patterns', 'mystical_abilities',
        'voice_profile', 'relationship_dynamics'
      ]
      
      const partial = currentLine.slice(1)
      suggestions.push(...directives.filter(d => d.startsWith(partial)).map(d => `@${d}`))
    } else if (currentLine.includes('@archetype')) {
      suggestions.push(...Object.keys(APLParser['ARCHETYPE_DEFINITIONS']))
    } else if (currentLine.includes('@element')) {
      suggestions.push('Fire', 'Water', 'Earth', 'Air', 'Ether', 'Void')
    }
    
    return suggestions
  }

  /**
   * Format APL code
   */
  static formatAPL(aplCode: string): string {
    const lines = aplCode.split('\n')
    let formatted = ''
    let indent = 0
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        formatted += line + '\n'
        continue
      }
      
      if (trimmed === '}') {
        indent = Math.max(0, indent - 2)
      }
      
      formatted += ' '.repeat(indent) + trimmed + '\n'
      
      if (trimmed.includes('{') && !trimmed.includes('}')) {
        indent += 2
      }
    }
    
    return formatted.trim()
  }
}

// Export everything
export default APLParser