import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditUser() {
  const location = useLocation(); // Obtiene el estado pasado desde la navegación
  const navigate = useNavigate();
  const { id_usuario, nombre_usuario } = location.state || {}; // Obtiene los valores del usuario desde el estado

  const [nombreUsuario, setNombreUsuario] = useState(nombre_usuario || ''); // Inicializa con el nombre recibido

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica que el nombre no esté vacío
    if (!nombreUsuario.trim()) {
      console.error('El campo de nombre no puede estar vacío.');
      return;
    }

    try {
      // Envía los datos actualizados al backend
      await axios.put(`http://localhost:5000/api/usuarios/${id_usuario}`, { nombre_usuario: nombreUsuario });
      console.log('Usuario actualizado:', { id_usuario, nombre_usuario: nombreUsuario });

      // Redirige a la lista de usuarios con un mensaje de éxito
      navigate('/usuarios', { state: { successMessage: 'Usuario actualizado exitosamente.' } });
    } catch (error) {
      console.error('Error al editar usuario:', error);
    }
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
              <h2 className="card-title text-center mb-4">Editar Usuario</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="idUsuario" className="form-label">ID de Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="idUsuario"
                    value={id_usuario || ''} // Muestra el ID recibido
                    disabled // Campo bloqueado
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nombreUsuario" className="form-label">Nombre de Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreUsuario"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)} // Actualiza el estado con el nuevo valor
                    required
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
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

export default EditUser;
