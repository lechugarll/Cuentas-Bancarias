# Documentación de la API - GCB App

Esta documentación describe los endpoints disponibles en el servidor de GCB App.

---

## **Base URL**
```
http://localhost:5000
```

---

## **Endpoints**

### 1. Probar conexión a la base de datos
**URL:** `/api/test-db`  
**Método:** `GET`  
**Descripción:** Verifica la conexión con la base de datos.

#### Respuesta exitosa:
```json
{
  "message": "Conexión exitosa a la base de datos"
}
```

#### Respuesta de error:
```json
{
  "error": "Error al conectar a la base de datos",
  "details": "Detalles del error"
}
```

---

### 2. Crear un nuevo usuario
**URL:** `/api/usuarios`  
**Método:** `POST`  
**Descripción:** Crea un nuevo usuario en la base de datos.

#### Parámetros del cuerpo (JSON):
| Campo          | Tipo   | Requerido | Descripción               |
|-----------------|--------|-----------|---------------------------|
| `id_usuario`    | String | Sí        | Identificador único del usuario. |
| `nombre_usuario`| String | Sí        | Nombre del usuario.       |

#### Ejemplo de solicitud:
```json
{
  "id_usuario": "user123",
  "nombre_usuario": "Juan Pérez"
}
```

#### Respuesta exitosa:
```json
{
  "message": "Usuario creado exitosamente"
}
```

#### Respuesta de error:
```json
{
  "errors": [
    {
      "msg": "El id_usuario debe ser un texto",
      "param": "id_usuario",
      "location": "body"
    }
  ]
}
```

---

### 3. Obtener todos los usuarios
**URL:** `/api/usuarios`  
**Método:** `GET`  
**Descripción:** Obtiene una lista de todos los usuarios registrados.

#### Respuesta exitosa:
```json
[
  {
    "id_usuario": "user123",
    "nombre_usuario": "Juan Pérez"
  }
]
```

#### Respuesta de error:
```json
{
  "error": "Error al obtener los usuarios"
}
```

---

### 4. Actualizar un usuario
**URL:** `/api/usuarios/:id`  
**Método:** `PUT`  
**Descripción:** Actualiza el nombre de un usuario existente.

#### Parámetros de la URL:
| Campo | Tipo   | Requerido | Descripción                     |
|-------|--------|-----------|---------------------------------|
| `id`  | String | Sí        | Identificador único del usuario.|

#### Parámetros del cuerpo (JSON):
| Campo          | Tipo   | Requerido | Descripción               |
|-----------------|--------|-----------|---------------------------|
| `nombre_usuario`| String | Sí        | Nuevo nombre del usuario. |

#### Ejemplo de solicitud:
```json
{
  "nombre_usuario": "Juan Carlos Pérez"
}
```

#### Respuesta exitosa:
```json
{
  "message": "Usuario actualizado exitosamente"
}
```

#### Respuesta de error:
```json
{
  "error": "Usuario no encontrado"
}
```

---

### 5. Eliminar un usuario
**URL:** `/api/usuarios/:id`  
**Método:** `DELETE`  
**Descripción:** Elimina un usuario de la base de datos.

#### Parámetros de la URL:
| Campo | Tipo   | Requerido | Descripción                     |
|-------|--------|-----------|---------------------------------|
| `id`  | String | Sí        | Identificador único del usuario.|

#### Respuesta exitosa:
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

#### Respuesta de error:
```json
{
  "error": "Usuario no encontrado"
}
```

---

## **Notas**
- Todos los endpoints devuelven respuestas en formato JSON.
- Asegúrate de enviar los datos requeridos en el formato correcto para evitar errores de validación.