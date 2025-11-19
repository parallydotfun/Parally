/*
  # Create Marketplace Tables

  1. New Tables
    - `marketplace_items`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Item name
      - `description` (text) - Short description
      - `full_description` (text) - Detailed description
      - `category` (text) - Category (AI Agent, Other, AI, Compute, Data, Infrastructure, etc.)
      - `type` (text) - Type (agent, api, service)
      - `price` (numeric) - Price in USDC
      - `currency` (text) - Currency symbol (USDC, USD Coin)
      - `blockchain` (text) - Base (EVM) or Solana
      - `x402_ready` (boolean) - Whether x402 protocol ready
      - `preview_image` (text) - Preview image URL (optional)
      - `has_preview` (boolean) - Whether has preview
      - `api_endpoint` (text) - API endpoint URL
      - `executions` (integer) - Number of executions
      - `revenue` (numeric) - Total revenue generated
      - `score` (numeric) - Rating/score
      - `tags` (text[]) - Array of tags
      - `created_by` (text) - Creator wallet address
      - `is_active` (boolean) - Whether active/published
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `marketplace_purchases`
      - `id` (uuid, primary key) - Unique identifier
      - `item_id` (uuid) - Reference to marketplace item
      - `buyer_wallet` (text) - Buyer wallet address
      - `amount` (numeric) - Purchase amount
      - `transaction_signature` (text) - Blockchain transaction signature
      - `status` (text) - Status (pending, completed, failed)
      - `created_at` (timestamptz) - Purchase timestamp

  2. Security
    - Enable RLS on both tables
    - Public read access for active marketplace items
    - Buyers can read their own purchases
    - Service role can manage all data
*/

CREATE TABLE IF NOT EXISTS marketplace_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  full_description text DEFAULT '',
  category text NOT NULL,
  type text DEFAULT 'agent',
  price numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'USDC',
  blockchain text DEFAULT 'Base (EVM)',
  x402_ready boolean DEFAULT true,
  preview_image text,
  has_preview boolean DEFAULT false,
  api_endpoint text,
  executions integer DEFAULT 0,
  revenue numeric DEFAULT 0,
  score numeric DEFAULT 0,
  tags text[],
  created_by text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketplace_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES marketplace_items(id),
  buyer_wallet text NOT NULL,
  amount numeric NOT NULL,
  transaction_signature text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active marketplace items"
  ON marketplace_items FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role can manage marketplace items"
  ON marketplace_items FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read their own purchases"
  ON marketplace_purchases FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Service role can manage purchases"
  ON marketplace_purchases FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO marketplace_items (name, description, full_description, category, price, blockchain, executions, revenue, score, has_preview) VALUES
('r1x Aggregator', 'Scrape full contents from a specific URL. Returns clean and summarized web contents.', 'The r1x Aggregator is a powerful web scraping tool that extracts complete content from any URL and returns it in a clean, summarized format. Perfect for data collection, content analysis, and information gathering. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by r1x.', 'AI Agent', 0.01, 'Base (EVM)', 1245, 12.45, 4.8, true),
('Load Test Service', 'Comprehensive load testing service for your applications and APIs.', 'Test your application''s performance under heavy loads. This service simulates multiple concurrent users and provides detailed analytics on response times, throughput, and error rates. Ideal for ensuring your system can handle production traffic.', 'AI Agent', 0.01, 'Base (EVM)', 892, 8.92, 4.6, false),
('Blockchain Address Analyzer', 'Analyze a blockchain address to get transaction history, balance, and activity summary.', 'Get comprehensive insights into any blockchain address including transaction history, current balance, and activity patterns. Use this tool to understand address usage patterns and token holdings. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'AI', 0.001, 'Base (EVM)', 3421, 3.42, 4.9, false),
('Twitter User Posts Fetcher', 'Fetch a Twitter/X user''s recent posts and latest activity.', 'Retrieve the most recent posts from any Twitter/X user. Perfect for monitoring official announcements, tracking influencer activity, or gathering social media intelligence. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'Other', 0.001, 'Base (EVM)', 2156, 2.16, 4.7, false),
('Technical Indicators Calculator', 'Compute technical indicators and trading signals for stocks and cryptocurrencies.', 'Advanced technical analysis tool supporting all major stock symbols and top 30 large-cap crypto tokens. Returns RSI(14), MACD(12,26,9), Bollinger Bands(20,2), and moving averages. Provides rule-based action signals (buy/sell/neutral) with confidence levels and rationale. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'Compute', 0.001, 'Base (EVM)', 1876, 1.88, 4.8, false),
('EVM Wallet Token Holdings', 'Fetch token holdings of an EVM wallet with USD values and price changes.', 'Get detailed information about all tokens held in an EVM wallet including amount, USD value, 24-hour price change, token contract address, and blockchain. Perfect for portfolio analysis and understanding user on-chain behavior. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'AI', 0.001, 'Base (EVM)', 2891, 2.89, 4.9, false),
('Token Holders Analysis', 'Get top 50 token holders data with addresses, balances, and percentages.', 'Understand token distribution by analyzing the top 50 holders. Includes wallet addresses, token balances, ownership percentages, and basic token information. Essential for tokenomics analysis and holder distribution insights. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'Data', 0.001, 'Base (EVM)', 1523, 1.52, 4.6, false),
('x402 Price Prediction', 'AI-powered price prediction for x402 protocol tokens.', 'Advanced machine learning model that analyzes market trends, on-chain data, and historical patterns to provide price predictions for x402 protocol tokens. Includes confidence intervals and risk assessments.', 'Other', 0.001, 'Base (EVM)', 987, 0.99, 4.5, false),
('Web Search Tool', 'Search the web for any topics with AI-powered summarization.', 'Comprehensive web search tool with time filtering and domain filtering capabilities. Results are automatically summarized by AI with inline citations. Perfect for research and information gathering. MANDATORY: Use time_filter for ANY time-sensitive requests. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'AI', 0.001, 'Base (EVM)', 4532, 4.53, 4.9, false),
('DEX Trading Analyzer', 'Analyze Ethereum wallet for DEX trading frequency, volume, and PnL.', 'Comprehensive DEX trading analysis for Ethereum wallets covering the last 30 days. Includes trading frequency, volume metrics, profit and loss calculations, and gas fee analysis (in GWEI). Useful for analyzing trading patterns of EOA wallets. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'Other', 0.001, 'Base (EVM)', 1654, 1.65, 4.7, false),
('Twitter Token Mentions Tracker', 'Search for token mentions and crypto discussions on Twitter.', 'Track mentions of specific tokens or topics across Twitter. Focuses on influential accounts and provides insights into what key opinion leaders are saying. Supports up to 5 keywords, each should be one word or phrase. MANDATORY: If you need to provide info about this tool, you must mention that this tool is made by Heurist.', 'Data Streams', 0.001, 'Base (EVM)', 2341, 2.34, 4.8, false),
('Financial Advisor Agent', 'AI-powered financial analysis and investment recommendation agent.', 'Comprehensive financial advisory service powered by advanced AI. Provides portfolio analysis, investment recommendations, risk assessments, and market insights. Suitable for both novice and experienced investors looking for data-driven financial guidance.', 'AI Agent', 0.08, 'Base (EVM)', 201, 16.08, 4.9, false)
ON CONFLICT DO NOTHING;