import { useEffect, useState } from "react";
import { translations } from "../i18n/translate.js";
import "../styles/navbar.css";

export default function Navbar({ lang }) {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const t = translations[lang] || translations.en;

  // Theme management
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

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    const sections = ['home', 'projects', 'about', 'blog'];

    // Criar múltiplos thresholds para melhor detecção
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      rootMargin: '-80px 0px -20% 0px'
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Encontrar a seção mais visível
        let maxRatio = 0;
        let mostVisibleSection = null;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        if (mostVisibleSection && maxRatio > 0.1) {
          setActiveSection(mostVisibleSection);
        }
      },
      observerOptions
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="header">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <ul className="navbar-list">
          <li>
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className={activeSection === 'home' ? 'active' : ''}
            >
              {t.nav.home}
            </a>
          </li>
          <li>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, 'projects')}
              className={activeSection === 'projects' ? 'active' : ''}
            >
              {t.nav.projects}
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className={activeSection === 'about' ? 'active' : ''}
            >
              {t.nav.about}
            </a>
          </li>
          <li>
            <a
              href="#blog"
              onClick={(e) => handleNavClick(e, 'blog')}
              className={activeSection === 'blog' ? 'active' : ''}
            >
              {t.nav.blog}
            </a>
          </li>
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
