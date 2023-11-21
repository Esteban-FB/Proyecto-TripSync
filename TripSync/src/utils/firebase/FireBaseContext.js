// FirebaseContext.js

import React, { createContext, useContext } from 'react';
import firestore from './Firebase'; // Importa la instancia de Firestore

// Crea un contexto de Firebase
const FirebaseContext = createContext(null);

// Hook personalizado para acceder al contexto de Firebase
export const useFirebase = () => {
  return useContext(FirebaseContext);
};

// Proveedor del contexto de Firebase
export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={firestore}>
      {children}
    </FirebaseContext.Provider>
  );
};
