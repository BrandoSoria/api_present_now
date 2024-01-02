// app.js
const express = require('express');
const bodyParser = require('body-parser');
const Alumno = require('./models/alumnoModel');
const pool = require('./models/conexion');

const app = express();
const port = 3000;

app.use(bodyParser.json());

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
