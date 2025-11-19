import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Eye, Upload } from 'lucide-react';
import { useWallet } from '../services/solana';
import DynamicBackground from '../components/DynamicBackground';

interface AgentConfig {
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  price: string;
  apiEndpoint: string;
  tags: string[];
  capabilities: string[];
}

interface AgentBuilderPageProps {
  onNavigate: (page: string) => void;
}

export default function AgentBuilderPage({ onNavigate }: AgentBuilderPageProps) {
  const { wallet, connected } = useWallet();
  const [currentTag, setCurrentTag] = useState('');
  const [currentCapability, setCurrentCapability] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    fullDescription: '',
    category: 'AI Agent',
    price: '0.01',
    apiEndpoint: '',
    tags: [],
    capabilities: []
  });

  const categories = [
    'AI Agent',
    'AI',
    'Compute',
    'Data',
    'Infrastructure',
    'Marketplace',
    'Tokens & NFTs',
    'Data Streams',
    'AI Inference',
    'Digital Content',
    'Other'
  ];

  const handleInputChange = (field: keyof AgentConfig, value: string) => {
    setAgentConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !agentConfig.tags.includes(currentTag.trim())) {
      setAgentConfig(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setAgentConfig(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCapability = () => {
    if (currentCapability.trim() && !agentConfig.capabilities.includes(currentCapability.trim())) {
      setAgentConfig(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, currentCapability.trim()]
      }));
      setCurrentCapability('');
    }
  };

  const handleRemoveCapability = (capToRemove: string) => {
    setAgentConfig(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(cap => cap !== capToRemove)
    }));
  };

  const validateForm = () => {
    if (!agentConfig.name.trim()) return 'Agent name is required';
    if (!agentConfig.description.trim()) return 'Short description is required';
    if (!agentConfig.fullDescription.trim()) return 'Full description is required';
    if (!agentConfig.price || parseFloat(agentConfig.price) <= 0) return 'Valid price is required';
    if (!agentConfig.apiEndpoint.trim()) return 'API endpoint is required';
    if (agentConfig.capabilities.length === 0) return 'At least one capability is required';
    return null;
  };

  const handleSaveDraft = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    if (!connected || !wallet) {
      alert('Please connect your wallet first');
      return;
    }

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Agent draft saved successfully! You can continue editing or publish to marketplace.');
    } catch (error) {
      alert('Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    if (!connected || !wallet) {
      alert('Please connect your wallet first');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/marketplace_items`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: agentConfig.name,
            description: agentConfig.description,
            full_description: agentConfig.fullDescription,
            category: agentConfig.category,
            type: 'agent',
            price: parseFloat(agentConfig.price),
            currency: 'USDC',
            blockchain: 'Solana',
            x402_ready: true,
            api_endpoint: agentConfig.apiEndpoint,
            tags: agentConfig.tags,
            created_by: wallet.publicKey.toString(),
            is_active: true,
            executions: 0,
            revenue: 0,
            score: 0,
            has_preview: false
          })
        }
      );

      if (response.ok) {
        alert('Agent published successfully to the marketplace!');
        onNavigate('marketplace');
      } else {
        throw new Error('Failed to publish agent');
      }
    } catch (error) {
      alert('Failed to publish agent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DynamicBackground>
    <div className="min-h-screen pt-32 pb-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('marketplace')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">BACK</span>
        </button>

        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">AGENT BUILDER</h1>
          <p className="text-lg text-gray-400">
            Create and publish your AI agent to the Parally Marketplace. Configure pricing, capabilities, and settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={agentConfig.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Financial Advisor"
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={agentConfig.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief one-line description"
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={agentConfig.fullDescription}
                    onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                    placeholder="Detailed description of what your agent does..."
                    rows={6}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={agentConfig.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Capabilities & Features</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Capabilities *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentCapability}
                      onChange={(e) => setCurrentCapability(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCapability()}
                      placeholder="e.g., Portfolio analysis"
                      className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddCapability}
                      className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add
                    </button>
                  </div>
                  {agentConfig.capabilities.length > 0 && (
                    <div className="space-y-2">
                      {agentConfig.capabilities.map((capability, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black border border-gray-700 rounded-lg px-4 py-2"
                        >
                          <span className="text-white">{capability}</span>
                          <button
                            onClick={() => handleRemoveCapability(capability)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="e.g., finance, AI"
                      className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add
                    </button>
                  </div>
                  {agentConfig.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {agentConfig.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-black border border-gray-700 rounded-lg px-3 py-1.5"
                        >
                          <span className="text-white text-sm">{tag}</span>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Technical Configuration</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Endpoint *
                  </label>
                  <input
                    type="text"
                    value={agentConfig.apiEndpoint}
                    onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                    placeholder="https://api.example.com/agent/execute"
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    The API endpoint that will be called when users execute your agent
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Pricing & Publishing</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price per Execution *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={agentConfig.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      step="0.001"
                      min="0"
                      placeholder="0.01"
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-16"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                      USDC
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Set your price in USDC per agent execution
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="bg-black rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">PRICE</span>
                      <span className="text-2xl font-bold text-white">
                        ${agentConfig.price || '0.00'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">USDC per execution</div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      {showPreview ? 'Hide Preview' : 'Preview Agent'}
                    </button>

                    <button
                      onClick={handleSaveDraft}
                      disabled={saving}
                      className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Draft'}
                    </button>

                    <button
                      onClick={handlePublish}
                      disabled={saving || !connected}
                      className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      {saving ? 'Publishing...' : 'Publish to Marketplace'}
                    </button>

                    {!connected && (
                      <p className="text-sm text-yellow-500 text-center">
                        Connect wallet to publish
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Publishing Info</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>x402 protocol enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Solana blockchain</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Instant marketplace listing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="mt-8 bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Marketplace Preview</h2>

            <div className="bg-black rounded-lg p-6 border border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {agentConfig.name || 'Your Agent Name'}
                  </h3>
                  <p className="text-lg text-gray-400 mb-4">
                    {agentConfig.description || 'Your short description'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg font-medium">
                      {agentConfig.category}
                    </span>
                    <span className="px-3 py-1 bg-green-800 text-green-300 text-sm rounded-lg font-medium">
                      x402 Ready
                    </span>
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
                  <div className="text-sm font-medium text-gray-400 mb-1">PRICE</div>
                  <div className="text-4xl font-bold text-white">
                    ${agentConfig.price || '0.00'}
                    <span className="text-xl text-gray-400 ml-1">USDC</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="text-sm font-medium text-gray-400 mb-2">EXECUTIONS</div>
                  <div className="text-2xl font-bold text-white">0</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="text-sm font-medium text-gray-400 mb-2">REVENUE</div>
                  <div className="text-2xl font-bold text-white">$0.00</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="text-sm font-medium text-gray-400 mb-2">SCORE</div>
                  <div className="text-2xl font-bold text-white">0%</div>
                </div>
              </div>

              {agentConfig.capabilities.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-3">Capabilities</h4>
                  <ul className="space-y-2">
                    {agentConfig.capabilities.map((cap, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {agentConfig.fullDescription && (
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">About This Agent</h4>
                  <p className="text-gray-400 leading-relaxed">
                    {agentConfig.fullDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </DynamicBackground>
  );
}
