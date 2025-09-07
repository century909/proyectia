import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Dashboard = () => {
  // Dummy data for demonstration
  const characters = [
    { id: 1, name: 'Sassy Sue', description: 'A witty bartender with a sharp tongue' },
    { id: 2, name: 'Philosophical Pete', description: 'A deep thinker who loves discussing life' },
    { id: 3, name: 'Techy Tom', description: 'A gadget enthusiast who knows all about the latest tech' }
  ];

  const conversations = [
    { id: 1, character: 'Sassy Sue', title: 'Evening Chat', lastMessage: 'See you tomorrow!', timestamp: '2 hours ago' },
    { id: 2, character: 'Philosophical Pete', title: 'Deep Thoughts', lastMessage: 'That\'s a fascinating perspective', timestamp: '1 day ago' },
    { id: 3, character: 'Techy Tom', title: 'Latest Gadgets', lastMessage: 'Have you seen the new smartphone?', timestamp: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 animate-fade-in">Tipsy Chat</h1>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 animate-fade-in">
                99 tokens
              </span>
              <Button
                as={Link}
                to="/character/create"
                variant="primary"
                className="animate-fade-in"
              >
                Create Character
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Characters section */}
          <div className="animate-slide-in-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Your Characters</h2>
              <Link to="/character/create" className="text-primary-600 hover:text-primary-900 text-sm font-medium transition-colors duration-200">
                + Create New
              </Link>
            </div>
            <div className="space-y-4">
              {characters.map((character, index) => (
                <div key={character.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                  <Card>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl w-16 h-16 flex items-center justify-center text-white font-bold text-xl transition-transform duration-300 hover:scale-105">
                            {character.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{character.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{character.description}</p>
                        </div>
                        <div className="flex items-center">
                          <Button
                            as={Link}
                            to={`/chat/${character.id}`}
                            variant="outline"
                            size="sm"
                            className="transition-fast hover:shadow-md"
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations section */}
          <div className="animate-slide-in-right">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Conversations</h2>
            <div className="space-y-4">
              {conversations.map((conversation, index) => (
                <div key={conversation.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                  <Card>
                    <Link to={`/chat/${conversation.id}`} className="block hover:bg-gray-50 transition-colors duration-150 rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              <span className="text-primary-600">{conversation.character}</span>
                              <span className="text-gray-500"> &middot; {conversation.title}</span>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 truncate max-w-md">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 whitespace-nowrap">
                            {conversation.timestamp}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;