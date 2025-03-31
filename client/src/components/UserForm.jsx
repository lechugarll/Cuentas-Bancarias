import React, { useState, useEffect } from 'react';
import { TextField, Button, Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ id_usuario: '', nombre_usuario: '' });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/usuarios/${id}`)
        .then(response => setFormData(response.data))
        .catch(error => console.error('Error al obtener usuario:', error));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axios.put(`http://localhost:5000/api/usuarios/${id}`, formData)
        .then(() => navigate('/'))
        .catch(error => console.error('Error al actualizar usuario:', error));
    } else {
      axios.post('http://localhost:5000/api/usuarios', formData)
        .then(() => navigate('/'))
        .catch(error => console.error('Error al crear usuario:', error));
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ID Usuario"
          value={formData.id_usuario}
          onChange={(e) => setFormData({ ...formData, id_usuario: e.target.value })}
          fullWidth
          margin="normal"
          disabled={!!id}
        />
        <TextField
          label="Nombre Usuario"
          value={formData.nombre_usuario}
          onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          {id ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </Container>
  );
}

export default UserForm;
