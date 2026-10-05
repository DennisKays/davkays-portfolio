import { ArrowUpRight, Layers3 } from "lucide-react";

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className="project-number">{project.number}</span>
        <span className="project-status">{project.status}</span>
      </div>

      <div className="project-icon">
        <Layers3 size={23} />
      </div>

      <span className="project-category">{project.category}</span>

      <h3>{project.title}</h3>

      <p>{project.description}</p>

      <div className="technology-list">
        {project.technologies.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>

      <div className="project-actions">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            View Project
            <ArrowUpRight size={17} />
          </a>
        )}

        <a href="#contact" className="project-link">
          Discuss a similar project
          <ArrowUpRight size={17} />
        </a>
      </div>
    </article>
  );
}

export default ProjectCard;
