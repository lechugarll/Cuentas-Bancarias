import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import UserList from './components/CrudUsuario/UserList.jsx';
import EditUser from './components/CrudUsuario/EditUser.jsx'; // Componente para editar usuario
import AddUser from './components/CrudUsuario/AddUser.jsx'; // Componente para agregar usuario

function Header() {
  const location = useLocation();

  // Determina el título dinámico según la ruta
  const getTitle = () => {
    switch (location.pathname) {
      case '/usuarios':
      case '/add':
      case `/edit/${location.pathname.split('/')[2]}`:
      default:
        //return 'Mantenimiento';
    }
  };

  return (
    <div className="table-header">
      <h1 className="header-title">{getTitle()}</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Header />
        <Routes>
          <Route path="/usuarios" element={<UserList />} />
          <Route path="/add" element={<AddUser />} /> {/* Ruta para agregar usuario */}
          <Route path="/edit/:id" element={<EditUser />} /> {/* Ruta para editar usuario */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
