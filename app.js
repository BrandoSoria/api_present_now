// app.js
const express = require('express');
const bodyParser = require('body-parser');
const Alumno = require('./models/alumnoModel');
const pool = require('./models/conexion');

const app = express();
const port = 3000;

app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
