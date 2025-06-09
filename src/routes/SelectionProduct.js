import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, getDocs, query, orderBy, limit, startAt, endAt, } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import defaultProductImage from '../assets/img/logo.jpg';
import { differenceInDays, parse, isValid } from 'date-fns';
import Confirmations from './Confirmations';
// Función para eliminar la última reserva
/*const resetAndRedirect = async () => {
    try {
        const reservationsCollection = collection(firestore, 'reservations');
        const q = query(reservationsCollection, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            await deleteDoc(doc.ref);
            console.log('Última reserva eliminada');
        }
    } catch (error) {
        console.error('Error al eliminar la última reserva:', error);
    }
}*/

function ProductCard({ product, onViewDetails, onReserve, onAddToCart, reservation, calculateTotalCost }) {
    if (!product || !reservation) return null;

    const totalCost = calculateTotalCost(product.pricingUnitary, product.dayliPrice, reservation.deliveryDate, reservation.returnDate);

    return (
        <Card className="mb-3" style={{ width: '100%', opacity: product.availability ? 1 : 0.5 }}>
            <div style={{ position: 'relative' }}>
                <Card.Img 
                    variant="top" 
                    src={product.imageUrl || defaultProductImage} 
                    style={{ height: '200px', objectFit: 'contain' }} 
                />
                {!product.availability && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        zIndex: 20
                    }}>
                        No disponible
                    </div>
                )}
                {product.quantity < 6 && product.availability && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        zIndex: 20
                    }}>
                        Quedan {product.quantity} disponibles
                    </div>
                )}
                <Button 
                    variant="info" 
                    style={{ position: 'absolute', bottom: '10px', left: '10px' }} 
                    onClick={() => onViewDetails(product)}
                >
                    + Info
                </Button>
            </div>
            <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.dimensions}</Card.Text>
                <Card.Text><strong>Precio total: </strong>{totalCost} €</Card.Text>
                <div className="d-flex justify-content-between">
                    <Button 
                        variant="primary" 
                        onClick={() => onAddToCart(product)} 
                        disabled={!product.availability || product.quantity <= 0}
                    >
                        Añadir al carrito
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}


function SelectionProduct() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reservation, setReservation] = useState(null);
    const [cart, setCart] = useState([]);
    const [productType, setProductType] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
   /**  const [history, setHistory] = useState([]);  // Historial de los tipos de productos visitados*/

    const { productType: initialProductType = [], cart: initialCart = [] } = location.state || {};  

    // Llamar a fetchFilteredProducts cuando el componente se monta o cuando productType cambia
    useEffect(() => {
        setProductType(initialProductType);
        setCart(initialCart);
        fetchFilteredProducts(initialProductType);  // Llamada inicial para cargar productos
    }, [initialProductType]); // Se vuelve a llamar si productType cambia

// Función para verificar la cantidad del producto en Firebase
/*const checkProductAvailability = async (productId) => {
    try {
        const productRef = doc(firestore, 'products', productId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
            const productData = productSnapshot.data();
            return productData.quantity;  // Devuelve la cantidad del producto
        } else {
            console.error("Producto no encontrado");
            return 0;
        }
    } catch (error) {
        console.error("Error al obtener la cantidad del producto: ", error);
        return 0;
    }
};*/

