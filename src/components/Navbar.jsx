import { useEffect, useState } from "react";
import "../styles/navbar.css";


export default function Navbar({ lang }) {
  const [dark, setDark] = useState(false);

  console.log("LANG:", lang);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDark(true);
  }, []);

  return (
    <div className="header">
      <nav className="navbar">
        <ul className="navbar-list">
          <li><a href="#home">Home</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#blog">Blog</a></li>
        </ul>
      </nav>

      <div className="navbar-actions">

      <button
  className={`theme-toggle ${dark ? "dark" : "light"}`}
  onClick={() => setDark(!dark)}
  aria-label="Toggle theme"
>
  <span className="toggle-thumb" />

  <span className="toggle-icon sun">
    <i className="fa-solid fa-sun" />
  </span>

  <span className="toggle-icon moon">
    <i className="fa-solid fa-moon" />
  </span>
</button>

  <a
    href={lang === "pt" ? "/en" : "/pt"}
    className="lang-toggle"
    aria-label="Change language"
  >
    <span className="lang-text">
      {lang === "pt" ? "EN" : "PT"}
    </span>
  </a>
</div>

    </div>
  );
}
