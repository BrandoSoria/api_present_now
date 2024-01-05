// models/alumnoModel.js
const pool = require('./conexion');
const moment = require('moment'); // Importa moment

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
    const horaActual = moment().format('HH:mm');

    // Consultar el horario registrado para el alumno
    const [horarioAlumno] = await pool.execute('SELECT horario FROM alumnos WHERE id = ?', [alumnoId]);

    // Verificar y reemplazar los valores undefined por null
    const horaRegistro = horarioAlumno && horarioAlumno.length > 0 ? horarioAlumno[0].horario : null;
    const asistioValue = asistio !== undefined ? asistio : null;
    const observacionesValue = observaciones !== undefined ? observaciones : null;

    // Comparar el horario con tolerancia de 10 minutos
    if (!coincideHorarioConTolerancia(horaActual, horaRegistro, 10)) {
      throw new Error('No es el momento adecuado para tomar asistencia');
    }

    // Función para verificar si el horario coincide con tolerancia
    function coincideHorarioConTolerancia(hora1, hora2, toleranciaMinutos) {
      if (!hora2) {
        return false;
      }

      const momentHora1 = moment(hora1, 'HH:mm');
      const momentHora2 = moment(hora2, 'HH:mm');

      // Verificar si la diferencia en minutos entre las dos horas es menor o igual a la tolerancia
      const diferenciaMinutos = momentHora1.diff(momentHora2, 'minutes');
      return Math.abs(diferenciaMinutos) <= toleranciaMinutos;
    }

    // Continuar con el registro de asistencia
    const [rows] = await pool.execute('INSERT INTO asistencias (alumno_id, fecha_hora, asistio, observaciones) VALUES (?, NOW(), ?, ?)', [alumnoId, asistioValue, observacionesValue]);
    return rows;
  },
  obtenerTodos: async () => {
    const [alumnos] = await pool.execute('SELECT * FROM alumnos');
    return alumnos;
  },
  obtenerPorId: async (alumnoId) => {
    const [alumno] = await pool.execute('SELECT * FROM alumnos WHERE id = ?', [alumnoId]);
    return alumno[0];
  },
  eliminar: async (alumnoId) => {
    const [resultado] = await pool.execute('DELETE FROM alumnos WHERE id = ?', [alumnoId]);
    return resultado;
  },
  actualizar: async (alumnoId, nuevoDatos) => {
    try {
      // Construir la consulta SQL con los marcadores de posición
      const sql = 'UPDATE alumnos SET numero_de_control = ?, nombre_completo = ?, grupo = ?, carrera = ?, semestre = ?, materia = ?, horario = ? WHERE id = ?';
  
      // Ejecutar la consulta con los datos actualizados y el ID del alumno
      const [resultado] = await pool.execute(sql, [
        nuevoDatos.numero_de_control,
        nuevoDatos.nombre_completo,
        nuevoDatos.grupo,
        nuevoDatos.carrera,
        nuevoDatos.semestre,
        nuevoDatos.materia,
        nuevoDatos.horario,
        alumnoId
      ]);
  
      return resultado;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

};

module.exports = Alumno;
