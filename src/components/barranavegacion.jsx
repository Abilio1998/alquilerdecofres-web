// src/components/barranavegacion.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../context/auth-context';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import '../assets/css/barranavegacion.css';
import logo from '../assets/img/logo.jpg';
import app from '../firebase-config'; // Importa la instancia de la aplicación de Firebase
import { Base64 } from 'js-base64';

const Barranavegacion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Obtener el estado de autenticación
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app); // Inicializar Firestore

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Función para limpiar la tabla de reservas
  const clearReservationsTable = async () => {
    try {
      const reservationsCollection = collection(db, 'reservations');
      const reservationsSnapshot = await getDocs(reservationsCollection);
      const batch = writeBatch(db); // Crear el batch para realizar múltiples operaciones atómicas

      reservationsSnapshot.forEach((reservationDoc) => {
        const docRef = doc(db, 'reservations', reservationDoc.id);
        batch.delete(docRef); // Añadir las operaciones de eliminación al batch
      });

      await batch.commit(); // Ejecutar todas las operaciones del batch
    } catch (error) {
      console.error('Error al limpiar la tabla de reservas:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirigir al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Manejador para la navegación que también limpia la tabla de reservas
  const handleNavigationClick = (path) => {
    clearReservationsTable(); // Limpiar la tabla de reservas
    navigate(path); // Redirigir a la nueva página
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleNavigationClick('/')}>
        <NavLink to="/">
          <img src={logo} alt="Logo" style={{ width: '100px', height: '58px' }} />
        </NavLink>
      </div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => handleNavigationClick('/')}
        >
          Inicio
        </NavLink>
        <NavLink 
          to="/contactar-alquiler-de-cofres" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => handleNavigationClick('/contactar-alquiler-de-cofres')}
        >
          Contacto
        </NavLink>
        <NavLink 
          to="/alquiler-cofres-mataro-barcelona" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => handleNavigationClick('/alquiler-cofres-mataro-barcelona')}
        >
          Productos
        </NavLink>
        {user ? (
  <>
        <NavLink 
          to={`/${Base64.encode('/reservar-de-cofres-mataro-barcelona/proceso-reserva-alquiler-de-cofres-mataro')}`}
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Admin
        </NavLink>
        <button onClick={handleLogout} className="btn btn-danger ms-2">
          Cerrar sesión
        </button>
      </>
    ) : (
      <NavLink 
        to="/login" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        onClick={() => handleNavigationClick('/login')}
      >
        Login
      </NavLink>
    )}
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Barranavegacion;
