import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import Projects from "./Projects.jsx";
import About from "./About.jsx";
import Hobbies from "./Hobbies.jsx";
import Footer from "./Footer.jsx";

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
      <About lang={lang} setLang={setLang} dark={dark} setDark={setDark} />
      <Hobbies lang={lang} setLang={setLang} dark={dark} setDark={setDark} />
      <Footer lang={lang} setLang={setLang} dark={dark} setDark={setDark} />
    </>
  );
}
