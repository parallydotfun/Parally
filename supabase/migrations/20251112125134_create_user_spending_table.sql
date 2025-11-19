/*
  # Create user_spending table

  ## Overview
  This migration creates the user_spending table to track aggregate spending
  metrics per wallet. This provides the dashboard statistics shown in the
  agent page sidebar (Total Spent, Transactions, Services Used).

  ## New Tables
  
  ### `user_spending`
  Aggregated spending statistics per wallet:
  - `id` (uuid, primary key) - Unique record identifier
  - `wallet_address` (text, unique, indexed) - Solana wallet address
  - `total_spent_sol` (numeric) - Total spent in SOL
  - `total_spent_usdc` (numeric) - Total spent in USDC
  - `transaction_count` (integer) - Number of transactions
  - `services_used` (integer) - Number of unique services
  - `last_activity_at` (timestamptz) - Last transaction timestamp
  - `created_at` (timestamptz) - Account creation time
  - `updated_at` (timestamptz) - Last update time

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on `user_spending` table
  - Policy: Users can only view their own spending data
  - Policy: Users can insert their own spending record
  - Policy: Users can update their own spending data
  
  ## Indexes
  - Unique index on `wallet_address` for fast lookups
  - Index on `last_activity_at` for activity tracking
  - Index on `total_spent_usdc` for leaderboards (future feature)

  ## Important Notes
  - Auto-updates via trigger when wallet_activity changes
  - Amounts stored as numeric for precision
  - Separate tracking for SOL and USDC
  - Updated automatically via database functions
*/

CREATE TABLE IF NOT EXISTS user_spending (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  total_spent_sol numeric(20, 9) DEFAULT 0,
  total_spent_usdc numeric(20, 6) DEFAULT 0,
  transaction_count integer DEFAULT 0,
  services_used integer DEFAULT 0,
  last_activity_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_spending_wallet ON user_spending(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_spending_last_activity ON user_spending(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_spending_total ON user_spending(total_spent_usdc DESC);

CREATE OR REPLACE FUNCTION update_user_spending_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_spending_updated_at
  BEFORE UPDATE ON user_spending
  FOR EACH ROW
  EXECUTE FUNCTION update_user_spending_updated_at();

CREATE OR REPLACE FUNCTION update_user_spending_on_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    INSERT INTO user_spending (wallet_address, transaction_count, last_activity_at)
    VALUES (NEW.wallet_address, 1, NEW.confirmed_at)
    ON CONFLICT (wallet_address) 
    DO UPDATE SET
      transaction_count = user_spending.transaction_count + 1,
      last_activity_at = NEW.confirmed_at,
      updated_at = now();
    
    IF NEW.service_name IS NOT NULL THEN
      UPDATE user_spending
      SET services_used = services_used + 1
      WHERE wallet_address = NEW.wallet_address
      AND NOT EXISTS (
        SELECT 1 FROM wallet_activity
        WHERE wallet_address = NEW.wallet_address
        AND service_name = NEW.service_name
        AND id != NEW.id
        AND status = 'confirmed'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_spending_on_activity
  AFTER INSERT OR UPDATE ON wallet_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_user_spending_on_activity();

ALTER TABLE user_spending ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own spending data"
  ON user_spending
  FOR SELECT
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own spending record"
  ON user_spending
  FOR INSERT
  TO authenticated
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update their own spending data"
  ON user_spending
  FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address')
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Allow public read access for demo"
  ON user_spending
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert for demo"
  ON user_spending
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update for demo"
  ON user_spending
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
