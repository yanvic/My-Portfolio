import "../styles/about.css";

const techs = [
  { name: "React", logo: "src/assets/techs/react.avif" },
  { name: "Go", logo: "src/assets/techs/go.avif" },
  { name: "Javascript", logo: "src/assets/techs/javascript.avif" },
  { name: "Typescript", logo: "src/assets/techs/typescript.avif" },
  { name: "Rust", logo: "src/assets/techs/rust.avif" },
  { name: "Docker", logo: "src/assets/techs/docker.avif" },
  { name: "MongoDB", logo: "src/assets/techs/mongodb.avif" },
  { name: "PostgreSQL", logo: "src/assets/techs/postgresql.avif" },
  { name: "Linux", logo: "src/assets/techs/linux.avif" },
  { name: "NodeJs", logo: "src/assets/techs/nodejs.avif" },
  { name: "Flutter", logo: "src/assets/techs/flutter.avif" },
  { name: "Aws", logo: "src/assets/techs/aws.avif" },
];

export default function About({ t }) {
  const items = [...techs, ...techs];

  return (
    <div className="slider">
      <div className="slide-track">
        {items.map((tech, index) => (
          <div className="slide" key={index}>
            <div className="tech-card">
              <img src={tech.logo} alt={tech.name} />
              <span>{tech.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}