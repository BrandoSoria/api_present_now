// models/alumnoModel.js
const pool = require('./conexion');

const Alumno = {
  registrar: async (alumno) => {
    // Verificar si ya existe un alumno con el mismo número de control
    const [existente] = await pool.execute('SELECT * FROM alumnos WHERE numero_de_control = ?', [alumno.numero_de_control]);

    if (existente.length > 0) {
      throw new Error('Ya existe un alumno con este número de control');
    }

    // Si no existe, proceder con la inserción
    const [rows] = await pool.execute('INSERT INTO alumnos (numero_de_control, nombre_completo, grupo, carrera, semestre, materia, horario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [alumno.numero_de_control, alumno.nombre_completo, alumno.grupo, alumno.carrera, alumno.semestre, alumno.materia, alumno.horario]);
    
    return rows;
  }
};

module.exports = Alumno;
