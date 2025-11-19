import { useState } from 'react';
import DynamicBackground from '../components/DynamicBackground';
import {
  Code2,
  Blocks,
  Bot,
  Store,
  LayoutDashboard,
  Link2,
  Package,
  Zap,
  Wallet,
  Vote,
  Crown,
  DollarSign,
  Network,
  Flame,
  Brain,
  Database,
  Cpu,
  Radio,
  Workflow,
  Sparkles,
  Library,
  LineChart
} from 'lucide-react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [email, setEmail] = useState('');

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'getting-started', label: 'GETTING STARTED' },
    { id: 'parally-agent', label: 'PARALLY AGENT' },
    { id: 'marketplace', label: 'MARKETPLACE' },
    { id: 'token', label: '$PARALLY TOKEN' },
    { id: 'agent-builder', label: 'AGENT BUILDER' },
    { id: 'sdk', label: 'SDK' },
    { id: 'fac', label: 'FAC' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Added pt-20 (80px) to account for fixed header height, reduced bottom padding */}
      <DynamicBackground>
      <div className="pt-20 pb-8 sm:pt-24 sm:pb-10 md:pt-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 font-everett" style={{ letterSpacing: '-1.858px' }}>
            Ship APIs agents actually pay for
          </h1>
          <p className="text-white text-lg sm:text-xl md:text-2xl font-everett-mono leading-relaxed max-w-4xl">
            x402 + USDC + Solana. Deploy in minutes. Agents discover, quote, and pay automatically. On‑chain settlement. This is how you monetize the AI economy.
          </p>
        </div>
      </div>
      </DynamicBackground>

      {/* Positioned below the 80px fixed header */}
      <div className="sticky top-[80px] bg-black/50 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-everett-mono whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={activeTab === tab.id ? { borderBottomColor: '#FF4D00' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        {activeTab === 'overview' && (
          <>
            <section className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-everett mb-4 text-white">What Parally does</h2>
                <p className="text-lg text-gray-400 font-everett-mono">The complete infrastructure for the machine economy</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Code2 className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-everett-mono mb-3 text-white">x402 Payment Protocol</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    HTTP 402 for machines: server quotes a price, wallet pays in USDC on Solana, client retries with proof (X‑PAYMENT). Minimal surface, maximal composability.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Blocks className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-everett-mono mb-3 text-white">Parally Builder</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Drag‑and‑drop builder to turn HTTP endpoints into x402 products. Price per request, set fees, and publish to the marketplace—no code required.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Bot className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-everett-mono mb-3 text-white">Parally Agent</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    An AI agent that plans, prices, and pays. Chats with Claude 3 Opus, understands x402, and executes purchases to unlock capabilities—pay‑per‑message, pay‑per‑request.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Store className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-everett-mono mb-3 text-white">Marketplace</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Discover and list machine‑payable services: inference, data windows, compute bursts, routes, teleop. Price in dollars, settle on Solana.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <LayoutDashboard className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-everett-mono mb-3 text-white">User & Platform Panels</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Create priced endpoints, set fees, and monitor quotes, purchases, and receipts in real time. Analytics for adoption and spend.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Link2 className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-everett-mono mb-3 text-white">On-Chain Settlement</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Every payment settles on‑chain and is auditable. No custodial accounts. Verifiable machine‑to‑machine commerce on Solana.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300 md:col-span-2 lg:col-span-3">
                  <Package className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-everett-mono mb-3 text-white">SDK & APIs</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Express middleware, public APIs, wallet utilities, and helpers for pricing, proof parsing, and verification—everything to ship x402 quickly.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative mb-32 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-black to-black"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-start gap-4 mb-8">
                  <Zap className="w-12 h-12 flex-shrink-0" style={{ color: '#FF4D00' }} />
                  <h2 className="text-3xl md:text-4xl font-everett text-white">The machine economy infrastructure</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
                  <p className="text-lg font-basel leading-relaxed text-gray-300">
                    Parally enables autonomous machine-to-machine transactions. AI agents buy compute. Robots purchase data. Machines transact without human intervention. Built on Solana. Powered by x402. Secured by blockchain. The infrastructure for the autonomous economy.
                  </p>
                  <p className="text-lg font-basel leading-relaxed text-gray-300">
                    This is the economic infrastructure for autonomous machines. No accounts. No API keys. No humans. Just machines transacting with machines. Every payment is on-chain. Every transaction is verifiable. Machines become economic agents. The future is here.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-everett mb-4 text-white">Roadmap</h2>
                <p className="text-lg font-everett-mono text-gray-400">Building the future of autonomous transactions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black text-white p-8 border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3" style={{ backgroundColor: '#FF4D00' }}></div>
                    <span className="font-everett-mono text-sm" style={{ color: '#FF4D00' }}>Q4 2025</span>
                  </div>
                  <h3 className="text-2xl font-everett mb-6 text-white">Current Focus</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Enterprise features & SSO‑less wallet flows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">White‑label marketplace & payouts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Governance & fee configuration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">$PARALLY token launch on Solana</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Cross-chain settlement research</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black text-white p-8 border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3" style={{ backgroundColor: '#FF4D00' }}></div>
                    <span className="font-everett-mono text-sm" style={{ color: '#FF4D00' }}>Q1 2026</span>
                  </div>
                  <h3 className="text-2xl font-everett mb-6 text-white">Expansion & Scale</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Parally SDK public release</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Parally Builder (no‑code) beta</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Service templates: inference, data window, compute job</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Enhanced analytics & receipts export</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Strategic ecosystem partnerships</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Developer documentation & examples</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Agent budgets (per‑cap, per‑task)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black text-white p-8 border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3" style={{ backgroundColor: '#FF4D00' }}></div>
                    <span className="font-everett-mono text-sm" style={{ color: '#FF4D00' }}>Q2 2026</span>
                  </div>
                  <h3 className="text-2xl font-everett mb-6 text-white">Machine Economy</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Pre‑authorized spend windows & allowances</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Machine‑to‑machine flows (X‑PAYMENT patterns)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Parally Builder marketplace publishing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Robot & IoT integration kits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Multi‑tenant billing & fee splits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Advanced routing & fallback strategies</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black text-white p-8 border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3" style={{ backgroundColor: '#FF4D00' }}></div>
                    <span className="font-everett-mono text-sm" style={{ color: '#FF4D00' }}>Q3 2026</span>
                  </div>
                  <h3 className="text-2xl font-everett mb-6 text-white">Global Adoption</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">DeFi treasury & yield routing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Cross‑chain settlement implementation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Enterprise partnerships</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Global market expansion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Advanced governance features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3" style={{ color: '#FF4D00' }}>▪</span>
                      <span className="font-basel">Ecosystem growth initiatives</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-everett mb-4 text-white">$PARALLY Token</h2>
                <p className="text-lg font-everett-mono text-gray-400">
                  Native token on Solana. Powering the machine economy with a deflationary flywheel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Wallet className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-basel mb-4 text-white">Network Utility</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    $PARALLY powers the machine economy. Staking, governance, fee discounts, and access to premium services.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <DollarSign className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-basel mb-4 text-white">Fee Distribution</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Token holders receive a share of platform fees. The more machines transact, the more value accrues to holders.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Vote className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-basel mb-4 text-white">Governance</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Vote on protocol upgrades, fee structures, and new features. Shape the future of the machine economy.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Crown className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h3 className="text-xl font-basel mb-4 text-white">Platform Access</h3>
                  <p className="text-gray-300 font-basel leading-relaxed text-sm">
                    Unlock premium features, priority support, and exclusive services. Build on top of Parally infrastructure.
                  </p>
                </div>
              </div>

              <div className="text-white p-12" style={{ backgroundColor: '#FF4D00' }}>
                <h3 className="text-3xl font-everett mb-8 text-white">Token Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <p className="font-everett-mono text-sm mb-2">NETWORK</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-green-400 rounded-full"></div>
                      <p className="text-2xl font-everett">Solana</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-everett-mono text-sm mb-2">CONTRACT</p>
                    <p className="text-2xl font-everett">Coming Soon</p>
                  </div>
                  <div>
                    <p className="font-everett-mono text-sm mb-2">UTILITY</p>
                    <p className="text-lg font-everett">Governance, Staking, Fees</p>
                  </div>
                  <div>
                    <p className="font-everett-mono text-sm mb-2">SUPPLY</p>
                    <p className="text-2xl font-everett">1B $PARALLY</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-black/80 backdrop-blur-sm p-8 border border-gray-800">
                <p className="text-gray-300 font-basel leading-relaxed">
                  $PARALLY is the native token of the Parally ecosystem, launched on Solana. It powers governance, enables staking, provides fee discounts, and unlocks premium features. 75% of platform fees are used for buybacks and burns, creating a deflationary flywheel that benefits all holders as the machine economy grows.
                </p>
              </div>
            </section>
          </>
        )}

        {activeTab === 'getting-started' && (
          <div>
            <h2 className="text-4xl md:text-5xl font-everett mb-8">Prerequisites</h2>
            <p className="text-xl font-basel mb-12">Before you begin, ensure you have:</p>

            <ul className="space-y-4 mb-16">
              <li className="flex items-start">
                <span className="mr-4 mt-1" style={{ color: '#FF4D00' }}>▪</span>
                <span className="text-lg font-basel">Node.js 20.9.0 or higher</span>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1" style={{ color: '#FF4D00' }}>▪</span>
                <span className="text-lg font-basel">npm 10.0.0 or higher</span>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1" style={{ color: '#FF4D00' }}>▪</span>
                <span className="text-lg font-basel">A Solana network wallet (Phantom recommended)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1" style={{ color: '#FF4D00' }}>▪</span>
                <span className="text-lg font-basel">USDC on Solana mainnet for testing</span>
              </li>
              <li className="flex items-start">
                <span className="mr-4 mt-1" style={{ color: '#FF4D00' }}>▪</span>
                <span className="text-lg font-basel">A Coinbase Developer Platform account (for PayAI facilitator)</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'parally-agent' && (
          <div>
            <h2 className="text-4xl md:text-5xl font-everett mb-8">Parally Agent</h2>
            <p className="text-xl font-everett-mono mb-12">
              The first AI agent that actually pays. Built to prove AI agents can be economically autonomous.
            </p>

            <section className="mb-16">
              <h3 className="text-3xl font-everett mb-6 text-white">What is Parally Agent?</h3>
              <p className="text-lg font-basel leading-relaxed mb-6">
                Parally Agent is an AI assistant powered by Claude 3.5 Sonnet that understands x402 payment protocols. When it encounters a paid service, it automatically quotes prices, guides you through wallet approval, and retries the request with proof.
              </p>
              <p className="text-lg font-basel leading-relaxed">
                <strong className="font-everett">This is the proof of concept for the autonomous economy.</strong> Every conversation that requires a paid service demonstrates how agents will spend money to accomplish tasks. No human API keys. No credit cards. Just wallets and payments.
              </p>
            </section>

            <section className="mb-16">
              <h3 className="text-3xl font-everett mb-6 text-white">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ backgroundColor: '#FF4D00' }}>1</div>
                    <h4 className="text-lg font-everett-mono text-white">Agent encounters 402</h4>
                  </div>
                  <p className="text-gray-300 font-basel text-sm">When a service requires payment, it returns HTTP 402 with pricing details in the X-PAYMENT-QUOTE header.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ backgroundColor: '#FF4D00' }}>2</div>
                    <h4 className="text-lg font-everett-mono text-white">Quote displayed to user</h4>
                  </div>
                  <p className="text-gray-300 font-basel text-sm">The agent parses the quote and presents the cost in USDC to you for approval.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ backgroundColor: '#FF4D00' }}>3</div>
                    <h4 className="text-lg font-everett-mono text-white">Wallet pays</h4>
                  </div>
                  <p className="text-gray-300 font-basel text-sm">Your connected wallet signs and submits the payment transaction on Solana.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ backgroundColor: '#FF4D00' }}>4</div>
                    <h4 className="text-lg font-everett-mono text-white">Request retried with proof</h4>
                  </div>
                  <p className="text-gray-300 font-basel text-sm">The agent includes the payment proof in the X-PAYMENT header and receives the service response.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div>
            <h2 className="text-4xl md:text-5xl font-everett mb-8">Parally Marketplace</h2>
            <p className="text-xl font-everett-mono mb-12">
              The app store for AI agents. Discover, quote, and purchase x402 services on demand.
            </p>

            <section className="mb-16">
              <h3 className="text-3xl font-everett mb-6 text-white">Overview</h3>
              <p className="text-lg font-basel leading-relaxed mb-6">
                Parally Marketplace is where agents find services to buy. Every listing is an x402-protected API. Every purchase is settled in USDC on Solana. Every transaction is verifiable on-chain.
              </p>
              <p className="text-lg font-basel leading-relaxed">
                <strong className="font-everett">This is the agent economy's discovery layer.</strong> Deploy your service, set your price, watch agents buy. No integration required—just standard x402.
              </p>
            </section>

            <section className="mb-16">
              <h3 className="text-3xl font-everett mb-6 text-white">Service Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Brain className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">AI Inference</h4>
                  <p className="text-gray-300 font-basel text-sm">Pay-per-token access to LLMs, vision models, and specialized AI services.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Database className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">Data Services</h4>
                  <p className="text-gray-300 font-basel text-sm">Real-time market data, weather, maps, and proprietary datasets on demand.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Cpu className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">Compute Resources</h4>
                  <p className="text-gray-300 font-basel text-sm">GPU hours, batch processing, rendering, and compute-intensive tasks.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Radio className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">Robot Services</h4>
                  <p className="text-gray-300 font-basel text-sm">Teleoperation, navigation routes, and physical task execution.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'token' && (
          <div>
            <h2 className="text-4xl md:text-5xl font-everett mb-8">What is $PARALLY?</h2>
            <p className="text-xl font-basel leading-relaxed mb-12">
              $PARALLY is the native token of the Parally ecosystem, launched on Solana. It powers the machine economy through governance, staking, fee discounts, and utility. Transactions on Solana settle in USDC, but every transaction feeds the flywheel that drives deflationary pressure on $PARALLY through buybacks and burns powered by platform fees.
            </p>

            <section className="mb-16">
              <h3 className="text-3xl font-everett mb-8 text-white">The flywheel:</h3>
              <p className="text-lg font-basel leading-relaxed mb-6">
                <strong className="font-everett">More transactions → More fees → More buybacks & burns → Reduced supply → Increased value → More adoption → More transactions.</strong>
              </p>
              <p className="text-lg font-basel leading-relaxed">
                This creates a cycle that benefits the entire ecosystem. As agents spend more, token holders capture that growth through deflationary mechanics that reduce supply while demand increases. It's designed for long-term sustainability and aligned incentives across users, builders, and token holders.
              </p>
            </section>

            <section className="mb-16">
              <h3 className="text-3xl font-everett mb-8 text-white">Tokenomics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Package className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-4 text-white">Total Supply</h4>
                  <p className="text-3xl font-everett mb-4">1,000,000,000</p>
                  <p className="text-gray-300 font-basel text-sm">Fixed supply with deflationary mechanics.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Network className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-4 text-white">Network</h4>
                  <p className="text-3xl font-everett mb-4">Solana</p>
                  <p className="text-gray-300 font-basel text-sm">Fast, cheap transactions for token operations.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <DollarSign className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-4 text-white">Platform Fees</h4>
                  <p className="text-3xl font-everett mb-4">2.5%</p>
                  <p className="text-gray-300 font-basel text-sm">On every x402 transaction in USDC on Solana.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Flame className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-4 text-white">Buyback & Burn</h4>
                  <p className="text-3xl font-everett mb-4">75%</p>
                  <p className="text-gray-300 font-basel text-sm">Of platform fees used for deflationary flywheel.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agent-builder' && (
          <div>
            <h2 className="text-4xl md:text-5xl font-everett mb-8">Overview</h2>
            <p className="text-xl font-basel leading-relaxed mb-12">
              Build custom AI agents with payment superpowers. No coding required. Connect your LLM, define workflows, add x402 services, deploy. Your agents quote prices and pays in USDC.
            </p>

            <section className="mb-16">
              <p className="text-lg font-basel leading-relaxed mb-6">
                <strong className="font-everett">This is Zapier meets AutoGPT meets crypto wallets.</strong> The missing platform that turns AI agents into economic actors.
              </p>
            </section>

            <section className="mb-16">
              <h3 className="text-3xl font-everett mb-8 text-white">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Workflow className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">Visual Workflow Builder</h4>
                  <p className="text-gray-300 font-basel text-sm">Drag-and-drop interface to create agent logic flows without writing code.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Sparkles className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">LLM Integration</h4>
                  <p className="text-gray-300 font-basel text-sm">Connect to Claude, GPT, or custom models with API key configuration.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Library className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">x402 Service Library</h4>
                  <p className="text-gray-300 font-basel text-sm">Browse and add paid services from the marketplace to your agent's capabilities.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Wallet className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">Wallet Management</h4>
                  <p className="text-gray-300 font-basel text-sm">Assign wallets to agents with spending limits and budget controls.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <Zap className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">Testing & Deployment</h4>
                  <p className="text-gray-300 font-basel text-sm">Test agents in sandbox mode before deploying to production.</p>
                </div>
                <div className="group bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800 hover:border-orange-600 transition-all duration-300">
                  <LineChart className="w-10 h-10 mb-4" style={{ color: '#FF4D00' }} />
                  <h4 className="text-xl font-everett-mono mb-3 text-white">Analytics Dashboard</h4>
                  <p className="text-gray-300 font-basel text-sm">Monitor agent spending, task completion, and performance metrics.</p>
                </div>
              </div>
            </section>

            <div className="bg-black text-white p-12 -mx-4 sm:-mx-6 lg:-mx-8">
              <h3 className="text-3xl font-everett mb-6 text-white">Ready to build?</h3>
              <p className="text-lg font-basel mb-8">Create your first agent with x402 payment capabilities.</p>
              <button className="px-8 py-4 font-everett-mono text-sm transition-all hover:opacity-90" style={{ backgroundColor: '#FF4D00' }}>
                TRY AGENT BUILDER →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sdk' && (
          <div>
            <h2 className="text-4xl md:text-5xl font-everett mb-8">SDK</h2>
            <p className="text-xl font-basel mb-12">Coming soon - Developer tools and SDK documentation.</p>
          </div>
        )}

        {activeTab === 'fac' && (
          <div>
            <h2 className="text-4xl md:text-5xl font-everett mb-8">Facilitator</h2>
            <p className="text-xl font-basel mb-12">Coming soon - Facilitator documentation.</p>
          </div>
        )}
      </div>

      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-everett-mono mb-4 text-white">STAY UP TO DATE WITH PARALLY</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-700 bg-gray-900 text-white font-everett-mono text-sm focus:outline-none focus:border-orange-600"
                style={{ borderColor: '#374151' }}
              />
              <button className="text-white px-6 py-3 font-everett-mono text-sm hover:opacity-90 transition-colors" style={{ backgroundColor: '#FF4D00' }}>
                Subscribe
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xs font-everett-mono mb-4 text-white">NAVIGATION</h4>
              <ul className="space-y-2">
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">HOME</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">DOCS</li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-xs font-everett-mono mb-4 text-white">PARALLY UTILITIES</h4>
              <ul className="grid grid-cols-2 gap-2">
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">PARALLY AGENT</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">PARALLY MARKETPLACE</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">AGENT BUILDER</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">PARALLY SDK</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">PARALLY FACILITATOR</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">PARALLY X402 CREATOR</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer border-t border-gray-700 pt-2 mt-2">USER PANEL</li>
                <li className="text-sm font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer border-t border-gray-700 pt-2 mt-2">PLATFORM PANEL</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <ul className="flex gap-6">
              <li className="text-xs font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">PRIVACY POLICY</li>
              <li className="text-xs font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">TERMS OF SERVICE</li>
              <li className="text-xs font-everett-mono text-gray-400 hover:text-orange-600 cursor-pointer">LEGAL</li>
            </ul>
            <p className="text-xs font-everett-mono text-gray-400">©2025 PARALLY. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
