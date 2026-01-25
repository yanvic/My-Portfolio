import { useEffect, useState } from "react";
import "../styles/hobbies.css";

const PROFILE = {
  name: "Yanvic",
  avatar: "src/assets/hobbies/profile.avif",
};

const images = [
  "src/assets/hobbies/photo3.avif",
  "src/assets/hobbies/photo4.avif",
  "src/assets/hobbies/photo5.avif",
  "src/assets/hobbies/photo6.avif",
  "src/assets/hobbies/photo7.avif",
];

export default function Hobbies({ t }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <article className="instagram">
      <header className="instagram__header">
        <figure>
          <img src={PROFILE.avatar} alt="perfil" />
          <figcaption>
            <h4 className="user">{PROFILE.name}</h4>
          </figcaption>
        </figure>
      </header>

      <section className="instagram__media">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={i === index ? "active" : ""}
          />
        ))}
      </section>

      <footer className="instagram__buttons">
        <div className="left">
          <span className="icon"><i className="fa-solid fa-heart"></i></span>
          <span className="icon"><i className="fa-regular fa-comment"></i></span>
          <span className="icon"><i className="fa-regular fa-paper-plane"></i></span>
        </div>
        <div className="right">
          <span className="icon"><i className="fa-regular fa-bookmark"></i></span>
        </div>
      </footer>
    </article>
  );
}
