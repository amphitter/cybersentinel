'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTheme } from 'next-themes'

export default function AttackHistoryChart() {
  const { resolvedTheme } = useTheme()
  const { data: session } = useSession()

  const [linkVisits, setLinkVisits] = useState<any[]>([])
  const [attackTypesData, setAttackTypesData] = useState<any[]>([])

  const isDark = resolvedTheme === 'dark'
  const tooltipStyle = {
    backgroundColor: isDark ? '#1f1f1f' : '#fff',
    borderColor: '#C27AFF',
    borderRadius: 6,
    color: isDark ? '#fff' : '#000',
  }

  // Fetch function
  const fetchStats = async () => {
    if (!session?.user?.email) return

    try {
      const res = await fetch(`/api/user/stats?email=${session.user.email}`)
      if (!res.ok) throw new Error('Failed to fetch user stats')
      const data = await res.json()

      const visitData = [
        { date: 'Today', visits: data.linkVisits?.today || 0 },
        { date: 'This Week', visits: data.linkVisits?.thisWeek || 0 },
        { date: 'This Month', visits: data.linkVisits?.thisMonth || 0 },
      ]

      setLinkVisits(visitData)
      setAttackTypesData(data.attackTypes || [])
    } catch (err) {
      console.error('Error fetching user stats:', err)
    }
  }

  // Auto-refreshing every 10s
  useEffect(() => {
    fetchStats() // initial fetch
    const interval = setInterval(fetchStats, 10000) // refresh every 10 seconds
    return () => clearInterval(interval)
  }, [session?.user?.email])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Line Chart: Link Visit Trend */}
      <Card className="bg-background text-foreground border border-neon-purple shadow-xl w-full">
        <CardHeader>
          <CardTitle className="text-neon-purple text-lg md:text-xl font-semibold">
            Link Visit Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[360px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={linkVisits}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={isDark ? 0.1 : 0.3} />
              <XAxis dataKey="date" stroke={isDark ? '#aaa' : '#333'} />
              <YAxis stroke={isDark ? '#aaa' : '#333'} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#C27AFF"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart: Attack Types */}
      <Card className="bg-background text-foreground border border-neon-purple shadow-xl w-full">
        <CardHeader>
          <CardTitle className="text-neon-purple text-lg md:text-xl font-semibold">
            Common Attack Types
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[360px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attackTypesData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={isDark ? 0.1 : 0.3} />
              <XAxis dataKey="type" stroke={isDark ? '#aaa' : '#333'} />
              <YAxis stroke={isDark ? '#aaa' : '#333'} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar
                dataKey="count"
                fill="#C27AFF"
                barSize={40}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
