import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import PublicLayout from './components/PublicLayout';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import TeachersPage from './pages/TeachersPage';
import ArticlesPage from './pages/ArticlesPage';
import SchedulePage from './pages/SchedulePage'; // page publique /planning

import Login from './components/Login';
import Register from './components/Register';

import AuthProvider, { useAuth } from './context/AuthContext';
import PrivateLayout from './components/PrivateLayout';      // menu latéral du portail
import HomeworkList from './pages/portal/HomeworkList';      // parent
import HomeworkManage from './pages/portal/HomeworkManage';  // teacher/admin
import PlanningPrivate from './pages/portal/PlanningPrivate';

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

          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/planning" element={<SchedulePage />} /> {/* <-- au lieu de /schedule */}
          </Route>

          {/* Auth */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Portail (connecté) */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="announcements" replace />} />
            <Route path="homework" element={<HomeworkList />} />                 {/* PARENT */}
            <Route path="planning" element={<PlanningPrivate />} />              {/* PARENT */}
            <Route
              path="homework/manage"
              element={
                <ProtectedRoute roles={['TEACHER','ADMIN']}>
                  <HomeworkManage />
                </ProtectedRoute>
              }
            />
            {/* d’autres écrans: announcements, students, posts, admin… */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
