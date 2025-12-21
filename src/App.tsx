import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import AddManhwaPage from './pages/AddManhwaPage';
import NavigationSetter from './components/NavigationSetter';
import NotFoundPage from './pages/NotFoundPage';
import AuthInitializer from './components/AuthInitializer';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthInitializer />
        <Router>
        <NavigationSetter /> {/* Render the NavigationSetter here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-manhwa"
            element={
              <PrivateRoute>
                <AddManhwaPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;