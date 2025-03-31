import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Importa estilos globales y Bootstrap

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Verifica que el servidor de desarrollo esté corriendo en el puerto 5173
console.log('React app corriendo en el puerto 5173');
