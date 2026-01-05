import { NextResponse } from 'next/server'

/**
 * POST /api/voice
 * Body: { text: string }
 * Returns a mock reply for the provided text input.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const text = (body && body.text) || ''

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "text" in request body' }, { status: 400 })
    }

    // Mock response (replace with real AI/backend later)
    const reply = `Mock reply: received ${text.length} chars`

    return NextResponse.json({ source: 'mock', input: text, reply, timestamp: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
