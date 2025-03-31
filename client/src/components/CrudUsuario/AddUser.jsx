import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddUser() {
  const [idUsuario, setIdUsuario] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [existingIds, setExistingIds] = useState([]); // Lista de IDs existentes
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error
  const navigate = useNavigate();

  useEffect(() => {
    // Obtiene los IDs existentes
    axios.get('http://localhost:5000/api/usuarios')
      .then(response => setExistingIds(response.data.map(user => user.id_usuario)))
      .catch(error => console.error('Error al obtener IDs existentes:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingIds.includes(idUsuario)) {
      setErrorMessage('El ID ingresado ya existe. Por favor, elige otro.');
      return;
    }
    axios.post('http://localhost:5000/api/usuarios', { id_usuario: idUsuario, nombre_usuario: nombreUsuario })
      .then(() => {
        navigate('/usuarios', { state: { successMessage: 'Usuario agregado exitosamente.' } }); // Redirige con mensaje
      })
      .catch(error => console.error('Error al agregar usuario:', error));
  };

  const handleCancel = () => {
    navigate('/usuarios'); // Redirige a la lista de usuarios
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Agregar Usuario</h2>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="idUsuario" className="form-label">ID de Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="idUsuario"
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nombreUsuario" className="form-label">Nombre de Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreUsuario"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">Guardar</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
