// app/api/quiz/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const prompt = `
Generate a cybersecurity multiple-choice quiz as a JSON array of 10 objects.
Each object should have the following fields:
- question: string
- options: string[4]
- answer: index (0-3)
- hint: string
Respond ONLY with the JSON array.
`
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    })

    const result = await response.json()
    const generated = result.choices?.[0]?.message?.content ?? ''

    try {
      const questions = JSON.parse(generated)
      return NextResponse.json(questions)
    } catch (err) {
      console.error('[QuizParseError]', generated)
      return NextResponse.json({ error: 'Parsing failed', raw: generated }, { status: 500 })
    }
  } catch (error) {
    console.error('[QuizAPIError]', error)
    return NextResponse.json({ error: 'Quiz fetch failed' }, { status: 500 })
  }
}
