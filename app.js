require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Agregado para manejar CORS
const morgan = require('morgan'); // Agregado para el registro de solicitudes HTTP
const Alumno = require('./models/alumnoModel');
const pool = require('./models/conexion');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); // Agregado para manejar CORS
app.use(morgan('dev')); // Agregado para el registro de solicitudes HTTP

// Conectar a la base de datos
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
  }
});

// Ruta para registrar un nuevo alumno
app.post('/alumnos', async (req, res) => {
  try {
    const resultado = await Alumno.registrar(req.body);
    console.log('Alumno registrado correctamente en la base de datos:', resultado);

    res.status(201).json({ mensaje: 'Alumno registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar el alumno:', error);
    res.status(500).json({ error: 'Error al registrar el alumno' });
  }
});

// Ruta para registrar la asistencia de un alumno
app.post('/asistencias', async (req, res) => {
  try {
    const { alumno_id, asistio, observaciones } = req.body;

    // Aquí puedes realizar alguna verificación adicional si es necesario
    // ...

    // Luego, registra la asistencia
    const resultado = await Alumno.registrarAsistencia(alumno_id, asistio, observaciones);

    res.status(201).json({ mensaje: 'Asistencia registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar la asistencia:', error);
    res.status(500).json({ error: 'Error al registrar la asistencia' });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Hubo un error en el servidor' });
});

if (process.env.NODE_ENV !== 'production') {
  // Configuración para reiniciar automáticamente en modo de desarrollo
  const server = app.listen(port, () => {
    console.log(`La aplicación está escuchando en http://localhost:${port}`);
  });

  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log('¡Un cliente se ha conectado!');
  });
} else {
  // Configuración para producción
  app.listen(port, () => {
    console.log(`La aplicación está escuchando en http://localhost:${port}`);
  });
}
