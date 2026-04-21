import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JKN Cosmetic Surgery',
  description: 'Cosmetic surgery. Artistry. Precision. Confidence.',
  openGraph: {
    title: 'JKN Cosmetic Surgery',
    description: 'Cosmetic surgery. Artistry. Precision. Confidence.',
    url: 'https://jkncosmeticsurgery.com',
    siteName: 'JKN Cosmetic Surgery',
    images: [{ url: 'https://jkncosmeticsurgery.com/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JKN Cosmetic Surgery',
    description: 'Cosmetic surgery. Artistry. Precision. Confidence.',
    images: ['https://jkncosmeticsurgery.com/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Montserrat:wght@300;400;500&family=Inter:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
