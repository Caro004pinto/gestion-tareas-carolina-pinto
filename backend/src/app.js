
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import materiaRoutes from './routes/materia.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/materias', materiaRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

export default app;
