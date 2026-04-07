
CREATE DATABASE gestion_tareas_academicas;
USE gestion_tareas_academicas;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(50) NOT NULL,
  apellidos VARCHAR(50),
  correo VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE materias (
  id_materia INT AUTO_INCREMENT PRIMARY KEY,
  nombre_materia VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tareas (
  id_tarea INT AUTO_INCREMENT PRIMARY KEY,
  titulo_tarea VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  fecha_entrega DATE,
  prioridad ENUM('baja','media','alta') DEFAULT 'media',
  estado ENUM('pendiente','completada') DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_materia INT,
  id_usuario INT,
  FOREIGN KEY (id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
