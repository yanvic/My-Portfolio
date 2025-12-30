import React from "react";
import { translations } from "../translate.js";
import "../styles/projects.css";

  export default function ProjectCard({ title, desc, image, link, lang = "en"  }) {
    const t = translations[lang] || translations["en"];
    return (
      <article className="project-card">
      <div
        className="thumb"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1498050108023-c5249f4df085)"
        }}
      />
      <div className="info">
        <h2>Projeto Test</h2>
        <p>
          Este projeto é para uso de senhas e etc. Exemplofkdfkadsfjbsdj
          fbsdbfjbsdkjfdfjbjdsbbsdjbfbd
          sajkfbsdjkbfjasbjfbasjkdbfbasjkdbfjsabkdjkfbsbfjksbadl.
        </p>
        <a href={link} target="_blank">View project</a>
      </div>
    </article>    
    );
  }
  


  