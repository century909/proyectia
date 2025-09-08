import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CharacterCreation from './pages/CharacterCreation';
import Chat from './pages/Chat';
import './index.scss'; // Importar estilos globales

function App() {
  return (
    <ToastProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/character/create" element={<CharacterCreation />} />
          <Route path="/chat/:characterId" element={<Chat />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;