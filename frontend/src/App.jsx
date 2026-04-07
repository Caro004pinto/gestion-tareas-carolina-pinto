import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PageTransition from './components/PageTransition.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('gestion_usuario');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    window.localStorage.setItem('gestion_usuario', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('gestion_usuario');
  };

  return (
    <BrowserRouter>
      <PageRoutes user={user} onLogin={handleLogin} onLogout={handleLogout} />
    </BrowserRouter>
  );
}

function PageRoutes({ user, onLogin, onLogout }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<PageTransition><LoginPage user={user} onLogin={onLogin} /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage user={user} onRegister={onLogin} /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <PageTransition><DashboardPage user={user} onLogout={onLogout} /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute user={user}>
              <PageTransition><TasksPage user={user} onLogout={onLogout} /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <PageTransition><ProfilePage user={user} onLogout={onLogout} /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
