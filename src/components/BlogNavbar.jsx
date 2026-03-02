import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function BlogNavbar({ lang }) {
  const [dark, setDark] = useState(false);

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
    <div className="blog-header">
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
  );
}
