import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import MainContent from "./Main.jsx";
import Projects from "./Projects.jsx";

export default function Page() {
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <>
      <Navbar lang={lang} setLang={setLang} dark={dark} setDark={setDark} />
      <Hero lang={lang} setLang={setLang} dark={dark} setDark={setDark} />
      <Projects lang={lang} setLang={setLang} dark={dark} setDark={setDark} />
      <MainContent lang={lang} />
    </>
  );
}
