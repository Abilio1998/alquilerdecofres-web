// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Barranavegacion from './components/barranavegacion';
import FondoCalendario from './components/FondoCalendario/Fondo-calendario';
import Contacto from './pages/Contacto';
import InsertProduct from './components/Administrator/InsertProduct';
import Login from './components/Logeo/Login';
import ReservationPage from './routes/ReservationPage';
import ErrorPage from './pages/ErrorPage'; // Importa la página de error
import Payment from './pages/Payment'; // Importa la página de error
import { AuthProvider } from './context/auth-context';
import ProtectedRoute from './components/Logeo/ProtectedRoute';
import PaymentTermsPage from './pages/PaymentTermsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Base64 } from 'js-base64'; // Importar la librería Base64
import Footer from './components/pages/footer';
import ProductosCards from './components/ProductosCards';
import SelectionProduct from './routes/SelectionProduct';
import './assets/css/App.css';


function App() {
  // El enlace original que deseas cifrar
  const originalLink2 = '/reservar-de-cofres-mataro-barcelona/proceso-reserva-alquiler-de-cofres-mataro';
  // Codificar el enlace usando Base64
  const encryptedLink2 = Base64.encode(originalLink2);

  return (
    <AuthProvider>
      <Router>
        <div className="App wrapper">
          <header className="App-header">
            <Barranavegacion />
            <div className="main-content">
            <Routes>
              <Route path="/" element={<FondoCalendario />} />
              <Route path="/contactar-alquiler-de-cofres" element={<Contacto />} />
              <Route path="/seleccion-de-productos-de-alquiler" element={<SelectionProduct />} />
              <Route path="/login-alquiler-de-cofres" element={<Login />} />
              <Route
                path={`/${encryptedLink2}`}
                element={<ProtectedRoute element={<InsertProduct />} />}
              />
              <Route path="/proceso-reserva-cofres-mataro" element={<ReservationPage />} />
              <Route path="/alquiler-cofres-mataro-barcelona" element={<ProductosCards />} />
              <Route path={`/${Base64.encode('/payment')}`} element={<Payment />} />
              <Route path="/error" element={<ErrorPage />} /> {/* Página de error */}
              <Route path="/terminos-y-condiciones-pago" element={<PaymentTermsPage />} /> {/* Página términos y condiciones */}
               {/* Ruta 404 - debe ir al final */}
           <Route path="*" element={<ErrorPage />} />
            </Routes>
            </div>
            </header>
        </div>
        <footer>
          <Footer/>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
