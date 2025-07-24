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
  // const { data: session, status } = useSession()
  const [stats, setStats] = useState([
    { label: 'Today', count: 0, value: 0 },
    { label: 'This Week', count: 0, value: 0 },
    { label: 'This Month', count: 0, value: 0 },
  ])

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     fetch('/api/user/stats')
  //       .then(res => res.json())
  //       .then(data => {
  //         setStats([
  //           { label: 'Today', count: data.today, value: Math.min(100, data.today * 2) },
  //           { label: 'This Week', count: data.thisWeek, value: Math.min(100, data.thisWeek) },
  //           { label: 'This Month', count: data.thisMonth, value: Math.min(100, data.thisMonth / 2) },
  //         ])
  //       })
  //   }
  // }, [status])

  return (
    <Card className="bg-background/80 backdrop-blur-md border border-neon-purple shadow-xl text-foreground">
      <CardHeader>
        <CardTitle className="text-neon-purple text-lg tracking-wide">
          Link Scan Summary
        </CardTitle>
        {/* {session?.user && (
          <p className="text-sm text-muted-foreground mt-1">
            Welcome, <span className="text-white">{session.user.name}</span>
          </p>
        )} */}
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
