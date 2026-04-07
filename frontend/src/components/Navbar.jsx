import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  CheckSquare,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const fullName =
    `${user?.nombres || ''} ${user?.apellidos || ''}`.trim() || 'Usuario';

  const initials =
    `${user?.nombres?.[0] || ''}${user?.apellidos?.[0] || ''}`.toUpperCase() || 'U';

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-700/40 bg-[#1e3a8a]/95 text-white shadow-lg backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-white p-2 shadow-md">
              <BookOpen className="h-6 w-6 text-[#1e3a8a]" />
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-semibold leading-tight">Gestión Académica</p>
              <p className="text-xs text-blue-100">Organiza tus tareas, mantén el control y alcanza tus metas</p>
            </div>

            <div className="sm:hidden">
              <p className="text-lg font-semibold">GA</p>
            </div>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive('/dashboard')
                  ? 'bg-[#3b82f6] text-white shadow-md'
                  : 'text-blue-100 hover:bg-[#2563eb]'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              to="/tasks"
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive('/tasks')
                  ? 'bg-[#3b82f6] text-white shadow-md'
                  : 'text-blue-100 hover:bg-[#2563eb]'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              Tareas
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive('/profile')
                  ? 'bg-[#3b82f6] text-white shadow-md'
                  : 'text-blue-100 hover:bg-[#2563eb]'
              }`}
            >
              <User className="h-4 w-4" />
              Perfil
            </Link>
          </nav>

          {/* USER DESKTOP */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-2xl bg-[#2563eb] px-3 py-2 transition hover:bg-[#3b82f6]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#60a5fa] text-sm font-bold text-white shadow">
                {initials}
              </div>

              <div className="max-w-[180px] text-left">
                <p className="truncate text-sm font-semibold text-white">
                  {fullName}
                </p>
                <p className="truncate text-xs text-blue-100">
                  {user?.correo || 'Cuenta activa'}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 transition hover:bg-[#2563eb] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-t border-blue-500 bg-[#1e40af] md:hidden">
          <div className="space-y-2 px-4 py-4">

            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive('/dashboard')
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-blue-100 hover:bg-[#2563eb]'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            <Link
              to="/tasks"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive('/tasks')
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-blue-100 hover:bg-[#2563eb]'
              }`}
            >
              <CheckSquare className="h-5 w-5" />
              Tareas
            </Link>

            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive('/profile')
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-blue-100 hover:bg-[#2563eb]'
              }`}
            >
              <User className="h-5 w-5" />
              Perfil
            </Link>

            <div className="border-t border-blue-500 pt-3">
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="mb-3 flex items-center gap-3 rounded-2xl bg-[#2563eb] px-4 py-3 transition hover:bg-[#3b82f6]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#60a5fa] text-sm font-bold text-white shadow">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {fullName}
                  </p>
                  <p className="truncate text-xs text-blue-100">
                    {user?.correo || 'Cuenta activa'}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;