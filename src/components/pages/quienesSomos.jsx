import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../../assets/css/QuienesSomos.css';
import { BsBoxArrowInRight } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { scrollOrNavigate } from '../../extra/scrollOrNavigate';

const QuienSomos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReserveClick = () => {
    scrollOrNavigate(location, navigate);
  };

  return (
    <>
      <Container className="mt-5 fade-in">
        <h1 className="text-center mb-5 display-4 fw-bold text-primary">¿Quiénes Somos?</h1>

        <Row className="mb-5 justify-content-center">
          <Col md={10}>
            <Card className="shadow-lg p-4 rounded-4 border-0 bg-light text-center">
              <Card.Body>
                <h2 className="mb-3 text-secondary">La Primera Empresa de Alquiler de Maleteros de Techo</h2>
                <p className="lead fs-5 text-dark">
                  Fundada en 2011, <strong>Alquilo Cofres</strong> es la primera empresa dedicada exclusivamente al alquiler de maleteros de techo en Mataró y Barcelona.
                  Nuestra misión es facilitar el transporte y almacenamiento para viajeros y ciudadanos, con soluciones prácticas y accesibles.
                </p>
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleReserveClick}
                  className="mt-4"
                >
                  Reservar ahora <BsBoxArrowInRight className="ms-2" />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 shadow-sm p-3 border-0 fade-in">
              <Card.Body>
                <h3 className="mb-3 text-info">Un Negocio Familiar</h3>
                <p>
                  Entendemos las necesidades reales de los viajeros y vecinos. Nacimos por la demanda de transporte voluminoso y la falta de espacio para guardar cofres, ofreciendo así una solución que ahorra tiempo y espacio.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm p-3 border-0 fade-in">
              <Card.Body>
                <h3 className="mb-3 text-info">Adaptación a tus Necesidades</h3>
                <p>
                  Además de alquilar cofres, ofrecemos montaje de barras de techo compatibles con la mayoría de vehículos, garantizando un transporte seguro y cómodo sin complicaciones.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm p-3 border-0 fade-in">
              <Card.Body>
                <h3 className="mb-3 text-info">Compromiso con la Calidad</h3>
                <p>
                  Productos de alta calidad y atención personalizada para que tu experiencia sea siempre satisfactoria. Queremos que disfrutes cada viaje con total tranquilidad.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm p-3 border-0 fade-in">
              <Card.Body>
                <h3 className="mb-3 text-info">Contáctanos</h3>
                <p>
                  ¿Tienes dudas o necesitas más información? Estamos a tu disposición para ayudarte. Contáctanos y resolveremos todas tus preguntas.
                </p>
                <button className="fixed-cta-mobile" href="/contactar-alquiler-de-cofres">
                  Más Información
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Botón fijo solo visible en móviles */}
      <div className="fixed-cta-mobile">
        <Button
          variant="success"
          size="lg"
          onClick={handleReserveClick}
          className="w-100"
        >
          📦 Alquila tu cofre
        </Button>
      </div>
    </>
  );
};

export default QuienSomos;
