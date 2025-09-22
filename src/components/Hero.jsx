import { translations } from "../translate";
// import "./Hero.css";


export default function Hero({
    lang = 'en',
    setLang = () => {},
    dark = false,
    setDark = () => {},
  }) {
  
    const t = translations[lang];
  
    return (
        // LAYOUT: name destacado, em baixo cargos e qualidades, em baixo texto apresentacao
        // em baixo botoes de contato email e curriculo baixar 
        // imagem avatar com animação 
    <div className="hero">
        <h1>{t.hello}</h1>
        <div class="description">
            <p>{t.presentation}</p>
        </div>
        <button onClick="www.github.com">
            {t.button_git} 
         </button>
    </div>
  
    );
  }
  