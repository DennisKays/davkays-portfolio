import { CheckCircle2 } from "lucide-react";

const principles = [
  "Understand the problem before building the solution.",
  "Keep systems simple enough for real people to use.",
  "Build modularly so software can grow with the client.",
  "Focus on practical business value, not unnecessary complexity.",
];

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container about-grid">
        <div className="about-heading">
          <span className="section-label">02 / About</span>
          <h2>
            Technology should
            <span> make things better.</span>
          </h2>

          <div className="about-orbit">
            <div className="about-orbit-core">DK</div>
            <div className="about-orbit-line orbit-a" />
            <div className="about-orbit-line orbit-b" />
          </div>
        </div>

        <div className="about-content">
          <p className="about-lead">
            I&apos;m David Kanyurira, the developer behind DavKays Softwares.
            I&apos;m focused on creating software that solves practical
            problems for real organizations.
          </p>

          <p>
            My approach is straightforward: understand how people currently
            work, identify where technology can improve the process, and build
            a solution that is useful, maintainable and ready to grow.
          </p>

          <div className="principles">
            {principles.map((principle) => (
              <div className="principle" key={principle}>
                <CheckCircle2 size={19} />
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
