import React from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase-config';
import { doc, deleteDoc } from 'firebase/firestore';
import '../assets/css/Confirmations.css';

const Confirmations = () => {
    const navigate = useNavigate();

    // Recuperar datos de la reserva desde localStorage
    const reservationData = JSON.parse(localStorage.getItem('reservationData'));

    // Verificar que existen datos de reserva
    if (!reservationData) {
        return <p>No se encontraron datos de reserva. Regrese y haga una nueva reserva.</p>;
    }

    const { city, deliveryDate, deliveryTime, returnCity, returnDate, carBrand, carModel, id } = reservationData;

    const handleGoBack = async () => {
        // Eliminar los datos de reserva del localStorage
        localStorage.removeItem('reservationData');

        // Eliminar la reserva de Firestore usando el ID
        try {
            await deleteDoc(doc(firestore, 'reservations', id));
        } catch (error) {
            console.error("Error eliminando reserva: ", error);
        }

        // Navegar de vuelta a la página anterior
        navigate(-1);
    };

    return (
        <div className="confirmation-container">
            <h1 style={{marginTop:'80px'}}>Confirmación de Reserva</h1>
            <div className="confirmation-details">
                <div className="confirmation-item">
                    <strong>Ciudad de entrega:</strong> {city}
                </div>
                <div className="confirmation-item">
                    <strong>Fecha de entrega:</strong> {deliveryDate}
                </div>
                <div className="confirmation-item">
                    <strong>Hora de entrega:</strong> {deliveryTime}
                </div>
                <div className="confirmation-item">
                    <strong>Lugar de devolución:</strong> {returnCity}
                </div>
                <div className="confirmation-item">
                    <strong>Fecha de devolución:</strong> {returnDate}
                </div>
                <div className="confirmation-item">
                    <strong>Vehículo:</strong> {carBrand}
                </div>
                <div className="confirmation-item">
                    <strong>Modelo:</strong> {carModel}
                </div>
            </div>
            <button className="btn btn-dark mt-4" onClick={handleGoBack}>Volver</button>
        </div>
    );
};

export default Confirmations;
