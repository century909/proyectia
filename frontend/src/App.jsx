import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CharacterCreation from './pages/CharacterCreation'
import Chat from './pages/Chat'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/character/create" element={<CharacterCreation />} />
        <Route path="/chat/:characterId" element={<Chat />} />
      </Routes>
    </div>
  )
}

export default App