import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCharacterState } from '../hooks/useCharacterState'
import { useVoiceInteraction } from '../hooks/useVoiceInteraction'
import { useMysticalEffects } from '../hooks/useMysticalEffects'
import CharacterAvatar from './CharacterAvatar'
import VoiceWaveform from '../interactive/VoiceWaveform'
import MysticalLoader from './MysticalLoader'

interface Message {
  id: string
  text: string
  sender: 'user' | 'character'
  timestamp: Date
  emotion?: string
  archetype_influence?: number
  mystical_energy?: 'low' | 'medium' | 'high'
}

interface ArcaneanChatProps {
  characterId: string
  onMessageSent?: (message: string) => void
  onVoiceToggle?: (enabled: boolean) => void
  enableVoice?: boolean
  enableMysticEffects?: boolean
  theme?: 'mystical' | 'ethereal' | 'cosmic' | 'elemental'
}

const ArcaneanChat: React.FC<ArcaneanChatProps> = ({
  characterId,
  onMessageSent,
  onVoiceToggle,
  enableVoice = false,
  enableMysticEffects = true,
  theme = 'mystical'
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { character, sendMessage: sendToCharacter } = useCharacterState(characterId)
  const { isListening, startListening, stopListening, transcript } = useVoiceInteraction()
  const { triggerMysticEffect, particleEffect } = useMysticalEffects()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (transcript) {
      setInputText(transcript)
    }
  }, [transcript])

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsThinking(true)
    
    if (enableMysticEffects) {
      triggerMysticEffect('message-send', { element: character?.element })
    }

    try {
      onMessageSent?.(inputText)
      const response = await sendToCharacter(inputText)
      
      setIsThinking(false)
      setIsTyping(true)

      // Simulate typing effect
      const characterMessage: Message = {
        id: `character-${Date.now()}`,
        text: response.text,
        sender: 'character',
        timestamp: new Date(),
        emotion: response.emotion,
        archetype_influence: response.archetype_influence,
        mystical_energy: response.mystical_energy
      }

      await simulateTyping(characterMessage)
      
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsThinking(false)
    }
  }

  const simulateTyping = async (message: Message) => {
    const words = message.text.split(' ')
    let currentText = ''
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i]
      
      setMessages(prev => {
        const messageIndex = prev.findIndex(m => m.id === message.id)
        if (messageIndex >= 0) {
          const updated = [...prev]
          updated[messageIndex] = { ...message, text: currentText }
          return updated
        } else {
          return [...prev, { ...message, text: currentText }]
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
    }
    
    setIsTyping(false)
    
    if (enableMysticEffects && message.mystical_energy === 'high') {
      triggerMysticEffect('character-response', { 
        element: character?.element,
        archetype: character?.archetype 
      })
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
    onVoiceToggle?.(!isListening)
  }

  const getMessageStyle = (message: Message) => {
    const baseStyle = "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words"
    
    if (message.sender === 'user') {
      return `${baseStyle} bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-auto`
    }
    
    // Character message styling based on archetype and element
    const elementColors = {
      Fire: 'from-red-500 to-orange-600',
      Water: 'from-blue-400 to-cyan-600', 
      Earth: 'from-green-500 to-emerald-600',
      Air: 'from-yellow-400 to-amber-500',
      Ether: 'from-purple-500 to-indigo-600',
      Void: 'from-gray-700 to-gray-900'
    }
    
    const elementGradient = elementColors[character?.element as keyof typeof elementColors] || 'from-gray-500 to-gray-700'
    
    return `${baseStyle} bg-gradient-to-br ${elementGradient} text-white mr-auto ${
      message.mystical_energy === 'high' ? 'shadow-lg shadow-purple-500/25' : ''
    }`
  }

  const getMysticalBorder = (energy?: string) => {
    switch (energy) {
      case 'high': return 'border-2 border-purple-400 animate-pulse'
      case 'medium': return 'border border-blue-300'
      case 'low': return 'border border-gray-300'
      default: return ''
    }
  }

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br ${
      theme === 'mystical' ? 'from-purple-900/20 to-blue-900/20' :
      theme === 'ethereal' ? 'from-cyan-900/20 to-teal-900/20' :
      theme === 'cosmic' ? 'from-indigo-900/20 to-purple-900/20' :
      'from-green-900/20 to-emerald-900/20'
    } backdrop-blur-sm rounded-2xl overflow-hidden`}>
      
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-white/10 bg-black/20">
        <CharacterAvatar 
          characterId={characterId}
          size="md"
          showStatus={true}
          animated={isTyping || isThinking}
        />
        <div className="ml-3 flex-1">
          <h3 className="text-white font-semibold">{character?.name}</h3>
          <p className="text-gray-300 text-sm">
            {isThinking ? 'Contemplating...' : 
             isTyping ? 'Channeling wisdom...' : 
             'Ready to assist'}
          </p>
        </div>
        
        {enableVoice && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceToggle}
            className={`p-3 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-gray-600'
            } text-white transition-colors`}
          >
            🎤
          </motion.button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`${getMessageStyle(message)} ${getMysticalBorder(message.mystical_energy)}`}
              >
                <p>{message.text}</p>
                {message.emotion && (
                  <div className="text-xs opacity-75 mt-1">
                    Emotion: {message.emotion}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {(isThinking || isTyping) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700 rounded-2xl px-4 py-2">
              <MysticalLoader type="dots" size="sm" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Waveform */}
      {enableVoice && isListening && (
        <div className="px-4 py-2 bg-black/20">
          <VoiceWaveform 
            isActive={isListening}
            color={character?.element === 'Fire' ? '#ef4444' : '#8b5cf6'}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Message ${character?.name || 'Character'}...`}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              disabled={isTyping}
            />
            {inputText && (
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <span className="text-xs text-gray-400">{inputText.length}</span>
              </motion.div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            ✨
          </motion.button>
        </div>
      </div>

      {/* Particle Effects */}
      {enableMysticEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {particleEffect && (
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Particle system would be rendered here */}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

export default ArcaneanChat