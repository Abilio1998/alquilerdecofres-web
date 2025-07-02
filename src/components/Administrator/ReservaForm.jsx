// src/components/ReservaForm.js

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Dropdown from 'react-bootstrap/Dropdown';
import { firestore } from '../../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Importa imágenes
import barra_longitudinal from '../../assets/img/techos/barra-longitudinal.png';
import Railing from '../../assets/img/techos/Railing.png';
import Puntos_de_anclajes from '../../assets/img/techos/puntos-de-anclaje.png';
import Barra_transversales from '../../assets/img/techos/barra-transversales.png';
import Sin_nada from '../../assets/img/techos/sin-nada.png';
import '../../assets/css/ReservaForm.css'

// JSON con modelos y marcas
import carModelsData from '../../routes/marcas_y_modelos.json';

const ReservaForm = ({ onClose }) => {
  const navigate = useNavigate();
  

  const [city, setCity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [returnCity, setReturnCity] = useState('');
  const [returnDate, setReturnDate] = useState(null);
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [roofType, setRoofType] = useState('');
  const [productType, setProductType] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    document.title = "Alquiler de Cofres en Mataró y Barcelona - Reserva Fácil";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Descubre nuestro servicio de alquiler de cofres en Mataró y Barcelona. Reserva fácil y rápido con nosotros.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Descubre nuestro servicio de alquiler de cofres en Mataró y Barcelona. Reserva fácil y rápido con nosotros.';
      document.head.appendChild(meta);
    }
  }, []);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1979 }, (_, i) => 1980 + i);
  };

  const generateTimes = () => {
    const times = [];
    for (let hour = 8; hour < 21; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const roofTypes = [
    { type: 'Barra Longitudinales', price: 30, image: barra_longitudinal },
    { type: 'Railing', price: 30, image: Railing },
    { type: 'Puntos de anclajes', price: 50, image: Puntos_de_anclajes },
    { type: 'Barra transversales', price: 50, image: Barra_transversales },
    { type: 'Sin nada', price: 50, image: Sin_nada },
  ];

  const carBrands = [...new Set(carModelsData.map(car => car["MARCA "]?.trim()))];
  const carModelsForSelectedBrand = carModelsData
    .filter(car => car["MARCA "]?.trim() === carBrand)
    .map(car => car["MODELO "]?.trim());

  const productTypes = ['Cofre'];

  const getRoofTypePrice = (type) => {
    const roof = roofTypes.find(r => r.type === type);
    return roof ? roof.price : 0;
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!city || !deliveryDate || !deliveryTime || !returnCity || !returnDate || !carBrand || !carModel || !carYear || !roofType || !productType.length) {
      setShowAlert(true);
      return;
    }

    const reservationData = {
      city,
      deliveryDate: deliveryDate.toLocaleDateString('es-ES'),
      deliveryTime,
      returnCity,
      returnDate: returnDate.toLocaleDateString('es-ES'),
      carBrand,
      carModel,
      carYear,
      roofType,
      roofPrice: getRoofTypePrice(roofType),
      productType,
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(firestore, 'reservations'), reservationData);
      localStorage.setItem('reservationData', JSON.stringify({ ...reservationData, id: docRef.id }));
      navigate('/seleccion-de-productos-de-alquiler', { state: { productType } });
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      setShowAlert(true);
    }
  };

  // Aquí puedes copiar y adaptar tu renderStep si quieres mantener la navegación paso a paso...
 const renderStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <div className="options-container">
          <h2>Seleccionar Ciudad de Entrega</h2>
         <div className="city-dropdown-container">
                    <button
                        className={`btn btn-light city-option ${city === 'Barcelona' ? 'selected-city' : ''}`}
                        onClick={() => setCity('Barcelona')}
                    >
                        Barcelona
                    </button>
                    <button
                        className={`btn btn-light city-option ${city === 'Mataró' ? 'selected-city' : ''}`}
                        onClick={() => setCity('Mataró')}
                    >
                        Mataró
                    </button>
                    </div>

            <div className="navigation-buttons">
          <button className="btn btn-primary mt-3" disabled={!city} onClick={() => setCurrentStep(2)}>Siguiente</button>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="options-container">
          <h2>Seleccionar Fecha de Entrega</h2>
          <Calendar onChange={setDeliveryDate} value={deliveryDate} minDate={new Date()} />
          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(1)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!deliveryDate} onClick={() => setCurrentStep(3)}>Siguiente</button>
          </div>
        </div>
      );
    case 3:
      const times = generateTimes();
      return (
        <div className="options-container">
          <h2>Seleccionar Hora de Entrega</h2>
          <div className="time-options">
            {times.map((time) => (
              <button
                key={time}
                className={`btn btn-light time-option ${deliveryTime === time ? 'selected-time' : ''}`}
                onClick={() => setDeliveryTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(2)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!deliveryTime} onClick={() => setCurrentStep(4)}>Siguiente</button>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="options-container">
          <h2>Seleccionar Lugar de Devolución</h2>
          <div className="city-dropdown-container">
                <button
                    className={`btn btn-light city-option ${returnCity === 'Barcelona' ? 'selected-city' : ''}`}
                    onClick={() => setReturnCity('Barcelona')}
                >
                    Barcelona
                </button>
                <button
                    className={`btn btn-light city-option ${returnCity === 'Mataró' ? 'selected-city' : ''}`}
                    onClick={() => setReturnCity('Mataró')}
                >
                    Mataró
                </button>
                </div>

          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(3)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!returnCity} onClick={() => setCurrentStep(5)}>Siguiente</button>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="options-container">
          <h2>Seleccionar Fecha de Devolución</h2>
          <Calendar onChange={setReturnDate} value={returnDate} minDate={deliveryDate || new Date()} />
          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(4)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!returnDate} onClick={() => setCurrentStep(6)}>Siguiente</button>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="options-container">
          <h2>Seleccionar Marca de Coche</h2>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" className='btn btn-light' style={{width:'100%'}}>
              {carBrand || 'Selecciona una Marca'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{width:'100%', textAlign:'center'}} className="custom-dropdown-menu">
              {carBrands.map((brand) => (
                <Dropdown.Item key={brand} onClick={() => setCarBrand(brand)} className={carBrand === brand ? 'selected-dropdown-item' : ''}>
                  {brand}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(5)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!carBrand} onClick={() => setCurrentStep(7)}>Siguiente</button>
          </div>
        </div>
      );
    case 7:
      return (
        <div className="options-container">
          <h2>Seleccionar Modelo de Coche</h2>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" className='btn btn-light' style={{width:'100%'}}>
              {carModel || 'Selecciona un Modelo'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{width:'100%', textAlign:'center'}} className="custom-dropdown-menu">
              {carModelsForSelectedBrand.map((model) => (
                <Dropdown.Item key={model} onClick={() => setCarModel(model)} className={carModel === model ? 'selected-dropdown-item' : ''}>
                  {model}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(6)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!carModel} onClick={() => setCurrentStep(8)}>Siguiente</button>
          </div>
        </div>
      );
    case 8:
      return (
        <div className="options-container">
          <h2>Seleccionar Año del Coche</h2>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" className='btn btn-light' style={{width:'100%'}}>
              {carYear || 'Selecciona un Año'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{width:'100%', textAlign:'center'}} className="custom-dropdown-menu">
              {generateYears().map((year) => (
                <Dropdown.Item key={year} onClick={() => setCarYear(year)} className={carYear === year ? 'selected-dropdown-item' : ''}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(7)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!carYear} onClick={() => setCurrentStep(9)}>Siguiente</button>
          </div>
        </div>
      );
    case 9:
      return (
        <div className="options-container">
          <h2>Seleccionar Tipo de Techo</h2>
          <form>
            {roofTypes.map(({ type, price, image }, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`roof-${type}`}
                  name="roofType"
                  value={type}
                  checked={roofType === type}
                  onChange={() => setRoofType(type)}
                />
                <label className="form-check-label" htmlFor={`roof-${type}`} style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={image} alt={type} style={{ width: '90px', height: 'auto', marginRight: '10px' }} />
                  {type} (€{price})
                </label>
              </div>
            ))}
          </form>
          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(8)}>Anterior</button>
          <button className="btn btn-primary mt-3" disabled={!roofType} onClick={() => setCurrentStep(10)}>Siguiente</button>
          </div>
        </div>
      );
    case 10:
      return (
        <div className="options-container">
          <h2>Seleccionar Productos</h2>
          <div className="checkbox-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {productTypes.map((type) => (
                <div
                key={type}
                className="form-check"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
                >
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={`product-${type}`}
                    value={type}
                    checked={productType.includes(type)}
                    onChange={() => {
                    if (productType.includes(type)) {
                        setProductType(productType.filter(item => item !== type));
                    } else {
                        setProductType([...productType, type]);
                    }
                    }}
                />
                <label className="form-check-label" htmlFor={`product-${type}`}>
                    {type}
                </label>
                </div>
            ))}
            </div>

          <div className="navigation-buttons">
          <button className="btn btn-secondary mt-3" onClick={() => setCurrentStep(9)}>Anterior</button>
          <button className="btn btn-success mt-3" disabled={productType.length === 0} onClick={handleConfirm}>Confirmar</button>
          </div>
        </div>
      );
    default:
      return (
        <div className="options-container">
          <h2>Confirmar Reserva</h2>
          <button className="btn btn-success" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      );
  }
};



 return (
  <div className="reserve-overlay">
    <button className="close-reserve-btn" onClick={onClose}>×</button>
    <div className="reserve-container">
      {renderStep()}
      {showAlert && <div className="alert alert-danger mt-3">Por favor, completa todos los pasos.</div>}
    </div>
  </div>
);

};

export default ReservaForm;
