import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { projects as fallbackProjects } from "../data/projects";
import { supabase } from "../lib/supabase";
import ProjectCard from "./ProjectCard";

function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("number", { ascending: true });

      if (data && data.length) {
        setProjects(data);
      }
    }

    loadProjects();
  }, []);

  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="section-label">01 / Selected Work</span>
            <h2>
              Projects built around
              <span> real problems.</span>
            </h2>
          </div>

          <p>
            A growing collection of software concepts and systems focused on
            making everyday processes simpler, faster and more organized.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id || project.number} project={project} />
          ))}
        </div>

        <div className="section-bottom-cta">
          <span>Have a problem that needs a software solution?</span>
          <a href="#contact">
            Start a conversation
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Projects;
