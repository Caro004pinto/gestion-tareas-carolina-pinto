import { pool } from '../config/db.js';

const validateMateria = ({ nombre_materia, id_usuario }) => {
  if (!nombre_materia || typeof nombre_materia !== 'string' || !nombre_materia.trim()) {
    return 'El nombre de la materia es obligatorio';
  }

  if (id_usuario === undefined || id_usuario === null || Number.isNaN(Number(id_usuario))) {
    return 'El id_usuario es obligatorio y debe ser un número válido';
  }

  return null;
};

export const getMaterias = async (req, res) => {
  try {
    const { id_usuario } = req.query;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const query = 'SELECT m.id_materia, m.nombre_materia, m.descripcion, m.id_usuario, u.nombres AS usuario_nombre, u.correo AS usuario_correo FROM materias m LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE m.id_usuario = ?';
    const params = [id_usuario];

    console.log('Query getMaterias:', query);
    console.log('Params getMaterias:', params);
    const [rows] = await pool.query(query, params);
    console.log('Materias encontradas:', rows.length);
    return res.json(rows);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const getMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.query;
    console.log('Obteniendo materia con ID:', id, 'para usuario:', id_usuario);

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const [rows] = await pool.query(
      'SELECT m.id_materia, m.nombre_materia, m.descripcion, m.id_usuario, u.nombres AS usuario_nombre, u.correo AS usuario_correo FROM materias m LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE m.id_materia = ? AND m.id_usuario = ?',
      [id, id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la materia:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const createMateria = async (req, res) => {
  try {
    console.log('=== CREATE MATERIA REQUEST ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    
    const { nombre_materia, descripcion, id_usuario } = req.body;
    
    console.log('Valores extraídos:');
    console.log('- nombre_materia:', nombre_materia, '(', typeof nombre_materia, ')');
    console.log('- descripcion:', descripcion, '(', typeof descripcion, ')');
    console.log('- id_usuario:', id_usuario, '(', typeof id_usuario, ')');
    
    const validationError = validateMateria({ nombre_materia, id_usuario });

    if (validationError) {
      console.log('Error de validación:', validationError);
      return res.status(400).json({ error: validationError });
    }

    const finalNombre = nombre_materia.trim();
    const finalDescripcion = descripcion && descripcion.trim() ? descripcion.trim() : null;
    
    console.log('Valores finales para INSERT:');
    console.log('- nombre_materia:', finalNombre);
    console.log('- descripcion:', finalDescripcion);
    console.log('- id_usuario:', id_usuario);

    const [result] = await pool.query(
      'INSERT INTO materias (nombre_materia, descripcion, id_usuario) VALUES (?, ?, ?)',
      [finalNombre, finalDescripcion, id_usuario]
    );

    console.log('INSERT exitoso. ID de materia creada:', result.insertId);
    return res.status(201).json({ 
      message: 'Materia creada correctamente',
      materiaId: result.insertId 
    });
  } catch (error) {
    console.error('=== ERROR AL CREAR MATERIA ===');
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

export const updateMateria = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== UPDATE MATERIA ===');
    console.log('ID:', id);
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    
    const { nombre_materia, descripcion, id_usuario } = req.body;

    const validationError = validateMateria({ nombre_materia, id_usuario });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const [result] = await pool.query(
      'UPDATE materias SET nombre_materia = ?, descripcion = ?, id_usuario = ? WHERE id_materia = ? AND id_usuario = ?',
      [nombre_materia.trim(), descripcion || null, id_usuario, id, id_usuario]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    console.log('UPDATE exitoso');
    return res.json({ message: 'Materia actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar materia:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const deleteMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.query;
    console.log('=== DELETE MATERIA ===');
    console.log('ID:', id, 'id_usuario:', id_usuario);

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    const [result] = await pool.query('DELETE FROM materias WHERE id_materia = ? AND id_usuario = ?', [id, id_usuario]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Materia no encontrada o no pertenece al usuario' });
    }

    console.log('DELETE exitoso');
    return res.json({ message: 'Materia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar materia:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};
