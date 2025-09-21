import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import MainContent from "./Main.jsx";

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
      <MainContent lang={lang} />
    </>
  );
}
