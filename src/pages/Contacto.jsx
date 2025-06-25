import React, { useEffect }from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const Contacto = () => {

   ///Posicionar en seo
     useEffect(() => {
    document.title = "Contacta con Nosotros - Alquiler de Cofres en Barcelona";

    // Cambiar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        '¿Tienes dudas o quieres alquilar un cofre? Contáctanos y te ayudamos con el mejor servicio en Barcelona.'
      );
    } else {
      // Si no existe el meta description, crearlo
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = '¿Tienes dudas o quieres alquilar un cofre? Contáctanos y te ayudamos con el mejor servicio en Barcelona.';
      document.head.appendChild(meta);
    }
  }, []);
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{marginTop:'100px'}}>Contacto</h1>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Información de Contacto</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Dirección:</strong> Amílcar 79, 08031 - Barcelona (Parking interior)</ListGroup.Item>
              <ListGroup.Item><strong>Dirección:</strong> Cami Ral 218-220, 08301 - Mataró</ListGroup.Item>
              <ListGroup.Item><strong>Teléfono:</strong> (+34) 690 691 834</ListGroup.Item>
              <ListGroup.Item><strong>Servicio Técnico:</strong> 24/7</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Ubicación en Mataró</Card.Header>
            <Card.Body>
              <iframe
                title="Mapa de Mataró"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2930.659400757227!2d2.4459431151218146!3d41.53578787926227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a3711625576f%3A0x93e65a7e1e3f2b3a!2sCarrer%20d&#39;Enric%20Prat%20de%20la%20Riba%2C%2010%2C%2008302%20Matar%C3%B3%2C%20Barcelona%2C%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1633645938888!5m2!1ses!2ses"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacto;
