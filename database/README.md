# Seiki Chat - Database

This directory contains the database schema for the Seiki Chat application.

## Schema Overview

The database uses PostgreSQL and consists of the following tables:

1. `users` - Stores user account information
2. `characters` - Stores user-created characters
3. `conversations` - Tracks conversations between users and characters
4. `messages` - Stores individual messages in conversations
5. `token_transactions` - Tracks token usage and purchases

## Setup

1. Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE tipsy_chat;
   ```

2. Run the schema file to create tables:
   ```bash
   psql -d tipsy_chat -f schema.sql
   ```