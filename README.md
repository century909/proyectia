# Tipsy Chat App

A chat application with AI characters, built with React, Node.js, and PostgreSQL.

## Project Structure

- `/frontend` - React application with TailwindCSS
- `/backend` - Node.js/Express API with JWT authentication
- `/database` - PostgreSQL database schema

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE tipsy_chat;
   ```

2. Run the schema file to create tables:
   ```bash
   psql -d tipsy_chat -f database/schema.sql
   ```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   DATABASE_URL=postgresql://username:password@localhost:5432/tipsy_chat
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be available at http://localhost:5000

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:5173 (or another port shown in the terminal output)

## API Endpoints

See [API Documentation](backend/API.md) for detailed information about all available endpoints.

## Real-time Chat

See [Real-time Chat Implementation](backend/REALTIME_CHAT.md) for information about implementing real-time messaging with Socket.IO.

## Features

- User registration and authentication with JWT
- Character creation with name, description, and personality traits
- Token-based messaging system
- Conversation history
- Responsive UI with TailwindCSS

## Development

### Backend

The backend is built with Node.js and Express, featuring:

- JWT-based authentication
- RESTful API design
- PostgreSQL database integration
- Token/gem system for messaging

### Frontend

The frontend is built with React and TailwindCSS, featuring:

- Responsive design
- React Router for navigation
- Context API for state management
- Component-based architecture

## Future Enhancements

- Integrate with AI language models for realistic character responses
- Add image generation for character avatars
- Implement real-time messaging with Socket.IO
- Add admin panel for user/character management
- Implement push notifications