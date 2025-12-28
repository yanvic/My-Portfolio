import { translations } from "../translate";
import "./Hero.css";

const TOTAL = 200;

export default function Hero({
  lang = "en",
  dark = false,
}) {
  const t = translations[lang];

  return (
    <section className="hero" data-theme={dark ? "dark" : "light"}>
      <div className="wrap">
      {Array.from({ length: TOTAL }).map((_, i) => {
  const size = Math.random() * 40 + 10;
  const x = Math.random() * 1000 - 500;
  const y = Math.random() * 1000 - 500;
  const z = Math.random() * 2000 - 1000;
  const rotate = Math.random() * 360;

  return (
    <div
      className="tri"
      key={i}
      style={{
        "--size": `${size}px`,
        "--x": `${x}px`,
        "--y": `${y}px`,
        "--z": `${z}px`,
        "--r": `${rotate}deg`,
        "--d": `${i * -0.05}s`,
      }}
    />
  );
})}

      </div>

      <div className="hero-content">
        <h1>{t.hello}</h1>
        <p>{t.presentation}</p>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-btn"
        >
          {t.button_projects}
        </a>
      </div>
    </section>
  );
}
