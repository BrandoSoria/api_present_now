// models/alumnoModel.js
const pool = require('./conexion');

const Alumno = {
  registrar: async (alumno) => {
    const [rows, fields] = await pool.execute('INSERT INTO alumnos (numero_de_control, nombre_completo, grupo, carrera, semestre, materia, horario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [alumno.numero_de_control, alumno.nombre_completo, alumno.grupo, alumno.carrera, alumno.semestre, alumno.materia, alumno.horario]);
    return rows;
  }
};

module.exports = Alumno;
