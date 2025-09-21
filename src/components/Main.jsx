import React from "react";
import { translations } from "/Users/mac/Portfolio/src/translate.js";

export default function MainContent({ lang = "en" }) {
    const t = translations[lang] || translations["en"];
  
    return (
      <main className="pt-20 max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold">{t.welcome}</h1>
        <p className="mt-4 text-lg">{t.description}</p>
      </main>
    );
  }
  