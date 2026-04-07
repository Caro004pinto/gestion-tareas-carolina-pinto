import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:4000/api/auth';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage({ user, onLogin }) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!correo.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!emailRegex.test(correo)) {
      setError('Ingresa un correo válido.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        correo: correo.trim(),
        password: password.trim()
      });

      onLogin(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Error al iniciar sesión.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-sky-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* LOGO Y BRANDING */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e3a8a] rounded-2xl shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Gestión Académica
          </h1>
          <p className="text-slate-600">
            Organiza tus tareas y materias fácilmente
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200"
        >

          {/* HEADER */}
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Bienvenido de nuevo
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Inicia sesión
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Accede a tu dashboard académico para gestionar tus actividades.
            </p>
          </div>

          {/* MENSAJE DE ERROR */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="login-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORMULARIO */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* CORREO */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="correo@universidad.edu"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* LINK A REGISTRO */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#1e3a8a] hover:text-[#3b82f6] transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Plataforma académica para gestión de tareas estudiantiles by Carolina Pinto 
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;