import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const { params: pathParams } = await params
    const [width, height] = pathParams

    const w = parseInt(width) || 300
    const h = parseInt(height) || w // Make it square by default

    // Create a sports-themed SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <circle cx="50%" cy="50%" r="${Math.min(w, h) * 0.15}" fill="#d1d5db" opacity="0.3"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(w, h) * 0.08}" fill="#9ca3af" text-anchor="middle" dy=".3em">
          ⚽
        </text>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    return new NextResponse('Error generating placeholder', { status: 500 })
  }
}
