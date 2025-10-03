import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import PublicLayout from './components/PublicLayout';

// Pages publiques
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import TeachersPage from './pages/TeachersPage';
import ArticlesPage from './pages/ArticlesPage';
import SchedulePage from './pages/SchedulePage'; // /planning (public)

// Auth
import Login from './components/Login';
import Register from './components/Register';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Contexte d'auth
import AuthProvider, { useAuth } from './context/AuthContext';

// Espace connecté (portail)
import PrivateLayout from './components/PrivateLayout';             // menu latéral + <Outlet/>
import HomeworkList from './pages/portal/HomeworkList';             // parent
import PlanningPrivate from './pages/portal/PlanningPrivate';       // parent
import HomeworkManage from './pages/portal/HomeworkManage';         // teacher/admin

import './App.css';

// Garde d'auth
const ProtectedRoute = ({ children, roles }) => {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/portal" replace />;
  return children;
};

// Routes publiques interdites si connecté
const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/portal" replace /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public avec Navbar/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/articles" element={<ArticlesPage />} />

            {/* Page publique: planning parental */}
            <Route path="/planning" element={<SchedulePage />} />
            {/* Alias rétro-compat pour ton ancienne route */}
            <Route path="/schedule" element={<Navigate to="/planning" replace />} />

            {/* Compat: si tu avais un /dashboard public → redirige vers /portal */}
            <Route path="/dashboard" element={<Navigate to="/portal" replace />} />
          </Route>

          {/* Auth (sans PublicLayout) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

          {/* Portail connecté */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            }
          >
            {/* Page d'accueil du portail */}
            <Route index element={<Navigate to="announcements" replace />} />

            {/* PARENT */}
            <Route path="homework" element={<HomeworkList />} />
            <Route path="planning" element={<PlanningPrivate />} />

            {/* TEACHER/ADMIN */}
            <Route
              path="homework/manage"
              element={
                <ProtectedRoute roles={['TEACHER','ADMIN']}>
                  <HomeworkManage />
                </ProtectedRoute>
              }
            />

            {/* TODO: annonces, posts, élèves, admin... */}
            {/* <Route path="announcements" element={<Announcements />} /> */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
