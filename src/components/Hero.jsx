import { ArrowRight, Code2, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero-grid" />

      <div className="container hero-inner">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" />
            DavKays Softwares
            <span className="eyebrow-divider" />
            Software Developer
          </div>

          <h1>
            Building software
            <span> that solves</span>
            <br />
            real problems.
          </h1>

          <p className="hero-description">
            I design and develop practical digital solutions for businesses,
            schools and organizations — turning real-world challenges into
            usable software.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="button button-primary">
              Explore Projects
              <ArrowRight size={18} />
            </a>

            <a href="#contact" className="button button-secondary">
              Let&apos;s Work Together
            </a>
          </div>

          <div className="hero-meta">
            <div>
              <Code2 size={18} />
              <span>Software Development</span>
            </div>
            <div>
              <Sparkles size={18} />
              <span>Built for real-world impact</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-grid" />

          <div className="orb-ring ring-one" />
          <div className="orb-ring ring-two" />
          <div className="orb-ring ring-three" />

          <div className="dk-orb">
            <div className="orb-glow" />
            <span>DK</span>
            <small>SOFTWARES</small>
          </div>

          <div className="floating-card floating-card-top">
            <span>01</span>
            <strong>Build</strong>
            <small>Ideas → Systems</small>
          </div>

          <div className="floating-card floating-card-bottom">
            <span className="pulse-line" />
            <strong>Digital Solutions</strong>
            <small>Designed to scale</small>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span />
        Scroll to explore
      </div>
    </section>
  );
}

export default Hero;
