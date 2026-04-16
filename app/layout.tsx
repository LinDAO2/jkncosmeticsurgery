import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JKN Cosmetic Surgery',
  description: 'Board-certified cosmetic surgery. Artistry. Precision. Confidence.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Display:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
