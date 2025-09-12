import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import UnauthorizedHandler from './components/UnauthorizedHandler';
import ErrorBoundary from './components/ErrorBoundary';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CharacterCreation = lazy(() => import('./pages/CharacterCreation'));
const Chat = lazy(() => import('./pages/Chat'));
import './index.scss'; // Importar estilos globales

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <UnauthorizedHandler />
            <div className="app">
              <Suspense fallback={null}>
                <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/character/create"
                  element={
                    <ProtectedRoute>
                      <CharacterCreation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:characterId"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                </Routes>
              </Suspense>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;