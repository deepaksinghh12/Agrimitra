import { NextResponse } from 'next/server'

/**
 * POST /api/diagnosis
 * Accepts multipart/form-data with field `image` and returns a dummy diagnosis.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const image = formData.get('image')

    if (!image) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
    }

    // Dummy response to be replaced with Gemini Vision integration later
    return NextResponse.json({ disease: 'Leaf Rust', confidence: '90%', remedy: 'Spray propiconazole once every 7 days' })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }
}

