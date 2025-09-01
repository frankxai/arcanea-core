import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

interface MysticalEffect {
  id: string
  type: string
  element?: string
  archetype?: string
  duration: number
  intensity: 'low' | 'medium' | 'high'
  particles?: boolean
  sound?: string
}

interface MysticalEffectsHook {
  activeEffects: MysticalEffect[]
  particleEffect: MysticalEffect | null
  triggerMysticEffect: (type: string, options?: Partial<MysticalEffect>) => void
  clearEffects: () => void
  createParticles: (element: string, intensity?: 'low' | 'medium' | 'high') => void
  playMysticSound: (sound: string) => void
}

const useMysticalEffects = (): MysticalEffectsHook => {
  const [activeEffects, setActiveEffects] = useState<MysticalEffect[]>([])
  const [particleEffect, setParticleEffect] = useState<MysticalEffect | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const effectTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const triggerMysticEffect = useCallback((type: string, options: Partial<MysticalEffect> = {}) => {
    const effect: MysticalEffect = {
      id: `${type}-${Date.now()}`,
      type,
      duration: 2000,
      intensity: 'medium',
      particles: false,
      ...options
    }

    setActiveEffects(prev => [...prev, effect])

    // Handle different effect types
    switch (type) {
      case 'message-send':
        createMagicRipple(effect)
        if (options.element) {
          createElementalTrail(options.element)
        }
        break
        
      case 'character-response':
        createArchetypeAura(effect)
        if (effect.intensity === 'high') {
          createConciousnessBloom(effect)
        }
        break
        
      case 'consciousness-surge':
        createEnergyPulse(effect)
        playMysticSound('consciousness-awakening')
        break
        
      case 'elemental-manifestation':
        createElementalBurst(effect)
        break
        
      case 'archetype-activation':
        createArchetypeSymbols(effect)
        break
    }

    // Auto-cleanup effect
    const timeout = setTimeout(() => {
      setActiveEffects(prev => prev.filter(e => e.id !== effect.id))
      effectTimeoutsRef.current.delete(effect.id)
    }, effect.duration)

    effectTimeoutsRef.current.set(effect.id, timeout)
  }, [])

  const createMagicRipple = (effect: MysticalEffect) => {
    // Create expanding ripple effect
    const ripple = document.createElement('div')
    ripple.className = 'absolute inset-0 pointer-events-none'
    ripple.innerHTML = `
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  w-4 h-4 rounded-full border-2 border-purple-400 
                  animate-ping opacity-75"></div>
    `
    
    // Add to current container (would need proper DOM reference in real implementation)
    setTimeout(() => ripple.remove(), effect.duration)
  }

  const createElementalTrail = (element: string) => {
    const elementEffects = {
      Fire: () => createFireTrail(),
      Water: () => createWaterFlow(),
      Earth: () => createEarthRumble(),
      Air: () => createWindSwirl(),
      Ether: () => createEtherGlow(),
      Void: () => createVoidDistortion()
    }

    elementEffects[element as keyof typeof elementEffects]?.()
  }

  const createFireTrail = () => {
    // Simulate fire particle trail
    console.log('🔥 Fire trail activated')
  }

  const createWaterFlow = () => {
    // Simulate water flow effect
    console.log('💧 Water flow activated')
  }

  const createEarthRumble = () => {
    // Simulate earth rumble with vibration API if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
    console.log('🌍 Earth rumble activated')
  }

  const createWindSwirl = () => {
    // Simulate wind swirl particles
    console.log('💨 Wind swirl activated')
  }

  const createEtherGlow = () => {
    // Simulate ethereal glow effect
    console.log('✨ Ether glow activated')
  }

  const createVoidDistortion = () => {
    // Simulate void distortion effect
    console.log('🌑 Void distortion activated')
  }

  const createArchetypeAura = (effect: MysticalEffect) => {
    const archetypeColors = {
      Creator: '#ef4444',
      Nurturer: '#10b981',
      Seductress: '#ec4899',
      Conductor: '#3b82f6',
      Architect: '#f59e0b',
      Transformer: '#8b5cf6'
    }

    const color = archetypeColors[effect.archetype as keyof typeof archetypeColors] || '#8b5cf6'
    console.log(`✨ Archetype aura activated: ${effect.archetype} (${color})`)
  }

  const createConciousnessBloom = (effect: MysticalEffect) => {
    // Create expanding consciousness bloom effect
    setParticleEffect({
      ...effect,
      type: 'consciousness-bloom',
      particles: true,
      duration: 3000
    })

    setTimeout(() => setParticleEffect(null), 3000)
  }

  const createEnergyPulse = (effect: MysticalEffect) => {
    // Create pulsing energy waves
    console.log('⚡ Energy pulse activated')
  }

  const createElementalBurst = (effect: MysticalEffect) => {
    // Create elemental particle burst
    setParticleEffect({
      ...effect,
      type: 'elemental-burst',
      particles: true,
      duration: 2000
    })

    setTimeout(() => setParticleEffect(null), 2000)
  }

  const createArchetypeSymbols = (effect: MysticalEffect) => {
    // Create floating archetype symbols
    console.log('🔮 Archetype symbols manifested')
  }

  const createParticles = useCallback((element: string, intensity: 'low' | 'medium' | 'high' = 'medium') => {
    const particleConfigs = {
      Fire: { color: '#ff4500', count: intensity === 'high' ? 100 : 50 },
      Water: { color: '#00bfff', count: intensity === 'high' ? 80 : 40 },
      Earth: { color: '#228b22', count: intensity === 'high' ? 60 : 30 },
      Air: { color: '#f0f8ff', count: intensity === 'high' ? 120 : 60 },
      Ether: { color: '#dda0dd', count: intensity === 'high' ? 150 : 75 },
      Void: { color: '#2f2f2f', count: intensity === 'high' ? 200 : 100 }
    }

    const config = particleConfigs[element as keyof typeof particleConfigs]
    console.log(`Creating ${config?.count} ${element} particles`)
    
    // In a real implementation, this would interface with a particle system library
  }, [])

  const playMysticSound = useCallback((sound: string) => {
    // Initialize audio context if needed
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn('Audio context not supported')
        return
      }
    }

    // Generate mystical sounds using Web Audio API
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Different sound patterns for different effects
    const soundPatterns = {
      'consciousness-awakening': () => {
        oscillator.frequency.setValueAtTime(220, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
      },
      'elemental-fire': () => {
        oscillator.frequency.setValueAtTime(440, ctx.currentTime)
        oscillator.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      },
      'mystical-chime': () => {
        oscillator.frequency.setValueAtTime(1760, ctx.currentTime)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2)
      }
    }

    const pattern = soundPatterns[sound as keyof typeof soundPatterns] || soundPatterns['mystical-chime']
    pattern()

    oscillator.type = 'sine'
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 2)
  }, [])

  const clearEffects = useCallback(() => {
    // Clear all active effects
    effectTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    effectTimeoutsRef.current.clear()
    setActiveEffects([])
    setParticleEffect(null)
  }, [])

  return {
    activeEffects,
    particleEffect,
    triggerMysticEffect,
    clearEffects,
    createParticles,
    playMysticSound
  }
}

export default useMysticalEffects