import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'

interface PersonalityRadarProps {
  personality: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
    creativity: number
    empathy: number
    intelligence: number
  }
  size?: number
  animated?: boolean
  interactive?: boolean
  theme?: 'mystical' | 'ethereal' | 'cosmic'
  className?: string
}

const PersonalityRadar: React.FC<PersonalityRadarProps> = ({
  personality,
  size = 300,
  animated = true,
  interactive = false,
  theme = 'mystical',
  className = ''
}) => {
  const svgSize = size
  const center = svgSize / 2
  const maxRadius = center - 40
  
  const traits = useMemo(() => [
    { key: 'openness', label: 'Openness', value: personality.openness, color: '#8B5CF6' },
    { key: 'conscientiousness', label: 'Conscientiousness', value: personality.conscientiousness, color: '#06D6A0' },
    { key: 'extraversion', label: 'Extraversion', value: personality.extraversion, color: '#F59E0B' },
    { key: 'agreeableness', label: 'Agreeableness', value: personality.agreeableness, color: '#EF4444' },
    { key: 'neuroticism', label: 'Neuroticism', value: personality.neuroticism, color: '#EC4899' },
    { key: 'creativity', label: 'Creativity', value: personality.creativity, color: '#6366F1' },
    { key: 'empathy', label: 'Empathy', value: personality.empathy, color: '#10B981' },
    { key: 'intelligence', label: 'Intelligence', value: personality.intelligence, color: '#F97316' }
  ], [personality])

  const angleStep = (Math.PI * 2) / traits.length

  const getPointCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = (value / 100) * maxRadius
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    }
  }

  const getGridPoints = (index: number, level: number) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = (level / 100) * maxRadius
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    }
  }

  const getLabelPosition = (index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = maxRadius + 25
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      anchor: Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle'
    }
  }

  const pathData = useMemo(() => {
    const points = traits.map((trait, index) => 
      getPointCoordinates(index, trait.value)
    )
    
    return `M ${points[0].x} ${points[0].y} ` +
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
           ' Z'
  }, [traits, maxRadius])

  const gridLevels = [20, 40, 60, 80, 100]

  const themeColors = {
    mystical: {
      background: 'rgba(139, 92, 246, 0.1)',
      grid: 'rgba(139, 92, 246, 0.3)',
      axis: 'rgba(255, 255, 255, 0.4)',
      fill: 'rgba(139, 92, 246, 0.2)',
      stroke: '#8B5CF6'
    },
    ethereal: {
      background: 'rgba(14, 165, 233, 0.1)',
      grid: 'rgba(14, 165, 233, 0.3)',
      axis: 'rgba(255, 255, 255, 0.4)',
      fill: 'rgba(14, 165, 233, 0.2)',
      stroke: '#0EA5E9'
    },
    cosmic: {
      background: 'rgba(168, 85, 247, 0.1)',
      grid: 'rgba(168, 85, 247, 0.3)',
      axis: 'rgba(255, 255, 255, 0.4)',
      fill: 'rgba(168, 85, 247, 0.2)',
      stroke: '#A855F7'
    }
  }

  const colors = themeColors[theme]

  return (
    <div className={`relative ${className}`}>
      <motion.svg
        width={svgSize}
        height={svgSize}
        className="overflow-visible"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background */}
        <defs>
          <radialGradient id={`bg-${theme}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={colors.background} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={maxRadius}
          fill={`url(#bg-${theme})`}
        />

        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * maxRadius}
            fill="none"
            stroke={colors.grid}
            strokeWidth={level === 100 ? 2 : 1}
            strokeDasharray={level === 100 ? "none" : "5,5"}
          />
        ))}

        {/* Grid lines (axes) */}
        {traits.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2
          const endX = center + Math.cos(angle) * maxRadius
          const endY = center + Math.sin(angle) * maxRadius
          
          return (
            <motion.line
              key={index}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke={colors.axis}
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          )
        })}

        {/* Data polygon */}
        <motion.path
          d={pathData}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2}
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        />

        {/* Data points */}
        {traits.map((trait, index) => {
          const point = getPointCoordinates(index, trait.value)
          
          return (
            <motion.g key={trait.key}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={4}
                fill={trait.color}
                stroke="white"
                strokeWidth={2}
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={interactive ? { scale: 1.5 } : {}}
              />
              
              {interactive && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={15}
                  fill="transparent"
                  className="cursor-pointer"
                >
                  <title>{`${trait.label}: ${trait.value}%`}</title>
                </circle>
              )}
            </motion.g>
          )
        })}

        {/* Labels */}
        {traits.map((trait, index) => {
          const labelPos = getLabelPosition(index)
          
          return (
            <motion.text
              key={`label-${trait.key}`}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor={labelPos.anchor}
              className="text-sm font-medium fill-current text-white"
              dominantBaseline="middle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
            >
              {trait.label}
              <tspan x={labelPos.x} dy="1.2em" className="text-xs opacity-75">
                {trait.value}%
              </tspan>
            </motion.text>
          )
        })}

        {/* Center label */}
        <motion.text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold fill-current text-white opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          Personality
        </motion.text>
      </motion.svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 bg-black/50 backdrop-blur-sm rounded-lg p-3 max-w-xs">
        <h4 className="text-white text-sm font-semibold mb-2">Personality Traits</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {traits.slice(0, 4).map((trait) => (
            <div key={trait.key} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: trait.color }}
              />
              <span className="text-gray-300 truncate">{trait.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PersonalityRadar