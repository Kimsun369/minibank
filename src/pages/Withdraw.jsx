import React, { useState, useEffect, useRef } from 'react';
import { useBank } from '../context/BankContext';
import { useNavigate } from 'react-router-dom';
import { Minus, ArrowRight, AlertCircle, RefreshCw, CheckCircle, DollarSign, Shield, Clock, Banknote, Send } from 'lucide-react';

const Withdraw = () => {
  const { account, withdraw, loading } = useBank();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('atm');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState(false);
  
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

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (account && withdrawAmount > account.balance / 100) {
      setError('Insufficient balance');
      return;
    }
    if (withdrawAmount < 20) {
      setError('Minimum withdrawal amount is $20');
      return;
    }
    if (withdrawAmount > 10000) {
      setError('Maximum withdrawal amount is $10,000 per transaction');
      return;
    }
    
    try {
      await withdraw(withdrawAmount);
      setSuccess(true);
      setAmount('');
      setTimeout(() => navigate('/transactions'), 2000);
    } catch (err) {
      setError('Withdrawal failed. Please try again.');
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setAmount(value);
      setError('');
    }
  };

  const withdrawalMethods = [
    { id: 'atm', label: 'ATM Withdrawal', icon: Banknote, description: 'Instant cash pickup' },
    { id: 'transfer', label: 'Bank Transfer', icon: Send, description: '1-2 business days' },
  ];

  const maxWithdrawal = account ? account.balance / 100 : 0;

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
          <div className="flex items-center gap-4 animate-slideDown">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Minus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Withdraw Money</h1>
              <p className="text-white/60">Withdraw cash from your account securely</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Matching Dashboard layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Withdraw Form - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 lg:p-8">
                {success ? (
                  <div className="text-center py-12 animate-scaleUp">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Withdrawal Successful!</h2>
                    <p className="text-slate-500 mb-2">
                      ${parseFloat(amount).toFixed(2)} has been withdrawn from your account
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-4">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Redirecting to transactions...
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100 animate-shake">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Current Balance - Matching Dashboard stats card style */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                      <p className="text-sm text-slate-600 mb-1">Available Balance</p>
                      <p className="text-3xl font-bold text-slate-800">
                        ${maxWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Withdrawal Method */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Withdrawal Method
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {withdrawalMethods.map((m) => {
                          const Icon = m.icon;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setMethod(m.id)}
                              className={`p-5 rounded-xl border-2 transition-all duration-300 text-left group ${
                                method === m.id 
                                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-md' 
                                  : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
                              }`}
                            >
                              <div className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-3 transition-all duration-300 ${
                                method === m.id ? 'bg-purple-100' : 'bg-slate-100 group-hover:bg-purple-50'
                              }`}>
                                <Icon className={`w-5 h-5 ${method === m.id ? 'text-purple-600' : 'text-slate-600'}`} />
                              </div>
                              <p className={`font-semibold ${method === m.id ? 'text-purple-700' : 'text-slate-800'}`}>
                                {m.label}
                              </p>
                              <p className={`text-xs mt-1 ${method === m.id ? 'text-purple-500' : 'text-slate-400'}`}>
                                {m.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Amount Field */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Withdrawal Amount
                      </label>
                      <div className="relative">
                        <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                          focusedField ? 'text-purple-500' : 'text-slate-400'
                        }`} />
                        <input
                          type="number"
                          value={amount}
                          onChange={handleAmountChange}
                          onFocus={() => setFocusedField(true)}
                          onBlur={() => setFocusedField(false)}
                          placeholder="0.00"
                          step="0.01"
                          min="20"
                          max={maxWithdrawal}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-slate-800 placeholder:text-slate-400 ${
                            focusedField
                              ? 'border-purple-500'
                              : 'border-slate-200 hover:border-purple-300'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-slate-400">Minimum: $20</p>
                        <p className="text-xs text-slate-400">Maximum: $10,000 per transaction</p>
                      </div>
                    </div>

                    {/* Quick Amounts */}
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-3">Quick Amounts</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {quickAmounts.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setAmount(q.toString())}
                            disabled={q > maxWithdrawal}
                            className={`py-2 border-2 rounded-lg transition-all duration-300 font-semibold text-sm ${
                              q > maxWithdrawal
                                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                          >
                            ${q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Warning for large withdrawals */}
                    {amount && parseFloat(amount) > 5000 && (
                      <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Large withdrawal detected. Additional verification may be required.
                        </p>
                      </div>
                    )}

                    {/* After Withdrawal Preview */}
                    {account && amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxWithdrawal && (
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Current Balance</span>
                          <span className="font-semibold text-slate-800">
                            ${maxWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-slate-200">
                          <span className="text-slate-500">After Withdrawal</span>
                          <span className="font-bold text-amber-600">
                            ${(maxWithdrawal - parseFloat(amount)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button - Matching Dashboard button style */}
                    <button
                      type="submit"
                      disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdrawal}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-xl group"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Withdrawal
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Information (Matching Dashboard style) */}
          <div className="space-y-6">
            {/* Security Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Secure Withdrawal</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                All withdrawals are protected by bank-level security and fraud monitoring.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>ATM: Instant | Transfer: 1-2 days</span>
              </div>
            </div>

            {/* Daily Limit Info */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 hover:shadow-md transition-all duration-300">
              <p className="text-xs text-blue-700">
                💡 <span className="font-semibold">Daily Limit:</span> You can withdraw up to $10,000 per day. Your remaining daily limit is ${(10000 - (parseFloat(amount) || 0)).toLocaleString()}.
              </p>
            </div>

            {/* Help */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
              <h3 className="font-semibold text-slate-800 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-3">
                Having trouble with your withdrawal? Our support team is here to help 24/7.
              </p>
              <button className="text-purple-600 text-sm font-semibold hover:text-purple-700 hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-1">
                Contact Support
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
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
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.5s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Withdraw;