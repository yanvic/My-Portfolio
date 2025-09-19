import React, { useState } from "react";
import { translations } from "../translate";
import "./Navbar.css";

export default function Navbar({
  lang = 'en',
  setLang = () => {},
  dark = false,
  setDark = () => {},
}) {

  const t = translations[lang];

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><a href="#home">{t.home}</a></li>
        <li><a href="#projects">{t.projects}</a></li>
        <li><a href="#about">{t.about}</a></li>
        <li><a href="#blog">{t.blog}</a></li>
      </ul>

      <div className="navbar-actions">
        <button onClick={() => setDark(!dark)}>
          {dark ? "🌞" : "🌙"}
        </button>

        <button onClick={() => setLang(lang === "en" ? "pt" : "en")}>
          {lang === "en" ? "🇺🇸" : "🇧🇷"}
        </button>
      </div>
    </nav>
  );
}
