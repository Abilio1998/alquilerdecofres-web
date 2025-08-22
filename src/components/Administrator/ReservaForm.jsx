// src/components/ReservaForm.js

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Dropdown from 'react-bootstrap/Dropdown';
import { firestore } from '../../firebase-config';
import { collection, addDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
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

  // Estados principales
  
    const [city, setCity] = useState('');
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [returnCity, setReturnCity] = useState('');
    const [returnDate, setReturnDate] = useState(null);
    const [carBrand, setCarBrand] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carYear, setCarYear] = useState(''); // Nuevo estado para el año del coche
    const [roofType, setRoofType] = useState(''); // Nuevo estado para el tipo de techo
    const [productType, setProductType] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showReserveOverlay, setShowReserveOverlay] = useState(false);

    const [showReservaForm, setShowReservaForm] = useState(false);
    
    const [availability, setAvailability] = useState({});
    
    useEffect(() => {
        const fetchAvailability = async () => {
            const snapshot = await getDocs(collection(firestore, 'availability'));
            const data = {};
            snapshot.forEach(doc => {
                const [city, date] = doc.id.split('_');
                if (!data[city]) data[city] = {};
                data[city][date] = doc.data();
            });
            setAvailability(data);
        };
        fetchAvailability();
    }, []);

    const navigate = useNavigate();

    // Generar lista de años desde 1980 hasta el año actual
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = 1980; year <= currentYear; year++) {
            years.push(year);
        }
        return years;
    };
    const carYears = generateYears();

    // Opciones de tipo de techo con precios

    //../assets/img/techos/barra-longitudinal.png
    //../../assets/img/techos/railing.png
    //../../assets/img/techos/puntos-de-anclajes.png
    //../../assets/img/techos/barra-transversales.png
    //../../assets/img/techos/sin-nada.png
    

    const roofTypes = [
        { type: 'Barra Longitudinales', price: 30, image: barra_longitudinal },
        { type: 'Railing', price: 30, image:Railing },
        { type: 'Puntos de anclajes', price: 50, image: Puntos_de_anclajes},
        { type: 'Barra transversales', price: 0, image:Barra_transversales},
        { type: 'Sin nada', price: 50, image: Sin_nada },
    ];
    
    

    

    const handleRoofTypeChange = (type) => {
        setRoofType(type);
        setCurrentStep(currentStep + 1);
    };
    const handleCityChange = (city) => {
        if (currentStep === 1) {
            setCity(city);
        } else if (currentStep === 4) {
            setReturnCity(city);
        }
        setCurrentStep(currentStep + 1);
    };

    const handleCalendarChange = (date) => {
        if (currentStep === 2) {
            setDeliveryDate(date);
        } else if (currentStep === 5) {
            setReturnDate(date);
        }
        setCurrentStep(currentStep + 1);
    };

    const handleTimeChange = (time) => {
        setDeliveryTime(time);
        setCurrentStep(currentStep + 1);
    };

    const handleCarBrandChange = (brand) => {
        setCarBrand(brand);
        setCarModel(''); // Reiniciar el modelo seleccionado cuando cambia la marca
        setCurrentStep(currentStep + 1);
    };

    const handleCarModelChange = (model) => {
        setCarModel(model);
        setCurrentStep(currentStep + 1);
    };

    const handleCheckboxChange = (type) => {
        if (type === 'Seleccion de Productos') {
            if (productType.includes('Seleccion de Productos')) {
                // Si 'Todos' ya está seleccionado, lo deseleccionamos y permitimos la selección de otros
                setProductType([]);
            } else {
                // Si 'Todos' no está seleccionado, lo seleccionamos y deseleccionamos los demás
                setProductType(['Seleccion de Productos']);
            }
        } else {
            // Si se selecciona/deselecciona un producto diferente
            if (productType.includes(type)) {
                // Si ya está seleccionado, lo deselecciona
                setProductType(productType.filter((item) => item !== type));
            } else {
                // Si no está seleccionado, lo agrega
                setProductType([...productType, type]);
            }
        }
    };

   
    const getRoofTypePrice = (type) => {
        const roof = roofTypes.find((roof) => roof.type === type);
        return roof ? roof.price : 0; // Retorna el precio o 0 si no se encuentra el tipo
    };
    
    const handleConfirm = async (e) => {
    e.preventDefault();
    if (!city || !deliveryDate || !deliveryTime || !returnCity || !returnDate || !carBrand || !carModel || !carYear || !roofType || !productType.length) {
        setShowAlert(true);
        return;
    }
    

    const roofPrice = getRoofTypePrice(roofType);
    const normalizeString = (str) => str.normalize('NFC');

    try {
        // 1️⃣ Obtener todos los documentos de la colección
        const reservationsCollection = collection(firestore, 'reservations');
        const querySnapshot = await getDocs(reservationsCollection);
        
        // 2️⃣ Eliminar cada documento
        for (const docSnap of querySnapshot.docs) {
            await deleteDoc(doc(firestore, 'reservations', docSnap.id));
        }

        // 3️⃣ Crear la nueva reserva
        const reservationData = {
            city: normalizeString(city),
            deliveryDate: deliveryDate.toLocaleDateString('es-ES'),
            deliveryTime,
            returnCity,
            returnDate: returnDate.toLocaleDateString('es-ES'),
            carBrand,
            carModel,
            carYear,
            roofType,
            roofPrice,
            productType,
            createdAt: new Date(),
        };

        const docRef = await addDoc(reservationsCollection, reservationData);

        const reservationWithId = {
            ...reservationData,
            id: docRef.id,
        };

        // Guardar localmente si quieres
        localStorage.setItem('reservationData', JSON.stringify(reservationWithId));

        // Redirigir o mostrar mensaje
        navigate('/seleccion-de-productos-de-alquiler', { state: { productType, carBrand, carModel, roofType, roofPrice } });

    } catch (error) {
        console.error('Error al limpiar y añadir la reserva: ', error);
        setShowAlert(true);
    }
};


    const handleCloseOverlay = () => {
        setCity('');
        setDeliveryDate(null);
        setDeliveryTime('');
        setReturnCity('');
        setReturnDate(null);
        setCarBrand('');
        setCarModel('');
        setProductType([]);
        setCurrentStep(1);
        setShowAlert(false);
        setShowReserveOverlay(false);
    };

    const handlePreviousStep = () => {
    if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
    }
};

 

    const generateTimes = () => {
        const times = [];
        for (let hour = 8; hour < 21; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
            times.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return times;
    };

    const times = generateTimes();

    // Extraer las marcas únicas del archivo JSON
    const carBrands = [...new Set(carModelsData.map(car => car["MARCA "].trim()))];  // Eliminar espacios en "MARCA "
    const carModelsForSelectedBrand = carModelsData
        .filter(car => car["MARCA "]?.trim() === carBrand)
        .map(car => car["MODELO "]?.trim());  // Modelos filtrados por la marca seleccionada

    const productTypes = [
        'Cofre'
    ];

    const renderStep = () => {
       const renderNavigationButtons = (nextDisabled = false, isFinalStep = false) => (
        <div className="step-navigation mt-3">
            {currentStep > 1 && (
                <button className="btn btn-secondary me-2" onClick={handlePreviousStep}>
                    Atrás
                </button>
            )}
            {!isFinalStep ? (
                <button
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={nextDisabled}
                >
                    Siguiente
                </button>
            ) : (
                <button className="btn btn-success" onClick={handleConfirm}>
                    Confirmar
                </button>
            )}
        </div>
    );

        switch (currentStep) {
            case 1:
            return (
                <div className="options-container">
                    <h2>Seleccionar Ciudad de Entrega</h2>
                    <div className="city-dropdown-container">
                        <button className="btn btn-light city-option" onClick={() => handleCityChange('Barcelona')}>
                            Barcelona
                        </button>
                        <button className="btn btn-light city-option" onClick={() => handleCityChange('Mataró')}>
                            Mataró
                        </button>
                    </div>
                    {renderNavigationButtons(true)}
                </div>
            );
        case 2: {
    // Obtener fechas disponibles para la ciudad seleccionada
    const deliveryAvailableDates = availability[city]
        ? Object.keys(availability[city]).filter(dateKey => availability[city][dateKey].available)
        : [];

    return (
        <div className="options-container">
            <h2>Seleccionar Fecha de Entrega</h2>
            <Calendar
                onChange={handleCalendarChange}
                value={deliveryDate}
                minDate={new Date()}
                tileDisabled={({ date, view }) => {
                    if (view === 'month') {
                        // Antes
                        // const dateStr = date.toISOString().split('T')[0];
                        // Después
                        const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
                        return !deliveryAvailableDates.includes(dateStr);
                    }
                    return false;
                }}
            />
            {renderNavigationButtons(!deliveryDate)}
        </div>
    );
}

        case 3:
                // Antes
                // const deliveryDateKey = deliveryDate?.toISOString().split('T')[0];
                // Después
                const deliveryDateKey = deliveryDate?.toLocaleDateString('en-CA');

                const availableTimes = availability[city]?.[deliveryDateKey]?.timeSlots || [];

                return (
                    <div className="options-container">
                        <h2>Seleccionar Hora de Entrega</h2>
                        <div className="time-options">
                            {availableTimes.length > 0 ? availableTimes.map(time => (
                                <button
                                    key={time}
                                    className="btn btn-light time-option"
                                    onClick={() => handleTimeChange(time)}
                                >
                                    {time}
                                </button>
                            )) : <p>No hay horarios disponibles para esta fecha</p>}
                        </div>
                        {renderNavigationButtons(!deliveryTime)}
                    </div>
                );

        case 4:
            return (
                <div className="options-container">
                    <h2>Seleccionar Lugar de Devolución</h2>
                    <div className="city-dropdown-container">
                        <button className="btn btn-light city-option" onClick={() => handleCityChange('Barcelona')}>
                            Barcelona
                        </button>
                        <button className="btn btn-light city-option" onClick={() => handleCityChange('Mataró')}>
                            Mataró
                        </button>
                    </div>
                    {renderNavigationButtons(true)}
                </div>
            );
       case 5: {
    const returnAvailableDates = availability[returnCity]
        ? Object.keys(availability[returnCity]).filter(dateKey => availability[returnCity][dateKey].available)
        : [];

    return (
        <div className="options-container">
            <h2>Seleccionar Fecha de Devolución</h2>
            <Calendar
                onChange={handleCalendarChange}
                value={returnDate}
                minDate={deliveryDate || new Date()}
                tileDisabled={({ date, view }) => {
                    if (view === 'month') {
                        const dateStr = date.toISOString().split('T')[0];
                        return !returnAvailableDates.includes(dateStr);
                    }
                    return false;
                }}
            />
            {renderNavigationButtons(!returnDate)}
        </div>
    );
}


        case 6:
            return (
                <div className="options-container">
                    <h2>Seleccionar Marca de Coche</h2>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" className='btn btn-light' id="dropdown-brand" style={{width:'100%'}}>
                            {carBrand || 'Selecciona una Marca'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{width:'100%', textAlign:'center'}} className="custom-dropdown-menu">
                            {carBrands.map((brand) => (
                                <Dropdown.Item
                                    key={brand}
                                    onClick={() => handleCarBrandChange(brand)}
                                >
                                    {brand}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    {renderNavigationButtons(!carBrand)}
                </div>
            );
        case 7:
            return (
                <div className="options-container">
                    <h2>Seleccionar Modelo de Coche</h2>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-model" className='btn btn-light' style={{width:'100%'}}>
                            {carModel || 'Selecciona un Modelo'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{width:'100%', textAlign:'center'}} className="custom-dropdown-menu">
                            {carModelsForSelectedBrand.map((model) => (
                                <Dropdown.Item
                                    key={model}
                                    onClick={() => handleCarModelChange(model)}
                                >
                                    {model}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    {renderNavigationButtons(!carModel)}
                </div>
            );
        case 8:
            return (
                <div className="options-container">
                    <h2>Seleccionar Año del Coche</h2>
<Dropdown>
    <Dropdown.Toggle
        variant="secondary"
        id="dropdown-year"
        className="btn btn-light"
        style={{ width: '100%' }}
    >
        {carYear || 'Selecciona un Año'}
    </Dropdown.Toggle>
                <Dropdown.Menu
                    style={{ marginLeft: '0px', textAlign: 'center', width: '100%' }}
                    className="custom-dropdown-menu"
                >
                    {carYears
                        .slice()             // Crear copia para no mutar original
                        .reverse()           // Invertir para que el más nuevo aparezca primero
                        .map((year) => (
                            <Dropdown.Item
                                key={year}
                                onClick={() => {
                                    setCarYear(year);
                                    setCurrentStep(currentStep + 1);
                                }}
                            >
                                {year}
                            </Dropdown.Item>
                        ))}
                </Dropdown.Menu>
            </Dropdown>
            {renderNavigationButtons(!carYear)}

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
                                    onChange={() => handleRoofTypeChange(type)}
                                />
                                <label className="form-check-label" htmlFor={`roof-${type}`} style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={image} alt={type} style={{ width: '90px', height: 'auto', marginRight: '10px' }} />
                                    {type}
                                </label>
                            </div>
                        ))}
                    </form>
                    {renderNavigationButtons(!roofType)}
                </div>
            );
        case 10:
            return (
                <div className="options-container">
                    <h2>Seleccionar Productos</h2>
                    <div className="checkbox-group">
                        {productTypes.map((type, index) => (
                            <div key={index} className="form-check">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id={`product-${type}`} 
                                    value={type} 
                                    checked={productType.includes(type)} 
                                    onChange={() => handleCheckboxChange(type)} 
                                    disabled={type === 'Seleccion de Productos' ? false : productType.includes('Seleccion de Productos')} 
                                />
                                <label className="form-check-label" htmlFor={`product-${type}`}>
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                    {renderNavigationButtons(productType.length === 0, true)}
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
    <>
    <div className="reserve-overlay">
      <button className="close-reserve-btn" onClick={onClose}>×</button>
      <div className="reserve-container">
        {renderStep()}
        {showAlert && <div className="alert alert-danger mt-3">Por favor, completa todos los pasos.</div>}
      </div>
    </div>

    
    {showReservaForm && (
        <ReservaForm onClose={() => setShowReservaForm(false)} />
    )}
    
                    {showReserveOverlay && (
                        <div className="reserve-overlay">
                            <button className="close-reserve-btn" onClick={handleCloseOverlay}>
                                ×
                            </button>
                            <div className="reserve-container">
                                {renderStep()}
                                {showAlert && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        Por favor, completa todos los pasos.
                                        <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
</>
  );
  
};

export default ReservaForm;
