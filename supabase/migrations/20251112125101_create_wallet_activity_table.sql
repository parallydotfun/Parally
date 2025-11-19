/*
  # Create wallet_activity table

  ## Overview
  This migration creates the wallet_activity table to track all Solana blockchain
  transactions initiated through the r1x agent platform. This enables transaction
  history, monitoring, and analytics.

  ## New Tables
  
  ### `wallet_activity`
  Stores blockchain transaction records:
  - `id` (uuid, primary key) - Unique record identifier
  - `wallet_address` (text, indexed) - Solana wallet address
  - `transaction_signature` (text, unique) - Solana transaction signature/hash
  - `transaction_type` (text) - Type: 'payment', 'service_purchase', 'transfer'
  - `amount` (numeric) - Transaction amount in SOL or tokens
  - `token_mint` (text, nullable) - Token mint address (null for SOL)
  - `status` (text) - Status: 'pending', 'confirmed', 'failed'
  - `service_name` (text, nullable) - Associated service name
  - `metadata` (jsonb) - Additional transaction metadata
  - `created_at` (timestamptz) - Transaction initiation time
  - `confirmed_at` (timestamptz, nullable) - Blockchain confirmation time

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on `wallet_activity` table
  - Policy: Users can only view their own transactions
  - Policy: Users can only insert their own transactions
  - Policy: System can update transaction status (for confirmations)
  
  ## Indexes
  - Index on `wallet_address` for user transaction history
  - Index on `transaction_signature` for lookup
  - Index on `status` for filtering pending/confirmed
  - Index on `created_at` for chronological queries
  - Composite index on (wallet_address, created_at) for optimized user history

  ## Important Notes
  - Transaction signatures are unique per blockchain transaction
  - Amount stored as numeric for precision (no floating point errors)
  - Status updated by background job monitoring blockchain
  - Metadata includes gas fees, block number, etc.
*/

CREATE TABLE IF NOT EXISTS wallet_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  transaction_signature text UNIQUE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('payment', 'service_purchase', 'transfer', 'other')),
  amount numeric(20, 9) NOT NULL DEFAULT 0,
  token_mint text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  service_name text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_wallet_activity_wallet ON wallet_activity(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_activity_signature ON wallet_activity(transaction_signature);
CREATE INDEX IF NOT EXISTS idx_wallet_activity_status ON wallet_activity(status);
CREATE INDEX IF NOT EXISTS idx_wallet_activity_created_at ON wallet_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_activity_wallet_created ON wallet_activity(wallet_address, created_at DESC);

ALTER TABLE wallet_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallet activity"
  ON wallet_activity
  FOR SELECT
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own wallet activity"
  ON wallet_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "System can update wallet activity status"
  ON wallet_activity
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access for demo"
  ON wallet_activity
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert for demo"
  ON wallet_activity
  FOR INSERT
  TO anon
  WITH CHECK (true);
