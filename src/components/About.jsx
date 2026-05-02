import "../styles/about.css";

import reactLogo from "../assets/techs/react.avif";
import goLogo from "../assets/techs/go.avif";
import jsLogo from "../assets/techs/javascript.avif";
import tsLogo from "../assets/techs/typescript.avif";
import rustLogo from "../assets/techs/rust.avif";
import dockerLogo from "../assets/techs/docker.avif";
import mongoLogo from "../assets/techs/mongodb.avif";
import pgLogo from "../assets/techs/postgresql.avif";
import linuxLogo from "../assets/techs/linux.avif";
import nodeLogo from "../assets/techs/nodejs.avif";
import flutterLogo from "../assets/techs/flutter.avif";
import awsLogo from "../assets/techs/aws.avif";

const techs = [
  { name: "React", logo: reactLogo },
  { name: "Go", logo: goLogo },
  { name: "Javascript", logo: jsLogo },
  { name: "Typescript", logo: tsLogo },
  { name: "Rust", logo: rustLogo },
  { name: "Docker", logo: dockerLogo },
  { name: "MongoDB", logo: mongoLogo },
  { name: "PostgreSQL", logo: pgLogo },
  { name: "Linux", logo: linuxLogo },
  { name: "NodeJs", logo: nodeLogo },
  { name: "Flutter", logo: flutterLogo },
  { name: "Aws", logo: awsLogo },
];

export default function About({t}) {
  const items = [...techs, ...techs];

  return (
    <div className="slider">
      <div className="slide-track">
        {items.map((tech, index) => (
          <div className="slide" key={index}>
            <div className="tech-card" data-name={tech.name}>
              <img src={tech.logo.src ?? tech.logo} alt={tech.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
