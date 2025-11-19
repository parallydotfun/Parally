import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Activity, DollarSign } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

interface ServiceData {
  id: string;
  name: string;
  category: string;
  price: number;
  transactions: number;
  volume: number;
  fees: number;
  users: number;
  status: 'Active' | 'Inactive';
}

export default function PlatformPanelPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'services'>('overview');
  const [timeRange, setTimeRange] = useState('30 days');

  // Mock data - in production, this would come from Supabase
  const overviewStats = {
    totalVolume: 675.35,
    totalFees: 667.03,
    transactions: 9433,
    uniqueUsers: 417,
    activeServices: 7
  };

  const feesStats = {
    totalFees: 667.03,
    transferred: 0.00,
    pending: 667.03,
    totalRecords: 9425
  };

  const servicesStats = {
    totalServices: 105,
    activeServices: 105,
    totalTransactions: 9433,
    totalVolume: 675.35,
    totalFees: 667.03
  };

  const topServices = [
    { name: 'Parally Aggregator', transactions: 4336, color: '#FF4D00' },
    { name: 'Load Test Service', transactions: 2657, color: '#FF4D00' },
    { name: 'Parally Agent Chat', transactions: 2408, color: '#FF4D00' },
    { name: 'Parally Agent Service Fee', transactions: 28, color: '#FF4D00' },
    { name: 'Platform Fee', transactions: 2, color: '#FF4D00' }
  ];

  const servicesData: ServiceData[] = [
    {
      id: '1',
      name: 'Parally Aggregator',
      category: 'AI Agent',
      price: 0.01,
      transactions: 4336,
      volume: 43.36,
      fees: 43.36,
      users: 400,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Load Test Service',
      category: 'AI Agent',
      price: 0.01,
      transactions: 2657,
      volume: 26.57,
      fees: 26.57,
      users: 200,
      status: 'Active'
    },
    {
      id: '3',
      name: 'Parally Agent Chat',
      category: 'AI Agent',
      price: 0.25,
      transactions: 2408,
      volume: 602,
      fees: 593.7,
      users: 415,
      status: 'Active'
    },
    {
      id: '4',
      name: 'Parally Agent Service Fee',
      category: 'AI Agent',
      price: 0.05,
      transactions: 28,
      volume: 1.4,
      fees: 1.4,
      users: 5,
      status: 'Active'
    },
    {
      id: '5',
      name: 'Platform Fee',
      category: 'AI Agent',
      price: 0.00005,
      transactions: 2,
      volume: 2,
      fees: 2,
      users: 2,
      status: 'Active'
    }
  ];

  const exportJSON = () => {
    const data = {
      overview: overviewStats,
      fees: feesStats,
      services: servicesData,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-panel-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DynamicBackground>
      <div className="min-h-screen pt-32 pb-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-everett mb-4">Platform Panel</h1>
                <p className="text-gray-400 font-everett-mono text-sm">
                  Analytics and insights for Parally platform
                </p>
              </div>
              <div className="flex gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-black/30 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-sm font-everett-mono text-white focus:outline-none focus:border-gray-600"
                >
                  <option value="7 days">7 days</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                </select>
                <button
                  onClick={exportJSON}
                  className="px-6 py-2 text-sm font-everett-mono transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#FF4D00', color: '#000000' }}
                >
                  Export JSON
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-800">
              {['overview', 'fees', 'services'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 font-everett-mono text-sm transition-colors relative ${
                    activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: '#FF4D00' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  label="Total Volume"
                  value={`${overviewStats.totalVolume} USDC`}
                  icon={<DollarSign size={20} />}
                />
                <StatCard
                  label="Total Fees"
                  value={`${overviewStats.totalFees} USDC`}
                  icon={<TrendingUp size={20} />}
                />
                <StatCard
                  label="Transactions"
                  value={overviewStats.transactions.toLocaleString()}
                  icon={<Activity size={20} />}
                />
                <StatCard
                  label="Unique Users"
                  value={overviewStats.uniqueUsers}
                  icon={<Users size={20} />}
                />
                <StatCard
                  label="Active Services"
                  value={overviewStats.activeServices}
                  icon={<BarChart3 size={20} />}
                />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Volume & Fees Chart */}
                <ChartCard title="Daily Volume & Fees">
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {[150, 250, 320, 280, 450, 520, 180].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t transition-all hover:opacity-80"
                          style={{
                            backgroundColor: '#FF4D00',
                            height: `${(height / 600) * 100}%`,
                            minHeight: '4px'
                          }}
                        />
                        <span className="text-xs text-gray-500 font-everett-mono mt-2">
                          Nov {5 + i}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF4D00' }} />
                      <span className="text-xs text-gray-400 font-everett-mono">Fees (USDC)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-600" />
                      <span className="text-xs text-gray-400 font-everett-mono">Volume (USDC)</span>
                    </div>
                  </div>
                </ChartCard>

                {/* Top Services Chart */}
                <ChartCard title="Top Services by Transactions">
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {topServices.map((service, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full rounded-t"
                          style={{
                            backgroundColor: service.color,
                            height: `${(service.transactions / 5000) * 100}%`,
                            minHeight: '4px'
                          }}
                        />
                        <span className="text-xs text-gray-500 font-everett-mono mt-2 rotate-45 origin-left whitespace-nowrap">
                          {service.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <ChartCard title="User Growth">
                  <div className="h-64 relative px-4">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <polyline
                        points="0,180 50,160 100,140 150,120 200,100 250,90 300,85 350,80 400,80"
                        fill="none"
                        stroke="#FF4D00"
                        strokeWidth="2"
                      />
                      <polyline
                        points="0,190 50,180 100,165 150,155 200,145 250,140 300,135 350,130 400,125"
                        fill="none"
                        stroke="#888"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF4D00' }} />
                      <span className="text-xs text-gray-400 font-everett-mono">New Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-600" />
                      <span className="text-xs text-gray-400 font-everett-mono">Total Users</span>
                    </div>
                  </div>
                </ChartCard>

                {/* Transaction Status Pie Chart */}
                <ChartCard title="Transaction Status">
                  <div className="h-64 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 200 200" className="transform -rotate-90">
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#FF4D00"
                          strokeWidth="40"
                          strokeDasharray="502.4"
                          strokeDashoffset="0"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-everett text-white">100%</div>
                          <div className="text-xs text-gray-400 font-everett-mono">verified</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF4D00' }} />
                      <span className="text-xs text-gray-400 font-everett-mono">verified</span>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Fees" value={`${feesStats.totalFees} USDC`} />
                <StatCard label="Transferred" value={`${feesStats.transferred} USDC`} />
                <StatCard label="Pending" value={`${feesStats.pending} USDC`} />
                <StatCard label="Total Records" value={feesStats.totalRecords.toLocaleString()} />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Fees Collected */}
                <ChartCard title="Daily Fees Collected">
                  <div className="h-64 relative px-4">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <polyline
                        points="0,140 50,100 100,60 150,40 200,35 250,120 300,180 350,185 400,185"
                        fill="none"
                        stroke="#FF8C00"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500 font-everett-mono">
                      <span>Nov 5</span>
                      <span>Nov 11</span>
                    </div>
                  </div>
                </ChartCard>

                {/* Fees by Recipient */}
                <ChartCard title="Fees by Recipient">
                  <div className="h-64 flex items-end justify-center gap-4 px-4">
                    <div className="flex flex-col items-center w-32">
                      <div
                        className="w-full rounded-t"
                        style={{
                          backgroundColor: '#FF4D00',
                          height: '80%'
                        }}
                      />
                      <span className="text-xs text-gray-500 font-everett-mono mt-2 truncate w-full text-center">
                        888e67f8...
                      </span>
                    </div>
                    <div className="flex flex-col items-center w-32">
                      <div
                        className="w-full rounded-t"
                        style={{
                          backgroundColor: '#FF4D00',
                          height: '20%'
                        }}
                      />
                      <span className="text-xs text-gray-500 font-everett-mono mt-2 truncate w-full text-center">
                        ccca6563...
                      </span>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Total Services" value={servicesStats.totalServices} />
                <StatCard label="Active Services" value={servicesStats.activeServices} />
                <StatCard label="Total Transactions" value={servicesStats.totalTransactions.toLocaleString()} />
                <StatCard label="Total Volume" value={`${servicesStats.totalVolume} USDC`} />
                <StatCard label="Total Fees" value={`${servicesStats.totalFees} USDC`} />
              </div>

              {/* Service Performance Table */}
              <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h3 className="text-xl font-everett">Service Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Service</th>
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Transactions</th>
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Volume</th>
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Fees</th>
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Users</th>
                        <th className="px-6 py-4 text-left text-sm font-everett-mono text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicesData.map((service) => (
                        <tr key={service.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-everett-mono text-sm">{service.name}</td>
                          <td className="px-6 py-4 font-everett-mono text-sm text-gray-400">{service.category}</td>
                          <td className="px-6 py-4 font-everett-mono text-sm">
                            {service.price} USDC
                          </td>
                          <td className="px-6 py-4 font-everett-mono text-sm">{service.transactions.toLocaleString()}</td>
                          <td className="px-6 py-4 font-everett-mono text-sm">
                            {service.volume} USDC
                          </td>
                          <td className="px-6 py-4 font-everett-mono text-sm">
                            {service.fees} USDC
                          </td>
                          <td className="px-6 py-4 font-everett-mono text-sm">{service.users}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-everett-mono bg-green-900/30 text-green-400 border border-green-800">
                              {service.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DynamicBackground>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-gray-400 font-everett-mono">{label}</p>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      <p className="text-2xl font-everett">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-everett mb-6">{title}</h3>
      {children}
    </div>
  );
}
