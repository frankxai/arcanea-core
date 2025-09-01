import { useState, useEffect, useRef, useCallback } from 'react'

interface VoiceInteractionHook {
  isListening: boolean
  isSupported: boolean
  transcript: string
  confidence: number
  error: string | null
  startListening: () => void
  stopListening: () => void
  clearTranscript: () => void
}

const useVoiceInteraction = (): VoiceInteractionHook => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      const recognition = new SpeechRecognition()
      
      // Configure recognition
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1
      
      // Event handlers
      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        console.log('Voice recognition started')
      }
      
      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          
          if (result.isFinal) {
            finalTranscript += transcript
            setConfidence(result[0].confidence)
          } else {
            interimTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript)
          resetSilenceTimer()
        } else if (interimTranscript) {
          setTranscript(prev => prev + interimTranscript)
          resetSilenceTimer()
        }
      }
      
      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error)
        
        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try again.')
            break
          case 'audio-capture':
            setError('Microphone access denied.')
            break
          case 'not-allowed':
            setError('Microphone access not allowed.')
            break
          case 'network':
            setError('Network error occurred.')
            break
          default:
            setError(`Recognition error: ${event.error}`)
        }
        
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
        console.log('Voice recognition ended')
      }
      
      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
      setError('Speech recognition is not supported in this browser.')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [])

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    
    // Auto-stop after 3 seconds of silence
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }, 3000)
  }, [isListening])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported.')
      return
    }
    
    if (!recognitionRef.current) {
      setError('Recognition not initialized.')
      return
    }
    
    if (isListening) {
      return // Already listening
    }

    try {
      setTranscript('')
      setConfidence(0)
      setError(null)
      recognitionRef.current.start()
      resetSilenceTimer()
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('Failed to start voice recognition.')
    }
  }, [isSupported, isListening, resetSilenceTimer])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
  }, [isListening])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(0)
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    clearTranscript
  }
}

export default useVoiceInteraction