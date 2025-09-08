import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
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

  const handleCreateCharacter = () => {
    addToast('Redirecting to character creation...', 'info');
    navigate('/character/create');
  };

  const handleChatWithCharacter = (characterId, characterName) => {
    addToast(`Starting chat with ${characterName}...`, 'success');
    // Navigate to the chat with the specific character
    navigate(`/chat/${characterId}`);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-container">
          <div className="dashboard__header-content">
            <h1 className="dashboard__title animate-fade-in">Tipsy Chat</h1>
            <div className="dashboard__header-actions">
              <span className="dashboard__tokens animate-fade-in hover:scale-105">
                99 tokens
              </span>
              <Button
                variant="primary"
                className="animate-fade-in hover:scale-105"
                onClick={handleCreateCharacter}
              >
                Create Character
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__grid">
          {/* Characters section */}
          <div className="dashboard__section animate-slide-in-left">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Your Characters</h2>
              <Link to="/character/create" className="dashboard__create-link hover:scale-105">
                + Create New
              </Link>
            </div>
            <div className="dashboard__characters">
              {characters.map((character, index) => (
                <div key={character.id} style={{ animationDelay: `${index * 0.1}s` }} className="dashboard__character animate-fade-in-up">
                  <Card>
                    <div className="dashboard__character-content">
                      <div className="dashboard__character-avatar">
                        <div className="dashboard__character-avatar-inner">
                          {character.name.charAt(0)}
                        </div>
                      </div>
                      <div className="dashboard__character-info">
                        <h3 className="dashboard__character-name">{character.name}</h3>
                        <p className="dashboard__character-description">{character.description}</p>
                      </div>
                      <div className="dashboard__character-actions">
                        <Button
                          variant="outline"
                          size="md"
                          className="transition-medium hover:scale-105"
                          onClick={() => handleChatWithCharacter(character.id, character.name)}
                        >
                          Chat
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations section */}
          <div className="dashboard__section animate-slide-in-right">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Recent Conversations</h2>
            </div>
            <div className="dashboard__conversations">
              {conversations.map((conversation, index) => (
                <div key={conversation.id} style={{ animationDelay: `${index * 0.1}s` }} className="dashboard__conversation animate-fade-in-up">
                  <Card>
                    <div className="dashboard__conversation-link" onClick={() => navigate(`/chat/${conversation.id}`)}>
                      <div className="dashboard__conversation-content">
                        <div className="dashboard__conversation-info">
                          <h3 className="dashboard__conversation-title">
                            <span className="dashboard__conversation-character">{conversation.character}</span>
                            <span className="dashboard__conversation-divider"> · {conversation.title}</span>
                          </h3>
                          <p className="dashboard__conversation-message">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        <div className="dashboard__conversation-timestamp">
                          {conversation.timestamp}
                        </div>
                      </div>
                    </div>
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