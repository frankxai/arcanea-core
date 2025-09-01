import React from 'react'
import { motion } from 'framer-motion'

interface MysticalLoaderProps {
  type?: 'spinning' | 'dots' | 'pulsing' | 'orbiting' | 'breathing' | 'quantum'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  speed?: 'slow' | 'normal' | 'fast'
  className?: string
}

const MysticalLoader: React.FC<MysticalLoaderProps> = ({
  type = 'spinning',
  size = 'md',
  color = '#8B5CF6',
  speed = 'normal',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const speedMultiplier = {
    slow: 1.5,
    normal: 1,
    fast: 0.5
  }

  const baseSize = sizeClasses[size]
  const duration = speedMultiplier[speed]

  const SpinningLoader = () => (
    <motion.div
      className={`${baseSize} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2 * duration,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="30"
        />
        <circle
          cx="12"
          cy="12"
          r="6"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="30"
          strokeDashoffset="15"
          opacity="0.6"
        />
        <circle
          cx="12"
          cy="12"
          r="2"
          fill={color}
          opacity="0.8"
        />
      </svg>
    </motion.div>
  )

  const DotsLoader = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full`}
          style={{ backgroundColor: color }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 0.8 * duration,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )

  const PulsingLoader = () => (
    <motion.div
      className={`${baseSize} rounded-full ${className}`}
      style={{ backgroundColor: color }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5 * duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )

  const OrbitingLoader = () => (
    <div className={`relative ${baseSize} ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2 * duration,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="w-3 h-3 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{ backgroundColor: color }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-2"
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5 * duration,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="w-2 h-2 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{ backgroundColor: color, opacity: 0.7 }}
        />
      </motion.div>
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: color, opacity: 0.5 }}
      />
    </div>
  )

  const BreathingLoader = () => (
    <motion.div
      className={`${baseSize} ${className}`}
      animate={{
        scale: [1, 1.3, 1],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 3 * duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
          <radialGradient id="breathingGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="70%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="url(#breathingGradient)"
        />
        <circle
          cx="12"
          cy="12"
          r="6"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill={color}
          opacity="0.8"
        />
      </svg>
    </motion.div>
  )

  const QuantumLoader = () => (
    <div className={`relative ${baseSize} ${className}`}>
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            backgroundColor: color,
            left: '50%',
            top: '50%',
            transformOrigin: '0 0'
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 0.5, 1],
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 2 * duration,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
          transform={`rotate(${index * 60}deg) translateX(${size === 'xs' ? '8px' : size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '24px' : '32px'})`}
        />
      ))}
      <div 
        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: color, opacity: 0.7 }}
      />
    </div>
  )

  const loaderComponents = {
    spinning: SpinningLoader,
    dots: DotsLoader,
    pulsing: PulsingLoader,
    orbiting: OrbitingLoader,
    breathing: BreathingLoader,
    quantum: QuantumLoader
  }

  const LoaderComponent = loaderComponents[type]

  return (
    <div className="flex items-center justify-center">
      <LoaderComponent />
    </div>
  )
}

export default MysticalLoader