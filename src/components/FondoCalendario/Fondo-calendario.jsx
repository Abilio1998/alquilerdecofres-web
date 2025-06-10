import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/fondo.css';
import Calendar from 'react-calendar';
import Dropdown from 'react-bootstrap/Dropdown';
import reservaIcon from '../../assets/img/right-arrow.png';
import { firestore } from '../../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import QuienSomos from '../pages/quienesSomos';
import Productos from '../Productos';
import carModelsData from '../../routes/marcas_y_modelos.json';  // Importar el archivo JSON

//IMAGENES
import barra_longitudinal from '../../assets/img/techos/barra-longitudinal.png'
import Railing from '../../assets/img/techos/Railing.png'
import Puntos_de_anclajes from '../../assets/img/techos/puntos-de-anclaje.png'
import Barra_transversales from '../../assets/img/techos/barra-transversales.png'
import Sin_nada from '../../assets/img/techos/sin-nada.png'

const Fondo = () => {
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
        { type: 'Barra transversales', price: 50, image:Barra_transversales},
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

    const handleNextStep = () => {
        if (productType.length > 0) {
            setCurrentStep(currentStep + 1);
        } else {
            alert("Por favor, selecciona al menos un producto.");
        }
    };
    const getRoofTypePrice = (type) => {
        const roof = roofTypes.find((roof) => roof.type === type);
        return roof ? roof.price : 0; // Retorna el precio o 0 si no se encuentra el tipo
    };
    
    const handleConfirm = async (e) => {
        e.preventDefault();
        if (!city || !deliveryDate || !deliveryTime || !returnCity || !returnDate || !carBrand || !carModel || !carYear || !roofType ||!productType.length) {
            setShowAlert(true);
            return;
        }

        // Obtener el precio del techo seleccionado
    const roofPrice = getRoofTypePrice(roofType);
const normalizeString = (str) => str.normalize('NFC');
        try {
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
                roofPrice, // Añadir el precio del techo a la reserva
                productType,
                createdAt: new Date(),
            };

            const reservationsCollection = collection(firestore, 'reservations');
            const docRef = await addDoc(reservationsCollection, reservationData);

            const reservationWithId = {
                ...reservationData,
                id: docRef.id,
            };
            localStorage.setItem('reservationData', JSON.stringify(reservationWithId));


            navigate('/seleccion-de-productos-de-alquiler', { state: { productType } });

        } catch (error) {
            console.error('Error añadiendo documento: ', error);
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

    const handleReserveClick = () => {
        setShowReserveOverlay(true);
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
                    </div>
                );
            case 2:
                return (
                    <div className="options-container">
                        <h2>Seleccionar Fecha de Entrega</h2>
                        <Calendar
                            onChange={handleCalendarChange}
                            value={deliveryDate}
                            minDate={new Date()}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="options-container">
                        <h2>Seleccionar Hora de Entrega</h2>
                        <div className="time-options">
                            {times.map((time) => (
                                <button
                                    key={time}
                                    className="btn btn-light time-option"
                                    onClick={() => handleTimeChange(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
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
                    </div>
                );
            case 5:
                return (
                    <div className="options-container">
                        <h2>Seleccionar Fecha de Devolución</h2>
                        <Calendar
                            onChange={handleCalendarChange}
                            value={returnDate}
                            minDate={deliveryDate || new Date()}
                        />
                    </div>
                );
            case 6:
                return (
                    <div className="options-container">
                        <h2>Seleccionar Marca de Coche</h2>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-brand" >
                                {carBrand || 'Selecciona una Marca'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{width:'200px', textAlign:'center'}}>
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
                    </div>
                );
            case 7:
                return (
                    <div className="options-container">
                        <h2>Seleccionar Modelo de Coche</h2>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-model">
                                {carModel || 'Selecciona un Modelo'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{width:'200px', textAlign:'center'}}>
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
                    </div>
                );
                case 8:
                return (
                   <div className="options-container">
                        <h2>Seleccionar Año del Coche</h2>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-year" style={{width:'175px'}}>
                                {carYear || 'Selecciona un Año'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{width:'100px', marginLeft:'8px', textAlign:'center'}}>
                                {carYears.map((year) => (
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
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!roofType}
                    >
                        Siguiente
                    </button>
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
                            disabled={type === 'Seleccion de Productos' ? false : productType.includes('Seleccion de Productos')} // Deshabilitar si 'Todos' está seleccionado
                        />
                        <label className="form-check-label" htmlFor={`product-${type}`}>
                            {type}
                        </label>
                    </div>
                ))}
            </div>
            <button
                className="btn btn-primary mt-3"
                onClick={handleNextStep}
                disabled={productType.length === 0}
            >
                Siguiente
            </button>
        </div>
                );
                
            case 11:
                return (
                    <div className="options-container">
                        <h2>Confirmar Reserva</h2>
                        <button className="btn btn-success" onClick={handleConfirm}>
                            Confirmar
                        </button>
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
        <div>
            <div className="fondo">
                <h1 className="fondo-title">¡Reserva tu cofre ya!</h1>
                <h3 className='text-center' style={{ fontSize: '0.85rem', color: 'lightgrey' }}>"Descubre el Tesoro de Tus Vacaciones y Reserva Tu Cofre de Experiencias Únicas"</h3>
                <button className="reserve-btn" onClick={handleReserveClick}>
                    Reservar <img src={reservaIcon} alt="Reservar" className="reserve-icon" style={{ width: '25px' }} />
                </button>
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
            </div>
            <Productos />
            <QuienSomos />
        </div>
    );
};

export default Fondo;
