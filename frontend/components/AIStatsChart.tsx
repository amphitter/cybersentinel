'use client'

import { useTheme } from 'next-themes'
import { TrendingUp } from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export default function AIStatsChart() {
  const { resolvedTheme } = useTheme()

  const data = [
    { category: 'Phishing', score: 85 },
    { category: 'Malware', score: 90 },
    { category: 'DDoS', score: 70 },
    { category: 'Leaks', score: 75 },
    { category: 'Ransomware', score: 80 },
  ]

  // Theme-based dynamic values
  const baseClasses = `p-6 rounded-2xl border h-full transition-colors`
  const darkModeStyles = `bg-black border-neon-purple`
  const lightModeStyles = `bg-gradient-to-br from-white to-gray-100 border-gray-300`

  const cardBg =
    resolvedTheme === 'dark'
      ? `${baseClasses} ${darkModeStyles}`
      : `${baseClasses} ${lightModeStyles}`

  const borderColor =
    resolvedTheme === 'dark' ? 'border-neon-purple' : 'border-gray-300'

  const labelColor =
    resolvedTheme === 'dark' ? '#ddd' : '#444'

  const tooltipStyles = {
    backgroundColor: resolvedTheme === 'dark' ? '#1e1e2f' : '#f4f4f4',
    border: 'none',
    borderRadius: '6px',
    color: resolvedTheme === 'dark' ? 'white' : 'black',
  }

  // Radar fill and stroke color based on theme
  const radarFill = resolvedTheme === 'dark' ? '#fff' : '#000'
  const radarFillOpacity = 0.5
  const radarStroke = resolvedTheme === 'dark' ? '#fff' : '#000'

  return (
    <div
      className={`bg-gradient-to-br ${cardBg} p-6 rounded-2xl border ${borderColor} w-full transition-colors`}
    >
      <div className="flex flex-col items-start justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-neon-purple">Cyber Attack Trends</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600">
          Past Attacks Focus On <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius="80%" data={data}>
          <PolarGrid
            stroke={resolvedTheme === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.1)'
            }
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: labelColor, fontSize: 12 }}
          />
          <Radar
            name="Detection"
            dataKey="score"
            stroke={radarStroke}
            fill={radarFill}
            fillOpacity={radarFillOpacity}
          />
          <Tooltip contentStyle={tooltipStyles} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
