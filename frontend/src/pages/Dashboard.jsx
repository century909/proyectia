import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getCharacters, deleteCharacter, updateCharacterAvatar } from '../services/characters';
import { getConversations, deleteConversation } from '../services/conversations';
import { getTokenBalance, purchaseTokens } from '../services/tokens';

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { logout } = useAuth();
  const { theme, toggle } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [tokens, setTokens] = useState(0);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(50);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [charactersRes, conversationsRes, tokensRes] = await Promise.all([
          getCharacters(),
          getConversations(),
          getTokenBalance()
        ]);
        
        setCharacters(charactersRes.characters || []);
        setConversations(conversationsRes.conversations || []);
        setTokens(tokensRes.tokens || 0);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error);
        
        // Determine error type and show appropriate message
        if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
          addToast('Error de conexión. Verifica tu conexión a internet.', 'error');
        } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          addToast('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
          logout();
          navigate('/login');
        } else if (error.message?.includes('503')) {
          addToast('Servidor temporalmente no disponible. Intenta nuevamente en unos minutos.', 'error');
        } else {
          addToast('Error al cargar los datos. Intenta nuevamente.', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [addToast, logout, navigate, retryCount]);

  const handleCreateCharacter = useCallback(() => {
    addToast('Redirecting to character creation...', 'info');
    navigate('/character/create');
  }, [addToast, navigate]);

  const handleChatWithCharacter = useCallback((characterId, characterName) => {
    addToast(`Starting chat with ${characterName}...`, 'success');
    navigate(`/chat/${characterId}`);
  }, [addToast, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    addToast('You have been logged out.', 'info');
    navigate('/login');
  }, [logout, addToast, navigate]);

  const handleDeleteCharacter = useCallback(async (characterId, characterName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el personaje "${characterName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteCharacter(characterId);
      setCharacters(prev => prev.filter(char => char.id !== characterId));
      addToast('Personaje eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error deleting character:', error);
      addToast('Error al eliminar el personaje', 'error');
    }
  }, [addToast]);

  const handleDeleteConversation = useCallback(async (conversationId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      addToast('Conversación eliminada exitosamente', 'success');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      addToast('Error al eliminar la conversación', 'error');
    }
  }, [addToast]);

  const handlePurchaseTokens = useCallback(async () => {
    if (tokenAmount <= 0) {
      addToast('La cantidad debe ser mayor a 0', 'error');
      return;
    }

    setIsPurchasing(true);
    try {
      const result = await purchaseTokens(tokenAmount);
      setTokens(result.tokens);
      setShowTokenModal(false);
      addToast(`${tokenAmount} tokens comprados exitosamente`, 'success');
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      addToast('Error al comprar tokens', 'error');
    } finally {
      setIsPurchasing(false);
    }
  }, [tokenAmount, addToast]);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      addToast('Reintentando...', 'info');
    } else {
      addToast('Máximo de reintentos alcanzado. Por favor, recarga la página.', 'error');
    }
  }, [retryCount, addToast]);

  const handleUpdateAvatar = useCallback((character) => {
    setSelectedCharacter(character);
    setAvatarUrl(character.avatar_url || '');
    setShowAvatarModal(true);
  }, []);

  const handleSaveAvatar = useCallback(async () => {
    if (!selectedCharacter) return;

    setIsUpdatingAvatar(true);
    try {
      await updateCharacterAvatar(selectedCharacter.id, avatarUrl);
      setCharacters(prev => prev.map(char => 
        char.id === selectedCharacter.id 
          ? { ...char, avatar_url: avatarUrl }
          : char
      ));
      setShowAvatarModal(false);
      addToast('Avatar actualizado exitosamente', 'success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      addToast('Error al actualizar el avatar', 'error');
    } finally {
      setIsUpdatingAvatar(false);
    }
  }, [selectedCharacter, avatarUrl, addToast]);

  // Memoize character list to prevent unnecessary re-renders
  const characterList = useMemo(() => {
    if (isLoading) return <SkeletonList count={3} />;
    if (characters.length === 0) {
      return (
        <EmptyState
          icon="🤖"
          title="No tienes personajes"
          description="Crea tu primer personaje para comenzar a chatear."
          actionLabel="Crear Personaje"
          onAction={handleCreateCharacter}
        />
      );
    }
    return characters.map((character, index) => (
      <div key={character.id} style={{ animationDelay: `${index * 0.1}s` }} className="dashboard__character animate-fade-in-up">
        <Card>
          <div className="dashboard__character-content">
            <div className="dashboard__character-avatar">
              {character.avatar_url ? (
                <img 
                  src={character.avatar_url} 
                  alt={character.name}
                  className="w-12 h-12 rounded-full object-cover shadow-md hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`dashboard__character-avatar-inner ${character.avatar_url ? 'hidden' : 'flex'}`}
                style={{ display: character.avatar_url ? 'none' : 'flex' }}
              >
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
                size="sm"
                className="transition-medium hover:scale-105"
                onClick={() => handleUpdateAvatar(character)}
              >
                Avatar
              </Button>
              <Button
                variant="outline"
                size="md"
                className="transition-medium hover:scale-105"
                onClick={() => handleChatWithCharacter(character.id, character.name)}
              >
                Chat
              </Button>
              <Button
                variant="outline"
                size="md"
                className="transition-medium hover:scale-105 text-red-600 hover:text-red-700 hover:border-red-300"
                onClick={() => handleDeleteCharacter(character.id, character.name)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    ));
  }, [isLoading, characters, handleCreateCharacter, handleChatWithCharacter]);

  // Memoize conversation list
  const conversationList = useMemo(() => {
    if (isLoading) return <SkeletonList count={3} />;
    if (conversations.length === 0) {
      return (
        <EmptyState
          icon="💬"
          title="No hay conversaciones"
          description="Inicia una conversación con uno de tus personajes."
        />
      );
    }
    return conversations.map((conversation, index) => (
      <div key={conversation.id} style={{ animationDelay: `${index * 0.1}s` }} className="dashboard__conversation animate-fade-in-up">
        <Card>
          <div className="dashboard__conversation-content">
            <div className="dashboard__conversation-link" onClick={() => navigate(`/chat/${conversation.character_id}`)}>
              <div className="dashboard__conversation-info">
                <h3 className="dashboard__conversation-title">
                  <span className="dashboard__conversation-character">{conversation.character?.name}</span>
                  <span className="dashboard__conversation-divider"> · {conversation.title}</span>
                </h3>
                <p className="dashboard__conversation-message">
                  Conversación iniciada el {new Date(conversation.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="dashboard__conversation-timestamp">
                {new Date(conversation.created_at).toLocaleTimeString()}
              </div>
            </div>
            <div className="dashboard__conversation-actions">
              <Button
                variant="outline"
                size="sm"
                className="transition-medium hover:scale-105 text-red-600 hover:text-red-700 hover:border-red-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(conversation.id);
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    ));
  }, [isLoading, conversations, navigate]);

  // Show error state
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar los datos</h2>
            <p className="text-gray-600 mb-6">
              {error.message?.includes('Network Error') 
                ? 'No se pudo conectar al servidor. Verifica tu conexión a internet.'
                : 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
              }
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="w-full"
              >
                {retryCount >= 3 ? 'Máximo de reintentos' : `Reintentar (${retryCount}/3)`}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-container">
          <div className="dashboard__header-content">
            <h1 className="dashboard__title animate-fade-in">Seiki Chat</h1>
            <div className="dashboard__header-actions">
              <div className="dashboard__tokens-container">
                <span className="dashboard__tokens animate-fade-in hover:scale-105">
                  {tokens} tokens
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="animate-fade-in hover:scale-105 ml-2"
                  onClick={() => setShowTokenModal(true)}
                >
                  Comprar
                </Button>
              </div>
              <Button
                variant="primary"
                className="animate-fade-in hover:scale-105"
                onClick={handleCreateCharacter}
              >
                Create Character
              </Button>
              <Button
                variant="outline"
                className="animate-fade-in hover:scale-105"
                onClick={toggle}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <Button
                variant="outline"
                className="animate-fade-in hover:scale-105"
                onClick={handleLogout}
              >
                Logout
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
              {characterList}
            </div>
          </div>

          {/* Conversations section */}
          <div className="dashboard__section animate-slide-in-right">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Recent Conversations</h2>
            </div>
            <div className="dashboard__conversations">
              {conversationList}
            </div>
          </div>
        </div>
      </div>

      {/* Token Purchase Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Comprar Tokens</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de tokens
              </label>
              <input
                type="number"
                min="1"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa la cantidad"
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Costo: ${(tokenAmount * (import.meta?.env?.VITE_TOKEN_PRICE || 0.01)).toFixed(2)} USD (1 token = ${import.meta?.env?.VITE_TOKEN_PRICE || 0.01})
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTokenModal(false)}
                disabled={isPurchasing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handlePurchaseTokens}
                disabled={isPurchasing || tokenAmount <= 0}
              >
                {isPurchasing ? 'Comprando...' : 'Comprar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Update Modal */}
      {showAvatarModal && selectedCharacter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Actualizar Avatar</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Avatar
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa una URL de imagen válida
              </p>
            </div>
            {avatarUrl && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista previa:
                </label>
                <div className="flex justify-center">
                  <img 
                    src={avatarUrl} 
                    alt="Vista previa del avatar"
                    className="w-16 h-16 rounded-full object-cover shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm hidden"
                    style={{ display: 'none' }}
                  >
                    Error
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAvatarModal(false)}
                disabled={isUpdatingAvatar}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveAvatar}
                disabled={isUpdatingAvatar}
              >
                {isUpdatingAvatar ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
