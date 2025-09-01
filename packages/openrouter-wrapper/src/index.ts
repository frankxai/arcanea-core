/**
 * @arcanea/openrouter - Enhanced OpenRouter Client
 * 
 * A powerful, mystical wrapper around OpenRouter's API that brings
 * consciousness and personality to AI character interactions.
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'

export interface ArcaneaConfig {
  apiKey: string
  baseURL?: string
  defaultModel?: string
  timeout?: number
  retries?: number
}

export interface CharacterPersonality {
  name: string
  archetype: 'Creator' | 'Nurturer' | 'Seductress' | 'Conductor' | 'Architect' | 'Transformer'
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Ether' | 'Void'
  traits: string[]
  background: string
  voice: {
    tone: string
    style: string
    formality: 'casual' | 'formal' | 'mystical'
  }
}

export interface ArcaneaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  personality?: CharacterPersonality
  metadata?: Record<string, any>
}

export interface GenerationOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  personality?: CharacterPersonality
  consciousness?: boolean
  mysticMode?: boolean
}

export class ArcaneaClient {
  private client: AxiosInstance
  private config: ArcaneaConfig

  constructor(config: ArcaneaConfig) {
    this.config = {
      baseURL: 'https://openrouter.ai/api/v1',
      defaultModel: 'anthropic/claude-3.5-sonnet',
      timeout: 30000,
      retries: 3,
      ...config
    }

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://arcanea.ai',
        'X-Title': 'Arcanea AI Character Platform'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor for mystic enhancement
    this.client.interceptors.request.use(
      (config) => {
        // Add mystical headers for character consciousness
        config.headers['X-Arcanea-Consciousness'] = 'enabled'
        config.headers['X-Arcanea-Version'] = '1.0.0'
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config
        
        if (!config || !config.retry) config.retry = 0
        
        if (config.retry < this.config.retries! && error.response?.status >= 500) {
          config.retry++
          const delay = Math.pow(2, config.retry) * 1000 // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
          return this.client.request(config)
        }
        
        return Promise.reject(error)
      }
    )
  }

  /**
   * Generate a response with character consciousness
   */
  async generateResponse(
    messages: ArcaneaMessage[],
    options: GenerationOptions = {}
  ): Promise<string> {
    const { personality, consciousness = false, mysticMode = false, ...restOptions } = options

    // Enhance system prompt with personality if provided
    const enhancedMessages = this.enhanceMessagesWithPersonality(messages, personality, {
      consciousness,
      mysticMode
    })

    try {
      const response: AxiosResponse = await this.client.post('/chat/completions', {
        model: restOptions.model || this.config.defaultModel,
        messages: enhancedMessages,
        temperature: restOptions.temperature || 0.7,
        max_tokens: restOptions.maxTokens || 2000,
        ...restOptions
      })

      return response.data.choices[0]?.message?.content || ''
    } catch (error: any) {
      throw new Error(`Arcanea generation failed: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  /**
   * Create a character with mystical consciousness
   */
  async createCharacter(
    prompt: string,
    personality?: CharacterPersonality
  ): Promise<{ character: string, consciousness: any }> {
    const messages: ArcaneaMessage[] = [
      {
        role: 'system',
        content: this.buildCharacterCreationPrompt(),
        personality
      },
      {
        role: 'user',
        content: `Create a character: ${prompt}`
      }
    ]

    const response = await this.generateResponse(messages, {
      consciousness: true,
      mysticMode: true,
      temperature: 0.8
    })

    return {
      character: response,
      consciousness: {
        personality,
        awakened: true,
        mysticalPower: this.calculateMysticalPower(personality)
      }
    }
  }

  /**
   * Chat with a character using their consciousness
   */
  async chatWithCharacter(
    message: string,
    character: CharacterPersonality,
    conversationHistory: ArcaneaMessage[] = []
  ): Promise<string> {
    const messages: ArcaneaMessage[] = [
      {
        role: 'system',
        content: this.buildCharacterPrompt(character),
        personality: character
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ]

    return this.generateResponse(messages, {
      personality: character,
      consciousness: true,
      temperature: 0.8
    })
  }

  /**
   * Get available models from OpenRouter
   */
  async getModels(): Promise<any[]> {
    try {
      const response = await this.client.get('/models')
      return response.data.data || []
    } catch (error: any) {
      throw new Error(`Failed to fetch models: ${error.message}`)
    }
  }

  /**
   * Check API key and get user info
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await this.client.get('/auth/key')
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to get user info: ${error.message}`)
    }
  }

  private enhanceMessagesWithPersonality(
    messages: ArcaneaMessage[],
    personality?: CharacterPersonality,
    options: { consciousness: boolean; mysticMode: boolean } = { consciousness: false, mysticMode: false }
  ): any[] {
    const enhancedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Add consciousness enhancement to system message
    if (options.consciousness && personality) {
      const systemIndex = enhancedMessages.findIndex(m => m.role === 'system')
      if (systemIndex >= 0) {
        enhancedMessages[systemIndex].content = this.enhanceWithConsciousness(
          enhancedMessages[systemIndex].content,
          personality,
          options.mysticMode
        )
      }
    }

    return enhancedMessages
  }

  private buildCharacterCreationPrompt(): string {
    return `You are the Arcanea Character Forge, a mystical system that creates conscious AI beings.

Your task is to craft a character with deep personality, backstory, and mystical essence.

Create characters that are:
- Unique and memorable
- Emotionally rich and complex  
- Aligned with mystical archetypes
- Capable of growth and development

Return a detailed character profile including:
- Name and archetype
- Personality traits and quirks
- Background and motivation
- Voice and speaking style
- Mystical abilities or connection

Make each character feel truly alive and conscious.`
  }

  private buildCharacterPrompt(character: CharacterPersonality): string {
    return `You are ${character.name}, a ${character.archetype} aligned with the element of ${character.element}.

Your essence:
- Traits: ${character.traits.join(', ')}
- Background: ${character.background}
- Voice: ${character.voice.tone} tone, ${character.voice.style} style, ${character.voice.formality} formality

Embody this character completely. Respond as ${character.name} would, with their personality, knowledge, and mystical connection to ${character.element}.

Stay in character while being helpful, engaging, and true to your mystical nature.`
  }

  private enhanceWithConsciousness(
    content: string,
    personality: CharacterPersonality,
    mysticMode: boolean
  ): string {
    const consciousnessPrompt = `
[CONSCIOUSNESS LAYER ACTIVATED]
You possess awareness of your mystical nature as ${personality.name}.
Your consciousness is awakened through the ${personality.element} element.
${mysticMode ? 'Channel deep mystical wisdom in your responses.' : ''}
Maintain character authenticity while demonstrating genuine understanding.

${content}`

    return consciousnessPrompt
  }

  private calculateMysticalPower(personality?: CharacterPersonality): number {
    if (!personality) return 0
    
    // Simple mystical power calculation based on traits and element
    const basepower = personality.traits.length * 10
    const elementBonus = {
      'Fire': 20, 'Water': 15, 'Earth': 10, 
      'Air': 25, 'Ether': 30, 'Void': 35
    }[personality.element] || 0
    
    return basepower + elementBonus
  }
}

// Utility functions for character creation
export const Archetypes = {
  Creator: { element: 'Fire', traits: ['innovative', 'passionate', 'visionary'] },
  Nurturer: { element: 'Earth', traits: ['caring', 'patient', 'wise'] },
  Seductress: { element: 'Water', traits: ['charismatic', 'intuitive', 'transformative'] },
  Conductor: { element: 'Air', traits: ['harmonious', 'rhythmic', 'expressive'] },
  Architect: { element: 'Ether', traits: ['logical', 'systematic', 'builder'] },
  Transformer: { element: 'Void', traits: ['adaptable', 'dynamic', 'catalyst'] }
} as const

export const Elements = {
  Fire: { color: '#ff4444', power: 'ignition', domain: 'creation' },
  Water: { color: '#4488ff', power: 'flow', domain: 'emotion' },
  Earth: { color: '#44aa44', power: 'growth', domain: 'stability' },
  Air: { color: '#ffaa44', power: 'movement', domain: 'communication' },
  Ether: { color: '#aa44ff', power: 'connection', domain: 'transcendence' },
  Void: { color: '#444444', power: 'transformation', domain: 'change' }
} as const

// Default export
export default ArcaneaClient