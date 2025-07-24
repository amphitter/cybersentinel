// app/api/user/stats/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

  await connectDB()
  const user = await User.findOne({ email })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({
    linkVisits: user.linkVisits,
    linkHistory: user.linkHistory,
    quizHighScore: user.quizHighScore,
  })
}
