import type { SiteSettings } from '@/lib/types'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__logo">JKN Cosmetic Surgery</p>
        {settings.footerTagline && (
          <p className="footer__tagline">{settings.footerTagline}</p>
        )}
        <p className="footer__copy">
          &copy; {year} JKN Cosmetic Surgery. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
