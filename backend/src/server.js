require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data for demonstration
const users = [];
let characters = [];
let conversations = [];
let messages = [];
let nextId = 1;

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'tipsy_chat_secret';

// Utility functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
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

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Tipsy Chat API is running!' });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and username are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = {
      id: nextId++,
      email,
      username,
      password_hash: hashedPassword,
      tokens: 100, // Starting tokens
      created_at: new Date().toISOString()
    };
    
    users.push(user);
    
    // Generate token
    const token = generateToken(user);
    
    // Return response without password
    const { password_hash, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return response without password
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create character endpoint
app.post('/api/characters', verifyToken, (req, res) => {
  try {
    const { name, description, personality } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Character name is required' 
      });
    }
    
    // Create character
    const character = {
      id: nextId++,
      user_id: userId,
      name,
      description: description || '',
      personality: personality || '',
      avatar_url: null,
      created_at: new Date().toISOString()
    };
    
    characters.push(character);
    
    res.status(201).json({
      success: true,
      character
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get user's characters
app.get('/api/characters', verifyToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userCharacters = characters.filter(c => c.user_id === userId);
    
    res.json({
      success: true,
      characters: userCharacters
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Start conversation
app.post('/api/conversations', verifyToken, (req, res) => {
  try {
    const { character_id, title } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!character_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Character ID is required' 
      });
    }
    
    // Check if character exists and belongs to user
    const character = characters.find(c => c.id == character_id && c.user_id == userId);
    if (!character) {
      return res.status(404).json({ 
        success: false, 
        message: 'Character not found' 
      });
    }
    
    // Create conversation
    const conversation = {
      id: nextId++,
      user_id: userId,
      character_id: parseInt(character_id),
      title: title || `Chat with ${character.name}`,
      created_at: new Date().toISOString()
    };
    
    conversations.push(conversation);
    
    res.status(201).json({
      success: true,
      conversation
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get user's conversations
app.get('/api/conversations', verifyToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userConversations = conversations.filter(c => c.user_id === userId);
    
    // Add character info to each conversation
    const conversationsWithCharacters = userConversations.map(conv => {
      const character = characters.find(c => c.id === conv.character_id);
      return {
        ...conv,
        character: character ? { name: character.name } : null
      };
    });
    
    res.json({
      success: true,
      conversations: conversationsWithCharacters
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Send message
app.post('/api/messages', verifyToken, (req, res) => {
  try {
    const { conversation_id, content } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!conversation_id || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Conversation ID and message content are required' 
      });
    }
    
    // Check if conversation exists and belongs to user
    const conversation = conversations.find(c => c.id == conversation_id && c.user_id == userId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }
    
    // Check user tokens
    const user = users.find(u => u.id == userId);
    if (!user || user.tokens <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient tokens' 
      });
    }
    
    // Deduct token
    user.tokens -= 1;
    
    // Create user message
    const userMessage = {
      id: nextId++,
      conversation_id: parseInt(conversation_id),
      sender_type: 'user',
      content,
      created_at: new Date().toISOString()
    };
    
    messages.push(userMessage);
    
    // Create character reply (simulated AI response)
    const character = characters.find(c => c.id === conversation.character_id);
    const characterReply = {
      id: nextId++,
      conversation_id: parseInt(conversation_id),
      sender_type: 'character',
      content: `I'm ${character?.name || 'your companion'}, and I received your message: "${content}". This is a simulated response.`,
      created_at: new Date(new Date().getTime() + 1000).toISOString() // 1 second later
    };
    
    messages.push(characterReply);
    
    res.status(201).json({
      success: true,
      message: userMessage,
      reply: characterReply
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get conversation messages
app.get('/api/messages', verifyToken, (req, res) => {
  try {
    const { conversation_id } = req.query;
    const userId = req.user.id;
    
    // Validation
    if (!conversation_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Conversation ID is required' 
      });
    }
    
    // Check if conversation exists and belongs to user
    const conversation = conversations.find(c => c.id == conversation_id && c.user_id == userId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }
    
    // Get messages for this conversation
    const conversationMessages = messages.filter(m => m.conversation_id == conversation_id);
    
    res.json({
      success: true,
      messages: conversationMessages
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get user token balance
app.get('/api/users/tokens', verifyToken, (req, res) => {
  try {
    const userId = req.user.id;
    const user = users.find(u => u.id == userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      tokens: user.tokens
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Purchase tokens
app.post('/api/users/tokens/purchase', verifyToken, (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid amount is required' 
      });
    }
    
    // Find user
    const user = users.find(u => u.id == userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Add tokens
    user.tokens += parseInt(amount);
    
    res.json({
      success: true,
      tokens: user.tokens
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Tipsy Chat API is running on port ${PORT}`);
});