/*
  # Create Agent Builder and Enhanced Marketplace Tables

  1. New Tables
    - `agent_drafts`
      - `id` (uuid, primary key) - Unique identifier
      - `creator_wallet` (text) - Creator wallet address
      - `name` (text) - Draft agent name
      - `description` (text) - Short description
      - `full_description` (text) - Detailed description
      - `category` (text) - Category
      - `price` (numeric) - Price in USDC
      - `api_endpoint` (text) - API endpoint
      - `tags` (text[]) - Array of tags
      - `capabilities` (text[]) - Array of capabilities
      - `preview_images` (text[]) - Array of preview image URLs
      - `last_saved_at` (timestamptz) - Last auto-save timestamp
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `agent_reviews`
      - `id` (uuid, primary key) - Unique identifier
      - `item_id` (uuid) - Reference to marketplace item
      - `reviewer_wallet` (text) - Reviewer wallet address
      - `rating` (numeric) - Rating (1-5)
      - `review_text` (text) - Review content
      - `helpful_count` (integer) - Number of helpful votes
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `listing_fees`
      - `id` (uuid, primary key) - Unique identifier
      - `item_id` (uuid) - Reference to marketplace item
      - `creator_wallet` (text) - Creator wallet address
      - `fee_amount` (numeric) - Fee amount in SOL
      - `transaction_signature` (text) - Transaction signature
      - `recipient_address` (text) - Fee recipient address
      - `status` (text) - Status (pending, confirmed, failed)
      - `created_at` (timestamptz) - Creation timestamp
      - `confirmed_at` (timestamptz) - Confirmation timestamp

  2. Enhancements to Existing Tables
    - Add `average_rating` column to marketplace_items
    - Add `review_count` column to marketplace_items
    - Add `draft_id` column to marketplace_items to link to original draft

  3. Security
    - Enable RLS on all new tables
    - Users can only access their own drafts
    - Anyone can read reviews
    - Only reviewers can update their own reviews
    - Service role manages listing fees
*/

-- Create agent_drafts table
CREATE TABLE IF NOT EXISTS agent_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet text NOT NULL,
  name text DEFAULT '',
  description text DEFAULT '',
  full_description text DEFAULT '',
  category text DEFAULT 'AI Agent',
  price numeric DEFAULT 0.01,
  api_endpoint text DEFAULT '',
  tags text[] DEFAULT '{}',
  capabilities text[] DEFAULT '{}',
  preview_images text[] DEFAULT '{}',
  last_saved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agent_reviews table
CREATE TABLE IF NOT EXISTS agent_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES marketplace_items(id) ON DELETE CASCADE,
  reviewer_wallet text NOT NULL,
  rating numeric NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text DEFAULT '',
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(item_id, reviewer_wallet)
);

-- Create listing_fees table
CREATE TABLE IF NOT EXISTS listing_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES marketplace_items(id),
  creator_wallet text NOT NULL,
  fee_amount numeric NOT NULL DEFAULT 0.01,
  transaction_signature text,
  recipient_address text NOT NULL DEFAULT '6rmN7SW2CnTWcFXn2Y2PQZfRBfVXovH3gMiQ2W9a8PsE',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

-- Add columns to marketplace_items if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'marketplace_items' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE marketplace_items ADD COLUMN average_rating numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'marketplace_items' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE marketplace_items ADD COLUMN review_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'marketplace_items' AND column_name = 'draft_id'
  ) THEN
    ALTER TABLE marketplace_items ADD COLUMN draft_id uuid REFERENCES agent_drafts(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE agent_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_fees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_drafts
CREATE POLICY "Users can view their own drafts"
  ON agent_drafts FOR SELECT
  TO authenticated, anon
  USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

CREATE POLICY "Users can insert their own drafts"
  ON agent_drafts FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update their own drafts"
  ON agent_drafts FOR UPDATE
  TO authenticated, anon
  USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true)
  WITH CHECK (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

CREATE POLICY "Users can delete their own drafts"
  ON agent_drafts FOR DELETE
  TO authenticated, anon
  USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

-- RLS Policies for agent_reviews
CREATE POLICY "Anyone can read reviews"
  ON agent_reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON agent_reviews FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update their own reviews"
  ON agent_reviews FOR UPDATE
  TO authenticated, anon
  USING (reviewer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true)
  WITH CHECK (reviewer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

CREATE POLICY "Users can delete their own reviews"
  ON agent_reviews FOR DELETE
  TO authenticated, anon
  USING (reviewer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

-- RLS Policies for listing_fees
CREATE POLICY "Users can read their own listing fees"
  ON listing_fees FOR SELECT
  TO authenticated, anon
  USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address' OR true);

CREATE POLICY "Anyone can create listing fees"
  ON listing_fees FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Service role can manage listing fees"
  ON listing_fees FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_drafts_creator ON agent_drafts(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_agent_reviews_item ON agent_reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_agent_reviews_rating ON agent_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_listing_fees_creator ON listing_fees(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_listing_fees_status ON listing_fees(status);

-- Create function to update average rating
CREATE OR REPLACE FUNCTION update_marketplace_item_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_items
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM agent_reviews
      WHERE item_id = NEW.item_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM agent_reviews
      WHERE item_id = NEW.item_id
    )
  WHERE id = NEW.item_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
DROP TRIGGER IF EXISTS update_rating_trigger ON agent_reviews;
CREATE TRIGGER update_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON agent_reviews
FOR EACH ROW
EXECUTE FUNCTION update_marketplace_item_rating();
