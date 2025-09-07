import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/ui/Button';

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
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col">
      {/* Chat header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-lg font-medium text-gray-900">Character Name</h1>
              <p className="text-sm text-green-500 flex items-center">
                <span className="flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Online
              </p>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                99 tokens
              </span>
              <Button variant="outline" size="sm">
                End Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender !== 'user' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                      C
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-200' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="bg-gradient-to-br from-accent-400 to-accent-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                      Y
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                    C
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={loading}
                  className="block w-full rounded-full border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4"
                  placeholder="Type your message..."
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="rounded-full"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;