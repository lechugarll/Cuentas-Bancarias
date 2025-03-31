import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [alertMessage, setAlertMessage] = useState(''); // Mensaje de alerta
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [userToDelete, setUserToDelete] = useState(null); // Usuario seleccionado para eliminar
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5000/api/usuarios')
      .then(response => {
        // Ordena los usuarios en orden descendente por ID
        const sortedUsers = response.data.sort((a, b) => a.id_usuario - b.id_usuario);
        setUsers(sortedUsers);
      })
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setAlertMessage(location.state.successMessage);
      setTimeout(() => setAlertMessage(''), 3000); // Limpia el mensaje después de 3 segundos
    }
  }, [location.state]);

  const handleDelete = () => {
    if (userToDelete) {
      axios.delete(`http://localhost:5000/api/usuarios/${userToDelete}`)
        .then(() => {
          setUsers(users.filter(user => user.id_usuario !== userToDelete));
          setAlertMessage('Usuario eliminado exitosamente'); // Establece el mensaje de éxito
          setTimeout(() => setAlertMessage(''), 3000); // Limpia el mensaje después de 3 segundos
        })
        .catch(error => console.error('Error al eliminar usuario:', error))
        .finally(() => setShowModal(false)); // Cierra el modal
    }
  };

  const handleEdit = (id, nombre) => {
    navigate(`/edit/${id}`, { state: { id_usuario: id, nombre_usuario: nombre } }); // Pasa los datos al componente de edición
  };

  const handleAddUser = () => {
    navigate('/add');
  };

  const openModal = (id) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="card-title">Usuarios</h2>
                <button className="btn btn-primary" onClick={handleAddUser}>
                  Agregar Usuario
                </button>
              </div>

              {/* Alerta de Bootstrap */}
              {alertMessage && (
                <div className="alert alert-success" role="alert">
                  {alertMessage}
                </div>
              )}

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Usuario</TableCell>
                      <TableCell>Nombre Usuario</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id_usuario}>
                        <TableCell>{user.id_usuario}</TableCell>
                        <TableCell>{user.nombre_usuario}</TableCell>
                        <TableCell>
                          <button
                            className="btn btn-info me-2"
                            onClick={() => handleEdit(user.id_usuario, user.nombre_usuario)} // Pasa el ID y el nombre
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => openModal(user.id_usuario)}
                          >
                            Eliminar
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este usuario?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
