// src/pages/ErrorPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import notFoundImg from '../assets/img/error-404.svg'; // Asegúrate de tener esta imagen o reemplaza la ruta

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container text-center" style={{ marginTop: '80px' }}>
      <img 
        src={notFoundImg} 
        alt="Página no encontrada" 
        style={{ maxWidth: '400px', width: '100%', marginBottom: '20px' }} 
      />
      <h1 className="display-4">Página no encontrada</h1>
      <p className="lead">Lo sentimos, la página que estás buscando no existe o fue movida.</p>
      <button className="btn btn-primary mt-3" onClick={handleGoHome}>
        Volver al inicio
      </button>
    </div>
  );
};

export default ErrorPage;
