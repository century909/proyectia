import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ChatInput from '../components/ui/ChatInput';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { getCharacter } from '../services/characters';
import { createConversation } from '../services/conversations';
import { getMessages } from '../services/messages';
import { getTokenBalance } from '../services/tokens';
import { getSocket } from '../services/socket';
import './Chat.scss'; // Import Chat specific styles

const Chat = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { addToast } = useToast();
  const { token, user } = useAuth();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        
        // Load character data
        const characterData = await getCharacter(characterId);
        setCharacter(characterData.character);
        
        // Create or get conversation
        const conversationData = await createConversation({
          character_id: parseInt(characterId),
          title: `Chat with ${characterData.character.name}`
        });
        setConversationId(conversationData.conversation.id);
        
        // Load existing messages
        const messagesData = await getMessages(conversationData.conversation.id);
        setMessages(messagesData.messages || []);
        
        // Load token balance
        const tokensData = await getTokenBalance();
        setTokens(tokensData.tokens);
        
        // Initialize Socket.IO
        if (token) {
          socketRef.current = getSocket(token);
          socketRef.current.connect();
          
          socketRef.current.on('connect', () => {
            setIsConnected(true);
            socketRef.current.emit('join_conversation', conversationData.conversation.id);
          });
          
          socketRef.current.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
          });
          
          socketRef.current.on('user_typing', (data) => {
            if (data.userId !== user?.id) {
              setTypingUsers(prev => {
                if (data.isTyping) {
                  return [...prev.filter(id => id !== data.userId), data.userId];
                } else {
                  return prev.filter(id => id !== data.userId);
                }
              });
            }
          });
          
          socketRef.current.on('error', (error) => {
            addToast(error.message, 'error');
            setLoading(false);
          });
        }
        
      } catch (error) {
        console.error('Error initializing chat:', error);
        addToast('Error al inicializar el chat', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [characterId, token, addToast, navigate]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading || !socketRef.current || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    try {
      // Send message via Socket.IO
      socketRef.current.emit('send_message', {
        conversationId,
        content: messageContent,
        token
      });
      
      // Update token balance
      setTokens(prev => prev - 1);
      
    } catch (err) {
      console.error('Error sending message:', err);
      addToast('Error al enviar el mensaje', 'error');
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [newMessage, loading, isConnected, conversationId, token, addToast]);

  const handleEndChat = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    addToast('Sesión de chat terminada', 'success');
    navigate('/');
  }, [addToast, navigate]);

  const handleTypingStart = useCallback(() => {
    if (!socketRef.current || !isConnected) return;
    
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing_start', {
        conversationId,
        userId: user?.id
      });
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 1000);
  }, [socketRef, isConnected, isTyping, conversationId, user?.id]);

  const handleTypingStop = useCallback(() => {
    if (!socketRef.current || !isConnected || !isTyping) return;
    
    setIsTyping(false);
    socketRef.current.emit('typing_stop', {
      conversationId,
      userId: user?.id
    });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [socketRef, isConnected, isTyping, conversationId, user?.id]);

  // Format timestamp
  const formatTime = useCallback((date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Show loading state
  if (loading && !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Personaje no encontrado</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col">
      {/* Chat header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {character.avatar_url ? (
                <img 
                  src={character.avatar_url} 
                  alt={character.name}
                  className="w-14 h-14 rounded-full object-cover shadow-lg hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-14 h-14 flex items-center justify-center text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform duration-300 ${character.avatar_url ? 'hidden' : 'flex'}`}
                style={{ display: character.avatar_url ? 'none' : 'flex' }}
              >
                {character.name.charAt(0)}
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">{character.name}</h1>
              <p className={`text-sm flex items-center font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                <span className="flex h-3 w-3 mr-2">
                  {isConnected ? (
                    <>
                      <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative h-3 w-3 rounded-full bg-green-500"></span>
                    </>
                  ) : (
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  )}
                </span>
                {isConnected ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-md hover:scale-105 transition-transform duration-300">
                {tokens} tokens
              </span>
              <Button variant="outline" size="md" className="hover:scale-105" onClick={handleEndChat}>
                End Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-hidden bg-white py-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-2xl shadow-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message-container ${message.sender_type === 'user' ? 'user-message' : 'character-message'} animate-fade-in-up`}
              >
                {message.sender_type !== 'user' && (
                  <div className="flex-shrink-0 mr-3">
                    {character.avatar_url ? (
                      <img 
                        src={character.avatar_url} 
                        alt={character.name}
                        className="w-10 h-10 rounded-full object-cover shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-md ${character.avatar_url ? 'hidden' : 'flex'}`}
                      style={{ display: character.avatar_url ? 'none' : 'flex' }}
                    >
                      {character.name.charAt(0)}
                    </div>
                  </div>
                )}
                <div className="message-bubble-wrapper">
                  <div
                    className={`message-bubble ${
                      message.sender_type === 'user'
                        ? 'user-bubble'
                        : 'character-bubble'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div className={`text-xs mt-1 ${message.sender_type === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`font-medium ${message.sender_type === 'user' ? 'text-primary-600' : 'text-gray-500'}`}>
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
                {message.sender_type === 'user' && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="bg-gradient-to-br from-accent-400 to-accent-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-md">
                      {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-md">
                    {character.name.charAt(0)}
                  </div>
                </div>
                <div className="flex flex-col max-w-xs md:max-w-md">
                  <div className="bg-gray-100 text-gray-800 rounded-3xl rounded-tl-none px-4 py-2 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-150"></div>
                </div>
                <span className="text-sm text-gray-600">
                  {typingUsers.length === 1 ? 'Alguien está escribiendo...' : 'Varias personas están escribiendo...'}
                </span>
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="border-t border-gray-200 p-6 bg-white/80 backdrop-blur-lg rounded-b-2xl">
            <ChatInput
              ref={inputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTypingStart();
              }}
              onSubmit={handleSendMessage}
              disabled={loading}
              placeholder="Type your message..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;