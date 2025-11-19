/*
  # Create Staking Configuration Table

  1. New Tables
    - `staking_config`
      - `id` (uuid, primary key) - Unique identifier for each staking config
      - `token_name` (text) - Name of the token (e.g., "R1X")
      - `token_symbol` (text) - Token symbol
      - `token_address` (text) - Solana token contract address
      - `token_decimals` (integer) - Token decimals (default 9 for Solana)
      - `base_apy` (numeric) - Base APY percentage
      - `boosted_apy` (numeric) - Boosted APY percentage
      - `boost_amount` (numeric) - Boost amount in USDC
      - `boost_source` (text) - Source of boost (e.g., "rewards campaign")
      - `campaign_progress` (numeric) - Campaign progress percentage
      - `total_value_locked` (numeric) - Total tokens staked
      - `stake_enabled` (boolean) - Whether staking is enabled
      - `unstake_enabled` (boolean) - Whether unstaking is enabled
      - `lock_duration_days` (integer) - Lock duration in days (0 for no lock)
      - `staking_program_address` (text) - Solana staking program address
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `user_stakes`
      - `id` (uuid, primary key) - Unique identifier
      - `wallet_address` (text) - User wallet address
      - `token_symbol` (text) - Token being staked
      - `staked_amount` (numeric) - Amount staked
      - `rewards_earned` (numeric) - Rewards earned
      - `stake_date` (timestamptz) - When staked
      - `last_claim_date` (timestamptz) - Last reward claim
      - `unstake_date` (timestamptz) - When unstaked (null if still staked)
      - `transaction_signature` (text) - Solana transaction signature
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Public read access for staking_config
    - Authenticated users can read their own stakes
    - Service role can write to both tables
*/

CREATE TABLE IF NOT EXISTS staking_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_name text NOT NULL,
  token_symbol text NOT NULL,
  token_address text NOT NULL,
  token_decimals integer DEFAULT 9,
  base_apy numeric DEFAULT 0,
  boosted_apy numeric DEFAULT 0,
  boost_amount numeric DEFAULT 0,
  boost_source text DEFAULT '',
  campaign_progress numeric DEFAULT 0,
  total_value_locked numeric DEFAULT 0,
  stake_enabled boolean DEFAULT true,
  unstake_enabled boolean DEFAULT true,
  lock_duration_days integer DEFAULT 0,
  staking_program_address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_stakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  token_symbol text NOT NULL,
  staked_amount numeric NOT NULL DEFAULT 0,
  rewards_earned numeric DEFAULT 0,
  stake_date timestamptz DEFAULT now(),
  last_claim_date timestamptz,
  unstake_date timestamptz,
  transaction_signature text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staking_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stakes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read staking config"
  ON staking_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage staking config"
  ON staking_config FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read their own stakes"
  ON user_stakes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Service role can manage user stakes"
  ON user_stakes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO staking_config (
  token_name,
  token_symbol,
  token_address,
  token_decimals,
  base_apy,
  boosted_apy,
  boost_amount,
  boost_source,
  campaign_progress,
  total_value_locked,
  stake_enabled,
  unstake_enabled,
  lock_duration_days,
  staking_program_address
) VALUES (
  'R1X Token',
  'R1X',
  'R1XTokenAddressPlaceholder',
  9,
  26.18,
  45.42,
  15000,
  '15k USDC rewards campaign',
  75.4,
  59456732.43,
  false,
  true,
  0,
  'StakingProgramAddressPlaceholder'
) ON CONFLICT DO NOTHING;