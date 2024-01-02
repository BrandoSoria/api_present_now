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
    res.status(201).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el alumno' });
  }
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
