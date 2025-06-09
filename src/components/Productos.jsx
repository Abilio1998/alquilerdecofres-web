import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config'; // Importa firestore desde tu archivo de configuración

const Productos = () => {
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
      {products.length > 0 ? (
        <Carousel 
          controls={true}  // Controles de izquierda y derecha para navegación manual
          indicators={false}  // Opcional: ocultar los indicadores del carrusel
          interval={1500}  // Cada 3 segundos cambia de producto automáticamente
          pause={'hover'}  // Se detiene el auto-desplazamiento cuando el mouse está sobre el carrusel
        >
          {products.map((product) => (
            <Carousel.Item key={product.productId}>
              {/* Imagen del producto */}
              <img
                className="d-block w-100"
                src={product.imageUrl}
                alt={product.title}
                style={{ height: '300px', objectFit: 'contain' }} // Reducir tamaño de imagen
              />
              {/* Contenedor del texto debajo de la imagen */}
              <div className="carousel-text text-center mt-3">
                <h5>{product.title}</h5>
                <p>{product.identifier}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="text-center">Cargando productos...</p>
      )}
    </div>
  );
};

export default Productos;
