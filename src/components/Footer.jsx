import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__overlay"></div>

      <div className="footer__content">
        <div className="text-center">
          <h3 className="footer__title">
  <span>Pronto para o Próximo Desafio</span>
          </h3>

          <p className="footer__description">
            <span>
              Desenvolvedor focado em qualidade, performance e boas práticas, aberto a novos desafios profissionais.
            </span>
          </p>

          <div className="footer__socials">
            <a href="#" className="social-btn git"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="social-btn link"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#" className="social-btn insta"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="social-btn gmail"><i className="fas fa-envelope"></i></a>
          </div>

          <div className="footer__bottom">
            <p>
              © 2026 Yan Silva •
              <span> Desenvolvido por Yan Silva</span>
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
