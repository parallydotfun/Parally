import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DocsPage from './pages/DocsPage';
import AgentPage from './pages/AgentPage';
import StakingPage from './pages/StakingPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import EnhancedAgentBuilderPage from './pages/EnhancedAgentBuilderPage';
import BackgroundDemoPage from './pages/BackgroundDemoPage';
import PlatformPanelPage from './pages/PlatformPanelPage';
import UserPanelPage from './pages/UserPanelPage';
import WalletConnectionModal from './components/WalletConnectionModal';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [walletState, setWalletState] = useState({
    connected: false,
    address: null as string | null,
  });
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if ('solana' in window) {
      const solana = (window as any).solana;
      if (solana?.isPhantom && solana.isConnected) {
        const publicKey = solana.publicKey.toString();
        setWalletState({
          connected: true,
          address: truncateAddress(publicKey),
        });
      }
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleNavigate = (page: string, itemId?: string) => {
    setCurrentPage(page);
    if (itemId) {
      setSelectedItemId(itemId);
    }
  };

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletConnect = (connected: boolean, address: string | null) => {
    setWalletState({ connected, address });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onNavigate={handleNavigate}
        currentPage={currentPage}
        walletState={walletState}
        onConnectWallet={handleConnectWallet}
      />

      <main>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'docs' && <DocsPage />}
        {currentPage === 'agent' && <AgentPage />}
        {currentPage === 'staking' && <StakingPage />}
        {currentPage === 'marketplace' && <MarketplacePage onNavigate={handleNavigate} />}
        {currentPage === 'marketplace-detail' && selectedItemId && (
          <ProductDetailPage itemId={selectedItemId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'agent-builder' && <EnhancedAgentBuilderPage onNavigate={handleNavigate} />}
        {currentPage === 'background-demo' && <BackgroundDemoPage />}
        {currentPage === 'platform-panel' && <PlatformPanelPage />}
        {currentPage === 'user-panel' && <UserPanelPage />}
      </main>

      {currentPage !== 'agent' && currentPage !== 'marketplace-detail' && currentPage !== 'agent-builder' && currentPage !== 'background-demo' && currentPage !== 'platform-panel' && currentPage !== 'user-panel' && (
        <Footer onNavigate={handleNavigate} />
      )}

      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}

export default App;
