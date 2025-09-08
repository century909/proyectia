import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import ChatInput from '../components/ui/ChatInput';
import { useToast } from '../contexts/ToastContext';
import './Chat.scss'; // Import Chat specific styles

const Chat = () => {
  const { characterId } = useParams();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'character',
      content: 'Hello there! I\'m your AI companion. What would you like to chat about?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { addToast } = useToast();

  // Dummy character data for demonstration
  const characters = {
    '1': { name: 'Sassy Sue', description: 'A witty bartender with a sharp tongue' },
    '2': { name: 'Philosophical Pete', description: 'A deep thinker who loves discussing life' },
    '3': { name: 'Techy Tom', description: 'A gadget enthusiast who knows all about the latest tech' }
  };

  // Get character name from ID
  const character = characters[characterId] || { name: 'AI Companion', description: 'Your digital friend' };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    // Immediately enable and focus input after user sends message
    setLoading(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      // Simulate API call delay
      setTimeout(() => {
        // Add character reply
        const characterReply = {
          id: messages.length + 2,
          sender: 'character',
          content: `I received your message: "${newMessage}". This is a simulated response from your AI companion.`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, characterReply]);
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
      addToast('Failed to send message. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleEndChat = () => {
    addToast('Chat session ended successfully.', 'success');
    // In a real app, you would navigate away or clean up the chat session
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex flex-col">
      {/* Chat header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-14 h-14 flex items-center justify-center text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform duration-300">
                {character.name.charAt(0)}
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">{character.name}</h1>
              <p className="text-sm text-green-600 flex items-center font-medium">
                <span className="flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative h-3 w-3 rounded-full bg-green-500"></span>
                </span>
                Online
              </p>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-md hover:scale-105 transition-transform duration-300">
                99 tokens
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
                className={`chat-message-container ${message.sender === 'user' ? 'user-message' : 'character-message'} animate-fade-in-up`}
              >
                {message.sender !== 'user' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-md">
                      {character.name.charAt(0)}
                    </div>
                  </div>
                )}
                <div className="message-bubble-wrapper">
                  <div
                    className={`message-bubble ${
                      message.sender === 'user'
                        ? 'user-bubble'
                        : 'character-bubble'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`font-medium ${message.sender === 'user' ? 'text-primary-600' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="bg-gradient-to-br from-accent-400 to-accent-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-md">
                      Y
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

          {/* Message input */}
          <div className="border-t border-gray-200 p-6 bg-white/80 backdrop-blur-lg rounded-b-2xl">
            <ChatInput
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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