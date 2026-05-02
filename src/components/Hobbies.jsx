import { useState, useEffect } from "react";
import "../styles/hobbies.css";

import photo1 from "../assets/hobbies/photo1.avif";
import photo2 from "../assets/hobbies/photo2.avif";
import photo3 from "../assets/hobbies/photo3.avif";
import photo4 from "../assets/hobbies/photo4.avif";
import photo5 from "../assets/hobbies/photo5.avif";
import photo6 from "../assets/hobbies/photo6.avif";
import photo7 from "../assets/hobbies/photo7.avif";
import photo8 from "../assets/hobbies/photo8.avif";

const allPhotos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8];
const PAGE_SIZE = 4;
const totalPages = Math.ceil(allPhotos.length / PAGE_SIZE);

export default function Hobbies({ t }) {
  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);

  const title = t?.hobbiesTitle || "Além do Código";

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setPage((p) => (p + 1) % totalPages);
        setFading(false);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentPhotos = allPhotos.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="personal">
      <h3 className="personal-heading">
        <span className="personal-heading-icon">
          <i className="fa-solid fa-star" />
        </span>
        {title}
      </h3>

      <div className={`photo-grid ${fading ? "fading" : ""}`}>
        {currentPhotos.map((src, i) => (
          <div key={page * PAGE_SIZE + i} className="photo-cell">
            <img src={src.src ?? src} alt="" />
          </div>
        ))}
      </div>

      <div className="photo-nav-dots">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`photo-dot ${i === page ? "active" : ""}`}
            onClick={() => setPage(i)}
            aria-label={`Página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
