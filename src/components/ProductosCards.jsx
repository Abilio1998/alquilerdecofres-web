import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config'; // Importa firestore desde tu archivo de configuración

const ProductosCards = () => {
  const [products, setProducts] = useState([]);

  // Cargar los productos desde Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(firestore, 'products'); // Accede a la colección 'products'
        const productsSnapshot = await getDocs(productsCollection);  // Obtén los documentos de la colección
        const productsList = productsSnapshot.docs.map(doc => doc.data()); // Mapea los documentos a sus datos
        setProducts(productsList); // Guarda los productos en el estado
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProducts(); // Llama a la función cuando el componente se monta
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Nuestros Productos</h2>
      <Row className="g-4"> {/* Bootstrap grid, con espacio entre las cards */}
        {products.length > 0 ? (
          products.map((product) => (
            <Col key={product.productId} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">  {/* Añade sombra para una apariencia más elegante */}
                <Card.Img 
                  variant="top" 
                  src={product.imageUrl} 
                  alt={product.title} 
                  style={{ height: '200px', objectFit: 'contain' }}  // Ajusta el tamaño de la imagen
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.Nameproduct} {product.title}</Card.Title>
                  <Card.Text>{product.identifier}</Card.Text>
                  <Card.Text>{product.dimensions}</Card.Text>
                  <div className="mt-auto">
                    <button className="btn btn-primary w-100">Reservar</button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">Cargando productos...</p>
        )}
      </Row>
    </div>
  );
};

export default ProductosCards;
