import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import {
  CheckSquare,
  Clock,
  BookOpen,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const TASKS_URL = 'http://localhost:4000/api/tasks';
const MATERIAS_URL = 'http://localhost:4000/api/materias';

const priorityBadgeStyle = (priority) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'media':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
};

const priorityIcon = (priority) => {
  switch (priority) {
    case 'alta':
      return <AlertCircle className="h-3.5 w-3.5" />;
    case 'media':
      return <Clock className="h-3.5 w-3.5" />;
    default:
      return <CheckCircle2 className="h-3.5 w-3.5" />;
  }
};

function DashboardPage({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id_usuario) {
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksResponse, materiasResponse] = await Promise.all([
          axios.get(TASKS_URL, { params: { id_usuario: user.id_usuario } }),
          axios.get(MATERIAS_URL, { params: { id_usuario: user.id_usuario } })
        ]);

        setTasks(tasksResponse.data);
        setMaterias(materiasResponse.data);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudo cargar la información del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.estado === 'pendiente'),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.estado === 'completada'),
    [tasks]
  );

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.estado !== 'completada')
        .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega))
        .slice(0, 4),
    [tasks]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HERO / BIENVENIDA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-8 rounded-3xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] p-8 shadow-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-100">
                Dashboard Académico
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                Hola, {user?.nombres || 'Estudiante'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Revisa tus tareas pendientes, completadas y las próximas fechas de entrega.
                Mantén todo organizado en un solo lugar.
              </p>
            </div>

            <Link
              to="/tasks"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#1e3a8a] shadow-lg transition hover:bg-gray-100"
            >
              Ir a tareas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* MENSAJE DE ERROR */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="dashboard-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-6 flex items-start space-x-3 rounded-2xl border border-red-200 bg-red-50 p-4"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="mt-0.5 text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GRID GENERAL */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-6 xl:col-span-2">

            {/* CARDS MÉTRICAS */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {/* Pendientes */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                whileHover={{ y: -2, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-orange-100 p-3">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                  Pendientes
                </p>
                <p className="mt-2 text-4xl font-semibold text-gray-900">
                  {loading ? '...' : pendingTasks.length}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Tareas por completar
                </p>
              </motion.div>

              {/* Completadas */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-green-100 p-3">
                    <CheckSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                  Completadas
                </p>
                <p className="mt-2 text-4xl font-semibold text-gray-900">
                  {loading ? '...' : completedTasks.length}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Tareas finalizadas
                </p>
              </motion.div>

              {/* Materias */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
                whileHover={{ y: -2, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg sm:col-span-2 lg:col-span-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-blue-100 p-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                  Materias
                </p>
                <p className="mt-2 text-4xl font-semibold text-gray-900">
                  {loading ? '...' : materias.length}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Materias activas
                </p>
              </motion.div>
            </div>

            {/* BLOQUE EXTRA OPCIONAL */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Resumen rápido
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Aquí puedes visualizar de forma general tu avance académico y mantener
                controladas tus entregas más importantes.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-700">Total de tareas</p>
                  <p className="mt-2 text-2xl font-semibold text-blue-900">
                    {loading ? '...' : tasks.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-700">En progreso</p>
                  <p className="mt-2 text-2xl font-semibold text-amber-900">
                    {loading ? '...' : pendingTasks.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-700">Avance</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-900">
                    {loading
                      ? '...'
                      : tasks.length > 0
                      ? `${Math.round((completedTasks.length / tasks.length) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="xl:col-span-1">
            <div className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-md">

              {/* HEADER */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                    Próximas Tareas
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    Lo siguiente
                  </h2>
                </div>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {loading ? '...' : `${upcomingTasks.length} pendientes`}
                </span>
              </div>

              {/* LISTA */}
              <div className="space-y-4">
                {loading ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
                    Cargando próximas tareas...
                  </div>
                ) : upcomingTasks.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      ¡Todo al día! No hay tareas próximas.
                    </p>
                  </div>
                ) : (
                  upcomingTasks.map((task) => (
                    <motion.div
                      key={task.id_tarea}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      whileHover={{ y: -1 }}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-blue-300 hover:shadow-sm"
                    >
                      {/* Título + prioridad */}
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold leading-snug text-gray-900">
                          {task.titulo_tarea}
                        </h3>
                        <span
                          className={`flex items-center space-x-1 whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${priorityBadgeStyle(task.prioridad)}`}
                        >
                          {priorityIcon(task.prioridad)}
                          <span>{task.prioridad}</span>
                        </span>
                      </div>

                      {/* Materia */}
                      <p className="mb-2 flex items-center text-xs text-gray-600">
                        <BookOpen className="mr-1 h-3 w-3" />
                        {task.materia_nombre || task.nombre_materia || 'Sin materia'}
                      </p>

                      {/* Fecha y estado */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-gray-600">
                          <Calendar className="mr-1 h-3 w-3" />
                          {task.fecha_entrega?.slice(0, 10)}
                        </span>
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 font-medium text-gray-700">
                          {task.estado}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;