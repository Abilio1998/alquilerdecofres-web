import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase-config';
import { query, orderBy, limit, getDocs, doc, updateDoc, collection } from 'firebase/firestore';
import Calendar from 'react-calendar';
import Dropdown from 'react-bootstrap/Dropdown';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import carModelsData from './marcas_y_modelos.json';
import '../assets/css/Confirmations.css';

const Confirmations = () => {
  const [reservationData, setReservationData] = useState(null);
  const [availability, setAvailability] = useState({});
  const [showModal, setShowModal] = useState(false);

  const carBrands = [...new Set(carModelsData.map(car => car["MARCA "]?.trim()))];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1980; year <= currentYear; year++) years.push(year);
    return years;
  };
  const carYears = generateYears();

  useEffect(() => {
    const fetchLastReservation = async () => {
      try {
        const reservationsRef = collection(firestore, 'reservations');
        const q = query(reservationsRef, orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const lastReservationDoc = snapshot.docs[0];
          setReservationData({ ...lastReservationDoc.data(), id: lastReservationDoc.id });
        }
      } catch (error) {
        alert('Error al obtener la última reserva: ', error);
      }
    };

    const fetchAvailability = async () => {
      try {
        const availabilityRef = collection(firestore, 'availability');
        const snapshot = await getDocs(availabilityRef);
        const data = {};
        snapshot.docs.forEach(doc => {
          const [city, date] = doc.id.split('_'); // ej. 'Barcelona_2025-08-22'
          if (!data[city]) data[city] = {};
          data[city][date] = doc.data();
        });
        setAvailability(data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchLastReservation();
    fetchAvailability();
  }, []);

  // --- Funciones auxiliares ---

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    } else {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
  // Validación de campos obligatorios
  const requiredFields = [
    'city', 'deliveryDate', 'deliveryTime',
    'returnCity', 'returnDate',
    'carBrand', 'carModel', 'carYear'
  ];

  const emptyField = requiredFields.find(field => !reservationData[field]);
  if (emptyField) {
    alert(`Por favor completa el campo: ${emptyField}`);
    return; // no continuar con el guardado
  }

  try {
    const { id, createdAt, ...dataToUpdate } = reservationData;
    const reservationRef = doc(firestore, 'reservations', id);
    await updateDoc(reservationRef, {
      ...dataToUpdate,
      createdAt, // mantenemos timestamp original
    });
    setShowModal(false);
  } catch (error) {
    alert('Error al actualizar la reserva', error);
  }
};


  const getAvailableTimes = (date, city) => {
    const dateKey = formatDateToISOKey(date); // formato 'YYYY-MM-DD' para buscar en availability
    const slot = availability[city]?.[dateKey];
    if (!slot || !slot.timeSlots) return [];
    return slot.timeSlots;
  };

  const formatDateToISOKey = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isDateBlocked = (date, city) => {
    const dateKey = formatDateToISOKey(date);
    const slot = availability[city]?.[dateKey];
    return !slot || !slot.available || slot.bookedCount >= slot.maxBookings;
  };

  if (!reservationData) return <p>No se encontraron datos de reserva. Regrese y haga una nueva reserva.</p>;

  const carModelsForSelectedBrand = carModelsData
    .filter(car => car["MARCA "]?.trim() === reservationData.carBrand)
    .map(car => car["MODELO "]?.trim());

  const availableTimesDelivery = getAvailableTimes(parseDate(reservationData.deliveryDate), reservationData.city);

  return (
    <div className="confirmation-container" style={{paddingTop:'90px'}}>
      <h1 className="mb-4">Confirmación de Reserva</h1>

      <div className="confirmation-details">
        <div className="confirmation-item"><strong>Ciudad de entrega:</strong> {reservationData.city}</div>
        <div className="confirmation-item"><strong>Fecha de entrega:</strong> {reservationData.deliveryDate}</div>
        <div className="confirmation-item"><strong>Hora de entrega:</strong> {reservationData.deliveryTime}</div>
        <div className="confirmation-item"><strong>Lugar de devolución:</strong> {reservationData.returnCity}</div>
        <div className="confirmation-item"><strong>Fecha de devolución:</strong> {reservationData.returnDate}</div>
        <div className="confirmation-item"><strong>Vehículo:</strong> {reservationData.carBrand}</div>
        <div className="confirmation-item"><strong>Modelo:</strong> {reservationData.carModel} - {reservationData.carYear}</div>
        <div className="confirmation-item"><strong>Tipo de techo:</strong> {reservationData.roofType}</div></div>

      <Button variant="primary" className="mt-4" onClick={() => setShowModal(true)}>Editar Reserva</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {/* Ciudad de entrega */}
          <div className="mb-3">
            <strong>Ciudad de entrega:</strong>
            <div className="d-flex gap-2 mt-2">
              {['Mataró','Barcelona'].map(c => (
                <button
                  key={c}
                  className={`btn ${reservationData.city === c ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setReservationData(prev => ({ ...prev, city: c, deliveryDate: null, deliveryTime: '' }))}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Fecha de entrega */}
          <div className="mb-3">
            <strong>Fecha de entrega:</strong>
            <Calendar
              onChange={date => setReservationData(prev => ({
                ...prev,
                deliveryDate: formatDateToDDMMYYYY(date),
                deliveryTime: ''
              }))}
              value={parseDate(reservationData.deliveryDate)}
              minDate={new Date()}
              tileDisabled={({ date }) => isDateBlocked(date, reservationData.city)}
            />
          </div>

          {/* Hora de entrega */}
          <div className="mb-3">
            <strong>Hora de entrega:</strong>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {availableTimesDelivery.length > 0 ? availableTimesDelivery.map(time => (
                <button
                  key={time}
                  className={`btn ${reservationData.deliveryTime === time ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setReservationData(prev => ({ ...prev, deliveryTime: time }))}
                >
                  {time}
                </button>
              )) : <p>No hay horarios disponibles para esta fecha</p>}
            </div>
          </div>

          {/* Ciudad de devolución */}
          <div className="mb-3">
            <strong>Lugar de devolución:</strong>
            <div className="d-flex gap-2 mt-2">
              {['Mataró','Barcelona'].map(c => (
                <button
                  key={c}
                  className={`btn ${reservationData.returnCity === c ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setReservationData(prev => ({ ...prev, returnCity: c, returnDate: null }))}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Fecha de devolución */}
          <div className="mb-3">
            <strong>Fecha de devolución:</strong>
            <Calendar
              onChange={date => setReservationData(prev => ({
                ...prev,
                returnDate: formatDateToDDMMYYYY(date),
                returnTime: ''
              }))}
              value={parseDate(reservationData.returnDate)}
              minDate={parseDate(reservationData.deliveryDate)}
              tileDisabled={({ date }) => isDateBlocked(date, reservationData.returnCity)}
            />
          </div>

          

          {/* Vehículo */}
          <div className="mb-3">
            <strong>Marca del vehículo:</strong>
            <Dropdown className="mt-2">
              <Dropdown.Toggle variant="secondary" style={{width:'100%'}}>
                {reservationData.carBrand || 'Selecciona una Marca'}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{width:'100%', textAlign:'center', maxHeight:'150px', overflowY:'auto'}}>
                {carBrands.map(brand => (
                  <Dropdown.Item key={brand} onClick={()=>setReservationData(prev=>({...prev, carBrand: brand, carModel:''}))}>{brand}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mb-3">
            <strong>Modelo del vehículo:</strong>
            <Dropdown className="mt-2">
              <Dropdown.Toggle variant="secondary" style={{width:'100%'}}>
                {reservationData.carModel || 'Selecciona un Modelo'}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{maxHeight:'150px', overflowY:'auto', width:'100%', textAlign:'center'}}>
                {carModelsForSelectedBrand.map(model => (
                  <Dropdown.Item key={model} onClick={()=>setReservationData(prev=>({...prev, carModel:model}))}>{model}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mb-3">
            <strong>Año del vehículo:</strong>
            <Dropdown className="mt-2">
              <Dropdown.Toggle variant="secondary" style={{width:'100%'}}>
                {reservationData.carYear || 'Selecciona un Año'}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{maxHeight:'150px', overflowY:'auto', width:'100%', textAlign:'center'}}>
                {carYears.slice().reverse().map(year=>(
                  <Dropdown.Item key={year} onClick={()=>setReservationData(prev=>({...prev, carYear:year}))}>{year}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Confirmations;
