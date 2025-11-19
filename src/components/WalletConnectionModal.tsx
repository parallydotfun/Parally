import { useState } from 'react';
import { X } from 'lucide-react';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connected: boolean, address: string | null) => void;
}

export default function WalletConnectionModal({
  isOpen,
  onClose,
  onConnect,
}: WalletConnectionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async (walletType: 'phantom' | 'solflare') => {
    try {
      setIsLoading(true);

      if (walletType === 'phantom') {
        if ('solana' in window) {
          const solana = (window as any).solana;
          if (solana?.isPhantom) {
            const response = await solana.connect();
            const publicKey = response.publicKey.toString();
            const truncatedAddress = `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`;

            onConnect(true, truncatedAddress);
            onClose();
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
          const truncatedAddress = `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`;

          onConnect(true, truncatedAddress);
          onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-everett text-white">Connect Wallet</h3>
          <button
            onClick={onClose}
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
                <p className="font-everett text-white">Phantom</p>
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
                <p className="font-everett text-white">Solflare</p>
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
  );
}
