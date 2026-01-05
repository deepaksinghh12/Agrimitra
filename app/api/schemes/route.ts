import { NextResponse } from 'next/server'

/**
 * GET /api/schemes?state=<state>&category=<cat>
 * Returns mock government schemes filtered by state/category.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const state = (url.searchParams.get('state') || 'all').toLowerCase()
  const category = (url.searchParams.get('category') || 'all').toLowerCase()

  const allSchemes = [
    { id: 'S1', title: 'Subsidy for seeds', category: 'inputs', states: ['all'] },
    { id: 'S2', title: 'Irrigation support', category: 'infrastructure', states: ['all'] },
    { id: 'S3', title: 'Crop insurance', category: 'insurance', states: ['all'] },
    { id: 'S4', title: 'State-specific pilot', category: 'pilot', states: ['kerala', 'maharashtra'] },
  ]

  const filtered = allSchemes.filter((s) => (state === 'all' || s.states.includes(state) || s.states.includes('all')) && (category === 'all' || s.category === category))

  return NextResponse.json({ source: 'mock', state, category, schemes: filtered, count: filtered.length, timestamp: new Date().toISOString() })
}
