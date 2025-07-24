import { NextResponse } from 'next/server'

export async function GET() {
  const backendUrl = 'http://localhost:5000/api/awareness/scenario';
  const res = await fetch(backendUrl);
  const data = await res.json();
  return NextResponse.json(data);
} 