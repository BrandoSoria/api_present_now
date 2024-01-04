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
  },

  registrarAsistencia: async (alumnoId, asistio, observaciones) => {
    // Obtener la hora actual en formato de 24 horas (HH:mm)
    const ahora = new Date();
    const horaActual = ahora.getHours() + ':' + (ahora.getMinutes() < 10 ? '0' : '') + ahora.getMinutes();

    // Consultar el horario registrado para el alumno
    const [horarioAlumno] = await pool.execute('SELECT horario FROM alumnos WHERE id = ?', [alumnoId]);

    // Comparar solo las horas y minutos con un margen de tolerancia de 5 minutos
    if (!coincideHorario(horaActual, horarioAlumno[0].horario, 5)) {
      throw new Error('No es el momento adecuado para tomar asistencia');
    }

    // Función para verificar si el horario coincide con un margen de tolerancia en minutos
    function coincideHorario(hora1, hora2, margen) {
      const [h1, m1] = hora1.split(':').map(Number);
      const [h2, m2] = hora2.split(':').map(Number);

      const diferenciaMinutos = Math.abs((h1 - h2) * 60 + (m1 - m2));
      return diferenciaMinutos <= margen;
    }

    // Continuar con el registro de asistencia
    const [rows] = await pool.execute('INSERT INTO asistencias (alumno_id, fecha_hora, asistio, observaciones) VALUES (?, NOW(), ?, ?)', [alumnoId, asistio, observaciones]);
    return rows;
  }
};

module.exports = Alumno;
