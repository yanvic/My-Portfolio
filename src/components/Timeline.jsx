import "../styles/timeline.css";

const data = [
  {
    year: "2022",
    title: "Estágio",
    desc: "Primeiros passos no mundo do código, descobrindo a lógica por trás das aplicações.",
    tech: ["Flutter", "Go", "Vue.js", "Postgres"],
  },
  {
    year: "2024",
    title: "Júnior",
    desc: "Aprendizado contínuo, conhecendo novos projetos e consolidando as tecnologias.",
    tech: ["Rust", "HTML", "CSS", "JS", "Python"],
  },
  {
    year: "2025",
    title: "Freelancer",
    desc: "Projetos variados, contato direto com clientes e responsabilidade total sobre as entregas.",
    tech: ["Rust", "JS", "Python", "n8n"],
  },
  {
    year: "2026",
    title: "Pleno",
    desc: "Novos desafios, maior responsabilidade técnica e participação em decisões de arquitetura.",
    tech: ["Node", "Flutter", "SQL Server", "Typescript"],
  },
];

export default function Timeline({ t }) {
  return (
    <section className="timeline">
      <svg
        className="timeline-line"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 50 L 100 50"
          pathLength="1"
        />
      </svg>

      {data.map((item, i) => (
        <div className={`point p${i + 1}`} key={i}>
          <span className="dot" />

          <div className="card">
            <small>{item.year}</small>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>

            <div className="badges">
              {item.tech.map((t, idx) => (
                <span key={idx}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
