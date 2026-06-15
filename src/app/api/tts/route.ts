import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text') || ''
  if (!text) return NextResponse.json({ error: 'no text' }, { status: 400 })

  const key = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION || 'eastus'

  if (!key) {
    return NextResponse.json({ error: 'AZURE_SPEECH_KEY not configured' }, { status: 503 })
  }

  const ssml = `
<speak version='1.0' xml:lang='ka-GE'>
  <voice xml:lang='ka-GE' xml:gender='Female' name='ka-GE-EkaNeural'>
    <prosody rate='-5%' pitch='0%'>
      ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </prosody>
  </voice>
</speak>`

  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
        'User-Agent': 'codeup-ge',
      },
      body: ssml,
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('Azure TTS error:', res.status, err)
    return NextResponse.json({ error: 'tts failed', detail: err }, { status: 502 })
  }

  const audio = await res.arrayBuffer()
  return new Response(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
