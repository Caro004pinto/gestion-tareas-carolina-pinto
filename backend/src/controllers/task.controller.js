
import { pool } from '../config/db.js';

const PRIORITY_VALUES = ['baja', 'media', 'alta'];
const STATUS_VALUES = ['pendiente', 'completada'];

const validateTaskPayload = ({ titulo_tarea, fecha_entrega, prioridad, estado, id_usuario, id_materia }) => {
  if (!titulo_tarea || typeof titulo_tarea !== 'string' || !titulo_tarea.trim()) {
    return 'El título de la tarea es obligatorio';
  }

  if (!fecha_entrega || isNaN(Date.parse(fecha_entrega))) {
    return 'La fecha de entrega es obligatoria y debe tener un formato válido';
  }

  if (!prioridad || !PRIORITY_VALUES.includes(prioridad)) {
    return `La prioridad debe ser una de: ${PRIORITY_VALUES.join(', ')}`;
  }

  if (!estado || !STATUS_VALUES.includes(estado)) {
    return `El estado debe ser uno de: ${STATUS_VALUES.join(', ')}`;
  }

  if (id_usuario === undefined || id_usuario === null || Number.isNaN(Number(id_usuario))) {
    return 'El id_usuario es obligatorio y debe ser un número válido';
  }

  if (id_materia === undefined || id_materia === null || Number.isNaN(Number(id_materia))) {
    return 'El id_materia es obligatorio y debe ser un número válido';
  }

  return null;
};

