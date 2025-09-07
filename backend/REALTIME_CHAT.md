# Real-time Chat Implementation

## Overview

To implement real-time chat functionality in Tipsy Chat, we'll use Socket.IO, which enables real-time, bidirectional communication between clients and the server.

## Backend Implementation

### 1. Install Socket.IO
```bash
npm install socket.io
```

### 2. Update server.js to include Socket.IO
```javascript
const http = require('http');
const socketIo = require('socket.io');

// After creating the Express app
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation ${conversationId}`);
  });
  
  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      // Validate and save message to database (similar to REST endpoint)
      // ...
      
      // Emit message to all users in the conversation
      io.to(data.conversationId).emit('receive_message', {
        id: newMessage.id,
        conversation_id: data.conversationId,
        sender_type: 'user',
        content: data.content,
        created_at: new Date().toISOString()
      });
      
      // Generate AI response (simulated)
      const aiResponse = {
        id: newMessage.id + 1,
        conversation_id: data.conversationId,
        sender_type: 'character',
        content: `I received your message: "${data.content}". This is a simulated AI response.`,
        created_at: new Date(new Date().getTime() + 1000).toISOString()
      };
      
      // Save AI response to database
      // ...
      
      // Emit AI response
      io.to(data.conversationId).emit('receive_message', aiResponse);
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });
  
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Change app.listen to server.listen
server.listen(PORT, () => {
  console.log(`Tipsy Chat API is running on port ${PORT}`);
});
```

## Frontend Implementation

### 1. Install Socket.IO Client
```bash
npm install socket.io-client
```

### 2. Update Chat.jsx to use Socket.IO
```jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const Chat = () => {
  const { characterId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  
  // Initialize Socket.IO connection
  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:5000');
    
    // Join conversation room
    socketRef.current.emit('join_conversation', characterId);
    
    // Listen for new messages
    socketRef.current.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Clean up on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [characterId]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;
    
    // Send message through Socket.IO
    socketRef.current.emit('send_message', {
      conversationId: characterId,
      content: newMessage
    });
    
    setNewMessage('');
  };
  
  return (
    // ... rest of the component remains the same
  );
};

export default Chat;
```

## Benefits of Real-time Implementation

1. **Instant Messaging**: Messages appear immediately for all participants without page refresh
2. **Presence Indicators**: Show when users are online/typing
3. **Reduced Latency**: Direct communication channel between client and server
4. **Scalability**: Socket.IO handles multiple connections efficiently

## Considerations

1. **Fallback**: Implement REST API as fallback when WebSocket connection fails
2. **Authentication**: Pass JWT token during Socket.IO connection for security
3. **Rate Limiting**: Implement message rate limiting to prevent spam
4. **Message History**: Load previous messages when joining a conversation