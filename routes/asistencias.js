// routes/asistencias.js
const express = require('express');
const router = express.Router();
const pool = require('../models/conexion');
const moment = require('moment');

router.get('/', async (req, res) => {
  try {
    const [asistencias] = await pool.execute('SELECT * FROM asistencias');
    
    // Formatear las fechas antes de enviarlas en la respuesta JSON
    const asistenciasFormateadas = asistencias.map(asistencia => {
      return {
        id: asistencia.id,
        alumno_id: asistencia.alumno_id,
        fecha_hora: moment(asistencia.fecha_hora).format('YYYY-MM-DD HH:mm:ss'),
        asistio: asistencia.asistio,
        observaciones: asistencia.observaciones,
      };
    });

    res.json(asistenciasFormateadas);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
