import { useState, useEffect } from 'react';
import { DollarSign, Activity, Package } from 'lucide-react';

interface UserStats {
  totalSpent: number;
  transactions: number;
  servicesUsed: number;
}

export default function UserPanelPage() {
  const [period, setPeriod] = useState('90 days');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalSpent: 0,
    transactions: 0,
    servicesUsed: 0
  });

  useEffect(() => {
    // Check for connected wallet
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if ('solana' in window) {
      const solana = (window as any).solana;
      if (solana?.isPhantom && solana.isConnected) {
        const publicKey = solana.publicKey.toString();
        setWalletAddress(truncateAddress(publicKey));
        // In production, fetch user stats from Supabase based on wallet address
        fetchUserStats(publicKey);
      }
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchUserStats = async (address: string) => {
    // In production, query Supabase for user transaction data
    // For now, using mock data matching the PDF
    setUserStats({
      totalSpent: 0,
      transactions: 0,
      servicesUsed: 0
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
      {/* Main Content */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-everett mb-4">User Panel</h1>
                <p className="text-gray-600 font-everett-mono text-sm">
                  {walletAddress || '0x8042...2947'}
                </p>
              </div>
              <button
                className="px-6 py-2 rounded text-sm font-everett-mono text-white"
                style={{ backgroundColor: '#FF4D00' }}
              >
                {walletAddress || '0x8042...2947'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatCard
              label="Total Spent"
              value={`${userStats.totalSpent.toFixed(2)} USDC`}
              icon={<DollarSign size={20} />}
            />
            <StatCard
              label="Transactions"
              value={userStats.transactions}
              icon={<Activity size={20} />}
            />
            <StatCard
              label="Services Used"
              value={userStats.servicesUsed}
              icon={<Package size={20} />}
            />
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 font-everett-mono mb-2">Period</p>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-2xl font-everett bg-transparent border-none focus:outline-none w-full cursor-pointer"
                style={{ appearance: 'none' }}
              >
                <option value="7 days">7 days</option>
                <option value="30 days">30 days</option>
                <option value="90 days">90 days</option>
              </select>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Daily Usage Chart */}
            <ChartCard title="Daily Usage">
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Activity size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-everett-mono text-sm">No transaction data available</p>
                  <p className="font-everett-mono text-xs mt-2">
                    Start using Parally services to see your usage patterns
                  </p>
                </div>
              </div>
            </ChartCard>

            {/* Usage by Service Chart */}
            <ChartCard title="Usage by Service">
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Package size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-everett-mono text-sm">No service usage data</p>
                  <p className="font-everett-mono text-xs mt-2">
                    Transactions will be categorized by service type here
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Transaction History Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-everett mb-6">Transaction History</h3>
            <div className="text-center py-12">
              <div className="text-gray-400">
                <Activity size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-everett-mono text-sm">No transactions yet</p>
                <p className="font-everett-mono text-xs mt-2 text-gray-500">
                  Your transaction history will appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-gray-600 font-everett-mono">{label}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="text-2xl font-everett">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-everett mb-6">{title}</h3>
      {children}
    </div>
  );
}
