const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { body, validationResult } = require('express-validator'); // Validación
const sql = require('mssql'); // Conexión a SQL Server
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de la conexión a SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Para Azure
        trustServerCertificate: true, // Evitar problemas de certificados
    },
    connectionTimeout: 30000, // Tiempo de espera para la conexión (30 segundos)
    requestTimeout: 30000, // Tiempo de espera para las solicitudes (30 segundos)
};

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: true,
}));
app.use(cors({
    origin: [
        'https://lechugarll.github.io', // GitHub Pages
        'http://localhost:8080',        // Desarrollo local
        'https://gcb-backend-b4f7ffamekdresdb.canadacentral-01.azurewebsites.net/' // Agrega aquí otros dominios si es necesario
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Ruta GET para la raíz
app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de GCB. Todo está funcionando correctamente.');
});

// Endpoint temporal para probar la conexión
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        res.status(200).json({ message: 'Conexión exitosa a la base de datos' });
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos', details: err.message });
    }
});

// CRUD para la tabla Usuario

// Crear un nuevo usuario
app.post(
    '/api/usuarios',
    [
        body('id_usuario').isString().withMessage('El id_usuario debe ser un texto'),
        body('nombre_usuario').isString().withMessage('El nombre_usuario debe ser un texto'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id_usuario, nombre_usuario } = req.body;

        try {
            const pool = await sql.connect(dbConfig);
            await pool.request()
                .input('id_usuario', sql.VarChar, id_usuario)
                .input('nombre_usuario', sql.VarChar, nombre_usuario)
                .query('INSERT INTO Usuario (id_usuario, nombre_usuario) VALUES (@id_usuario, @nombre_usuario)');
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    }
);

// Leer todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Usuario');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Actualizar un usuario
app.put(
    '/api/usuarios/:id',
    [
        body('nombre_usuario').isString().withMessage('El nombre_usuario debe ser un texto'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params; // ID del usuario desde la URL
        const { nombre_usuario } = req.body; // Nuevo nombre del usuario desde el cuerpo de la solicitud

        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request()
                .input('id_usuario', sql.VarChar, id_usuario) // Parámetro para el ID del usuario
                .input('nombre_usuario', sql.VarChar, nombre_usuario) // Parámetro para el nuevo nombre
                .query('UPDATE Usuario SET nombre_usuario = @nombre_usuario WHERE id_usuario = @id_usuario'); // Consulta SQL

            if (result.rowsAffected[0] === 0) {
                // Si no se actualizó ninguna fila, el usuario no existe
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Respuesta exitosa
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        } catch (err) {
            console.error('Error al actualizar el usuario:', err);
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
    }
);

// Eliminar un usuario
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_usuario', sql.VarChar, id)
            .query('DELETE FROM Usuario WHERE id_usuario = @id_usuario');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('CORS habilitado para GitHub Pages y localhost');
});
