import React, { useState, useEffect } from 'react';
import DynamicBackground from '../components/DynamicBackground';
import { ArrowLeft, Play, Copy, Check } from 'lucide-react';
import { useWallet } from '../services/solana';
import ReviewSystem from '../components/ReviewSystem';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  full_description: string;
  category: string;
  type: string;
  price: number;
  currency: string;
  blockchain: string;
  x402_ready: boolean;
  has_preview: boolean;
  preview_image?: string;
  api_endpoint?: string;
  executions: number;
  revenue: number;
  score: number;
  average_rating: number;
  review_count: number;
}

interface ProductDetailPageProps {
  itemId: string;
  onNavigate: (page: string) => void;
}

export default function ProductDetailPage({ itemId, onNavigate }: ProductDetailPageProps) {
  const { wallet, connected, connecting, connect } = useWallet();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [queryInput, setQueryInput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'python' | 'typescript' | 'javascript' | 'curl'>('python');

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/marketplace_items?select=*&id=eq.${itemId}&is_active=eq.true`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setItem(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!wallet || !item) return;

    if (!queryInput.trim()) {
      setError('Please enter a query');
      return;
    }

    setExecuting(true);
    setError('');
    setResult('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setResult(`Execution successful! Your query "${queryInput}" has been processed.\n\nThis is a demo response. In production, this would call the actual API endpoint and return real results.`);

      const purchaseResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/marketplace_purchases`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            item_id: item.id,
            buyer_wallet: wallet.publicKey.toString(),
            amount: item.price,
            status: 'completed',
          }),
        }
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const getCodeExample = () => {
    if (!item) return '';

    const examples = {
      python: `import requests
import json

# Your wallet (keep secure!)
keypair = Keypair.from_bytes(bytearray(YOUR_SECRET_KEY))
recipient = Pubkey.from_string("${item.api_endpoint || ''}")

# Step 1: Get payment requirements
response = requests.post(
    "${item.api_endpoint || 'https://api.parally.com/api/agents/execute'}",
    json={
        "agent_id": "${item.id}",
        "input_data": {"query": "Your query here"},
    }
)

if response.status_code == 402:
    # Step 2: Create and send USDC transaction
    # ... transaction code here

    # Step 3: Retry with payment header
    payment_header = {
        "transaction_signature": signature,
        "amount": ${item.price},
    }

    response = requests.post(
        "${item.api_endpoint || 'https://api.parally.com/api/agents/execute'}",
        json={"agent_id": "${item.id}", "input_data": {"query": "Your query here"}},
        headers={"X-Payment": json.dumps(payment_header)}
    )

    result = response.json()
    print(result)`,
      typescript: `import { Connection, Keypair, PublicKey } from '@solana/web3.js';

// Your wallet configuration
const keypair = Keypair.fromSecretKey(YOUR_SECRET_KEY);
const recipient = new PublicKey("${item.api_endpoint || ''}");

// Execute agent
async function executeAgent() {
    const response = await fetch("${item.api_endpoint || 'https://api.parally.com/api/agents/execute'}", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            agent_id: "${item.id}",
            input_data: { query: "Your query here" }
        })
    });

    if (response.status === 402) {
        // Handle payment and retry
        const paymentHeader = {
            transaction_signature: signature,
            amount: ${item.price}
        };

        const retryResponse = await fetch("${item.api_endpoint || 'https://api.parally.com/api/agents/execute'}", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Payment': JSON.stringify(paymentHeader)
            },
            body: JSON.stringify({
                agent_id: "${item.id}",
                input_data: { query: "Your query here" }
            })
        });

        const result = await retryResponse.json();
        console.log(result);
    }
}`,
      javascript: `const response = await fetch("${item.api_endpoint || 'https://api.parally.com/api/agents/execute'}", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        agent_id: "${item.id}",
        input_data: { query: "Your query here" }
    })
});

const data = await response.json();
console.log(data);`,
      curl: `curl -X POST "${item.api_endpoint || 'https://api.parally.com/api/agents/execute'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "${item.id}",
    "input_data": {
      "query": "Your query here"
    }
  }'`
    };

    return examples[activeTab];
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeExample());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading product details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500">Product not found</div>
            <button
              onClick={() => onNavigate('marketplace')}
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DynamicBackground>
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('marketplace')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Marketplace</span>
        </button>

        <div className="bg-black/30 backdrop-blur-sm rounded border border-gray-800-xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3">{item.name}</h1>
              <p className="text-lg text-gray-400 mb-4">{item.description}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-300 text-sm rounded-lg font-medium">
                  {item.category}
                </span>
                {item.x402_ready && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg font-medium">
                    x402 Ready
                  </span>
                )}
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-lg font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 397.7 311.7" fill="currentColor">
                    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
                    <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
                    <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
                  </svg>
                  Solana
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-500 mb-1">PRICE</div>
              <div className="text-4xl font-bold text-white">
                {item.price}
                <span className="text-xl text-gray-500 ml-1">{item.currency}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-black/30 backdrop-blur-sm rounded border border-gray-800-xl border border-gray-200 shadow-sm p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">EXECUTIONS</div>
            <div className="text-3xl font-bold text-white">{item.executions.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded border border-gray-800-xl border border-gray-200 shadow-sm p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">REVENUE</div>
            <div className="text-3xl font-bold text-white">${item.revenue.toFixed(2)}</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded border border-gray-800-xl border border-gray-200 shadow-sm p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">SCORE</div>
            <div className="text-3xl font-bold text-white">{item.score}%</div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded border border-gray-800-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Execute Agent</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Input Query</label>
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Enter your query..."
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={!connected || executing}
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm whitespace-pre-wrap">
              {result}
            </div>
          )}

          {!connected ? (
            <button
              onClick={connect}
              disabled={connecting}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {connecting ? 'Connecting...' : 'Connect Wallet to Execute'}
            </button>
          ) : (
            <button
              onClick={handleExecute}
              disabled={executing}
              className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {executing ? 'Executing...' : `Execute (${item.price} ${item.currency})`}
            </button>
          )}
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded border border-gray-800-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">API Integration</h2>
          <p className="text-gray-400 mb-6">
            Integrate this agent programmatically. The x402 payment protocol handles micropayments automatically.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {(['python', 'typescript', 'javascript', 'curl'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === lang
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-300 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
            <button
              onClick={handleCopyCode}
              className="ml-auto px-4 py-2 text-gray-400 hover:text-white bg-white border border-gray-300 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-50"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCode ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono">
              <code>{getCodeExample()}</code>
            </pre>
          </div>
        </div>

        {item.full_description && (
          <div className="bg-black/30 backdrop-blur-sm rounded border border-gray-800-xl border border-gray-200 shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">About This Agent</h2>
            <p className="text-gray-400 leading-relaxed">{item.full_description}</p>
          </div>
        )}

        <ReviewSystem
          itemId={item.id}
          averageRating={item.average_rating || 0}
          reviewCount={item.review_count || 0}
        />
      </div>
    </div>
    </DynamicBackground>
  );
}
