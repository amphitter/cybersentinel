import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json();
  const backendUrl = 'http://localhost:5000/api/sandbox/simulate';

  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
} 