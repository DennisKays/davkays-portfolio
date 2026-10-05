import { ArrowUpRight } from "lucide-react";
import { services } from "../data/services";

function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">04 / Services</span>
            <h2>
              Software designed
              <span> around your needs.</span>
            </h2>
          </div>

          <p>
            From a small internal tool to a complete management platform,
            solutions can be developed in stages and upgraded over time.
          </p>
        </div>

        <div className="services-list">
          {services.map((service) => (
            <article className="service-row" key={service.number}>
              <span className="service-number">{service.number}</span>

              <div className="service-title">
                <h3>{service.title}</h3>
              </div>

              <p>{service.description}</p>

              <a href="#contact" aria-label={`Learn more about ${service.title}`}>
                <ArrowUpRight size={21} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
