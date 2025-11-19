import { useState, useEffect, useRef } from 'react';
import { X, Send, ChevronUp, Menu, Loader2 } from 'lucide-react';
import { AIService } from '../services/ai';
import { DatabaseService, UserSpending, WalletActivity } from '../services/database';
import { SolanaService } from '../services/solana';
import DynamicBackground from '../components/DynamicBackground';

interface Message {
  id: string;
  type: 'agent' | 'user';
  content: string;
  timestamp: Date;
}

interface WalletState {
  connected: boolean;
  address: string | null;
  publicKey: string | null;
}

export default function AgentPage() {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    publicKey: null,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSpending, setUserSpending] = useState<UserSpending | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<WalletActivity[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How does Parally enable machine-to-machine payments?',
    'What is the machine economy?',
    'How do I integrate Parally SDK?',
    'Tell me about Parally Marketplace',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (walletState.connected && walletState.publicKey) {
      loadChatHistory();
      loadUserSpending();
      loadRecentPurchases();
    }
  }, [walletState.connected, walletState.publicKey]);

  const loadChatHistory = async () => {
    if (!walletState.publicKey) return;

    setIsLoadingHistory(true);
    try {
      const history = await DatabaseService.getChatHistory(walletState.publicKey);

      if (history.length > 0) {
        const loadedMessages: Message[] = history.map((msg) => ({
          id: msg.id,
          type: msg.message_type,
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(loadedMessages);
      } else {
        setMessages([
          {
            id: '1',
            type: 'agent',
            content:
              "Hello! I'm Parally Agent, your assistant for the machine economy. I can help you understand how Parally enables autonomous machine-to-machine transactions, answer questions about our infrastructure, and guide you through building on Solana. What would you like to know?",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([
        {
          id: '1',
          type: 'agent',
          content:
            "Hello! I'm Parally Agent, your assistant for the machine economy. I can help you understand how Parally enables autonomous machine-to-machine transactions, answer questions about our infrastructure, and guide you through building on Solana. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadUserSpending = async () => {
    if (!walletState.publicKey) return;

    try {
      const spending = await DatabaseService.getUserSpending(walletState.publicKey);
      setUserSpending(spending);
    } catch (error) {
      console.error('Error loading user spending:', error);
    }
  };

  const loadRecentPurchases = async () => {
    if (!walletState.publicKey) return;

    try {
      const purchases = await DatabaseService.getRecentPurchases(walletState.publicKey);
      setRecentPurchases(purchases);
    } catch (error) {
      console.error('Error loading recent purchases:', error);
    }
  };

  const checkWalletConnection = async () => {
    if ('solana' in window) {
      const solana = (window as any).solana;
      if (solana?.isPhantom && solana.isConnected) {
        const publicKey = solana.publicKey.toString();
        setWalletState({
          connected: true,
          address: truncateAddress(publicKey),
          publicKey: publicKey,
        });
      }
    }
  };

  const connectWallet = async (walletType: 'phantom' | 'solflare') => {
    try {
      setIsLoading(true);

      if (walletType === 'phantom') {
        if ('solana' in window) {
          const solana = (window as any).solana;
          if (solana?.isPhantom) {
            const response = await solana.connect();
            const publicKey = response.publicKey.toString();

            setWalletState({
              connected: true,
              address: truncateAddress(publicKey),
              publicKey: publicKey,
            });

            setShowWalletModal(false);
          } else {
            alert('Phantom wallet is not installed. Please install it from phantom.app');
          }
        } else {
          alert('Phantom wallet is not installed. Please install it from phantom.app');
        }
      } else if (walletType === 'solflare') {
        if ('solflare' in window) {
          const solflare = (window as any).solflare;
          await solflare.connect();
          const publicKey = solflare.publicKey.toString();

          setWalletState({
            connected: true,
            address: truncateAddress(publicKey),
            publicKey: publicKey,
          });

          setShowWalletModal(false);
        } else {
          alert('Solflare wallet is not installed. Please install it from solflare.com');
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if ('solana' in window) {
        const solana = (window as any).solana;
        if (solana?.isPhantom) {
          await solana.disconnect();
        }
      }

      if ('solflare' in window) {
        const solflare = (window as any).solflare;
        await solflare.disconnect();
      }

      setWalletState({
        connected: false,
        address: null,
        publicKey: null,
      });
      setMessages([]);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !walletState.publicKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = AIService.convertToAIMessages(
        messages.map((m) => ({ type: m.type, content: m.content }))
      );

      const response = await AIService.sendMessage(
        inputValue,
        walletState.publicKey,
        conversationHistory
      );

      if (response.success && response.response) {
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: response.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentResponse]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <DynamicBackground>
    <div className="min-h-screen text-white flex pt-32">
      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={`fixed left-0 top-32 h-[calc(100vh-128px)] bg-black/30 backdrop-blur-sm border-r border-gray-800 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:top-0 lg:h-full`}
        style={{ width: '350px' }}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="mb-8">
            <h2 className="text-lg font-everett mb-6">Overview</h2>

            {/* Stats Cards */}
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 font-everett-mono">Total Spent</p>
                <p className="text-2xl font-everett">
                  {formatCurrency(userSpending?.total_spent_usdc || 0)}{' '}
                  <span className="text-sm">💵 USDC</span>
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 font-everett-mono">Transactions</p>
                <p className="text-2xl font-everett">{userSpending?.transaction_count || 0}</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 font-everett-mono">Services Used</p>
                <p className="text-2xl font-everett">{userSpending?.services_used || 0}</p>
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="mb-6">
            <h3 className="text-base font-everett mb-4">Recent Purchases</h3>
            {recentPurchases.length > 0 ? (
              <div className="space-y-2">
                {recentPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-gray-900/30 border border-gray-800 rounded-lg p-3"
                  >
                    <p className="text-sm font-everett-mono text-white">
                      {purchase.service_name || 'Service'}
                    </p>
                    <p className="text-xs text-gray-400 font-everett-mono mt-1">
                      {formatCurrency(Number(purchase.amount))} SOL
                    </p>
                    <p className="text-xs text-gray-500 font-everett-mono mt-1">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 font-everett-mono">No purchases yet</div>
            )}
          </div>

          {/* Service Results */}
          <div>
            <h3 className="text-base font-everett mb-4">Service Results</h3>
            <div className="text-sm text-gray-500 font-everett-mono">No results yet</div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-80px)] relative">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'agent' && (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FF4D00' }}
                    >
                      <X size={20} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl p-4 rounded-lg ${
                      message.type === 'agent'
                        ? 'bg-gray-900/80 border border-gray-800'
                        : 'bg-[#FF4D00] text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed font-everett-mono whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-everett-mono text-sm">U</span>
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FF4D00' }}
                >
                  <X size={20} className="text-white" />
                </div>
                <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Questions */}
            {walletState.connected && messages.length <= 1 && !isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-left text-sm font-everett-mono hover:border-gray-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Wallet Connection Notice */}
        {!walletState.connected && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-center">
                <p className="text-sm text-red-400 font-everett-mono">
                  Please connect your Solana wallet (Phantom or Solflare)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-800 px-4 sm:px-6 lg:px-8 py-6 bg-black/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Message Parally Agent..."
                disabled={!walletState.connected || isLoading}
                className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-everett-mono"
              />
              <button
                onClick={handleSendMessage}
                disabled={!walletState.connected || !inputValue.trim() || isLoading}
                className="px-6 py-3 rounded-lg text-sm font-everett-mono transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: '#FF4D00', color: '#000000' }}
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <ChevronUp size={20} />
        </button>
      </main>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-everett">Connect Wallet</h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => connectWallet('phantom')}
                disabled={isLoading}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-left hover:bg-gray-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                  </div>
                  <div>
                    <p className="font-everett">Phantom</p>
                    <p className="text-xs text-gray-400 font-everett-mono">
                      Connect with Phantom Wallet
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => connectWallet('solflare')}
                disabled={isLoading}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-left hover:bg-gray-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <p className="font-everett">Solflare</p>
                    <p className="text-xs text-gray-400 font-everett-mono">
                      Connect with Solflare Wallet
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {isLoading && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400 font-everett-mono">Connecting...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </DynamicBackground>
  );
}
