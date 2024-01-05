// routes/alumnos.js
const express = require('express');
const router = express.Router();
const Alumno = require('../models/alumnoModel');

router.get('/', async (req, res) => {
  try {
    const alumnos = await Alumno.obtenerTodos();
    res.json(alumnos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

router.get('/:id', async (req, res) => {
  const alumnoId = req.params.id;

  try {
    const alumno = await Alumno.obtenerPorId(alumnoId);

    if (!alumno) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' });
    }

    res.json(alumno);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

router.delete('/:id', async (req, res) => {
  const alumnoId = req.params.id;

  try {
    const resultado = await Alumno.eliminar(alumnoId);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' });
    }

    res.json({ mensaje: 'Alumno eliminado correctamente' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

router.put('/:id', async (req, res) => {
    const alumnoId = req.params.id;
    const nuevoDatos = req.body;
  
    try {
      const resultado = await Alumno.actualizar(alumnoId, nuevoDatos);
  
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Alumno no encontrado' });
      }
  
      res.json({ mensaje: 'Alumno actualizado correctamente' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
  });

module.exports = router;
