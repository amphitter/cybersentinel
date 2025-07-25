import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'

// Optional: Revalidate tag for ISR-style caching if needed
// export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email }).select(
      'linkVisits username name email'
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      today: user.linkVisits?.today || 0,
      thisWeek: user.linkVisits?.thisWeek || 0,
      thisMonth: user.linkVisits?.thisMonth || 0,
      username: user.username,
      name: user.name,
      email: user.email,
    })
  } catch (error: any) {
    console.error('Error in GET /api/user/stats:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
