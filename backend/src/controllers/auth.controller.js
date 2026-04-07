
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const register = async (req, res) => {
  try {
    console.log('=== REGISTER REQUEST ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    
    const { nombres, apellidos, correo, password } = req.body;

    if (!nombres || !apellidos || !correo || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (!validateEmail(correo)) {
      return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    const [existingUsers] = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const finalApellidos = apellidos.trim();

    console.log('Valores para INSERT:');
    console.log('- nombres:', nombres.trim());
    console.log('- apellidos:', finalApellidos);
    console.log('- correo:', correo);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombres, apellidos, correo, contraseña) VALUES (?, ?, ?, ?)',
      [nombres.trim(), finalApellidos, correo, hash]
    );

    console.log('Usuario registrado con ID:', result.insertId);
    return res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    if (!validateEmail(correo)) {
      return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    const [rows] = await pool.query(
      'SELECT id_usuario, nombres, apellidos, correo, contraseña FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user['contraseña']);

    if (!valid) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    console.log('Login exitoso para usuario:', user.id_usuario);
    return res.json({
      message: 'Login correcto',
      user: {
        id_usuario: user.id_usuario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};
