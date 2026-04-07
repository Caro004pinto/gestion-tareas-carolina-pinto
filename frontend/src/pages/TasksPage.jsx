import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import {
  ClipboardList,
  PlusCircle,
  BookOpen,
  Filter,
  Calendar,
  Flag,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  Layers3
} from 'lucide-react';

const API_URL = 'http://localhost:4000/api/tasks';
const MATERIAS_URL = 'http://localhost:4000/api/materias';
const PRIORITY_OPTIONS = ['baja', 'media', 'alta'];
const STATUS_OPTIONS = ['pendiente', 'completada'];

const badgeClasses = {
  alta: 'bg-red-50 text-red-700 border border-red-200',
  media: 'bg-amber-50 text-amber-700 border border-amber-200',
  baja: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
};

const statusClasses = {
  pendiente: 'bg-slate-100 text-slate-700 border border-slate-200',
  completada: 'bg-green-50 text-green-700 border border-green-200'
};

const getPriorityBadge = (priority) => badgeClasses[priority] || badgeClasses.baja;
const getStatusBadge = (estado) => statusClasses[estado] || statusClasses.pendiente;

const initialFormState = {
  titulo: '',
  descripcion: '',
  fecha_entrega: '',
  prioridad: 'media',
  estado: 'pendiente',
  id_materia: ''
};

