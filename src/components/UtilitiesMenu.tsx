import { useEffect } from 'react';
import { X } from 'lucide-react';

interface UtilitiesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export default function UtilitiesMenu({ isOpen, onClose, onNavigate }: UtilitiesMenuProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('utilities-menu');
      if (menu && !menu.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { name: 'PARALLY AGENT', color: '#FF4D00', action: 'agent' },
    { name: 'PARALLY MARKETPLACE', color: '#FF4D00', action: 'marketplace' },
    { name: 'PARALLY AGENT BUILDER', color: '#FF4D00', action: 'agent-builder' },
    { name: 'PARALLY STAKING', color: '#FF4D00', action: 'staking' },
    { name: 'PARALLY PLUG', color: '#000000', action: null },
    { name: 'PARALLY SDK', color: '#000000', action: null },
    { name: 'PARALLY FACILITATOR', color: '#000000', action: null },
    { name: 'PARALLY X402 CREATOR', color: '#000000', action: null },
  ];

  const panelItems = [
    { name: 'USER PANEL', color: '#FF4D00', action: 'user-panel' },
    { name: 'PLATFORM PANEL', color: '#FF4D00', action: 'platform-panel' },
  ];

  const handleNavigateClick = (action: string | null) => {
    if (action && onNavigate) {
      onNavigate(action);
      setTimeout(() => {
        onClose();
      }, 50);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-in menu */}
      <div
        id="utilities-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="utilities-menu-title"
        className={`fixed top-0 right-0 h-full bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '370px', maxWidth: '90vw' }}
      >
        {/* Menu content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2
                id="utilities-menu-title"
                className="text-lg font-everett-mono tracking-wide"
              >
                Parally Utilities
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black transition-colors p-1"
                aria-label="Close utilities menu"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto py-8">
            <ul className="space-y-6 px-8">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigateClick(item.action)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNavigateClick(item.action);
                      }
                    }}
                    className="block text-sm font-everett-mono tracking-wide hover:opacity-80 transition-opacity text-left w-full"
                    style={{ color: item.color, cursor: item.action ? 'pointer' : 'default' }}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="my-8 px-8">
              <hr className="border-t border-gray-900" />
            </div>

            {/* Panel items */}
            <ul className="space-y-6 px-8">
              {panelItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigateClick(item.action)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNavigateClick(item.action);
                      }
                    }}
                    className="block text-sm font-everett-mono tracking-wide hover:opacity-80 transition-opacity text-left w-full"
                    style={{ color: item.color, cursor: item.action ? 'pointer' : 'default' }}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
