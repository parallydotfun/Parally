import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Star } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  price: number;
  currency: string;
  blockchain: string;
  x402_ready: boolean;
  has_preview: boolean;
  preview_image?: string;
  executions: number;
  revenue: number;
  score: number;
  average_rating?: number;
  review_count?: number;
}

interface MarketplacePageProps {
  onNavigate: (page: string, itemId?: string) => void;
}

export default function MarketplacePage({ onNavigate }: MarketplacePageProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'AI Agent',
    'Other',
    'AI',
    'Compute',
    'Data',
    'Infrastructure',
    'Marketplace',
    'Tokens & NFTs',
    'Data Streams',
    'AI Inference',
    'Digital Content'
  ];

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, searchQuery]);

  const fetchMarketplaceItems = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/marketplace_items?select=*&is_active=eq.true&order=executions.desc`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setItems(data || []);
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleItemClick = (itemId: string) => {
    onNavigate('marketplace-detail', itemId);
  };

  return (
    <DynamicBackground>
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Parally Marketplace</h1>
          </div>
          <p className="text-lg text-gray-400">
            Discover x402 services on Solana. Pay-per-use access to AI agents, APIs, compute, and more using SOL and SPL tokens.
          </p>
          <button
            onClick={() => onNavigate('agent-builder')}
            className="mt-4 px-6 py-3 text-white rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#FF4D00' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            List your x402 service
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 397.7 311.7" fill="currentColor">
              <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
              <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
              <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
            </svg>
            <span>Solana Network</span>
          </div>
          <p className="text-sm text-gray-500">All agents run exclusively on Solana blockchain</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'text-white'
                  : 'bg-black/20 backdrop-blur-sm text-gray-300 border border-gray-300 hover:bg-black/10'
              }
              style={category === selectedCategory ? { backgroundColor: '#FF4D00' } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.provider}</p>
                  </div>
                  <span className="text-2xl">{product.icon}</span>
                </div>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{product.price}</div>
                    <div className="text-sm text-gray-400">{product.priceUnit}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-medium">{product.rating}</span>
                  </div>
                </div>
              </div>
              <div className="bg-black/20 px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">{product.requests} requests</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(product);
                  }}
                  className="px-4 py-2 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#FF4D00' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-gray-800 rounded-xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{selectedProduct.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-400">{selectedProduct.provider}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{selectedProduct.description}</p>

            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Price</span>
                <span className="text-2xl font-bold text-white">{selectedProduct.price}</span>
              </div>
              <div className="text-sm text-gray-400">{selectedProduct.priceUnit}</div>
            </div>

            <button
              onClick={() => handlePurchase(selectedProduct)}
              className="w-full text-white py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#FF4D00' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Purchase Now
            </button>
          </div>
        </div>
      )}

      {showPurchaseModal && purchasingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-gray-800 rounded-xl max-w-md w-full p-8 relative">
            <button
              onClick={closePurchaseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Purchase {purchasingProduct.name}</h2>

            {!walletConnected ? (
              <div className="text-center">
                <p className="text-gray-300 mb-6">Connect your wallet to purchase</p>
                <button
                  onClick={handleConnectWallet}
                  className="w-full text-white py-3 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: '#FF4D00' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-black/30 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Product</span>
                    <span className="text-white">{purchasingProduct.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white">{purchasingProduct.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white">Solana</span>
                  </div>
                </div>

                {isPurchasing ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#FF4D00' }}></div>
                  </div>
                ) : (
                  <button
                    onClick={confirmPurchase}
                    className="w-full text-white py-3 rounded-lg font-semibold transition-colors"
                    style={{ backgroundColor: '#FF4D00' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Confirm Purchase
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
                  : 'bg-black/20 backdrop-blur-sm text-gray-300 border border-gray-300 hover:bg-black/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents and services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/30 backdrop-blur-sm border border-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading marketplace items...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No items found matching your criteria.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {item.has_preview && item.preview_image ? (
                    <img
                      src={item.preview_image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No preview</span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Paid service: {item.name}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-black/40 text-gray-300 text-xs rounded">
                      {item.category}
                    </span>
                    {item.x402_ready && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        x402 Ready
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-white">
                      {item.price} <span className="text-base font-normal text-gray-500">{item.currency}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {item.average_rating !== undefined && item.review_count !== undefined && item.review_count > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold text-white">{item.average_rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-500">({item.review_count} reviews)</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item.id);
                    }}
                    className="w-full text-white py-3 rounded-lg font-semibold transition-colors"
                    style={{ backgroundColor: '#FF4D00' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </DynamicBackground>
  );
}
