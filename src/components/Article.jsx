import "../styles/article.css";

export default function ArticleCard({
  date = "15 JAN 24",
  tag = "Arquitetura",
  title = "Microserviços na Prática",
  desc = "Como implementar uma arquitetura de microserviços que realmente escala e funciona em produção.",
  readTime = "8 min",
  views = "2.4k",
  delay = "0.1s",
}) {
  return (
    <article className="article-card fade-in-up" style={{ animationDelay: delay }}>
      <div className="card-glow" />

      <div className="card-inner">
        <span className="side-bar" />

        <div className="card-content">
          <header className="card-header">
            <div className="icon-box">
              <i className="fas fa-code" />
            </div>
            <span className="card-date">{date}</span>
          </header>

          <span className="card-tag">{tag}</span>

          <h3 className="card-title">{title}</h3>

          <p className="card-desc">{desc}</p>

          <footer className="card-footer">
            <div className="stats">
              <span><i className="far fa-clock" /> {readTime}</span>
              <span><i className="far fa-eye" /> {views}</span>
            </div>

            <button className="read-btn">
              Ler <i className="fas fa-arrow-right" />
            </button>
          </footer>
        </div>
      </div>
    </article>
  );
}
