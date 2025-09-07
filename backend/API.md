# Tipsy Chat API Endpoints

## Authentication

### Register a new user
**POST** `/api/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "newuser"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "newuser",
    "tokens": 100
  }
}
```

### Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "newuser",
    "tokens": 85
  }
}
```

## Characters

### Create a character
**POST** `/api/characters`

Request:
```json
{
  "name": "Sassy Sue",
  "description": "A witty bartender with a sharp tongue",
  "personality": "sarcastic, clever, observant"
}
```

Response:
```json
{
  "success": true,
  "character": {
    "id": 1,
    "user_id": 1,
    "name": "Sassy Sue",
    "description": "A witty bartender with a sharp tongue",
    "personality": "sarcastic, clever, observant",
    "avatar_url": null,
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get user's characters
**GET** `/api/characters`

Response:
```json
{
  "success": true,
  "characters": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Sassy Sue",
      "description": "A witty bartender with a sharp tongue",
      "personality": "sarcastic, clever, observant",
      "avatar_url": null,
      "created_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Conversations

### Start a new conversation
**POST** `/api/conversations`

Request:
```json
{
  "character_id": 1,
  "title": "Evening Chat"
}
```

Response:
```json
{
  "success": true,
  "conversation": {
    "id": 1,
    "user_id": 1,
    "character_id": 1,
    "title": "Evening Chat",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get user's conversations
**GET** `/api/conversations`

Response:
```json
{
  "success": true,
  "conversations": [
    {
      "id": 1,
      "user_id": 1,
      "character_id": 1,
      "title": "Evening Chat",
      "created_at": "2023-01-01T00:00:00.000Z",
      "character": {
        "name": "Sassy Sue"
      }
    }
  ]
}
```

## Messages

### Send a message
**POST** `/api/messages`

Request:
```json
{
  "conversation_id": 1,
  "content": "Hello there!"
}
```

Response:
```json
{
  "success": true,
  "message": {
    "id": 1,
    "conversation_id": 1,
    "sender_type": "user",
    "content": "Hello there!",
    "created_at": "2023-01-01T00:00:00.000Z"
  },
  "reply": {
    "id": 2,
    "conversation_id": 1,
    "sender_type": "character",
    "content": "Well, hello to you too! What brings you to my bar tonight?",
    "created_at": "2023-01-01T00:00:01.000Z"
  }
}
```

### Get conversation messages
**GET** `/api/messages?conversation_id=1`

Response:
```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "conversation_id": 1,
      "sender_type": "user",
      "content": "Hello there!",
      "created_at": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "conversation_id": 1,
      "sender_type": "character",
      "content": "Well, hello to you too! What brings you to my bar tonight?",
      "created_at": "2023-01-01T00:00:01.000Z"
    }
  ]
}
```

## Tokens

### Get user token balance
**GET** `/api/users/tokens`

Response:
```json
{
  "success": true,
  "tokens": 85
}
```

### Purchase tokens
**POST** `/api/users/tokens/purchase`

Request:
```json
{
  "amount": 100
}
```

Response:
```json
{
  "success": true,
  "tokens": 185
}
```