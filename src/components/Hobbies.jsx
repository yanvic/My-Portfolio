import { useEffect, useState } from "react";
import "../styles/hobbies.css";

const images = [
  "https://images.unsplash.com/photo-1542668340-9387e6981c5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMGltYWdlcyUyMGhvYmJpZXN8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1686255006386-5f58b00ffe9d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnVuZG98ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1515504846179-94ac6b34ebb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlbWF8ZW58MHx8MHx8fDA%3D",
];

export default function Hobbies() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <aside className="carousel">
        <div className="carousel__wrapper">
          {images.map((src, i) => (
            <div
              key={i}
              className={`item ${i === index ? "active" : ""}`}
            >
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </aside>

      <article className="instagram">
          <header className="instagram__header">
            <figure>
              <img
                src="https://images.unsplash.com/photo-1515504846179-94ac6b34ebb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlbWF8ZW58MHx8MHx8fDA%3D"
                alt="perfil"
                width="42"
                height="42"
              />
              <figcaption>
                <h4 className="user">Yanvic</h4>
              </figcaption>
            </figure>
          </header>
  
          <section className="instagram__media">
            <div className="img" />
          </section>
  
          <footer className="instagram__buttons">
            <div className="left">
              <span className="icon"><i class="fa-solid fa-heart"></i></span>
              <span className="icon"><i class="fa-regular fa-comment"></i></span>
              <span className="icon"><i class="fa-regular fa-paper-plane"></i></span>
            </div>
            <div className="right">
              <span className="icon"><i class="fa-regular fa-bookmark"></i></span>
            </div>
          </footer>
        </article>
    </div>
  );
}
