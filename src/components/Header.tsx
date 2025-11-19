import { useState } from 'react';
import { Github } from 'lucide-react';
import UtilitiesMenu from './UtilitiesMenu';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  walletState?: {
    connected: boolean;
    address: string | null;
  };
  onConnectWallet?: () => void;
}

export default function Header({ onNavigate, currentPage, walletState, onConnectWallet }: HeaderProps) {
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);

  return (
    <>
    <header className="fixed top-0 w-full z-50" style={{ backgroundColor: '#000000', height: '80px' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full gap-4">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center transform transition-transform duration-300 hover:scale-105"
            >
              <img src="/logo.svg" alt="Parally" width="50" height="50" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm font-medium text-white hover:text-white/80 transition-colors duration-200 font-everett-mono"
            >
              HOME
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className="text-sm font-medium text-white hover:text-white/80 transition-colors duration-200 font-everett-mono"
            >
              DOCS
            </button>
          </div>

          <button
            onClick={() => setIsUtilitiesOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsUtilitiesOpen(true);
              }
            }}
            className="flex items-center justify-center text-white transition-all duration-200 hover:opacity-90 clip-path-corners font-everett-mono"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 400,
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Open utilities menu"
          >
            Parally Utilities
          </button>

          <div className="hidden md:flex items-center gap-4">
            {walletState?.connected ? (
              <button
                onClick={onConnectWallet}
                className="px-4 py-2 bg-white text-black transition-all duration-200 hover:opacity-90 clip-path-corners font-everett-mono"
                style={{ fontSize: '12px', border: 'none', cursor: 'pointer' }}
              >
                {walletState.address}
              </button>
            ) : (
              <button
                onClick={onConnectWallet}
                className="px-4 py-2 bg-white text-black transition-all duration-200 hover:opacity-90 clip-path-corners font-everett-mono"
                style={{ fontSize: '12px', border: 'none', cursor: 'pointer' }}
              >
                Connect Wallet
              </button>
            )}

            <a href="https://x.com/parallydotfun" className="text-white hover:text-white/80 transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a href="https://github.com/parallydotfun/Parally" className="text-white hover:text-white/80 transition-colors flex-shrink-0">
              <Github size={20} />
            </a>
          </div>
        </div>
      </nav>
    </header>

    <UtilitiesMenu
      isOpen={isUtilitiesOpen}
      onClose={() => setIsUtilitiesOpen(false)}
      onNavigate={onNavigate}
    />
    </>
  );
}
