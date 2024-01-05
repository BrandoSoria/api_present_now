// models/alumnoModel.js
const pool = require('./conexion');
const moment = require('moment');
//version buena
const Alumno = {
  registrar: async (alumno) => {
    const [existente] = await pool.execute('SELECT * FROM alumnos WHERE numero_de_control = ?', [alumno.numero_de_control]);

    if (existente.length > 0) {
      throw new Error('Ya existe un alumno con este número de control');
    }

    const [rows] = await pool.execute('INSERT INTO alumnos (numero_de_control, nombre_completo, grupo, carrera, semestre, materia, horario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [alumno.numero_de_control, alumno.nombre_completo, alumno.grupo, alumno.carrera, alumno.semestre, alumno.materia, alumno.horario]);

    return rows;
  },

  registrarAsistencia: async (alumnoId, asistio, observaciones) => {
    const horaActual = moment().format('HH:mm');
    const [horarioAlumno] = await pool.execute('SELECT horario FROM alumnos WHERE id = ?', [alumnoId]);

    // Verificar y asignar valores predeterminados si son undefined
    const horaRegistro = horarioAlumno && horarioAlumno.length > 0 ? horarioAlumno[0].horario : null;
    const asistioValue = asistio !== undefined ? asistio : null;
    const observacionesValue = observaciones !== undefined ? observaciones : null;

    if (!coincideHorario(horaActual, horaRegistro)) {
      throw new Error('No es el momento adecuado para tomar asistencia');
    }

    function coincideHorario(hora1, hora2) {
      if (!hora2) {
        return false;
      }

      return moment(hora1, 'HH:mm').isSame(moment(hora2, 'HH:mm'));
    }

    const [rows] = await pool.execute('INSERT INTO asistencias (alumno_id, fecha_hora, asistio, observaciones) VALUES (?, NOW(), ?, ?)', [alumnoId, asistioValue, observacionesValue]);
    return rows;
  }
};

module.exports = Alumno;
