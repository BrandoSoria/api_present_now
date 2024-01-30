// models/alumnoModel.js
const pool = require('./conexion');
const moment = require('moment');

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
    const [rows] = await pool.execute('INSERT INTO asistencias (alumno_id, fecha_hora, asistio, observaciones) VALUES (?, NOW(), ?, ?)', [alumnoId, asistio, observaciones]);
    return rows;
  },

  obtenerTodos: async (materia) => {
    // Construir la consulta SQL filtrando por materia si se proporciona
    let sql = 'SELECT * FROM alumnos';
    const params = [];

    if (materia) {
      sql += ' WHERE materia = ?';
      params.push(materia);
    }

    const [alumnos] = await pool.execute(sql, params);
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
  }
};

module.exports = Alumno;
