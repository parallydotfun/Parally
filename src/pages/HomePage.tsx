import { useState } from 'react';
import RotatingText from '../components/RotatingText';
import UtilitiesMenu from '../components/UtilitiesMenu';
import DynamicBackground from '../components/DynamicBackground';
import { Eye, Database, Users, Sparkles, Cpu, Zap, ArrowRight, DollarSign } from 'lucide-react';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const rotatingTexts = [
    'Machine economy.',
    'Robots.',
    'Staking.',
    'Build.',
    'AI Agents.',
    'x402.'
  ];

  const handleEnterClick = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setMenuOpen(true);
    }, 300);
  };

  const handleNavigate = (page: string) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <DynamicBackground>
      <UtilitiesMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
      />
      <section className="min-h-screen flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 pt-32 pb-32 text-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            <p className="text-sm font-everett-mono mb-4 tracking-wide">Parally enables</p>

            <h1 className="text-xl font-everett-mono mb-8 tracking-wide">
              <RotatingText texts={rotatingTexts} interval={2000} className="font-everett-mono" />
            </h1>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-everett mb-8 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              From users to AI agents,<br />
              from AI agents to robots.<br />
              Enabling machines to<br />
              operate in an autonomous<br />
              economy.
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={() => onNavigate?.('agent')}
                className="px-6 py-3 text-black font-everett-mono text-sm transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#FF4D00' }}
              >
                TRY PARALLY AGENT
              </button>
              <button
                onClick={() => onNavigate?.('docs')}
                className="px-6 py-3 border border-white text-white font-everett-mono text-sm hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                DOCS
              </button>
            </div>

            <button
              onClick={handleEnterClick}
              className={`inline-block border border-white px-4 py-2 cursor-pointer hover:bg-white hover:text-black transition-all ${isGlitching ? 'glitching-button' : ''}`}
            >
              <p className="font-everett-mono text-sm tracking-wider">[ENTER]</p>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-everett mb-12 leading-tight max-w-5xl">
            AI agents will spend billions. x402 makes every HTTP endpoint machine‑payable. USDC on Solana. We're building the payment layer for AGI.
          </h2>

          <div className="space-y-6 max-w-4xl">
            <p className="text-lg font-basel leading-relaxed text-gray-300">
              <strong className="font-everett text-white">The future isn't humans with API keys—it's agents with wallets.</strong> Every Claude, GPT, and custom agent will need to pay for services. We've built the first protocol where HTTP 402 meets blockchain settlement. One request → one quote → one payment. Instant, verifiable, on‑chain.
            </p>

            <p className="text-lg font-basel leading-relaxed text-gray-300">
              Deploy any service as x402. Agents discover it, quote it, pay for it—no accounts, no OAuth, no credit cards. Just wallets and smart contracts. This is how trillion‑dollar agent economies get built. We're making it standard.
            </p>
          </div>

        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-black/30 backdrop-blur-sm p-8 border border-gray-800">
              <p className="text-sm font-everett-mono text-gray-400 mb-4">[Agent]</p>
              <h3 className="text-xl font-everett mb-4">
                The first AI agent that actually pays. Plans, quotes, and settles in USDC on Base. Understands x402, executes purchases, unlocks premium APIs. This is what autonomous spending looks like.
              </h3>
            </div>

            <div className="bg-black/30 backdrop-blur-sm p-8 border border-gray-800">
              <p className="text-sm font-everett-mono text-gray-400 mb-4">[Panel]</p>
              <h3 className="text-xl font-everett mb-4">
                Turn your API into revenue in minutes. Set prices, deploy x402, watch agents pay. Real‑time analytics, on‑chain receipts, instant USDC settlement. The dashboard for the agent economy.
              </h3>
            </div>

            <div className="bg-black/30 backdrop-blur-sm p-8 border border-gray-800">
              <p className="text-sm font-everett-mono text-gray-400 mb-4">[x402]</p>
              <h3 className="text-xl font-everett mb-4">
                HTTP 402 Payment Required, reimagined for Web3. Server quotes, agent pays in USDC, client retries with proof. The missing protocol that makes agents economically autonomous.
              </h3>
            </div>
          </div>


          <h2 className="text-3xl sm:text-4xl md:text-5xl font-everett mb-16">
            AI agents unlock trillion‑dollar markets. Every capability becomes pay‑per‑use.
          </h2>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Eye className="w-12 h-12 mb-6" style={{ color: '#FF4D00' }} />
              <h3 className="text-2xl font-everett-mono mb-3">Vision APIs agents buy</h3>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Agents pay per inference for OCR, object detection, image analysis. No monthly fees. Just USDC per call. The AI vision market, now machine‑accessible.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Database className="w-12 h-12 mb-6" style={{ color: '#FF4D00' }} />
              <h3 className="text-2xl font-everett-mono mb-3">Real‑time data streams</h3>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Market data, social feeds, IoT sensors—all priced per access. Agents compose data sources on demand. Pay only for what they consume.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Users className="w-12 h-12 mb-6" style={{ color: '#FF4D00' }} />
              <h3 className="text-2xl font-everett-mono mb-3">Human expertise on tap</h3>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Agents escalate complex tasks to human specialists. Pay per consultation minute. On‑chain receipts, instant settlement. The gig economy meets AGI.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Sparkles className="w-12 h-12 mb-6" style={{ color: '#FF4D00' }} />
              <h3 className="text-2xl font-everett-mono mb-3">Premium model access</h3>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Deploy gated LLMs, custom fine‑tunes, or specialized models. Agents pay per token or inference. Your models become revenue streams.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300 md:col-span-2 lg:col-span-2">
              <Cpu className="w-12 h-12 mb-6" style={{ color: '#FF4D00' }} />
              <h3 className="text-2xl font-everett-mono mb-3">Compute marketplaces</h3>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Rent GPU cycles, serverless functions, or specialized hardware. Agents pay per job. Idle compute becomes instant revenue. The Airbnb for AI infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-everett mb-16">[The machine economy]</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl" style={{ color: '#FF4D00' }}>→</span>
                <div>
                  <p className="text-sm font-everett-mono mb-2">[01]</p>
                  <h3 className="text-xl font-everett mb-4">AGENT REQUESTS</h3>
                  <p className="font-basel text-gray-300 leading-relaxed">
                    AI agent calls your API. Server returns HTTP 402 with a USDC quote on Solana. Dynamic pricing. Instant quotes. Zero overhead.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl" style={{ color: '#FF4D00' }}>$</span>
                <div>
                  <p className="text-sm font-everett-mono mb-2">[02]</p>
                  <h3 className="text-xl font-everett mb-4">AGENT PAYS</h3>
                  <p className="font-basel text-gray-300 leading-relaxed">
                    Wallet auto‑approves, settles in USDC. Transaction confirmed on‑chain in seconds. The quote is now a verifiable receipt.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl" style={{ color: '#FF4D00' }}>✓</span>
                <div>
                  <p className="text-sm font-everett-mono mb-2">[03]</p>
                  <h3 className="text-xl font-everett mb-4">AGENT ACCESSES</h3>
                  <p className="font-basel text-gray-300 leading-relaxed">
                    Client retries with payment proof in X‑PAYMENT header. API unlocks. Agent gets the resource. You get paid. This is the new internet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl sm:text-5xl font-everett mb-12">
              The payment protocol AGI needs.
            </h2>

            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-everett-mono mb-4">[ ] Built for AGI scale</h3>
                <p className="font-basel text-gray-300 leading-relaxed">
                  Millions of agents, billions of transactions. x402 scales with USDC on Solana. Sub‑cent fees. Instant finality. This infrastructure is ready for the agent explosion.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-everett-mono mb-4">[ ] No integration hell</h3>
                <p className="font-basel text-gray-300 leading-relaxed">
                  One protocol, every agent. No OAuth, no API keys, no rate limits. Agents use wallets. Your API returns 402. That's it. Standard, simple, unstoppable.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-everett-mono mb-4">[ ] Verifiable from day one</h3>
                <p className="font-basel text-gray-300 leading-relaxed">
                  Every payment is on‑chain. Every quote is signed. Every receipt is provable. Build trust into agent economies by default. No disputes, no chargebacks.
                </p>
              </div>
            </div>
          </div>

          <div className="aspect-square bg-gradient-to-br from-orange-950/20 via-black to-black border border-gray-800 flex items-center justify-center">
            <Zap className="w-32 h-32" style={{ color: '#FF4D00', opacity: 0.3 }} />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-everett-mono text-gray-400 mb-2">AGENT‑NATIVE</p>
            <h2 className="text-3xl sm:text-4xl font-everett mb-4">REVENUE STREAMS</h2>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-everett mb-12 uppercase">
            BUILD THE SERVICES AGENTS WILL PAY BILLIONS FOR.
          </h3>

          <button
            onClick={() => onNavigate?.('marketplace')}
            className="mb-16 font-everett-mono text-sm underline hover:no-underline flex items-center gap-2 cursor-pointer"
          >
            VIEW THE DEMOS →
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <ArrowRight className="w-10 h-10 mb-6" style={{ color: '#FF4D00' }} />
              <h4 className="text-xl font-everett mb-3">Paid API calls</h4>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Monetize every endpoint instantly. Agents pay per request in USDC. Your backend becomes a revenue stream today.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <DollarSign className="w-10 h-10 mb-6" style={{ color: '#FF4D00' }} />
              <h4 className="text-xl font-everett mb-3">Agent marketplaces</h4>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                List services agents discover and purchase automatically. Build the next Stripe for AI. We provide the payment rails.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Sparkles className="w-10 h-10 mb-6" style={{ color: '#FF4D00' }} />
              <h4 className="text-xl font-everett mb-3">Premium models</h4>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Gate your LLMs behind x402. Agents pay per token. Instant settlement. This is how AI model creators monetize at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Database className="w-10 h-10 mb-6" style={{ color: '#FF4D00' }} />
              <h4 className="text-xl font-everett mb-3">Live data feeds</h4>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Market data, social graphs, sensor networks—all x402‑protected. Agents pay per access. Build Bloomberg for machines.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Cpu className="w-10 h-10 mb-6" style={{ color: '#FF4D00' }} />
              <h4 className="text-xl font-everett mb-3">GPU‑as‑a‑service</h4>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Agents rent your idle compute. Per‑second billing. USDC settlement. Turn every GPU into passive income.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900 to-black p-8 border border-gray-800 hover:border-orange-600 transition-all duration-300">
              <Eye className="w-10 h-10 mb-6" style={{ color: '#FF4D00' }} />
              <h4 className="text-xl font-everett mb-3">Gated knowledge</h4>
              <p className="font-basel text-gray-300 leading-relaxed text-sm">
                Proprietary datasets, research, trained embeddings—agents pay to access. Intellectual property meets machine payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-everett-mono mb-8">
            JOIN THE CONVERSATION
          </h2>

          <div className="flex items-center justify-between">
            <p className="text-lg font-everett-mono text-gray-400 max-w-2xl">
              [X]
            </p>
            <button
              onClick={() => window.open('https://x.com/parallydotfun', '_blank')}
              className="w-16 h-16 rounded-full flex items-center justify-center hover:opacity-90 transition-all cursor-pointer"
              style={{ backgroundColor: '#FF4D00' }}
              aria-label="Follow us on X"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>

          <p className="text-gray-400 font-basel mt-8 max-w-2xl">
            Be the first to know what we've been up to and how we can help unleash the potential in your high-value data.
          </p>
        </div>
      </section>
    </DynamicBackground>
  );
}
