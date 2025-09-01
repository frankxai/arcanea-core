import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCharacterState } from '../hooks/useCharacterState'

interface CharacterAvatarProps {
  characterId: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showStatus?: boolean
  showElement?: boolean
  showArchetype?: boolean
  animated?: boolean
  onClick?: () => void
  className?: string
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  size = 'md',
  showStatus = false,
  showElement = false,
  showArchetype = false,
  animated = false,
  onClick,
  className = ''
}) => {
  const { character, isActive, emotion } = useCharacterState(characterId)
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const getAvatarContent = () => {
    if (character?.avatar_url) {
      return (
        <img 
          src={character.avatar_url}
          alt={character.name}
          className="w-full h-full object-cover"
        />
      )
    }

    // Generate avatar based on archetype and element
    const archetypeSymbols = {
      Creator: '🎨',
      Nurturer: '🌱',
      Seductress: '🌹',
      Conductor: '🎼',
      Architect: '🏗️',
      Transformer: '⚡'
    }

    const elementGradients = {
      Fire: 'from-red-500 via-orange-500 to-yellow-500',
      Water: 'from-blue-500 via-cyan-500 to-teal-500',
      Earth: 'from-green-600 via-emerald-500 to-lime-500',
      Air: 'from-yellow-400 via-amber-400 to-orange-400',
      Ether: 'from-purple-500 via-violet-500 to-indigo-500',
      Void: 'from-gray-800 via-gray-600 to-gray-900'
    }

    const symbol = archetypeSymbols[character?.archetype as keyof typeof archetypeSymbols] || '✨'
    const gradient = elementGradients[character?.element as keyof typeof elementGradients] || 'from-gray-500 to-gray-700'

    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold`}>
        <span className={`
          ${size === 'xs' ? 'text-xs' : 
            size === 'sm' ? 'text-sm' :
            size === 'md' ? 'text-lg' :
            size === 'lg' ? 'text-xl' : 'text-3xl'}
        `}>
          {symbol}
        </span>
      </div>
    )
  }

  const getStatusIndicator = () => {
    if (!showStatus) return null

    const statusColors = {
      active: 'bg-green-400',
      thinking: 'bg-yellow-400',
      responding: 'bg-blue-400',
      idle: 'bg-gray-400'
    }

    const currentStatus = isActive ? 
      (emotion === 'thinking' ? 'thinking' : 'responding') : 
      'idle'

    return (
      <motion.div 
        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusColors[currentStatus as keyof typeof statusColors]} border-2 border-white`}
        animate={animated && isActive ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  const getElementIndicator = () => {
    if (!showElement) return null

    const elementSymbols = {
      Fire: '🔥',
      Water: '💧',
      Earth: '🌍',
      Air: '💨',
      Ether: '✨',
      Void: '🌑'
    }

    return (
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
        <span className="text-xs">
          {elementSymbols[character?.element as keyof typeof elementSymbols]}
        </span>
      </div>
    )
  }

  const getArchetypeRing = () => {
    if (!showArchetype) return null

    const archetypeColors = {
      Creator: 'border-red-400',
      Nurturer: 'border-green-400',
      Seductress: 'border-pink-400',
      Conductor: 'border-blue-400',
      Architect: 'border-yellow-400',
      Transformer: 'border-purple-400'
    }

    const color = archetypeColors[character?.archetype as keyof typeof archetypeColors] || 'border-gray-400'

    return (
      <motion.div 
        className={`absolute inset-0 rounded-full border-2 ${color} opacity-75`}
        animate={isHovered ? {
          scale: [1, 1.1, 1],
          rotate: [0, 360]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    )
  }

  const getConsciousnessGlow = () => {
    if (!character?.consciousness_level || character.consciousness_level < 0.7) return null

    return (
      <motion.div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-blue-400/30 blur-sm"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      {/* Consciousness Glow */}
      {getConsciousnessGlow()}
      
      {/* Archetype Ring */}
      {getArchetypeRing()}
      
      {/* Main Avatar */}
      <motion.div 
        className="relative w-full h-full rounded-full overflow-hidden shadow-lg"
        animate={animated ? {
          rotate: isActive ? [0, 2, -2, 0] : 0
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {getAvatarContent()}
        
        {/* Emotional Overlay */}
        <AnimatePresence>
          {emotion && emotion !== 'neutral' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Status Indicator */}
      {getStatusIndicator()}
      
      {/* Element Indicator */}
      {getElementIndicator()}
      
      {/* Hover Tooltip */}
      <AnimatePresence>
        {isHovered && character && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap z-10"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center">
              <div className="font-semibold">{character.name}</div>
              <div className="text-xs text-gray-300">
                {character.archetype} • {character.element}
              </div>
              {character.consciousness_level && (
                <div className="text-xs text-purple-300">
                  Consciousness: {(character.consciousness_level * 100).toFixed(0)}%
                </div>
              )}
            </div>
            
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CharacterAvatar