import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useBank } from "../context/BankContext";
import { Send, Plus, TrendingUp, Eye, EyeOff, RefreshCw, ArrowUpRight, Wallet, Calendar, Award, Shield } from "lucide-react";
import BalanceCard from "../components/BalanceCard";
import QuickActions from "../components/QuickActions";
import RecentTransactions from "../components/RecentTransactions";
import SpendingSummary from "../components/SpendingSummary";

const Dashboard = () => {
  const { user } = useAuth();
  const { account, transactions, loading: bankLoading } = useBank();
  const [showBalance, setShowBalance] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedStats, setAnimatedStats] = useState({ transfers: 0, deposits: 0, growth: 0 });
  const [exchangeRates, setExchangeRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState('');
  
  const containerRef = useRef(null);

  // Mouse parallax effect
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      setMousePosition({ x, y });
    }
  };

  // External API Integration for exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setRatesLoading(true);
        setRatesError('');
        
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        
        const transformedRates = {
          base: data.base,
          rates: [
            { code: 'EUR', name: 'Euro', rate: data.rates.EUR?.toFixed(2), flag: '🇪🇺', change: '+0.8' },
            { code: 'GBP', name: 'British Pound', rate: data.rates.GBP?.toFixed(2), flag: '🇬🇧', change: '-0.2' },
            { code: 'JPY', name: 'Japanese Yen', rate: data.rates.JPY?.toFixed(0), flag: '🇯🇵', change: '+0.5' },
            { code: 'CAD', name: 'Canadian Dollar', rate: data.rates.CAD?.toFixed(2), flag: '🇨🇦', change: '+0.3' },
            { code: 'CHF', name: 'Swiss Franc', rate: data.rates.CHF?.toFixed(2), flag: '🇨🇭', change: '-0.1' },
          ]
        };
        
        setExchangeRates(transformedRates);
      } catch (err) {
        setRatesError('Unable to load exchange rates');
      } finally {
        setRatesLoading(false);
      }
    };
    
    fetchExchangeRates();
  }, []);

  // Calculate statistics from real transaction data
  const calculateStats = () => {
    let totalTransfers = 0;
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    transactions.forEach((tx) => {
      const amount = tx.amount;
      if (tx.category === "transfer") {
        totalTransfers += amount;
      } else if (tx.category === "deposit") {
        totalDeposits += amount;
      } else if (tx.category === "withdrawal") {
        totalWithdrawals += amount;
      }
    });

    const savingsGrowth = totalDeposits - totalWithdrawals;

    return {
      totalTransfers,
      totalDeposits,
      savingsGrowth: Math.max(0, savingsGrowth),
    };
  };

  const stats = calculateStats();

  // Animated counter effect for stats
  useEffect(() => {
    const duration = 1500;
    const step = 16;
    const increments = {
      transfers: stats.totalTransfers / (duration / step),
      deposits: stats.totalDeposits / (duration / step),
      growth: stats.savingsGrowth / (duration / step)
    };
    
    let current = { transfers: 0, deposits: 0, growth: 0 };
    let timer = setInterval(() => {
      let allComplete = true;
      
      Object.keys(current).forEach(key => {
        if (current[key] < stats[key]) {
          allComplete = false;
          current[key] = Math.min(current[key] + increments[key], stats[key]);
        }
      });
      
      setAnimatedStats({
        transfers: current.transfers,
        deposits: current.deposits,
        growth: current.growth
      });
      
      if (allComplete) clearInterval(timer);
    }, step);
    
    return () => clearInterval(timer);
  }, [stats.totalTransfers, stats.totalDeposits, stats.savingsGrowth]);

  // Calculate percentage changes from transaction data
  const getPercentageChange = (value, total) => {
    if (!total || total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
    >
      {/* Hero Section with Parallax */}
      <div 
        className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"
        style={{
          transform: `translateY(${mousePosition.y * 0.1}px)`,
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slower" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-spin-slow" />
          
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="animate-slideDown">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{user?.name || 'User'}</span>
              </h1>
              <p className="text-white/60">Here's your financial overview</p>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="mt-2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Balance Card */}
          <div className="animate-fadeUp">
            <BalanceCard visible={showBalance} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Stats Cards - All dynamic from transactions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer animate-scaleUp" style={{ animationDelay: '0s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                +{getPercentageChange(stats.totalTransfers, account?.balance || 1)}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Total Transfers</p>
            <p className="text-2xl font-bold text-slate-800">
              ${animatedStats.transfers.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>{transactions.filter(tx => tx.category === "transfer").length} transactions</span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer animate-scaleUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                +{getPercentageChange(stats.totalDeposits, account?.balance || 1)}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Total Deposits</p>
            <p className="text-2xl font-bold text-slate-800">
              ${animatedStats.deposits.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>{transactions.filter(tx => tx.category === "deposit").length} deposits</span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer animate-scaleUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                +{getPercentageChange(stats.savingsGrowth, account?.balance || 1)}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Savings Growth</p>
            <p className="text-2xl font-bold text-slate-800">
              ${animatedStats.growth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>Net positive balance</span>
            </div>
          </div>
        </div>

        {/* Exchange Rates Widget - External API Display */}
        <div className="mb-12 animate-fadeUp">
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Live Exchange Rates</h2>
                <p className="text-slate-500 text-sm">Real-time market data</p>
              </div>
              {ratesLoading && <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />}
            </div>
            
            {ratesError && (
              <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                <p className="text-red-500 text-sm">{ratesError}</p>
                <button onClick={() => window.location.reload()} className="text-blue-600 text-sm mt-2 hover:text-blue-700">
                  Try again
                </button>
              </div>
            )}
            
            {ratesLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex justify-between py-3">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            )}
            
            {exchangeRates && !ratesLoading && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {exchangeRates.rates.map((rate, idx) => (
                  <div 
                    key={rate.code} 
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 cursor-pointer group"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">{rate.flag}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{rate.code}</p>
                        <p className="text-xs text-slate-400">{rate.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{rate.rate}</p>
                      <p className={`text-xs ${rate.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {rate.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Charts and Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SpendingSummary />
          </div>
          <div>
            <RecentTransactions limit={5} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { opacity: 0.5; }
          75% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-fadeUp { animation: fadeUp 0.6s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.5s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default Dashboard;