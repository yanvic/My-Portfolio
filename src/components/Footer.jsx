import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__overlay"></div>

      <div className="footer__content">
        <div className="text-center">
          <h3 className="footer__title">
            <span className="text">Pronto para o Próximo Projeto?</span>
          </h3>

          <p className="footer__description">
            <span className="text">
              Vamos criar algo incrível juntos. Estou sempre em busca de novos desafios e oportunidades empolgantes.
            </span>
          </p>

          <div className="footer__socials">
            <a href="#" className="social-btn"><i className="fab fa-github"></i></a>
            <a href="#" className="social-btn"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="social-btn"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-btn"><i className="fas fa-envelope"></i></a>
          </div>

          <div className="footer__bottom">
            <p>
              © 2026 Yan Silva •
              <span className="text"> Desenvolvido por Yan Silva</span>
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
