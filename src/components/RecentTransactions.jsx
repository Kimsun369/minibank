import React from 'react';
import { Link } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import { ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';

const RecentTransactions = ({ limit = 10 }) => {
  const { transactions } = useBank();
  const displayTransactions = transactions.slice(0, limit);
  
  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Your latest activity</p>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="divide-y divide-slate-100">
        {displayTransactions.length > 0 ? (
          displayTransactions.map((transaction, index) => (
            <div 
              key={transaction.id} 
              className="p-4 hover:bg-slate-50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(transaction.date)} at {formatTime(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    transaction.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-slate-800'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : transaction.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.status || 'completed'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No transactions yet</p>
            <p className="text-xs text-slate-400 mt-1">Your transactions will appear here</p>
          </div>
        )}
      </div>
      
      {/* View All Link */}
      <Link 
        to="/transactions" 
        className="p-4 block text-center text-purple-600 font-semibold hover:bg-purple-50 transition-all duration-300 border-t border-slate-100 group"
      >
        <span className="inline-flex items-center gap-2 group-hover:gap-3 transition-all">
          View All Transactions
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </span>
      </Link>
    </div>
  );
};

export default RecentTransactions;