

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection on startup
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection test successful');
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'seiki_chat_secret';

// Utility functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const generateCharacterResponse = (character, userMessage) => {
  const { name, personality, description } = character;
  const personalityTraits = personality ? personality.toLowerCase().split(',').map(t => t.trim()) : [];
  
  // Base responses based on personality traits
  let responseTemplates = [];
  
  if (personalityTraits.includes('sarcastic') || personalityTraits.includes('sarcástico')) {
    responseTemplates = [
      `Oh, ${userMessage}? How original. *rolls eyes*`,
      `Well, well, well... ${userMessage}. How... predictable.`,
      `*sighs dramatically* ${userMessage}? Really? That's what you're going with?`,
      `Oh please, ${userMessage}? I've heard that one before. Try harder.`
    ];
  } else if (personalityTraits.includes('friendly') || personalityTraits.includes('amigable')) {
    responseTemplates = [
      `That's so interesting! ${userMessage} - I love hearing about that!`,
      `Oh wow, ${userMessage}! Tell me more about that!`,
      `That sounds amazing! ${userMessage} - I'm so happy you shared that with me!`,
      `I'm so glad you told me about ${userMessage}! That's wonderful!`
    ];
  } else if (personalityTraits.includes('mysterious') || personalityTraits.includes('misterioso')) {
    responseTemplates = [
      `*whispers* ${userMessage}... I know more than you think about such things.`,
      `Hmm, ${userMessage}... There are secrets hidden in those words.`,
      `*smirks* ${userMessage}? You don't know what you're dealing with.`,
      `Interesting... ${userMessage}. The shadows hold many answers.`
    ];
  } else if (personalityTraits.includes('cheerful') || personalityTraits.includes('alegre')) {
    responseTemplates = [
      `Yay! ${userMessage} - that makes me so happy! 😊`,
      `Oh my gosh, ${userMessage}! That's the best thing I've heard today!`,
      `*jumps with excitement* ${userMessage}? That's absolutely fantastic!`,
      `I'm so excited about ${userMessage}! This is going to be amazing!`
    ];
  } else if (personalityTraits.includes('wise') || personalityTraits.includes('sabio')) {
    responseTemplates = [
      `Ah, ${userMessage}... There is much wisdom in what you say.`,
      `I see... ${userMessage}. The ancient ones spoke of such things.`,
      `Your words about ${userMessage} carry the weight of experience.`,
      `Indeed, ${userMessage}... Life has taught me that this is often true.`
    ];
  } else {
    // Default responses
    responseTemplates = [
      `That's interesting! ${userMessage} - I'd love to know more about that.`,
      `Hmm, ${userMessage}... I'm thinking about what you said.`,
      `I see... ${userMessage}. That's something to consider.`,
      `Thanks for sharing that! ${userMessage} - it gives me something to think about.`
    ];
  }
  
  // Add character-specific elements
  const characterName = name || 'your companion';
  const characterDescription = description || 'a helpful companion';
  
  // Select a random template and customize it
  const selectedTemplate = responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
  
  // Add some variety with follow-up questions or statements
  const followUps = [
    ' What do you think about that?',
    ' I\'m curious about your perspective.',
    ' Tell me more about your thoughts on this.',
    ' I\'d love to hear your opinion.',
    ' What\'s your take on this?',
    ' I find this fascinating.',
    ' This is really interesting to me.'
  ];
  
  const followUp = followUps[Math.floor(Math.random() * followUps.length)];
  
  return selectedTemplate + followUp;
};

// Input validation and sanitization functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 50 && /^[a-zA-Z0-9_]+$/.test(username);
};

const validateMessage = (message) => {
  return message && message.length > 0 && message.length <= 1000;
};

