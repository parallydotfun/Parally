import { Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Parally</h3>
            <p className="text-sm text-gray-600">
              Enabling machines to operate in an autonomous economy.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('docs')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Documentation
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Parally Utilities</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={() => onNavigate('agent')}
                  className="hover:text-gray-900 transition-colors"
                >
                  Parally Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-gray-900 transition-colors"
                >
                  Parally Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('agent-builder')}
                  className="hover:text-gray-900 transition-colors"
                >
                  Parally Agent Builder
                </button>
              </li>
              <li>Parally SDK</li>
              <li>Parally Facilitator</li>
              <li>Parally X402 Creator</li>
              <li>
                <button
                  onClick={() => onNavigate('user-panel')}
                  className="hover:text-gray-900 transition-colors"
                >
                  User Panel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('platform-panel')}
                  className="hover:text-gray-900 transition-colors"
                >
                  Platform Panel
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <a
                href="https://x.com/parallydotfun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/parallydotfun/Parally"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github size={20} />
              </a>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>© 2024 Parally</span>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
