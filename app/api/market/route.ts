import { NextResponse } from 'next/server'

/**
 * GET /api/market?crop=<name>
 * Returns mock price list entries for a crop.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const crop = (url.searchParams.get('crop') || 'wheat').toLowerCase()

  const basePrices: Record<string, number> = {
    wheat: 2200,
    rice: 3000,
    maize: 1800,
    sugarcane: 1200,
  }

  const base = basePrices[crop] ?? 1500

  const prices = [
    { market: 'Local Mandi A', price: Math.round(base * 0.98) },
    { market: 'District Mandi', price: Math.round(base) },
    { market: 'State Market Hub', price: Math.round(base * 1.02) },
  ]

  return NextResponse.json({ source: 'mock', crop, prices, timestamp: new Date().toISOString() })
}
