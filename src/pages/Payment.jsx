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
        insuranceCost,
        extraCost,
        productImage,
        TotalPago,
        productImages, 
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
            

                <Col md={12}>
                    <Card.Body>
                        <Card.Title className="text-center">Modelo </Card.Title>
                        <CardText className="text-center"> <strong>Nº Ref:</strong> {referenceNumber}</CardText>
                         {/* Imagenes debajo del numero de referencia */}
                            <div className="d-flex justify-content-center flex-wrap mb-3">
                                {productImages.map((imgUrl, index) => (
                                    <Image
                                        key={index}
                                        src={imgUrl}
                                        fluid
                                        className="m-2"
                                        style={{ maxHeight: '150px', maxWidth: '150px', objectFit: 'contain' }}
                                    />
                                ))}
                            </div>
                        <ListGroup variant="flush" className="text-center">
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
                                    <strong>Costo del Seguro:</strong> €{insuranceCost}
                                </ListGroup.Item>
                            )}
                            {extraCost != null && ( // Esto mostrará el costo si es 0 o cualquier otro valor
                              <ListGroup.Item>
                                  <strong>Costo Extra:</strong> €{extraCost.toFixed(2)}
                              </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <h3><strong style={{fontSize:'1.2rem'}}>Pago de Reserva:</strong> <strong style={{color:'darkred'}}>€10</strong></h3>
                            </ListGroup.Item>
                            {/* Aquí va tu nota explicativa */}
                            <ListGroup.Item>
                                <small style={{ fontSize: '0.9rem', color: '#555' }}>
                                    El importe total a pagar en el establecimiento es de: <strong>{Number(TotalPago).toFixed(0) - 10}€ </strong>   + una fianza de <strong>100€</strong>. <br />
                                    Los <strong>10€</strong> de la reserva se han descontado del pago total.
                                </small>
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
