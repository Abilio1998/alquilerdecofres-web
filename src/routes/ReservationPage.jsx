import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card, Toast, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import extraImage from '../assets/img/barra-coche.jpeg';
//import extraImagePortabici from '../assets/img/portabicicleta.jpg';
import { firestore } from '../firebase-config';
import { collection, query, orderBy, limit, getDocs, deleteDoc } from 'firebase/firestore';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../components/PagoStripe/stripe-config';
import CheckoutForm from '../components/PagoStripe/CheckoutForm';
import '../assets/css/ReservationPage.css';

// Función para convertir la fecha del formato dd/MM/yyyy al formato YYYY-MM-DD
const formatDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).toISOString().split('T')[0];
};

// Función para convertir la fecha del formato dd/MM/yyyy a texto largo
const formatDateToLongText = (dateStr) => {
    if (!dateStr) return '';
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const monthName = monthNames[month - 1];

    return `${dayOfWeek} ${day} de ${monthName} de ${year}`;
};

function ReservationPage() {
    const [showModal, setShowModal] = useState(false);
    const handlePaymentSuccess = () => {
        handleClose(); // Cierra el modal
    };

    const showToastNotification = (message, variant = 'success') => {
        setShowToast({
            show: true,
            message,
            variant,
        });
        setTimeout(() => setShowToast({ show: false, message: '', variant }), 5000);
    };

    const [selectedReferenceNumber, setSelectedReferenceNumber] = useState([0]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const {
        cart,
        product: initialProduct,
        city: initialCity,
        deliveryDate: initialDeliveryDate,
        deliveryTime: initialDeliveryTime,
        returnCity: initialReturnCity,
        returnDate: initialReturnDate,
        //referenceNumber: initialReturnReferenceNumber,
        roofPrice: initialRoofPrice,
        Nameproduct: initialNameProduct
        
    } = state || {};

    const [product, setProduct] = useState(initialProduct);
    const [city, setCity] = useState(initialCity);
    const [deliveryDate, setDeliveryDate] = useState(initialDeliveryDate);
    const [deliveryTime, setDeliveryTime] = useState(initialDeliveryTime);
    const [returnCity, setReturnCity] = useState(initialReturnCity);
    const [returnDate, setReturnDate] = useState(initialReturnDate);
    const [Nameproduct, setNameProduct] = useState(initialNameProduct);
    //const [referenceNumber, setReferenceNumber] = useState(initialReturnReferenceNumber || ''); // Asegúrate de que sea un string vacío si no hay referencia
    const [roofPrice, setRoofPrice] = useState(initialRoofPrice);
   // const [insuranceCost, setInsuranceCost] = useState(0);
  //  const [extraCost, setExtraCost] = useState(0);
    //const [extraCostPortabici, setExtraCostPortabici] = useState(0);
    //const [extraCostSillaBebe, setExtraCostSillaBebe] = useState(0);
    //const [TotalCost, setTotalCost] = useState(0);
    const [daysCount, setDaysCount] = useState(0);
    const [insuranceSelected, setInsuranceSelected] = useState(false);
    //const [extraSelected, setExtraSelected] = useState(false);
    //const [extraSelectedPorabici, setExtraSelectedPortabici] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [productCosts, setProductCosts] = useState([]); // Estado para almacenar costos por producto
    const [grandTotal, setGrandTotal] = useState(0); // Estado para almacenar la suma total de todos los productos

    const depositAmount = 100; // Fianza
    const reservationAmount = 10; // Parte del producto a pagar
    const totalAmountToPay = depositAmount + reservationAmount; // Total a pagar para la reserva

    // Estado para los toasts
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });


    

    const deleteLastReservation = async () => {
        try {
            const reservationsCollection = collection(firestore, 'reservations');
            const q = query(reservationsCollection, orderBy('createdAt', 'desc'), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                await deleteDoc(doc.ref);
            }
        } catch (error) {
            alert('Error eliminando la última reserva:', error);
        }
    };
    useEffect(() => {
        if (product?.referenceNumbers) {
            const referenceNumbersArray = product.referenceNumbers.split(',').map(ref => ref.trim());
            const randomNumber = referenceNumbersArray[Math.floor(Math.random() * referenceNumbersArray.length)];
            setSelectedReferenceNumber(randomNumber);
        }
    }, [product]); // Se ejecuta cuando product cambia
 
        
    useEffect(() => {
    const fetchLastReservation = async () => {
        try {
            const reservationsCollection = collection(firestore, 'reservations');
            const q = query(reservationsCollection, orderBy('createdAt', 'desc'), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();

                setProduct(data.product || initialProduct);
                setCity(data.city || initialCity);
                setDeliveryDate(data.deliveryDate || initialDeliveryDate);
                setDeliveryTime(data.deliveryTime || initialDeliveryTime);
                setReturnCity(data.returnCity || initialReturnCity);
                setReturnDate(data.returnDate || initialReturnDate);
                // Cambiar esta línea
                //setReferenceNumber(data.referenceNumber || ''); // Asegúrate de que sea un string vacío si no hay referencia
                setRoofPrice(data.roofPrice || initialRoofPrice);
                setNameProduct(data.Nameproduct || initialNameProduct);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching reservation:', error);
            navigate('/');
        }
    };

    fetchLastReservation();
}, [initialProduct, initialCity, initialDeliveryDate, initialReturnCity, initialReturnDate, initialDeliveryTime , initialRoofPrice, initialNameProduct, navigate]);


    useEffect(() => {
        if (deliveryDate && returnDate) {
            const formattedDeliveryDate = formatDateToISO(deliveryDate);
            const formattedReturnDate = formatDateToISO(returnDate);
    
            const startDate = new Date(formattedDeliveryDate);
            const endDate = new Date(formattedReturnDate);
    
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                const differenceInTime = endDate.getTime() - startDate.getTime();
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1; // Asegúrate de agregar 1 día.
                setDaysCount(differenceInDays);
            } else {
                setDaysCount(0);
            }
        }
    }, [deliveryDate, returnDate]);

    // Calcula los totales antes de renderizar
