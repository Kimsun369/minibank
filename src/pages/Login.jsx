import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, RefreshCw, Eye, EyeOff, TrendingUp, Shield, Zap, CreditCard, Users, Globe, ChevronRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [exchangeRates, setExchangeRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedNumbers, setAnimatedNumbers] = useState({ users: 0, transactions: 0, uptime: 0 });
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Animated counter effect
  useEffect(() => {
    const counters = { users: 50000, transactions: 10000000000, uptime: 999 };
    const duration = 2000;
    const step = 16;
    const increments = {
      users: counters.users / (duration / step),
      transactions: counters.transactions / (duration / step),
      uptime: counters.uptime / (duration / step)
    };
    
    let current = { users: 0, transactions: 0, uptime: 0 };
    let timer = setInterval(() => {
      let allComplete = true;
      
      Object.keys(current).forEach(key => {
        if (current[key] < counters[key]) {
          allComplete = false;
          current[key] = Math.min(current[key] + increments[key], counters[key]);
        }
      });
      
      setAnimatedNumbers({
        users: Math.floor(current.users),
        transactions: Math.floor(current.transactions),
        uptime: current.uptime.toFixed(1)
      });
      
      if (allComplete) clearInterval(timer);
    }, step);
    
    return () => clearInterval(timer);
  }, []);

  // Mouse parallax effect
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePosition({ x, y });
    }
  };

  // External API Integration
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

  const validateField = (field, value) => {
    if (field === 'email') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setFieldErrors(prev => ({ ...prev, email: '' }));
      }
    }
    
    if (field === 'password') {
      if (value && value.length < 6) {
        setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else {
        setFieldErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateField('email', value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validateField('password', value);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-spin-slow" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

      {/* Main Content with Parallax Effect */}
      <div 
        className="relative z-10 w-full max-w-6xl transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }}
      >
        <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          
          {/* Left Side - Brand Section */}
          <div className="bg-gradient-to-br from-[#1a1a3e] via-[#2d2b55] to-[#1e1b4b] p-10 flex flex-col justify-between min-h-[700px] relative overflow-hidden group">
            {/* Animated border gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Logo with pulse animation */}
            <div className="relative animate-slideDown">
              <div className="flex items-center gap-3 mb-16">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  MiniBank
                </span>
              </div>

              {/* Hero Section with Stagger Animation */}
              <div className="space-y-6 mb-12">
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-widthExpand" />
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight animate-slideRight">
                  Banking that<br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                    evolves with you
                  </span>
                </h1>
                <p className="text-white/60 text-sm leading-relaxed animate-slideRight animation-delay-200">
                  Join the future of banking with AI-powered insights, 
                  military-grade security, and instant global transfers.
                </p>
              </div>
            </div>

            {/* Animated Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              {[
                { value: animatedNumbers.users, label: 'Active Users', icon: Users, suffix: '+', delay: 0 },
                { value: animatedNumbers.transactions, label: 'Transactions', icon: Globe, suffix: '+', delay: 0.1, format: (v) => `$${(v / 1000000000).toFixed(1)}B` },
                { value: animatedNumbers.uptime, label: 'Uptime', icon: CreditCard, suffix: '%', delay: 0.2 }
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-500 hover:scale-110 cursor-pointer group/stat animate-scaleUp"
                  style={{ animationDelay: `${stat.delay}s` }}
                >
                  <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-2 group-hover/stat:rotate-12 transition-transform duration-300" />
                  <p className="text-2xl font-bold text-white">
                    {stat.format ? stat.format(stat.value) : stat.value.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Exchange Rates Widget */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-purple-500/50 transition-all duration-500 animate-fadeUp">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400 animate-pulse" />
                  <h3 className="text-sm font-semibold text-white">Live Exchange Rates</h3>
                </div>
                {ratesLoading && <RefreshCw className="w-3 h-3 text-white/50 animate-spin" />}
              </div>
              
              {ratesError && (
                <div className="bg-red-500/20 rounded-xl p-3 text-center animate-shake">
                  <p className="text-red-300 text-sm">{ratesError}</p>
                  <button onClick={() => window.location.reload()} className="text-white/70 text-xs mt-1 hover:text-white transition">
                    Retry
                  </button>
                </div>
              )}
              
              {ratesLoading && (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse flex justify-between">
                      <div className="h-4 bg-white/10 rounded w-20"></div>
                      <div className="h-4 bg-white/10 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              )}
              
              {exchangeRates && !ratesLoading && (
                <div className="space-y-2">
                  {exchangeRates.rates.map((rate, idx) => (
                    <div 
                      key={rate.code} 
                      className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group/rate animate-slideIn"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl transform group-hover/rate:scale-110 transition-transform duration-300">{rate.flag}</span>
                        <div>
                          <p className="text-white text-sm font-semibold">{rate.code}</p>
                          <p className="text-white/40 text-xs">{rate.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{rate.rate}</p>
                        <p className={`text-xs ${rate.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} font-medium`}>
                          {rate.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white/95 backdrop-blur-sm p-10 flex flex-col justify-center min-h-[700px] relative">
            <div className="max-w-md mx-auto w-full">
              {/* Header with Animation */}
              <div className="text-center mb-8 animate-fadeDown">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-slate-500 mt-2">Sign in to continue your journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 animate-shake">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Email Field with Focus Animation */}
                <div className="space-y-1 group">
                  <label className="block text-sm font-semibold text-slate-700 transition-all group-focus-within:text-purple-600">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-purple-500 scale-110' : fieldErrors.email ? 'text-red-400' : 'text-slate-400'
                    }`} />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={handleEmailChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="name@company.com" 
                      className={`w-full pl-9 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 ${
                        focusedField === 'email' 
                          ? 'border-purple-500 ring-4 ring-purple-100 scale-[1.02]' 
                          : fieldErrors.email 
                            ? 'border-red-300 bg-red-50/50' 
                            : 'border-slate-200 hover:border-purple-300'
                      }`} 
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs animate-slideDown flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1 group">
                  <label className="block text-sm font-semibold text-slate-700 transition-all group-focus-within:text-purple-600">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-purple-500 scale-110' : fieldErrors.password ? 'text-red-400' : 'text-slate-400'
                    }`} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={handlePasswordChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••" 
                      className={`w-full pl-9 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-slate-800 ${
                        focusedField === 'password' 
                          ? 'border-purple-500 ring-4 ring-purple-100 scale-[1.02]' 
                          : fieldErrors.password 
                            ? 'border-red-300 bg-red-50/50' 
                            : 'border-slate-200 hover:border-purple-300'
                      }`} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-all duration-300 hover:scale-110"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs animate-slideDown flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1">
                    Forgot password?
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Submit Button with Ripple Effect */}
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="relative w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-slate-500 pt-4">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1">
                    Create account
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Animations */}
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
        
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes widthExpand {
          from { width: 0; }
          to { width: 64px; }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-slideRight { animation: slideRight 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; opacity: 0; }
        .animate-fadeUp { animation: fadeUp 0.6s ease-out; }
        .animate-fadeDown { animation: fadeDown 0.6s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.5s ease-out forwards; opacity: 0; }
        .animate-widthExpand { animation: widthExpand 0.8s ease-out; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        
        /* Smooth transitions */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Login;