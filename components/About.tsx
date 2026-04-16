import Image from 'next/image'
import type { Doctor } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

export default function About({ doctor }: { doctor: Doctor }) {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__image-col">
          <div className="about__photo-wrap">
            <Image
              src={urlFor(doctor.photo).width(560).height(700).url()}
              alt={doctor.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="about__content-col">
          <p className="section-label">Meet the Doctor</p>
          <h2 className="about__name">{doctor.name}</h2>
          <p className="about__title">{doctor.title}</p>

          {doctor.bio.map((para, i) => (
            <p key={i} className="about__bio-para">{para}</p>
          ))}

          {doctor.credentials.length > 0 && (
            <div className="about__credentials">
              <p className="about__cred-heading">Education &amp; Training</p>
              <ul>
                {doctor.credentials.map((c, i) => (
                  <li key={i}>
                    <span>{c.institution}</span>
                    {c.year && <span className="about__cred-year"> · {c.year}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {doctor.expertiseTags.length > 0 && (
            <div className="about__tags">
              {doctor.expertiseTags.map((tag) => (
                <span key={tag} className="about__tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
