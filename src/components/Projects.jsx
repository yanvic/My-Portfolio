import { translations } from "../translate.js";
import "../styles/projects.css";

export default function Projects({ lang = "en" }) {
  const t = translations[lang] || translations["pt"];
  const projects = Array.isArray(t.projects_card ) ? t.projects_card : [];

  return (
    <div className="projects-container">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          image={project.image}
          link={project.link}
          desc={project.desc}
          view={t.viewProject}
        />
      ))}
    </div>
  );
}

function ProjectCard({ title, desc, image, link, view }) {
  return (
    <article className="project-card">
    <div
      className="thumb"
      style={{
        backgroundImage: `url(${image})`
      }}
    />
    <div className="info">
      <h3 className="title">{title}</h3>
      <p>{desc}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        {view}
      </a>
    </div>
  </article>
  );
}