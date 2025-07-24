// app/api/upload/route.ts

import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = file.name
  const filePath = path.join(process.cwd(), 'public/uploads', fileName)

  await writeFile(filePath, buffer)

  return NextResponse.json({ success: true, fileName })
}
