'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PhishingMalwareScanner from '@/components/PhishingMalwareScanner'
import DashboardStats from '@/components/DashboardStats'
import LinkHistory from '@/components/LinkHistory'
import SecurityQuiz from '@/components/SecurityQuiz'
import AttackHistoryChart from '@/components/AttackHistoryChart'
import DecryptedText from '@/components/DecryptedText'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.email) {
        const res = await fetch(`/api/user/stats?email=${session.user.email}`)
        if (res.ok) {
          const data = await res.json()
          setUsername(data.username || data.name || data.email || null)
        } else {
          console.error('Failed to fetch user data')
        }
      }
    }

    fetchUser()
  }, [session?.user?.email])

  if (status === 'loading') {
    return <div className="text-center mt-10 text-neon-purple">Loading dashboard...</div>
  }

  if (!session) return null

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Top section: Welcome message (left) and Scanner (right) */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-2">
        <div className="flex-1 flex md:justify-start justify-center items-center mt-8 md:mt-16">
          <span className="text-4xl md:text-5xl -mt-15 font-extrabold text-neon-purple drop-shadow-lg">
            Welcome,{' '}
            <DecryptedText
              text={username || ''}
              speed={60}
              maxIterations={15}
              className="inline-block text-neon-purple"
              encryptedClassName="inline-block text-gray-500 dark:text-gray-600"
              animateOn="view"
            />
            !
          </span>
        </div>
      </div>

      {/* Responsive grid for stats, recent scans, and quiz */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <DashboardStats />
          <LinkHistory />
          <AttackHistoryChart />
        </div>
        <div>
          <SecurityQuiz />
          <PhishingMalwareScanner />
        </div>
      </div>
    </main>
  )
}
