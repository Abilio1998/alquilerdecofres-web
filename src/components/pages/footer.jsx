import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../assets/css/Footer.css'; // Asegúrate de crear este archivo para los estilos
import logo from '../../assets/img/logo.jpg'; // Asegúrate de que la ruta sea correcta
import facebook from '../../assets/img/facebook.png'; // Asegúrate de que la ruta sea correcta
import instagram from '../../assets/img/instagram.png'; // Asegúrate de que la ruta sea correcta

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light mt-5">
      <Container>
        <Row className="py-4">
          <Col md={4}>
            <h5>Redes Sociales</h5>
            <ul className="list-unstyled">
              <li className="social-icon">
                <a href="https://www.instagram.com/alquilerdecofres" target="_blank" rel="noopener noreferrer" className="text-light">
                  <img src={instagram} alt="Instagram" className="social-logo" /> alquilerdecofres
                </a>
              </li>
              <li className="social-icon">
                <a href="https://www.facebook.com/alquilocofres" target="_blank" rel="noopener noreferrer" className="text-light">
                  <img src={facebook} alt="Facebook" className="social-logo" /> alquilocofres
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contáctanos</h5>
            <p>Amílcar 79, 08031 - Barcelona</p>
            <p>(+34) 690 691 834</p>
            <p>(+34) 747 440 342</p>
            <p><a href="mailto:alquilocofres@gmail.com" className="text-light">alquilocofres@gmail.com</a></p>
          </Col>
          <Col md={4} className="text-center">
            <img src={logo} alt="Logo Alquilo Cofres" className="logo" />
            <h5>Alquiler de Cofres</h5>
            <p>
              La primera empresa dedicada exclusivamente al servicio de alquiler de maleteros de techos.
            </p>
            <p>
              Con el único objetivo de hacer que vuestros viajes sean más confortables desde el primer momento.
            </p>
          </Col>
        </Row>
      </Container>
      <div className="text-center py-3" style={{ backgroundColor: '#333' }}>
        <p className="mb-0">© 2024 Alquilo Cofres. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