const validateCharacterName = (name) => {
  return name && name.length >= 1 && name.length <= 100;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Database error handler middleware
const handleDatabaseError = (err, req, res, next) => {
  console.error('Database error:', err);
  
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ 
      success: false, 
      message: 'Database connection failed. Please try again later.' 
    });
  }
  
  if (err.code === '23505') { // Unique constraint violation
    return res.status(409).json({ 
      success: false, 
      message: 'A record with this information already exists.' 
    });
  }
  
  if (err.code === '23503') { // Foreign key constraint violation
    return res.status(400).json({ 
      success: false, 
      message: 'Referenced record does not exist.' 
    });
  }
  
  // Generic database error
  res.status(500).json({ 
    success: false, 
    message: 'Database error occurred. Please try again later.' 
  });
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Seiki Chat API is running!' });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: 'Email, password, and username are required' });
    }
    
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedUsername = sanitizeInput(username);
    
    // Validate inputs
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    
    if (!validateUsername(sanitizedUsername)) {
      return res.status(400).json({ success: false, message: 'Username must be 3-50 characters long and contain only letters, numbers, and underscores' });
    }
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [sanitizedEmail, sanitizedUsername]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = await pool.query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [sanitizedEmail, sanitizedUsername, hashedPassword]
    );
    
    const user = newUser.rows[0];
    const token = generateToken(user);
    
    const { password_hash, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    // Sanitize email
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [sanitizedEmail]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create character endpoint
app.post('/api/characters', verifyToken, async (req, res) => {
  try {
    const { name, description, personality } = req.body;
    const userId = req.user.id;
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedDescription = sanitizeInput(description || '');
    const sanitizedPersonality = sanitizeInput(personality || '');
    
    if (!validateCharacterName(sanitizedName)) {
      return res.status(400).json({ success: false, message: 'Character name is required and must be 1-100 characters long' });
    }
    
    if (sanitizedDescription.length > 500) {
      return res.status(400).json({ success: false, message: 'Description must be 500 characters or less' });
    }
    
    if (sanitizedPersonality.length > 500) {
      return res.status(400).json({ success: false, message: 'Personality must be 500 characters or less' });
    }
    
    const newCharacter = await pool.query(
      'INSERT INTO characters (user_id, name, description, personality) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, sanitizedName, sanitizedDescription, sanitizedPersonality]
    );
    
    res.status(201).json({
      success: true,
      character: newCharacter.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user's characters
app.get('/api/characters', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
    
    res.json({
      success: true,
      characters: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get single character
app.get('/api/characters/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await pool.query('SELECT * FROM characters WHERE id = $1 AND user_id = $2', [id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    
    res.json({
      success: true,
      character: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update character avatar
app.patch('/api/characters/:id/avatar', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_url } = req.body;
    const userId = req.user.id;
    
    // Sanitize avatar URL
    const sanitizedAvatarUrl = sanitizeInput(avatar_url || '');
    
    // Validate avatar URL format
    if (sanitizedAvatarUrl && !sanitizedAvatarUrl.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ success: false, message: 'Invalid avatar URL format' });
    }
    
    // First check if character exists and belongs to user
    const characterResult = await pool.query('SELECT * FROM characters WHERE id = $1 AND user_id = $2', [id, userId]);
    
    if (characterResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    
    // Update character avatar
    const updatedCharacter = await pool.query(
      'UPDATE characters SET avatar_url = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [sanitizedAvatarUrl, id, userId]
    );
    
    res.json({
      success: true,
      character: updatedCharacter.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete character
app.delete('/api/characters/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // First check if character exists and belongs to user
    const characterResult = await pool.query('SELECT * FROM characters WHERE id = $1 AND user_id = $2', [id, userId]);
    
    if (characterResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    
    // Delete character (cascade will handle related conversations and messages)
    await pool.query('DELETE FROM characters WHERE id = $1 AND user_id = $2', [id, userId]);
    
    res.json({
      success: true,
      message: 'Character deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start conversation
app.post('/api/conversations', verifyToken, async (req, res) => {
  try {
    const { character_id, title } = req.body;
    const userId = req.user.id;
    
    if (!character_id) {
      return res.status(400).json({ success: false, message: 'Character ID is required' });
    }
    
    const characterResult = await pool.query('SELECT * FROM characters WHERE id = $1 AND user_id = $2', [character_id, userId]);
    const character = characterResult.rows[0];
    
    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    
    const newConversation = await pool.query(
      'INSERT INTO conversations (user_id, character_id, title) VALUES ($1, $2, $3) RETURNING *',
      [userId, character_id, title || `Chat with ${character.name}`]
    );
    
    res.status(201).json({
      success: true,
      conversation: newConversation.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user's conversations
app.get('/api/conversations', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT c.*, ch.name as character_name 
       FROM conversations c 
       JOIN characters ch ON c.character_id = ch.id 
       WHERE c.user_id = $1`,
      [userId]
    );
    
    const conversations = result.rows.map(conv => ({
      ...conv,
      character: { name: conv.character_name }
    }));
    
    res.json({
      success: true,
      conversations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete conversation
app.delete('/api/conversations/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // First check if conversation exists and belongs to user
    const conversationResult = await pool.query('SELECT * FROM conversations WHERE id = $1 AND user_id = $2', [id, userId]);
    
    if (conversationResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    // Delete conversation (cascade will handle related messages)
    await pool.query('DELETE FROM conversations WHERE id = $1 AND user_id = $2', [id, userId]);
    
    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Send message
app.post('/api/messages', verifyToken, async (req, res) => {
  try {
    const { conversation_id, content } = req.body;
    const userId = req.user.id;
    
    if (!conversation_id || !content) {
      return res.status(400).json({ success: false, message: 'Conversation ID and message content are required' });
    }
    
    const conversationResult = await pool.query('SELECT * FROM conversations WHERE id = $1 AND user_id = $2', [conversation_id, userId]);
    const conversation = conversationResult.rows[0];
    
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    
    if (!user || user.tokens <= 0) {
      return res.status(400).json({ success: false, message: 'Insufficient tokens' });
    }
    
    await pool.query('UPDATE users SET tokens = tokens - 1 WHERE id = $1', [userId]);
    
    const userMessageResult = await pool.query(
      'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *',
      [conversation_id, 'user', content]
    );
    const userMessage = userMessageResult.rows[0];
    
    const characterResult = await pool.query('SELECT * FROM characters WHERE id = $1', [conversation.character_id]);
    const character = characterResult.rows[0];
    
    const characterReplyContent = generateCharacterResponse(character, content);
    const characterReplyResult = await pool.query(
      'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *',
      [conversation_id, 'character', characterReplyContent]
    );
    const characterReply = characterReplyResult.rows[0];
    
    res.status(201).json({
      success: true,
      message: userMessage,
      reply: characterReply
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get conversation messages
app.get('/api/messages', verifyToken, async (req, res) => {
  try {
    const { conversation_id } = req.query;
    const userId = req.user.id;
    
    if (!conversation_id) {
      return res.status(400).json({ success: false, message: 'Conversation ID is required' });
    }
    
    const conversationResult = await pool.query('SELECT * FROM conversations WHERE id = $1 AND user_id = $2', [conversation_id, userId]);
    if (conversationResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    const messagesResult = await pool.query('SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC', [conversation_id]);
    
    res.json({
      success: true,
      messages: messagesResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user token balance
app.get('/api/users/tokens', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT tokens FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      tokens: result.rows[0].tokens
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Purchase tokens
app.post('/api/users/tokens/purchase', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }
    
    const result = await pool.query(
      'UPDATE users SET tokens = tokens + $1 WHERE id = $2 RETURNING tokens',
      [amount, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      tokens: result.rows[0].tokens
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });
  
  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, content, token } = data;
      
      // Verify token
      if (!token) {
        socket.emit('error', { message: 'Authentication required' });
        return;
      }
      
      let userId;
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }
      
      // Verify conversation belongs to user
      const conversationResult = await pool.query(
        'SELECT * FROM conversations WHERE id = $1 AND user_id = $2', 
        [conversationId, userId]
      );
      const conversation = conversationResult.rows[0];
      
      if (!conversation) {
        socket.emit('error', { message: 'Conversation not found' });
        return;
      }
      
      // Check user tokens
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      
      if (!user || user.tokens <= 0) {
        socket.emit('error', { message: 'Insufficient tokens' });
        return;
      }
      
      // Deduct token
      await pool.query('UPDATE users SET tokens = tokens - 1 WHERE id = $1', [userId]);
      
      // Save user message
      const userMessageResult = await pool.query(
        'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *',
        [conversationId, 'user', content]
      );
      const userMessage = userMessageResult.rows[0];
      
      // Emit user message to all users in the conversation
      io.to(conversationId).emit('receive_message', userMessage);
      
      // Get character info for response
      const characterResult = await pool.query('SELECT * FROM characters WHERE id = $1', [conversation.character_id]);
      const character = characterResult.rows[0];
      
      // Generate AI response based on character personality
      const characterReplyContent = generateCharacterResponse(character, content);
      
      // Save character reply
      const characterReplyResult = await pool.query(
        'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *',
        [conversationId, 'character', characterReplyContent]
      );
      const characterReply = characterReplyResult.rows[0];
      
      // Emit character reply after a short delay
      setTimeout(() => {
        io.to(conversationId).emit('receive_message', characterReply);
      }, 1000);
      
    } catch (err) {
      console.error('Error handling message:', err);
      socket.emit('error', { message: 'Internal server error' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing_start', (data) => {
    socket.to(data.conversationId).emit('user_typing', {
      userId: data.userId,
      isTyping: true
    });
  });
  
  socket.on('typing_stop', (data) => {
    socket.to(data.conversationId).emit('user_typing', {
      userId: data.userId,
      isTyping: false
    });
  });
  
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Add error handling middleware
app.use(handleDatabaseError);

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    await testDatabaseConnection();
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`Seiki Chat API is running on port ${PORT}`);
      console.log(`Socket.IO server is ready for real-time communication`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
