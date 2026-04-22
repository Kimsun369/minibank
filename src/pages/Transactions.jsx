import React, { useState, useEffect, useRef } from 'react';
import { useBank } from '../context/BankContext';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const Transactions = () => {
  const { transactions, account } = useBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);

  // Mouse parallax effect (matching Dashboard)
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      setMousePosition({ x, y });
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate summary stats
  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = date => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Hero Section with Parallax - Matching Dashboard */}
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
          <div className="flex flex-wrap justify-between items-center gap-4 animate-slideDown">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">Transactions</h1>
                <p className="text-white/60">View and manage all your transactions</p>
              </div>
            </div>
            
            {/* Summary Badges */}
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-white/50">Total Income</p>
                <p className="text-sm font-bold text-green-400">+${totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-white/50">Total Expenses</p>
                <p className="text-sm font-bold text-red-400">-${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm">Current Balance</p>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              ${(account?.balance / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm">Total Transactions</p>
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{transactions.length}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm">Filtered Results</p>
              <Filter className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{filteredTransactions.length}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={() => setFilterType('all')} 
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                    filterType === 'all' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterType('credit')} 
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                    filterType === 'credit' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Income
                </button>
                <button 
                  onClick={() => setFilterType('debit')} 
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                    filterType === 'debit' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="p-6 hover:bg-slate-50 transition-all duration-300 group animate-slideIn"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 group-hover:bg-green-200' 
                          : 'bg-red-100 group-hover:bg-red-200'
                      } transition-all duration-300`}>
                        {transaction.type === 'credit' ? 
                          <ArrowDownLeft className="w-6 h-6 text-green-600" /> : 
                          <ArrowUpRight className="w-6 h-6 text-red-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{transaction.description}</h3>
                        <p className="text-sm text-slate-400">
                          {formatDate(transaction.date)} at {formatTime(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-slate-800'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : transaction.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No transactions found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
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
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default Transactions;