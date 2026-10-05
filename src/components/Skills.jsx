import { Terminal, Database, Server, Wrench } from "lucide-react";
import { skillGroups } from "../data/skills";

const icons = {
  Frontend: Terminal,
  Backend: Server,
  Database,
  Tools: Wrench,
};

function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-label">03 / Technology</span>
          <h2>
            Tools I use to
            <span> build solutions.</span>
          </h2>
          <p>
            A practical technology stack focused on building modern,
            maintainable and scalable software.
          </p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group) => {
            const Icon = icons[group.title];

            return (
              <div className="skill-card" key={group.title}>
                <div className="skill-icon">
                  <Icon size={21} />
                </div>

                <h3>{group.title}</h3>

                <div className="skill-tags">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;
