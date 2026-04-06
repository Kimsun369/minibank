import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBank } from '../context/BankContext';
import { useParallax } from '../hooks/useParallax';
import { Send, Plus, TrendingUp, Eye, EyeOff } from 'lucide-react';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import RecentTransactions from '../components/RecentTransactions';
import SpendingSummary from '../components/SpendingSummary';
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    account
  } = useBank();
  const [showBalance, setShowBalance] = React.useState(true);
  const {
    ref: heroRef,
    translateY: heroParallax
  } = useParallax({
    speed: 0.3
  });
  const {
    ref: cardsRef,
    translateY: cardsParallax
  } = useParallax({
    speed: 0.5
  });
  return <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Hero Section with Parallax */}
      <div ref={heroRef} className="relative overflow-hidden py-16 lg:py-24" style={{
      backgroundImage: 'linear-gradient(135deg, #0c3d66 0%, #075985 50%, #0ea5e9 100%)',
      transform: `translateY(${heroParallax * 0.2}px)`
    }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-screen filter blur-3xl" />
          <div className="absolute -bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full mix-blend-screen filter blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                Welcome back, {user?.name}
              </h1>
              <p className="text-blue-100 text-lg">
                Here's your financial overview
              </p>
            </div>
            <button onClick={() => setShowBalance(!showBalance)} className="mt-2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-lg transition-smooth">
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Balance Card with Animation */}
          <div style={{
          transform: `translateY(${heroParallax * 0.1}px)`
        }}>
            <BalanceCard visible={showBalance} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Quick Actions - Parallax Cards */}
        <div ref={cardsRef} style={{
        transform: `translateY(${cardsParallax * 0.05}px)`
      }} className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Send className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-3 py-1 rounded-full">
                +2.5%
              </span>
            </div>
            <p className="text-neutral-600 text-sm mb-1">Total Transfers</p>
            <p className="text-2xl font-bold text-neutral-900">$5,250</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent-50 rounded-lg">
                <Plus className="w-6 h-6 text-accent-600" />
              </div>
              <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-3 py-1 rounded-full">
                +1.8%
              </span>
            </div>
            <p className="text-neutral-600 text-sm mb-1">Total Deposits</p>
            <p className="text-2xl font-bold text-neutral-900">$8,100</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-3 py-1 rounded-full">
                +5.2%
              </span>
            </div>
            <p className="text-neutral-600 text-sm mb-1">Savings Growth</p>
            <p className="text-2xl font-bold text-neutral-900">$2,340</p>
          </div>
        </div>

        {/* Charts and Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SpendingSummary />
          </div>
          <div>
            <RecentTransactions limit={5} />
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;