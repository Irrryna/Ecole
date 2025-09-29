import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import TeachersPage from './pages/TeachersPage';
import ArticlesPage from './pages/ArticlesPage';
import SchedulePage from './pages/SchedulePage';
import PublicLayout from './components/PublicLayout';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import './App.css';

// A simple wrapper for authenticated routes
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// A simple wrapper for public-only routes (e.g., login/register)
const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the entire application with AuthProvider */}
        <Routes>
          {/* Public routes with Navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            {/* Dashboard as a child of PublicLayout, but still protected */}
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
            />
          </Route>

          {/* Authentication routes (without PublicLayout) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;