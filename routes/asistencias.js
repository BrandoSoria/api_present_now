const express = require('express');
const router = express.Router();
const pool = require('../models/conexion');
const moment = require('moment-timezone');  // Importa moment-timezone

// Configura la zona horaria local (México)
const zonaHorariaLocal = 'America/Mexico_City';

router.get('/', async (req, res) => {
  try {
    const [asistencias] = await pool.execute('SELECT * FROM asistencias');
    
    // Formatear y convertir las fechas a la zona horaria local
    const asistenciasFormateadas = asistencias.map(asistencia => {
      // Convierte `fecha_hora` a la zona horaria local
      const fechaHoraLocal = moment(asistencia.fecha_hora)
        .tz(zonaHorariaLocal)  // Convierte a la zona horaria local
        .format('YYYY-MM-DD HH:mm:ss');  // Formatea la fecha y hora
      
      return {
        id: asistencia.id,
        alumno_id: asistencia.alumno_id,
        fecha_hora: fechaHoraLocal,  // Utiliza la fecha y hora local
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
