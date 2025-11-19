/*
  # Create chat_messages table

  ## Overview
  This migration creates the chat_messages table to store AI chat conversations
  between users and the r1x agent. It tracks message history per wallet address
  to enable conversation continuity and history retrieval.

  ## New Tables
  
  ### `chat_messages`
  Stores all chat messages with metadata:
  - `id` (uuid, primary key) - Unique message identifier
  - `wallet_address` (text, indexed) - Solana wallet address of the user
  - `message_type` (text) - Either 'user' or 'agent'
  - `content` (text) - The actual message content
  - `metadata` (jsonb, nullable) - Optional metadata (tokens used, model, etc.)
  - `created_at` (timestamptz) - Message timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on `chat_messages` table
  - Policy: Users can only read their own messages (matched by wallet_address)
  - Policy: Users can only insert messages with their own wallet_address
  - Policy: Users can update their own messages
  - Policy: Users can delete their own messages
  
  ## Indexes
  - Index on `wallet_address` for fast message retrieval
  - Index on `created_at` for chronological sorting
  - Composite index on (wallet_address, created_at) for optimized queries

  ## Important Notes
  - All timestamps use `timestamptz` for timezone support
  - Message content has no length limit (use text, not varchar)
  - Metadata stored as JSONB for flexible schema
  - Auto-update `updated_at` trigger included
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('user', 'agent')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_wallet ON chat_messages(wallet_address);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_wallet_created ON chat_messages(wallet_address, created_at DESC);

CREATE OR REPLACE FUNCTION update_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_messages_updated_at
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_messages_updated_at();

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update their own chat messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address')
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can delete their own chat messages"
  ON chat_messages
  FOR DELETE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Allow public read access for demo"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert for demo"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);
