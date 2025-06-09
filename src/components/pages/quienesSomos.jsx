import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../../assets/css/QuienesSomos.css'; // Asegúrate de crear este archivo para los estilos

const QuienSomos = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4 title">¿Quiénes Somos?</h1>
      <Row className="mb-5">
        <Col md={12}>
          <Card className="text-center shadow">
            <Card.Body>
              <h2 className="mb-3">La Primera Empresa de Alquiler de Maleteros de Techo</h2>
              <p className="lead">
                Fundada en 2011, Alquilo Cofres se ha convertido en la primera empresa dedicada exclusivamente
                al servicio de alquiler de maleteros de techo.
              </p>
              <Button variant="primary" href="/contactar-alquiler-de-cofres" className="mt-3">Contáctanos</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h3 className="mb-3">Un Negocio Familiar</h3>
              <p>
                Somos un pequeño negocio familiar que entiende las necesidades de los viajeros. Nacimos debido a la creciente demanda de los viajeros que necesitan transportar objetos voluminosos y la falta de espacio de los habitantes de las ciudades para almacenar un maletero de techo, el cual, en muchas ocasiones, queda sin uso durante todo el año, ocupando un espacio valioso.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h3 className="mb-3">Adaptación a las Necesidades del Cliente</h3>
              <p>
                En Alquilo Cofres, nos adaptamos a la necesidad de nuestros clientes no solo ofreciendo maleteros de techo en alquiler, sino también el servicio de montaje de barras de techo. Esto asegura que nuestros maleteros sean compatibles con la gran mayoría de coches del mercado, facilitando así el transporte de objetos sin complicaciones.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h3 className="mb-3">Compromiso con la Calidad</h3>
              <p>
                Nos comprometemos a ofrecer productos de alta calidad y un servicio excepcional, asegurando que cada cliente se sienta satisfecho y bien atendido. Nuestra misión es hacer que tu experiencia de viaje sea más fácil y cómoda, permitiéndote disfrutar de tus aventuras sin preocupaciones.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h3 className="mb-3">Contáctanos</h3>
              <p>
                Si deseas más información sobre nuestros servicios o tienes alguna pregunta, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte.
              </p>
              <Button variant="primary" href="/contactar-alquiler-de-cofres">Más Información</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuienSomos;
