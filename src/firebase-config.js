// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDNsQoBlZAQ_nQjEJksUy7K5eRQ0SaTtdY",
  authDomain: "alquilerdecofres-89ebb.firebaseapp.com",
  projectId: "alquilerdecofres-89ebb",
  storageBucket: "alquilerdecofres-89ebb.appspot.com",
  messagingSenderId: "493188188529",
  appId: "1:493188188529:web:df1b3a5c1b5b8593308ed0",
  measurementId: "G-G7X86FB4R2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias de Firebase que necesites
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app; // Exporta la instancia de la aplicación de Firebase
