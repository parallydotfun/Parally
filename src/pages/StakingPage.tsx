import React, { useState, useEffect } from 'react';
import DynamicBackground from '../components/DynamicBackground';
import { TrendingUp, Info } from 'lucide-react';
import { useWallet } from '../services/solana';
import { stakeTokens, unstakeTokens, getTokenBalance, getStakedAmount } from '../services/staking';

interface StakingConfig {
  token_name: string;
  token_symbol: string;
  token_address: string;
  base_apy: number;
  boosted_apy: number;
  boost_amount: number;
  boost_source: string;
  campaign_progress: number;
  total_value_locked: number;
  stake_enabled: boolean;
  unstake_enabled: boolean;
}

export default function StakingPage() {
  const { wallet, connected, connecting, connect } = useWallet();
  const [config, setConfig] = useState<StakingConfig | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [stakeInput, setStakeInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchStakingConfig();
  }, []);

  useEffect(() => {
    if (connected && wallet) {
      fetchBalances();
    }
  }, [connected, wallet]);

  const fetchStakingConfig = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/staking_config?select=*&limit=1`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data && data.length > 0) {
        setConfig(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch staking config:', err);
    }
  };

  const fetchBalances = async () => {
    if (!wallet || !config) return;

    try {
      const bal = await getTokenBalance(wallet.publicKey.toString(), config.token_address);
      setBalance(bal);

      const staked = await getStakedAmount(wallet.publicKey.toString(), config.token_symbol);
      setStakedAmount(staked);
    } catch (err) {
      console.error('Failed to fetch balances:', err);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    const amount = (balance * percentage / 100).toFixed(2);
    setStakeInput(amount);
    setError('');
  };

  const handleStake = async () => {
    if (!wallet || !config) return;

    const amount = parseFloat(stakeInput);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > balance) {
      setError('Insufficient balance');
      return;
    }

    if (!config.stake_enabled) {
      setError('Staking is currently disabled');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const signature = await stakeTokens(
        wallet,
        config.token_address,
        amount,
        config.staking_program_address
      );

      setSuccess(`Successfully staked ${amount} ${config.token_symbol}!`);
      setStakeInput('');

      await fetchBalances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stake tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!wallet || !config || stakedAmount <= 0) return;

    if (!config.unstake_enabled) {
      setError('Unstaking is currently disabled');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const signature = await unstakeTokens(
        wallet,
        config.token_address,
        stakedAmount,
        config.staking_program_address
      );

      setSuccess(`Successfully unstaked ${stakedAmount} ${config.token_symbol}!`);

      await fetchBalances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unstake tokens');
    } finally {
      setLoading(false);
    }
  };

  const boostPercentage = config ? config.boosted_apy - config.base_apy : 0;

  return (
    <DynamicBackground>
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Parally Staking</h1>
          </div>
          <p className="text-lg text-gray-400">
            Stake your ${config?.token_symbol || 'PARALLY'} tokens and earn rewards from platform fees
          </p>
        </div>

        {config && (
          <>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 mb-6">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">CURRENT APY</div>
                <div className="text-6xl font-bold mb-4" style={{ color: '#FF4D00' }}>
                  {config.base_apy.toFixed(2)}%
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-2" style={{ backgroundColor: 'rgba(255, 77, 0, 0.1)', color: '#FF4D00' }}>
                  <Info className="w-4 h-4" />
                  <span className="font-semibold">Boosted APY: {config.boosted_apy.toFixed(2)}%</span>
                </div>
                <div className="text-sm text-gray-400">
                  +{boostPercentage.toFixed(2)}% from {config.boost_amount}k USDC {config.boost_source}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Campaign progress: {config.campaign_progress}%
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  APY fluctuates based on platform fee distribution
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 mb-6">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">TOTAL VALUE LOCKED</div>
                <div className="text-4xl font-bold text-white">
                  {config.total_value_locked.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-gray-500">{config.token_symbol}</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Total ${config.token_symbol} staked across all users
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Historical APY (30 Days)</div>
                <div className="h-48 flex items-end justify-between gap-2 mt-4">
                  {[24, 25.5, 26, 27, 26.5, 28, 27.5, 26.18].map((value, idx) => (
                    <div key={idx} className="flex-1 rounded-t" style={{ height: `${(value / 30) * 100}%`, backgroundColor: 'rgba(255, 77, 0, 0.3)' }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Nov 12</span>
                  <span>Nov 11</span>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Projected APY (30 Days)</div>
                <div className="h-48 flex items-end justify-between gap-2 mt-4">
                  {[15, 19, 23, 27, 28, 30, 27, 25].map((value, idx) => (
                    <div key={idx} className="flex-1 rounded-t" style={{ height: `${(value / 30) * 100}%`, backgroundColor: 'rgba(255, 77, 0, 0.5)' }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Nov 13</span>
                  <span>Dec 12</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">YOUR PARALLY BALANCE</div>
                <div className="text-3xl font-bold text-white">
                  {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-gray-500 text-xl">{config.token_symbol}</span>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">STAKED AMOUNT</div>
                <div className="text-3xl font-bold text-white">
                  {stakedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-gray-500 text-xl">{config.token_symbol}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Stake PARALLY Tokens</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to Stake
                </label>
                <input
                  type="number"
                  value={stakeInput}
                  onChange={(e) => {
                    setStakeInput(e.target.value);
                    setError('');
                  }}
                  placeholder="0"
                  className="w-full px-4 py-3 text-2xl bg-black/20 border border-gray-800 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: '#FF4D00' }}
                  disabled={!connected || loading}
                />
              </div>

              <div className="flex gap-2 mb-6">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handlePercentageClick(pct)}
                    className="flex-1 px-4 py-2 bg-black/20 border border-gray-800 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    disabled={!connected || loading}
                  >
                    {pct === 100 ? 'MAX' : `${pct}%`}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {!connected ? (
                <button
                  onClick={connect}
                  disabled={connecting}
                  className="w-full text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#FF4D00' }}
                  onMouseEnter={(e) => !connecting && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => !connecting && (e.currentTarget.style.opacity = '1')}
                >
                  {connecting ? 'CONNECTING...' : 'CONNECT WALLET TO STAKE'}
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleStake}
                    disabled={loading || !config.stake_enabled}
                    className="w-full text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    style={{ backgroundColor: '#FF4D00' }}
                    onMouseEnter={(e) => !loading && config.stake_enabled && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !loading && config.stake_enabled && (e.currentTarget.style.opacity = '1')}
                  >
                    {loading ? 'PROCESSING...' : config.stake_enabled ? 'STAKE PARALLY' : 'STAKING DISABLED'}
                  </button>

                  {stakedAmount > 0 && config.unstake_enabled && (
                    <button
                      onClick={handleUnstake}
                      disabled={loading}
                      className="w-full bg-gray-800 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'PROCESSING...' : 'UNSTAKE ALL'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {connected && wallet && (
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mt-6">
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium text-gray-500">CONNECTED WALLET</div>
                    <div className="text-white font-mono text-sm mt-1">
                      {wallet.publicKey.toString().slice(0, 8)}...{wallet.publicKey.toString().slice(-6)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">STAKING ADDRESS</div>
                    <div className="text-white font-mono text-xs mt-1 break-all">
                      {config.staking_program_address || 'Not configured'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!config && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading staking configuration...</div>
          </div>
        )}
      </div>
    </div>
    </DynamicBackground>
  );
}
