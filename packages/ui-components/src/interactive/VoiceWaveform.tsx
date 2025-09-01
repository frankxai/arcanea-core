import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface VoiceWaveformProps {
  isActive: boolean
  color?: string
  height?: number
  barCount?: number
  sensitivity?: number
  className?: string
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  color = '#8B5CF6',
  height = 40,
  barCount = 20,
  sensitivity = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext>()
  const analyserRef = useRef<AnalyserNode>()
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [waveformData, setWaveformData] = useState<number[]>(new Array(barCount).fill(0))

  useEffect(() => {
    if (isActive) {
      initializeAudio()
    } else {
      stopAudio()
    }

    return () => stopAudio()
  }, [isActive])

  const initializeAudio = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setAudioStream(stream)

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)

      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      microphone.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      startVisualization()
    } catch (error) {
      console.error('Failed to access microphone:', error)
    }
  }

  const stopAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    setWaveformData(new Array(barCount).fill(0))
  }

  const startVisualization = () => {
    const analyser = analyserRef.current
    if (!analyser) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const animate = () => {
      analyser.getByteFrequencyData(dataArray)

      // Process audio data to create waveform
      const step = Math.floor(bufferLength / barCount)
      const newWaveformData: number[] = []

      for (let i = 0; i < barCount; i++) {
        let sum = 0
        const start = i * step
        const end = Math.min(start + step, bufferLength)

        for (let j = start; j < end; j++) {
          sum += dataArray[j]
        }

        const average = sum / (end - start)
        const normalized = (average / 255) * sensitivity
        newWaveformData.push(Math.min(normalized, 1))
      }

      setWaveformData(newWaveformData)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  const maxBarHeight = height - 4

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {waveformData.map((value, index) => {
        const barHeight = Math.max(2, value * maxBarHeight)
        const opacity = Math.max(0.3, value)

        return (
          <motion.div
            key={index}
            className="bg-current rounded-full"
            style={{
              width: '3px',
              height: `${barHeight}px`,
              backgroundColor: color,
              opacity: isActive ? opacity : 0.3
            }}
            animate={{
              height: isActive ? `${barHeight}px` : '2px',
              opacity: isActive ? opacity : 0.3
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut'
            }}
          />
        )
      })}

      {/* Fallback animation when no audio data */}
      {!isActive && (
        <div className="flex items-center space-x-1">
          {[...Array(barCount)].map((_, index) => (
            <motion.div
              key={`fallback-${index}`}
              className="bg-current rounded-full"
              style={{
                width: '3px',
                backgroundColor: color,
                opacity: 0.3
              }}
              animate={{
                height: ['2px', `${Math.random() * 20 + 5}px`, '2px']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default VoiceWaveform