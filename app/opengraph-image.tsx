import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export const alt = 'JKN Cosmetic Surgery — Dr. Nia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const imgData = await readFile(join(process.cwd(), 'public/dr-nia-portrait.png'))
  const base64 = `data:image/png;base64,${imgData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#1c1917',
          fontFamily: 'serif',
        }}
      >
        {/* Doctor photo — left side */}
        <img
          src={base64}
          style={{
            width: 420,
            height: 630,
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />

        {/* Right side — text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 72px',
            flex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              JKN COSMETIC SURGERY
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#fff', fontSize: 52, fontWeight: 400, lineHeight: 1.1 }}>
              Dr. Nia
            </span>
            <span style={{ color: '#fff', fontSize: 52, fontWeight: 400, lineHeight: 1.1 }}>
              Hamdy, MD
            </span>
          </div>

          <div style={{ width: 48, height: 0.5, background: 'rgba(255,255,255,0.3)', margin: '32px 0' }} />

          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, fontFamily: 'sans-serif', fontWeight: 300, lineHeight: 1.6 }}>
            Cosmetic Surgery.{'\n'}Artistry. Precision. Confidence.
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
