import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Splits text into chunks ≤200 chars at sentence boundaries
function splitText(text: string, maxLen = 190): string[] {
  if (text.length <= maxLen) return [text]
  const chunks: string[] = []
  let current = ''
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if ((current + sentence).length > maxLen) {
      if (current) chunks.push(current.trim())
      current = sentence
    } else {
      current += (current ? ' ' : '') + sentence
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text') || ''
  if (!text) return NextResponse.json({ error: 'no text' }, { status: 400 })

  const chunks = splitText(text)

  // Fetch all chunks and concatenate MP3 buffers
  const buffers: ArrayBuffer[] = []
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=ka&client=tw-ob&ttsspeed=0.9`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    })
    if (!res.ok) continue
    buffers.push(await res.arrayBuffer())
  }

  if (!buffers.length) return NextResponse.json({ error: 'tts failed' }, { status: 502 })

  const total = buffers.reduce((s, b) => s + b.byteLength, 0)
  const merged = new Uint8Array(total)
  let offset = 0
  for (const buf of buffers) {
    merged.set(new Uint8Array(buf), offset)
    offset += buf.byteLength
  }

  return new Response(merged, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
