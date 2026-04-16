import type { Service } from '@/lib/types'

export default function Services({ services }: { services: Service[] }) {
  return (
    <section className="services" id="services">
      <div className="services__inner">
        <p className="section-label">Services</p>
        <h2 className="services__heading">Procedures & Treatments</h2>
        <div className="services__grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <h3 className="service-card__name">{service.name}</h3>
              <p className="service-card__desc">{service.description}</p>
              {service.price && (
                <p className="service-card__price">{service.price}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