const totalInsuranceCost = cart.reduce((acc, product) => {
    const productCostData = productCosts.find(
        (cost) => cost.productId === product.identifier
    );
    return acc + (productCostData ? productCostData.insuranceCost : 0);
}, 0);
    


    useEffect(() => {
        if (cart && cart.length > 0) {
            const calculatedCosts = cart.map((product) => {
                const basePrice = parseFloat(product.pricingUnitary.replace("€", "").trim()) || 0;
                const dailyPrice = parseFloat(product.dayliPrice.replace("€", "").trim()) || 0;
    
                let totalBaseCost = 0;
                let totalDailyCost = 0;
    
                if (daysCount <= 7) {
                    totalBaseCost = basePrice;
                } else {
                    totalBaseCost = basePrice; 
                    totalDailyCost = (daysCount - 7) * dailyPrice; 
                }
    
                const insuranceTotal = insuranceSelected ? daysCount * 6 : 0; 
                const total = totalBaseCost + totalDailyCost ;
    
                return {
                    productId: product.identifier,
                    totalCost: total, 
                    insuranceCost: insuranceTotal, 
                };
            });
    
            setProductCosts(calculatedCosts); // Guarda los costos por producto
    
            // Suma el total general incluyendo roofPrice
            const totalSum = calculatedCosts.reduce((sum, item) => sum + item.totalCost, 0) + (parseFloat(roofPrice) || 0);
            setGrandTotal(totalSum); // Actualiza el estado de la suma total
    
           
        } else {
            setProductCosts([]);
            setGrandTotal(0);
        }
    }, [cart, daysCount, insuranceSelected, roofPrice]); // Asegúrate de agregar roofPrice a las dependencias
    
    
    

   

    const confirmReservation = () => {
        if (!personalInfo.name || !personalInfo.email || !personalInfo.phone) {
            showToastNotification('Por favor, completa todos los campos de información personal.', 'danger');
            return;
        }
    
        // Mostrar el modal de pago
        handleShow();
      
    };
    
        
    
    

    if (!cart || cart.length === 0) {
    return <div>No se encontraron productos en el carrito.</div>;
}
// Generar el array de costos
const productCostsString = cart.map(product => {
    const productCostData = productCosts.find(
        (cost) => cost.productId === product.identifier
    );
    const totalCostForProduct = productCostData ? productCostData.totalCost : 0;
    
    return `${totalCostForProduct}€`;
}).join(', ');

