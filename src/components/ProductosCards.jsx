import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollOrNavigate } from '../extra/scrollOrNavigate';
import '../assets/css/productos.css'

const ProductosCards = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // SEO
  useEffect(() => {
    document.title = "Cofres para Alquiler - Variedad y Calidad en Mataró";

    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta("description", "Explora nuestra variedad de cofres para alquiler en Mataró. Calidad garantizada y opciones para todos los gustos.");
    setMeta("keywords", "cofres alquiler, cofres Mataró, alquiler de cofres, cofres Barcelona");
    setMeta("robots", "index, follow");

    const setOG = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setOG("og:title", "Cofres para Alquiler en Mataró");
    setOG("og:description", "Descubre cofres de alquiler en Mataró ideales para tus necesidades.");
    setOG("og:type", "website");
    setOG("og:url", window.location.href);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", window.location.href);
  }, []);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(firestore, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => doc.data());
        setProducts(productsList);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = () => {
    scrollOrNavigate(location, navigate);
  };

  return (
    <div className="container mt-5">
     <h1 className="text-center display-5 fw-bold fade-in" style={{ marginTop: '100px' }}>
        🚗 Nuestros Cofres de Alquiler
      </h1>

      <p className="lead text-center text-muted mb-5 fade-in">
        ¿Necesitas espacio extra? Nuestros cofres para alquiler en Mataró son perfectos para <strong>viajes de aventura</strong>,
        <strong> vacaciones de esquí</strong>, <strong>campings</strong>, o simplemente para transportar más equipaje
        con comodidad, seguridad y estilo.
      </p>

      <section className="bg-light p-4 rounded shadow-sm mb-5 fade-in">
        <h2 className="h4 fw-semibold mb-3">🎯 Alquiler para cualquier ocasión</h2>
        <ul className="list-unstyled ps-3">
          <li>✅ Perfectos para escapadas a la montaña o la playa</li>
          <li>✅ Compatibles con viajes en coche, furgoneta o caravana</li>
          <li>✅ Resistentes al agua y fáciles de instalar</li>
          <li>✅ Ideales para transportar material de <strong>snowboard</strong>, <strong>pesca</strong>, <strong>camping</strong> y más</li>
        </ul>
        <p className="mt-3">
          Estamos ubicados en <strong>Mataró</strong> y ofrecemos alquiler rápido y económico para toda la provincia de <strong>Barcelona</strong>.
        </p>
      </section>

      <div className="text-center mb-5 fade-in">
        <button 
          className="btn btn-success btn-lg px-5 py-3 shadow"
          onClick={handleClick}
        >
          💼 ¡Alquila tu cofre ahora!
        </button>
      </div>

     <Row className="g-4 fade-in">
        {products.length > 0 ? (
          products.map((product) => (
            <Col key={product.productId} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 border-0 shadow-sm card-hover fade-in">
                <Card.Img 
                  variant="top" 
                  src={product.imageUrl} 
                  alt={product.title} 
                  style={{ height: '200px', objectFit: 'Contain' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold text-danger">{product.Nameproduct}</Card.Title>
                  <Card.Text className="text-muted small">{product.dimensions}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">Cargando productos...</p>
        )}
      </Row>
        <button className="fixed-cta-mobile" onClick={handleClick}>
          📦 Reservar Cofre
        </button>
    </div>
  );
};

export default ProductosCards;
