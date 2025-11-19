/*
  # Migrate Marketplace to Solana-Only

  1. Schema Changes
    - Update blockchain column to enforce Solana-only values
    - Update currency to use SOL and SPL tokens only
    - Remove Base (EVM) and other non-Solana blockchain references

  2. Data Migration
    - Migrate all existing agents to Solana blockchain
    - Update currency from USDC to USDC (SPL) for Solana
    - Ensure all API endpoints reference Solana RPC

  3. Cleanup
    - Remove any Base/EVM specific configurations
*/

-- Update all existing items to use Solana blockchain
UPDATE marketplace_items 
SET blockchain = 'Solana',
    currency = CASE 
      WHEN currency = 'USDC' THEN 'USDC (SPL)'
      WHEN currency = 'USD Coin' THEN 'USDC (SPL)'
      ELSE currency
    END,
    updated_at = now()
WHERE blockchain != 'Solana' OR currency IN ('USDC', 'USD Coin');

-- Add constraint to ensure only Solana blockchain is used going forward
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'marketplace_items_blockchain_check'
  ) THEN
    ALTER TABLE marketplace_items 
    ADD CONSTRAINT marketplace_items_blockchain_check 
    CHECK (blockchain = 'Solana');
  END IF;
END $$;

-- Update default blockchain value to Solana
ALTER TABLE marketplace_items 
ALTER COLUMN blockchain SET DEFAULT 'Solana';

-- Update currency default to USDC (SPL)
ALTER TABLE marketplace_items 
ALTER COLUMN currency SET DEFAULT 'USDC (SPL)';

-- Add comment documenting Solana-only policy
COMMENT ON COLUMN marketplace_items.blockchain IS 'Blockchain network - Solana only';
COMMENT ON COLUMN marketplace_items.currency IS 'Payment currency - Solana SPL tokens only (USDC, SOL, etc.)';
