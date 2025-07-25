import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'

export async function GET(req: Request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne(
      { email: session.user.email },
      {
        username: 1,
        email: 1,
        linkVisits: 1,
        linkHistory: 1,
        quizHighScore: 1,
        _id: 0,
      }
    ).lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const linkVisits = {
      today: user.linkVisits?.today || 0,
      thisWeek: user.linkVisits?.thisWeek || 0,
      thisMonth: user.linkVisits?.thisMonth || 0,
    }

    const attackCounts: Record<string, number> = {}
    user.linkHistory?.forEach((entry: any) => {
      const type = entry.status
      if (type) {
        attackCounts[type] = (attackCounts[type] || 0) + 1
      }
    })

    const attackTypes = Object.entries(attackCounts).map(([type, count]) => ({
      type,
      count,
    }))

    return NextResponse.json({
      username: user.username || '',
      email: user.email,
      linkVisits,
      attackTypes,
      quizHighScore: user.quizHighScore || 0,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
