import { pool } from './src/config/db.js';
import bcrypt from 'bcrypt';

async function insertTestData() {
  try {
    // Insertar usuario
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [userResult] = await pool.query(
      'INSERT INTO usuarios (nombres, apellidos, correo, contraseña) VALUES (?, ?, ?, ?)',
      ['Test', 'User', 'test@example.com', hashedPassword]
    );
    console.log('Usuario insertado, ID:', userResult.insertId);

    // Insertar materia
    const [materiaResult] = await pool.query(
      'INSERT INTO materias (nombre_materia, descripcion, id_usuario) VALUES (?, ?, ?)',
      ['Matemáticas', 'Materia de prueba', userResult.insertId]
    );
    console.log('Materia insertada, ID:', materiaResult.insertId);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertTestData();