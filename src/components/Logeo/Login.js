import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import app from '../../firebase-config';
import { Base64 } from 'js-base64'; // Importar Base64
import { useAuth } from '../../context/auth-context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);
  const navigate = useNavigate();

   const { user } = useAuth();

   useEffect(() => {
    if (user) {
      // Redirige automáticamente si ya está autenticado
      const originalLink = '/reservar-de-cofres-mataro-barcelona/proceso-reserva-alquiler-de-cofres-mataro';
      const encryptedLink = Base64.encode(originalLink);
      navigate(`/${encryptedLink}`);
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Codificar la ruta con Base64
      const originalLink = '/reservar-de-cofres-mataro-barcelona/proceso-reserva-alquiler-de-cofres-mataro';
      const encryptedLink = Base64.encode(originalLink);

      // Navegar a la ruta cifrada
      navigate(`/${encryptedLink}`);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      alert('Error de inicio de sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 style={{marginTop:'100px'}}>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