function TasksPage({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [filters, setFilters] = useState({ estado: '', prioridad: '' });
  const [form, setForm] = useState(initialFormState);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showMateriaForm, setShowMateriaForm] = useState(false);
  const [materiaForm, setMateriaForm] = useState({ nombre_materia: '', descripcion: '' });

  const loadMaterias = async () => {
    try {
      const response = await axios.get(`${MATERIAS_URL}?id_usuario=${user?.id_usuario}`);
      setMaterias(response.data);
    } catch (err) {
      console.error('Error al cargar materias:', err);
    }
  };

  const loadTasks = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams();

    if (user?.id_usuario) params.append('id_usuario', user.id_usuario);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.prioridad) params.append('prioridad', filters.prioridad);

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    setTasks(response.data);
  } catch (err) {
    console.error('Error al cargar tareas:', err);
    setError('No se pudieron cargar las tareas.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (!user?.id_usuario) {
      return;
    }

    loadMaterias();
    loadTasks();
  }, [user]);

  const resetForm = () => {
    setSelectedTask(null);
    setForm(initialFormState);
    setError('');
  };

  const handleFormChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (!form.titulo.trim()) return 'El título es obligatorio.';
    if (!form.fecha_entrega) return 'La fecha de entrega es obligatoria.';
    if (!PRIORITY_OPTIONS.includes(form.prioridad)) return 'Selecciona una prioridad válida.';
    if (!STATUS_OPTIONS.includes(form.estado)) return 'Selecciona un estado válido.';
    if (!form.id_materia || Number.isNaN(Number(form.id_materia))) return 'La materia es obligatoria.';
    return null;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      titulo_tarea: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      fecha_entrega: form.fecha_entrega,
      prioridad: form.prioridad,
      estado: form.estado,
      id_usuario: user?.id_usuario,
      id_materia: Number(form.id_materia)
    };

    try {
      setSaving(true);
      if (selectedTask) {
        await axios.put(`${API_URL}/${selectedTask.id_tarea}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      await loadTasks();
      resetForm();
    } catch (err) {
      console.error('Error al guardar tarea:', err);
      setError(err?.response?.data?.error || 'No se pudo guardar la tarea.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${taskId}`, { params: { id_usuario: user?.id_usuario } });
      await loadTasks();
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      setError(err?.response?.data?.error || 'No se pudo eliminar la tarea.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setForm({
      titulo: task.titulo_tarea || '',
      descripcion: task.descripcion || '',
      fecha_entrega: task.fecha_entrega?.slice(0, 10) || '',
      prioridad: task.prioridad || 'media',
      estado: task.estado || 'pendiente',
      id_materia: task.id_materia || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateMateria = async (event) => {
    event.preventDefault();
    if (!materiaForm.nombre_materia.trim()) {
      setError('El nombre de la materia es obligatorio.');
      return;
    }

    try {
      await axios.post(MATERIAS_URL, {
        nombre_materia: materiaForm.nombre_materia.trim(),
        descripcion: materiaForm.descripcion.trim() || null,
        id_usuario: user?.id_usuario
      });
      setMateriaForm({ nombre_materia: '', descripcion: '' });
      setShowMateriaForm(false);
      loadMaterias();
    } catch (err) {
      console.error('Error al crear materia:', err);
      setError('No se pudo crear la materia.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-8 rounded-3xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] p-8 shadow-lg"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-100">
                Gestión de tareas
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-white">
                Organiza tus actividades
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-blue-100 leading-6">
                Crea, edita, elimina y filtra tus tareas académicas en un solo lugar. 
                Mantén todo claro y organizado por prioridad, estado y materia.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => setFilters({ estado: '', prioridad: '' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1e3a8a] shadow-md transition hover:bg-blue-50"
            >
              Limpiar filtros
            </motion.button>
          </div>
        </motion.div>

        {/* ERROR GLOBAL */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="tasks-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-6">
            
            {/* FORM TAREA */}
            <section className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedTask ? 'Editar tarea' : 'Crear tarea'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Completa la información para guardar una tarea.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMateriaForm(!showMateriaForm)}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 border border-green-200 transition hover:bg-green-100"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {showMateriaForm ? 'Ocultar' : 'Nueva materia'}
                  </button>

                  {selectedTask && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSave}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Título</label>
                  <input
                    value={form.titulo}
                    onChange={(e) => handleFormChange('titulo', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    placeholder="Ej. Estudiar para el parcial"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => handleFormChange('descripcion', e.target.value)}
                    className="h-24 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    placeholder="Detalles opcionales sobre la tarea"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Fecha de entrega</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={form.fecha_entrega}
                        onChange={(e) => handleFormChange('fecha_entrega', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Materia</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <select
                        value={form.id_materia}
                        onChange={(e) => handleFormChange('id_materia', e.target.value)}
                        className="w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                      >
                        <option value="">Seleccionar materia</option>
                        {materias.map((materia) => (
                          <option key={materia.id_materia} value={materia.id_materia}>
                            {materia.nombre_materia}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Prioridad</label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <select
                        value={form.prioridad}
                        onChange={(e) => handleFormChange('prioridad', e.target.value)}
                        className="w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <select
                        value={form.estado}
                        onChange={(e) => handleFormChange('estado', e.target.value)}
                        className="w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                  className="w-full rounded-xl bg-[#1e3a8a] hover:bg-[#3b82f6] text-white font-medium py-3 px-4 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : selectedTask ? 'Actualizar tarea' : 'Crear tarea'}
                </motion.button>
              </form>
            </section>

            {/* FORM MATERIA */}
            <AnimatePresence>
              {showMateriaForm && (
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="rounded-2xl bg-white p-6 shadow-md border border-gray-100"
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Crear materia</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Agrega una nueva materia para asignarla a tus tareas.
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => setShowMateriaForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Cancelar
                  </motion.button>
                </div>

                <form className="space-y-4" onSubmit={handleCreateMateria}>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Nombre de la materia</label>
                    <input
                      value={materiaForm.nombre_materia}
                      onChange={(e) => setMateriaForm(prev => ({ ...prev, nombre_materia: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                      placeholder="Ej. Matemáticas"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      value={materiaForm.descripcion}
                      onChange={(e) => setMateriaForm(prev => ({ ...prev, descripcion: e.target.value }))}
                      className="h-20 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                      placeholder="Descripción opcional"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Crear materia
                  </motion.button>
                </form>
              </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* COLUMNA DERECHA */}
          <section className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="h-5 w-5 text-[#1e3a8a]" />
                  <h2 className="text-xl font-semibold text-gray-900">Lista de tareas</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Filtra, administra y revisa todas tus tareas académicas.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 border border-blue-200">
                <Layers3 className="h-4 w-4" />
                {loading ? 'Cargando...' : `${tasks.length} tarea(s)`}
              </div>
            </div>

            {/* FILTROS */}
            <div className="mb-6 rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-800">Filtros</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={filters.estado}
                    onChange={(e) => setFilters((prev) => ({ ...prev, estado: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  >
                    <option value="">Todos</option>
                    {STATUS_OPTIONS.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Prioridad</label>
                  <select
                    value={filters.prioridad}
                    onChange={(e) => setFilters((prev) => ({ ...prev, prioridad: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  >
                    <option value="">Todas</option>
                    {PRIORITY_OPTIONS.map((prioridad) => (
                      <option key={prioridad} value={prioridad}>{prioridad}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <motion.button
                    type="button"
                    onClick={loadTasks}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-[#1e3a8a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                  >
                    Aplicar filtros
                  </motion.button>
                </div>
              </div>
            </div>

            {/* TABLA DESKTOP */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600">
                    <th className="px-5 py-4 font-semibold">Título</th>
                    <th className="px-5 py-4 font-semibold">Estado</th>
                    <th className="px-5 py-4 font-semibold">Prioridad</th>
                    <th className="px-5 py-4 font-semibold">Entrega</th>
                    <th className="px-5 py-4 font-semibold">Materia</th>
                    <th className="px-5 py-4 font-semibold">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-gray-500">
                        Cargando tareas...
                      </td>
                    </tr>
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-gray-500">
                        No hay tareas disponibles.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <motion.tr
                        key={task.id_tarea}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">{task.titulo_tarea}</p>
                          {task.descripcion && (
                            <p className="mt-1 text-xs text-gray-500 line-clamp-1">{task.descripcion}</p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(task.estado)}`}>
                            {task.estado}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(task.prioridad)}`}>
                            {task.prioridad}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {task.fecha_entrega?.slice(0, 10)}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {task.materia_nombre || task.id_materia}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(task)}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(task.id_tarea)}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 border border-red-200 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* CARDS MOBILE */}
            <div className="space-y-4 lg:hidden">
              {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                  Cargando tareas...
                </div>
              ) : tasks.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                  No hay tareas disponibles.
                </div>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.id_tarea}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    whileHover={{ y: -1 }}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{task.titulo_tarea}</h3>
                        {task.descripcion && (
                          <p className="mt-1 text-sm text-gray-500">{task.descripcion}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(task.estado)}`}>
                        {task.estado}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(task.prioridad)}`}>
                        {task.prioridad}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-800">Entrega:</span> {task.fecha_entrega?.slice(0, 10)}</p>
                      <p><span className="font-medium text-gray-800">Materia:</span> {task.materia_nombre || task.id_materia}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(task)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(task.id_tarea)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 border border-red-200 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TasksPage;