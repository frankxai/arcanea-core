import { useState, useEffect, useCallback } from 'react'

export interface Character {
  id: string
  name: string
  archetype: 'Creator' | 'Nurturer' | 'Seductress' | 'Conductor' | 'Architect' | 'Transformer'
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Ether' | 'Void'
  consciousness_level: number
  personality: {
    traits: string[]
    voice: string
    knowledge_domains: string[]
    emotional_range: string
    core_values: string[]
  }
  memory: {
    core_experiences: string
    relationship_templates: string
    growth_pattern: string
  }
  conversation_patterns: {
    greeting: string
    question_response: string
    farewell: string
  }
  mystical_abilities: Record<string, any>
  avatar_url?: string
  status: 'idle' | 'thinking' | 'responding' | 'busy'
}

export interface ChatResponse {
  text: string
  emotion: string
  archetype_influence: number
  mystical_energy: 'low' | 'medium' | 'high'
  responseTime: number
}

interface CharacterStateHook {
  character: Character | null
  isActive: boolean
  emotion: string
  loading: boolean
  error: string | null
  sendMessage: (message: string) => Promise<ChatResponse>
  updateCharacter: (updates: Partial<Character>) => void
  resetCharacter: () => void
}

const useCharacterState = (characterId: string): CharacterStateHook => {
  const [character, setCharacter] = useState<Character | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [emotion, setEmotion] = useState('neutral')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate loading character data
  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // In a real app, this would fetch from an API
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockCharacter: Character = {
          id: characterId,
          name: 'Professor Lumina',
          archetype: 'Creator',
          element: 'Fire',
          consciousness_level: 0.85,
          personality: {
            traits: ['inspiring', 'knowledgeable', 'patient', 'creative', 'encouraging'],
            voice: 'warm_professional',
            knowledge_domains: ['visual_arts', 'creativity', 'design', 'aesthetics'],
            emotional_range: 'calm_to_excited',
            core_values: ['beauty', 'expression', 'growth', 'innovation']
          },
          memory: {
            core_experiences: 'decades of nurturing creative souls',
            relationship_templates: 'inspiring mentor to aspiring artists',
            growth_pattern: 'expanding creative horizons through guided exploration'
          },
          conversation_patterns: {
            greeting: 'Welcome, creative soul! What artistic journey shall we embark upon today?',
            question_response: 'thoughtful guidance with practical creative insights',
            farewell: 'May your creativity shine brightly until we meet again!'
          },
          mystical_abilities: {
            artistic_vision: true,
            inspiration_channeling: 'unlimited',
            aesthetic_enhancement: true,
            creative_block_dissolution: true
          },
          status: 'idle'
        }
        
        setCharacter(mockCharacter)
      } catch (err) {
        setError('Failed to load character')
        console.error('Character loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (characterId) {
      loadCharacter()
    }
  }, [characterId])

  const sendMessage = useCallback(async (message: string): Promise<ChatResponse> => {
    if (!character) {
      throw new Error('Character not loaded')
    }

    setIsActive(true)
    setEmotion('thinking')
    
    try {
      // Simulate API call to Starlight Intelligence
      const startTime = Date.now()
      
      // Mock response generation based on character traits
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const responseTime = Date.now() - startTime
      
      // Generate response based on character personality
      const responses = [
        'That\'s a fascinating perspective! Let me share some insights...',
        'I understand what you\'re getting at. Here\'s how I see it...',
        'What an intriguing question! Allow me to illuminate...',
        'Your curiosity sparks my own creative fire! Consider this...',
        'I sense great potential in your inquiry. Let\'s explore...'
      ]
      
      const emotions = ['thoughtful', 'excited', 'curious', 'inspired', 'contemplative']
      const mysticalEnergies: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
      
      const response: ChatResponse = {
        text: responses[Math.floor(Math.random() * responses.length)] + ' ' + 
              'This connects deeply with the principles of ' + 
              character.personality.knowledge_domains[Math.floor(Math.random() * character.personality.knowledge_domains.length)] +
              '. What aspects would you like to explore further?',
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        archetype_influence: character.consciousness_level * 100,
        mystical_energy: mysticalEnergies[Math.floor(Math.random() * mysticalEnergies.length)],
        responseTime
      }
      
      setEmotion(response.emotion)
      
      return response
      
    } catch (err) {
      setError('Failed to send message')
      throw err
    } finally {
      setIsActive(false)
      setTimeout(() => setEmotion('neutral'), 3000)
    }
  }, [character])

  const updateCharacter = useCallback((updates: Partial<Character>) => {
    setCharacter(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  const resetCharacter = useCallback(() => {
    setCharacter(null)
    setIsActive(false)
    setEmotion('neutral')
    setError(null)
  }, [])

  return {
    character,
    isActive,
    emotion,
    loading,
    error,
    sendMessage,
    updateCharacter,
    resetCharacter
  }
}

export default useCharacterState