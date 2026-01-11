import "../styles/timeline.css";

const data = [
  {
    year: "2021",
    title: "Início",
    desc: "Primeiro contato com programação, lógica e web.",
    tech: ["HTML", "CSS", "JS"],
  },
  {
    year: "2022",
    title: "Estágio",
    desc: "React, componentes, estado e UI.",
    tech: ["React", "UI"],
  },
  {
    year: "2024",
    title: "Freelancer",
    desc: "Back-end, bancos e deploy.",
    tech: ["Node", "Mongo", "Docker"],
  },
  {
    year: "2025",
    title: "Full Stack",
    desc: "Back-end, bancos e deploy.",
    tech: ["Node", "Mongo", "Docker"],
  },
];

export default function Timeline({ t }) {
  return (
    <section className="timeline">
      <svg
        className="timeline-line"
        viewBox="0 0 600 300"
        preserveAspectRatio="none"
      >
        <path
          d="
            M 20 150
            C 140 60, 240 240, 340 150
            S 460 60, 580 150
          "
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
