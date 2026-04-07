import React from 'react';
import { Mail, User, BadgeCheck, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

function ProfilePage({ user, onLogout }) {
  const nombreCompleto = `${user?.nombres || ''} ${user?.apellidos || ''}`.trim();
  const iniciales = `${user?.nombres?.[0] || ''}${user?.apellidos?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100">
      <Navbar user={user} onLogout={onLogout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Encabezado */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Mi cuenta
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Perfil del usuario
          </h1>
          <p className="mt-2 text-slate-600">
            Consulta tu información personal registrada en el sistema.
          </p>
        </div>

        {/* Card principal */}
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          
          {/* Tarjeta lateral */}
          <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-3xl font-bold text-white shadow-lg">
                {iniciales || 'U'}
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-slate-900">
                {nombreCompleto || 'Usuario'}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Estudiante registrado
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Cuenta activa
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Información personal
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Nombres */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-sky-600" />
                  <p className="text-sm font-medium text-slate-500">Nombres</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {user?.nombres || 'No disponible'}
                </p>
              </div>

              {/* Apellidos */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-sky-600" />
                  <p className="text-sm font-medium text-slate-500">Apellidos</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {user?.apellidos || 'No disponible'}
                </p>
              </div>

              {/* Correo */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-sky-600" />
                  <p className="text-sm font-medium text-slate-500">Correo electrónico</p>
                </div>
                <p className="text-lg font-semibold text-slate-900 break-all">
                  {user?.correo || 'No disponible'}
                </p>
              </div>
            </div>

            {/* Botón logout */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;