const handleAddToCart = async (product) => {
    // Verificar la cantidad del producto antes de añadirlo al carrito
  //  const productQuantity = await checkProductAvailability(product.id);

    // Si la cantidad del producto es 1 o menor, no se puede añadir al carrito (eliminado)
    // No hay ninguna validación aquí, ya que la restricción fue eliminada.

    // Añadir el producto al carrito sin restricciones
    const updatedCart = [...cart, product];
    let nextProductType;

    // Determinamos el siguiente tipo de producto en función del producto añadido al carrito
    if (productType.includes('PortaBicicleta')) {
        nextProductType = ['Silla Bebe']; // Si está en PortaBicicleta, el siguiente tipo es Barra
    } else if (productType.includes('Cofre')) {
        nextProductType = ['PortaBicicleta']; // Si está en Cofre, el siguiente tipo es PortaBicicleta
    } else {
        nextProductType = productType; // Si no se ha seleccionado ninguno, sigue el tipo actual
    }

    // Añadir el producto al carrito
    setCart(updatedCart);

    // No recargar los productos si ya están cargados correctamente
    if (nextProductType === productType) {
        return; // Evita recargar productos si ya es el tipo actual
    }

    // Función para cargar productos filtrados según el tipo
    const fetchFilteredProducts = async (productType) => {
        try {
            const productsCollection = collection(firestore, 'products');
            let productPromises = [];

            // Consulta para cada tipo de producto seleccionado
            if (productType.includes('Cofre')) {
                productPromises.push(getDocs(query(productsCollection, orderBy('identifier'), startAt('PRD'), endAt('PRD\uf8ff'))));
            }
            if (productType.includes('PortaBicicleta')) {
                productPromises.push(getDocs(query(productsCollection, orderBy('identifier'), startAt('PBC'), endAt('PBC\uf8ff'))));
            }
            if (productType.includes('Silla Bebe')) {
                productPromises.push(getDocs(query(productsCollection, orderBy('identifier'), startAt('SLB'), endAt('SLB\uf8ff'))));
            }

            // Obtener todos los resultados de las consultas
            const productSnapshots = await Promise.all(productPromises);

            // Extraer productos de cada snapshot
            const productList = productSnapshots.flatMap(snapshot =>
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );

            // Remover duplicados
            const uniqueProducts = Array.from(new Set(productList.map(product => product.id)))
                .map(id => productList.find(product => product.id === id));

            // Establecer los productos filtrados
            setProducts(uniqueProducts);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    // Llamar a la función para cargar los productos filtrados
    fetchFilteredProducts(nextProductType);

    // Actualiza el tipo de producto solo si es diferente
    if (nextProductType !== productType) {
        setProductType(nextProductType);  // Cambia el tipo de producto
    }
};





const fetchFilteredProducts = async (productType) => {
    try {
        const productsCollection = collection(firestore, 'products');
        let productPromises = [];

        // Consulta para cada tipo de producto seleccionado
        if (productType.includes('Cofre')) {
            productPromises.push(getDocs(query(productsCollection, orderBy('identifier'), startAt('PRD'), endAt('PRD\uf8ff'))));
        }
        if (productType.includes('PortaBicicleta')) {
            productPromises.push(getDocs(query(productsCollection, orderBy('identifier'), startAt('PBC'), endAt('PBC\uf8ff'))));
        }
        if (productType.includes('Barra')) {
            productPromises.push(getDocs(query(productsCollection, orderBy('identifier'), startAt('SLB123'), endAt('SLB\uf8ff'))));
        }

        // Obtener todos los resultados de las consultas
        const productSnapshots = await Promise.all(productPromises);

        // Extraer productos de cada snapshot
        const productList = productSnapshots.flatMap(snapshot =>
            snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
        );

        // Remover duplicados
        const uniqueProducts = Array.from(new Set(productList.map(product => product.id)))
            .map(id => productList.find(product => product.id === id));

        // Establecer los productos filtrados
        setProducts(uniqueProducts);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
};
    
    // Llamada inicial para cargar productos cuando se monta el componente
    useEffect(() => {
        setProductType(initialProductType);
        setCart(initialCart);
        fetchFilteredProducts(initialProductType);  // Llamada inicial para cargar productos
    }, [initialProductType]); // Se vuelve a llamar si productType cambia
    
    

    

    const handleRemoveFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId)); // Eliminar producto por ID
    };

    const handleReserveProduct = () => {

        if (cart.length > 0) {
            // Calcula el costo total del carrito
        const totalCost = cart.reduce((acc, product) => {
            return acc + parseFloat(calculateTotalCost(product.pricingUnitary, product.dayliPrice, reservation.deliveryDate, reservation.returnDate));
        }, 0);

            navigate('/proceso-reserva-cofres-mataro', { state: { cart, reservation, totalCost } });
        } else {
            alert('Por favor, añade productos al carrito.');
        }
    };
    

    useEffect(() => {
        const fetchLatestReservation = async () => {
            try {
                const reservationsCollection = collection(firestore, 'reservations');
                const reservationQuery = query(reservationsCollection, orderBy('createdAt', 'desc'), limit(1));
                const reservationSnapshot = await getDocs(reservationQuery);
                const latestReservation = reservationSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))[0];
                setReservation(latestReservation);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchLatestReservation();
    }, []);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    
    

    const calculateTotalCost = (pricingUnitary, dayliPrice, startDate, endDate) => {
        if (!startDate || !endDate) return "Fechas no válidas";

        const pricingUnitaryNum = parseFloat(pricingUnitary.replace(/[^\d.-]/g, '')); 
        const dayliPriceNum = parseFloat(dayliPrice.replace(/[^\d.-]/g, '')); 

        if (isNaN(pricingUnitaryNum) || isNaN(dayliPriceNum)) return "Precios no válidos";

        // Parse the dates using date-fns with a consistent format (dd/MM/yyyy)
        const deliveryDate = parse(startDate, 'dd/MM/yyyy', new Date());
        const returnDate = parse(endDate, 'dd/MM/yyyy', new Date());

        // Check if the parsed dates are valid
        if (!isValid(deliveryDate) || !isValid(returnDate)) return "Fechas no válidas";

        // Calculate the difference in days, including the return date
        const diffDays = differenceInDays(returnDate, deliveryDate) + 1;

        if (diffDays <= 7) {
            return pricingUnitaryNum.toFixed(2);
        }

        const additionalDays = diffDays - 7;
        const additionalCost = additionalDays * dayliPriceNum;
        const totalCost = pricingUnitaryNum + additionalCost;

        return totalCost.toFixed(2);
    };

    return (
        <div>

    <Confirmations/>
    <Container className="mt-5">
                <h2 className="text-center mb-4">Selección de Productos</h2>
                <Row>
                    {products.map((product) => (
                        <Col xs={12} md={6} lg={4} key={product.id}>
                            <ProductCard 
                                product={product} 
                                onViewDetails={handleViewDetails} 
                                onReserve={handleReserveProduct} 
                                onAddToCart={handleAddToCart} 
                                reservation={reservation} 
                                calculateTotalCost={calculateTotalCost} 
                            />
                        </Col>
                    ))}
                </Row>

                <h2>Carrito</h2>
{cart.length === 0 ? (
    <p>No hay productos en el carrito.</p>
) : (
    <ul className="list-group">
        {cart.map((product) => (
            <li 
                key={product.id} 
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ alignItems: 'center' }} // Para centrar contenido verticalmente
            >
                <div className="d-flex align-items-center">
                    <img
                        src={product.imageUrl || defaultProductImage}
                        alt={product.title}
                        style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'contain',
                            marginRight: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                   <span>
                        <strong>{product.title}</strong> - {calculateTotalCost(product.pricingUnitary, product.dayliPrice, reservation.deliveryDate, reservation.returnDate)} €
                    </span>

                </div>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveFromCart(product.id)}
                >
                    Eliminar
                </button>
            </li>
        ))}
    </ul>
)}


                {selectedProduct && (
                    <Modal show={!!selectedProduct} onHide={handleCloseModal} size="lg" centered>
                        <Modal.Header closeButton className="bg-primary text-white">
                            <Modal.Title>{selectedProduct.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="text-center mb-4">
                                <img 
                                    src={selectedProduct.imageUrl || defaultProductImage} 
                                    alt={selectedProduct.title} 
                                    style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} 
                                    className="img-fluid"
                                />
                            </div>
                            <p>{selectedProduct.description}</p>
                            <h5>Detalles:</h5>
                            <ul className="list-group">
                                <li className="list-group-item"><strong>Medidas:</strong> {selectedProduct.dimensions}</li>
                                <li className="list-group-item"><strong>Precio de 7 días:</strong> {selectedProduct.pricingUnitary}</li>
                                <li className="list-group-item"><strong>Más de 7 días:</strong> +{selectedProduct.dayliPrice} <i>/día</i></li>
                                {reservation && (
                                    <li className="list-group-item">
                                        <strong>Costo Total:</strong> {calculateTotalCost(selectedProduct.pricingUnitary, selectedProduct.dayliPrice, reservation.deliveryDate, reservation.returnDate)} €
                                    </li>
                                )}
                            </ul>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>
                )}
                <div className="text-center mt-4">
                <Button 
                        variant="success" 
                        onClick={handleReserveProduct} 
                        disabled={cart.length === 0}  // Habilitar solo si hay productos en el carrito
                    >
                        Reservar
                    </Button>

                </div>
            </Container>
        </div>
    );
}

export default SelectionProduct;