return (
    <div style={{ backgroundColor: '#F4F4F4', minHeight: '100vh', position: 'relative' }} className='body-ReservationPage'>
        <Container className="mt-5 reservation-container">
            <div className="full-width-red-bar">
                <div className="horizontal-data">
                    <div className="data-item">
                        <strong>Ciudad de entrega:</strong> {city}
                    </div>
                    <div className="data-item">
                        <strong>Ciudad de retorno:</strong> {returnCity}
                    </div>
                    <div className="data-item">
                    <div className="data-item">
                    <strong>Total a pagar:</strong> {grandTotal.toFixed(2)}€ {/* Muestra el total general */}
                </div>
                    </div>
                </div>
            </div>

            <Row>
            <Col xs={12} md={6}>
    {/* Tarjeta de resumen completo */}
    <Card className="mb-4 mt-5 product-card cardClass" style={{ marginTop: '20px' }}>
        <Card.Body>
            <Card.Title>Resumen Completo de la Reserva</Card.Title>
            <hr />

            {/* Muestra la información de cada producto dentro de un solo resumen */}
            {cart.map((product, index) => {
                const productCostData = productCosts.find(
                    (cost) => cost.productId === product.identifier
                );

                const totalCostForProduct = productCostData ? productCostData.totalCost : 0;
               // const totalCostWithoutInsurance = totalCostForProduct - insuranceCost;
                return (
                    <div key={index} className="product-summary" style={{ marginBottom: '20px' }}>
                        {/* Imagen del producto */}
                        <div className="product-image-container" style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={product.imageUrl || 'default-image.jpg'} // Suponiendo que product.imageUrl es la URL de la imagen
                                alt={product.Nameproduct}
                                className="product-image"
                                style={{ width: '100px', height: '100px', objectFit: 'contain', marginRight: '15px' }}
                            />
                            <div>
                                <Card.Text><strong>Ref:</strong> {product?.identifier}</Card.Text>
                                <Card.Text><strong>Producto:</strong> {product?.Nameproduct}</Card.Text>
                                <Card.Text><strong><i className="fi fi-rr-arrow-right"></i> {formatDateToLongText(deliveryDate)} {deliveryTime} | {city}</strong></Card.Text>
                                <Card.Text><strong><i className="fi fi-rr-arrow-left"></i> {formatDateToLongText(returnDate)} | {returnCity}</strong></Card.Text>
                                <Card.Text><strong><i className="fi fi-rr-arrows-h"></i></strong> {product?.dimensions}</Card.Text>
                                <Card.Text><strong><i className="fi fi-rr-calendar-days"></i> {daysCount} DÍA(S)</strong></Card.Text>
                                
                                <Card.Text><strong >Precio del producto: </strong> <strong style={{ color: '#C0392B' }}>{totalCostForProduct}€</strong></Card.Text>
                            </div>
                        </div>
                        
                        <hr />
                    </div>
                );
            })}

            {/* Mostrar el total combinado */}
            <Card.Text><strong><i className="fi fi-rr-shield-check"></i> Seguro:</strong> {totalInsuranceCost}€</Card.Text>
            <Card.Text><strong>Barras:</strong> {roofPrice}€</Card.Text>
            <Card.Text className="total-payable-text">
                <strong style={{ fontSize: '1.2rem', color: '#C0392B' }}>
                    Total: {(grandTotal + totalInsuranceCost).toFixed(2)}€
                </strong>

                <p style={{ marginTop: '10px', fontSize: '1rem', color: '#555' }}>
                    Para completar la reserva solo debes pagar <strong style={{ color: '#C0392B', fontSize: '1.5rem' }}>10€</strong> ahora. 
                    El resto del importe total {(grandTotal + totalInsuranceCost).toFixed(2)}€ se abonará el día que recojas el producto en tienda.
                </p>

            </Card.Text>
        </Card.Body>
    </Card>
</Col>


    
                    <Col xs={12} md={6}>
                        <div className="mb-4 mt-5 section-insurance coberturaClass">
                            <h4>Cobertura</h4>
                            <Row>
                                <Col xs={6}>
                                    <Form.Check
                                        type="radio"
                                        id="basicInsuranceYes"
                                        label="Seguro Básico"
                                        name="insurance"
                                        checked={insuranceSelected}
                                        onChange={() => setInsuranceSelected(true)}
                                        className="radio-option"
                                    />
                                </Col>
                                <Col xs={6} className="text-end">
                                    <span className="price-label">6€ por día</span>
                                </Col>
                                <Col xs={6}>
                                    <Form.Check
                                        type="radio"
                                        id="basicInsuranceNo"
                                        label="Sin Seguro"
                                        name="insurance"
                                        checked={!insuranceSelected}
                                        onChange={() => setInsuranceSelected(false)}
                                        className="radio-option"
                                    />
                                </Col>
                            </Row>
                        </div>
    
                        <div className="mb-4 section-extras extraClass">
                            <h4>Extras</h4>
                        
                        </div>

                                {/* Sección para la Fianza */}
                                <div className="mb-4 section-deposit depositClass" style={{ backgroundColor: '#F9F9F9', padding: '15px', borderRadius: '8px' }}>
                        <h4>Fianza</h4>
                        <p>
                          El pago de una <strong> fianza de 100 € es obligatorio</strong> para poder retirar el producto.
                                    En el momento de la reserva online, solo abonarás <strong>10 €</strong> en concepto de anticipo.

                                    El día que retires el producto en el local, deberás pagar el importe restante correspondiente al precio total del producto + la fianza obligatoria de 100 €.
                        </p>
                    </div>

                        <div className="mb-4 section-personal-info formClass">
                            <h4>Datos Personales</h4>
                            <Form>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Nombre Completo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Introduce tu nombre completo"
                                        className="form-input"
                                        value={personalInfo.name}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Introduce tu correo electrónico"
                                        className="form-input"
                                        value={personalInfo.email}
                                        onChange={(e) => {
                                            setPersonalInfo({ ...personalInfo, email: e.target.value });
                                            setEmailError('');
                                        }}
                                    />
                                    {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPhone">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Introduce tu número de teléfono"
                                        className="form-input"
                                        value={personalInfo.phone}
                                        onChange={(e) => {
                                            const cleanedValue = e.target.value.replace(/[^0-9+\-() ]/g, ''); // Solo permite números, espacios y caracteres especiales
                                            setPersonalInfo({ ...personalInfo, phone: cleanedValue });
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formTerms">
                                <Form.Check 
                                    type="checkbox"
                                    id="acceptTerms"
                                    label={
                                    <>
                                        Acepto los{' '}
                                        <Link to="/terminos-y-condiciones-pago" target="_blank">
                                        términos y condiciones {Nameproduct}
                                        </Link>
                                    </>
                                    }
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                />
                                </Form.Group>
                            </Form>
                            <Button variant="danger" className="confirm-button" onClick={confirmReservation}>
                                Confirmar Reserva 
                            </Button>
                        </div>

                        
                    </Col>
                    
                </Row>
                <Modal
                        show={showModal}
                        onHide={handleClose}
                        centered
                        size="lg"
                        className="custom-modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title className="w-100 text-center">
                                <h4 className="modal-title mb-0">Completar  Pago {cart.map(product => product.Nameproduct).join(", ")} </h4>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="py-4">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                totalCost={totalAmountToPay } // Enviar el total en centavos
                                personalInfo={personalInfo}
                                handleClose={() => setShowModal(false)}
                                onPaymentSuccess={handlePaymentSuccess}
                                city={city}
                                deliveryDate={deliveryDate}
                                returnCity={returnCity}
                                returnDate={returnDate}
                                referenceNumber={cart.map(product => product.identifier).join(', ')}
                                selectedReferenceNumber={selectedReferenceNumber}
                                title={cart.map(product => product.title).join(", ")} 
                                product={cart}
                                handleShow={handleShow}
                                acceptTerms={acceptTerms}
                                deleteLastReservation={deleteLastReservation}
                                insuranceCost={totalInsuranceCost}
                                productImages={cart.map(product => product.imageUrl)}
                              //  extraCost={extraCost}
                                deliveryTime={deliveryTime}
                                Nameproduct={cart.map(product => product.Nameproduct).join(", ")} 
                                RoofPrice= {roofPrice}
                                TotalPago={(grandTotal + totalInsuranceCost).toFixed(2)}
                                TotalCostForProduct={productCostsString}
                            />
                        </Elements>
                    </Modal.Body>
                    </Modal>

            </Container>

            {/* Toast Notification */}
            <Toast
                onClose={() => setShowToast({ ...showToast, show: false })}
                show={showToast.show}
                delay={5000}
                autohide
                style={{ position: 'fixed', bottom: '20px', right: '20px', color:'white', fontSize:'1.8rem', width:'100%', padding:'0 20px' }}
                bg={showToast.variant}
            >
                <Toast.Body>{showToast.message}</Toast.Body>
            </Toast>
        </div>
    );
}

export default ReservationPage;
