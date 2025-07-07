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
        <h1 className="text-center mb-5 display-5 fw-bold text-dark"> ¿Quiénes Somos? | Alquiler de Cofres de Techo en Barcelona y Mataró</h1>


        <Row className="mb-5 justify-content-center">
          <Col md={10}>
            <Card className="shadow-lg p-4 rounded-4 border-0 bg-light text-center">
              <Card.Body>
                <h2 className="mb-3 text-secondary">La Primera Empresa de Alquiler de Maleteros de Techo</h2>
               <p className="lead fs-5 text-dark">
                Fundada en 2011, <strong>Alquilo Cofres</strong> es la primera empresa dedicada al alquiler de soluciones de transporte como maleteros de techo, sillitas de bebé y portabicicletas en Mataró y Barcelona.
                Nuestra misión es facilitar el transporte y almacenamiento para viajeros y ciudadanos, con soluciones prácticas, seguras y accesibles.
              </p>

                <Button
                  variant="warning"
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
                <h3 className="mb-3 text-danger">Un Negocio Familiar</h3>
                <p>
                  Entendemos las necesidades reales de los viajeros y vecinos. Nacimos por la demanda de transporte voluminoso y la falta de espacio para guardar cofres, ofreciendo así una solución que ahorra tiempo y espacio.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm p-3 border-0 fade-in">
              <Card.Body>
                <h3 className="mb-3 text-danger">Adaptación a tus Necesidades</h3>
                <p>
                  Además de alquilar cofres, ofrecemos montaje de barras de techo compatibles con la mayoría de vehículos, garantizando un transporte seguro y cómodo sin complicaciones.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm p-3 border-0 fade-in">
              <Card.Body>
                <h3 className="mb-3 text-danger">Compromiso con la Calidad</h3>
                <p>
                  Productos de alta calidad y atención personalizada para que tu experiencia sea siempre satisfactoria. Queremos que disfrutes cada viaje con total tranquilidad.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 shadow-sm p-3 border-0 fade-in">
              <Card.Body>
                <h3 className="mb-3 text-danger">Contáctanos</h3>
                <p>
                  ¿Tienes dudas o necesitas más información? Estamos a tu disposición para ayudarte. Contáctanos y resolveremos todas tus preguntas.
                </p>
               <Button
                  variant="outline-warning"
                  className="mt-4"
                  onClick={() => navigate('/contactar-alquiler-de-cofres')}
                >
                  Más Información
                </Button>

              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
          <Card className="h-100 shadow-sm p-3 border-0 fade-in">
            <Card.Body>
              <h3 className="mb-3 text-danger">Más que Cofres</h3>
              <p>
                También alquilamos sillitas de bebé homologadas y portabicicletas seguros para que viajes con comodidad, seguridad y sin limitaciones. Consulta disponibilidad y tipos de accesorios que ofrecemos.
              </p>
              <p className="mt-3 text-muted">
                Explora nuestra selección de productos de alquiler: cofres de techo, portabicicletas y sillitas de bebé disponibles en Mataró y Barcelona.
              </p>
              <Button
                variant="outline-warning"
                size="lg"
                className="mt-3"
                onClick={() => navigate('/productos')}
                aria-label="Ver productos en alquiler: cofres, portabicicletas y sillitas de bebé"
              >
                Ver todos nuestros productos de alquiler <BsBoxArrowInRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>
        </Col>


        </Row>
         <div className="text-center mt-4">
                  <Button
                    variant="warning"
                    size="lg"
                    onClick={handleReserveClick}
                  >
                    Reservar <BsBoxArrowInRight className="ms-2" />
                  </Button>
                </div>

      </Container>

      {/* Botón fijo solo visible en móviles */}
      <div className="fixed-cta-mobile">
        <Button
          variant="warning"
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