export const getTasks = async (req, res) => {
  try {
    console.log("GET /api/tasks query:", req.query);
    const { id_usuario, id_materia, estado, prioridad } = req.query;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const conditions = ['t.id_usuario = ?'];
    const params = [id_usuario];

    if (id_materia) {
      conditions.push('t.id_materia = ?');
      params.push(id_materia);
    }

    if (estado) {
      conditions.push('t.estado = ?');
      params.push(estado);
    }

    if (prioridad) {
      conditions.push('t.prioridad = ?');
      params.push(prioridad);
    }

    let query = `SELECT t.id_tarea, t.titulo_tarea AS titulo_tarea, t.descripcion, t.fecha_entrega, t.prioridad, t.estado, t.id_usuario, t.id_materia, u.nombres AS usuario_nombre, u.correo AS usuario_correo, m.nombre_materia AS materia_nombre FROM tareas t LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario LEFT JOIN materias m ON t.id_materia = m.id_materia WHERE ${conditions.join(' AND ')}`;

    query += ' ORDER BY t.fecha_entrega ASC, t.id_tarea ASC';

    console.log('Query getTasks:', query);
    console.log('Params getTasks:', params);
    const [rows] = await pool.query(query, params);
    console.log('Tareas encontradas:', rows.length);
    return res.json(rows);
  } catch (error) {
    console.error('Error al listar tareas:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.query;

    console.log('Obteniendo tarea con ID:', id, 'para usuario:', id_usuario);

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const [rows] = await pool.query(
      'SELECT t.id_tarea, t.titulo_tarea AS titulo_tarea, t.descripcion, t.fecha_entrega, t.prioridad, t.estado, t.id_usuario, t.id_materia, u.nombres AS usuario_nombre, u.correo AS usuario_correo, m.nombre_materia AS materia_nombre FROM tareas t LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario LEFT JOIN materias m ON t.id_materia = m.id_materia WHERE t.id_tarea = ? AND t.id_usuario = ?',
      [id, id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    console.log('=== CREATE TASK REQUEST ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    
    const { titulo_tarea, descripcion, fecha_entrega, prioridad, estado, id_usuario, id_materia } = req.body;
    
    console.log('Valores extraídos:');
    console.log('- titulo_tarea:', titulo_tarea, '(', typeof titulo_tarea, ')');
    console.log('- descripcion:', descripcion, '(', typeof descripcion, ')');
    console.log('- fecha_entrega:', fecha_entrega, '(', typeof fecha_entrega, ')');
    console.log('- prioridad:', prioridad, '(', typeof prioridad, ')');
    console.log('- estado:', estado, '(', typeof estado, ')');
    console.log('- id_usuario:', id_usuario, '(', typeof id_usuario, ')');
    console.log('- id_materia:', id_materia, '(', typeof id_materia, ')');
    
    const validationError = validateTaskPayload({ titulo_tarea, fecha_entrega, prioridad, estado, id_usuario, id_materia });

    if (validationError) {
      console.log('Error de validación:', validationError);
      return res.status(400).json({ error: validationError });
    }

    const finalTitulo = titulo_tarea.trim();
    const finalDescripcion = descripcion && descripcion.trim() ? descripcion.trim() : null;
    
    console.log('Valores finales para INSERT:');
    console.log('- titulo_tarea:', finalTitulo);
    console.log('- descripcion:', finalDescripcion);
    console.log('- fecha_entrega:', fecha_entrega);
    console.log('- prioridad:', prioridad);
    console.log('- estado:', estado);
    console.log('- id_usuario:', id_usuario);
    console.log('- id_materia:', id_materia);

    const [materiaRows] = await pool.query(
      'SELECT id_materia FROM materias WHERE id_materia = ? AND id_usuario = ?',
      [id_materia, id_usuario]
    );

    if (materiaRows.length === 0) {
      return res.status(400).json({ error: 'La materia no pertenece a este usuario' });
    }

    const [result] = await pool.query(
      'INSERT INTO tareas (titulo_tarea, descripcion, fecha_entrega, prioridad, estado, id_usuario, id_materia) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [finalTitulo, finalDescripcion, fecha_entrega, prioridad, estado, id_usuario, id_materia]
    );

    console.log('INSERT exitoso. ID de tarea creada:', result.insertId);
    return res.status(201).json({ 
      message: 'Tarea creada correctamente',
      taskId: result.insertId 
    });
  } catch (error) {
    console.error('=== ERROR AL CREAR TAREA ===');
    console.error('Error completo:', error);
    console.error('Mensaje:', error.message);
    console.error('SQLState:', error.sqlState);
    console.error('SQL:', error.sql);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message,
      sqlState: error.sqlState
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== UPDATE TASK ===');
    console.log('ID:', id);
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    
    const { titulo_tarea, descripcion, fecha_entrega, prioridad, estado, id_usuario, id_materia } = req.body;

    if (id_usuario === undefined || id_usuario === null) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const [existing] = await pool.query('SELECT * FROM tareas WHERE id_tarea = ? AND id_usuario = ?', [id, id_usuario]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o no pertenece al usuario' });
    }

    const task = {
      titulo_tarea: titulo_tarea !== undefined ? titulo_tarea : existing[0].titulo_tarea,
      descripcion: descripcion !== undefined ? descripcion : existing[0].descripcion,
      fecha_entrega: fecha_entrega !== undefined ? fecha_entrega : existing[0].fecha_entrega,
      prioridad: prioridad !== undefined ? prioridad : existing[0].prioridad,
      estado: estado !== undefined ? estado : existing[0].estado,
      id_usuario: id_usuario !== undefined ? id_usuario : existing[0].id_usuario,
      id_materia: id_materia !== undefined ? id_materia : existing[0].id_materia
    };

    const validationError = validateTaskPayload(task);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const [materiaRows] = await pool.query(
      'SELECT id_materia FROM materias WHERE id_materia = ? AND id_usuario = ?',
      [task.id_materia, task.id_usuario]
    );

    if (materiaRows.length === 0) {
      return res.status(400).json({ error: 'La materia no pertenece a este usuario' });
    }

    const [result] = await pool.query(
      'UPDATE tareas SET titulo_tarea = ?, descripcion = ?, fecha_entrega = ?, prioridad = ?, estado = ?, id_usuario = ?, id_materia = ? WHERE id_tarea = ? AND id_usuario = ?',
      [task.titulo_tarea.trim(), task.descripcion || null, task.fecha_entrega, task.prioridad, task.estado, task.id_usuario, task.id_materia, id, id_usuario]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    console.log('UPDATE exitoso');
    return res.json({ message: 'Tarea actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.query;
    console.log('=== DELETE TASK ===');
    console.log('ID:', id, 'id_usuario:', id_usuario);

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }
    
    const [result] = await pool.query('DELETE FROM tareas WHERE id_tarea = ? AND id_usuario = ?', [id, id_usuario]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o no pertenece al usuario' });
    }

    console.log('DELETE exitoso');
    return res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};
