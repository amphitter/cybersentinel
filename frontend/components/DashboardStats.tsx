'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DashboardStats() {
  const { data: session, status } = useSession()

  const [stats, setStats] = useState([
    { label: 'Today', count: 0, value: 0 },
    { label: 'This Week', count: 0, value: 0 },
    { label: 'This Month', count: 0, value: 0 },
  ])

 useEffect(() => {
  let interval: NodeJS.Timeout

  const fetchStats = async () => {
  try {
    const res = await fetch('/api/user/stats')
    if (!res.ok) throw new Error('Failed to fetch stats')
    const data = await res.json()

    const visits = data.linkVisits || {}

    setStats([
      {
        label: 'Today',
        count: visits.today || 0,
        value: Math.min(100, visits.today * 2),
      },
      {
        label: 'This Week',
        count: visits.thisWeek || 0,
        value: Math.min(100, visits.thisWeek),
      },
      {
        label: 'This Month',
        count: visits.thisMonth || 0,
        value: Math.min(100, visits.thisMonth / 2),
      },
    ])
  } catch (err) {
    console.error('Error loading stats:', err)
  }
}


  if (status === 'authenticated') {
    fetchStats() // ✅ Initial load
    interval = setInterval(fetchStats, 10000) // ✅ Refresh every 10 sec
  }

  return () => {
    if (interval) clearInterval(interval) // ✅ Clean up on unmount
  }
}, [status])

  return (
    <Card className="bg-background/80 backdrop-blur-md border border-neon-purple shadow-xl text-foreground">
      <CardHeader>
        <CardTitle className="text-neon-purple text-lg tracking-wide">
          Link Scan Summary
        </CardTitle>

      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-3"
          >
            <div className="w-[95%] h-40 hover:scale-105 transition-transform duration-300 ease-in-out -mt-12">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="80%"
                  innerRadius="60%"
                  outerRadius="100%"
                  barSize={14}
                  data={[{ name: stat.label, value: stat.value, fill: '#C27AFF' }]}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    animationBegin={0}
                    animationDuration={1000}
                    isAnimationActive
                  />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-black text-white px-3 py-1 rounded border border-purple-500 text-xs">
                          <span className="font-semibold">Links Visited:</span>{' '}
                          {stat.count}
                        </div>
                      ) : null
                    }
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center -mt-20">
              <p className="text-2xl font-bold text-neon-purple">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
