import React from 'react';
import { Card, ListGroup, Row, Col, Image, Button, CardText } from 'react-bootstrap';
import { useLocation, useNavigate  } from 'react-router-dom';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Inicializa el hook useNavigate
    const {
        personalInfo,
        city,
        deliveryDate,
        returnCity,
        returnDate,
        referenceNumber,
        totalCost,
        insuranceCost,
        extraCost,
        productImage,
        Nameproduct,
    } = location.state || {}; // Asegúrate de manejar el caso donde no hay state

    // Comprobación adicional para asegurarse de que hay datos
    if (!personalInfo || !city || !deliveryDate || !returnCity || !returnDate || !Nameproduct) {
        return <div>Cargando datos de pago...</div>; // Puedes personalizar esto
    }
     // Función para manejar el clic en el botón "Salir"
     const handleExit = () => {
      navigate('/'); // Cambia '/' a la ruta a la que deseas que redirija
  };


    return (
        <Card className="my-4 shadow">
            <Row>
            <Col md={4} className="d-flex align-items-center">
                {productImage && (
                    <Image 
                        src={productImage} 
                        fluid 
                        className="rounded-start mx-3" // Agrega margen a los lados
                        style={{ maxHeight: '200px', objectFit: 'contain' }} 
                    />
                )}
            </Col>



                <Col md={8}>
                    <Card.Body>
                        <Card.Title className="text-center">Modelo </Card.Title>
                        <CardText className="text-center"> <strong>Nº Ref:</strong> {referenceNumber}</CardText>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Ciudad de Entrega:</strong> {city} <br />
                                <strong>Fecha de Entrega:</strong> {deliveryDate}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Ciudad de Devolución:</strong> {returnCity} <br />
                                <strong>Fecha de Devolución:</strong> {returnDate}
                            </ListGroup.Item>
                            {insuranceCost !== undefined && (
                                <ListGroup.Item>
                                    <strong>Costo del Seguro:</strong> €{insuranceCost.toFixed(2)}
                                </ListGroup.Item>
                            )}
                            {extraCost != null && ( // Esto mostrará el costo si es 0 o cualquier otro valor
                              <ListGroup.Item>
                                  <strong>Costo Extra:</strong> €{extraCost.toFixed(2)}
                              </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <h3><strong style={{fontSize:'1.2rem'}}>Costo Total:</strong> <strong style={{color:'darkred'}}>€{totalCost.toFixed(2)}</strong></h3>
                            </ListGroup.Item>
                        </ListGroup>
                        <div className="text-center mt-3">
                            <Button variant="dark" onClick={handleExit}>
                                Salir
                            </Button>
                        </div>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default Payment;
