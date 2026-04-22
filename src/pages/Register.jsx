import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, AlertCircle, RefreshCw, Eye, EyeOff, Shield, Zap, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [exchangeRates, setExchangeRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState('');
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

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

  // Password strength checker
  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    const strengthMap = {
      0: { text: 'Very Weak', color: 'text-red-500', bg: 'bg-red-500' },
      1: { text: 'Weak', color: 'text-orange-500', bg: 'bg-orange-500' },
      2: { text: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500' },
      3: { text: 'Good', color: 'text-blue-500', bg: 'bg-blue-500' },
      4: { text: 'Strong', color: 'text-green-500', bg: 'bg-green-500' },
      5: { text: 'Very Strong', color: 'text-green-600', bg: 'bg-green-600' }
    };
    
    const strength = Math.min(score, 5);
    setPasswordStrength({
      score: strength,
      text: strengthMap[strength].text,
      color: strengthMap[strength].color,
      bg: strengthMap[strength].bg
    });
    
    return score >= 3;
  };

  const validateField = (field, value) => {
    if (field === 'name') {
      if (value && value.length < 2) {
        setFieldErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      } else if (value && value.length > 50) {
        setFieldErrors(prev => ({ ...prev, name: 'Name must be less than 50 characters' }));
      } else {
        setFieldErrors(prev => ({ ...prev, name: '' }));
      }
    }
    
    if (field === 'email') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setFieldErrors(prev => ({ ...prev, email: '' }));
      }
    }
    
    if (field === 'password') {
      const isStrong = checkPasswordStrength(value);
      if (value && value.length < 6) {
        setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else if (value && !isStrong) {
        setFieldErrors(prev => ({ ...prev, password: 'Password is too weak' }));
      } else {
        setFieldErrors(prev => ({ ...prev, password: '' }));
      }
    }
    
    if (field === 'confirmPassword') {
      if (value && value !== password) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateField('name', value);
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
    if (confirmPassword) {
      validateField('confirmPassword', confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateField('confirmPassword', value);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name) {
      errors.name = 'Full name is required';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password is too weak';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
          <div className="bg-gradient-to-br from-[#1a1a3e] via-[#2d2b55] to-[#1e1b4b] p-10 flex flex-col justify-between min-h-[800px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Logo */}
            <div className="relative animate-slideDown">
              <div className="flex items-center gap-3 mb-16">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  MiniBank
                </span>
              </div>

              {/* Hero Section */}
              <div className="space-y-6 mb-12">
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-widthExpand" />
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight animate-slideRight">
                  Join the<br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                    banking revolution
                  </span>
                </h1>
                <p className="text-white/60 text-sm leading-relaxed animate-slideRight animation-delay-200">
                  Create your account in minutes and start your journey toward 
                  smarter financial management with cutting-edge technology.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-12">
              {[
                { icon: Shield, text: 'Bank-Level Security', color: 'text-purple-400' },
                { icon: Zap, text: 'Instant Transactions', color: 'text-blue-400' },
                { icon: TrendingUp, text: 'Smart Analytics', color: 'text-green-400' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 group animate-slideIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className="text-white/80 group-hover:text-white transition-colors">
                    {feature.text}
                  </span>
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

          {/* Right Side - Register Form */}
          <div className="bg-white/95 backdrop-blur-sm p-10 flex flex-col justify-center min-h-[800px] relative overflow-y-auto">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-8 animate-fadeDown">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                  <User className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-slate-500 mt-2">Start your financial journey today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 animate-shake">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div className="space-y-1 group">
                  <label className="block text-sm font-semibold text-slate-700 transition-all group-focus-within:text-purple-600">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                      focusedField === 'name' ? 'text-purple-500 scale-110' : fieldErrors.name ? 'text-red-400' : 'text-slate-400'
                    }`} />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={handleNameChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John Doe" 
                      className={`w-full pl-9 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-slate-800 placeholder:text-slate-400 ${
                        focusedField === 'name' 
                          ? 'border-purple-500 ring-4 ring-purple-100 scale-[1.02]' 
                          : fieldErrors.name 
                            ? 'border-red-300 bg-red-50/50' 
                            : 'border-slate-200 hover:border-purple-300'
                      }`} 
                    />
                    {fieldErrors.name && (
                      <p className="text-red-500 text-xs mt-1 animate-slideDown flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1 group">
                  <label className="block text-sm font-semibold text-slate-700 transition-all group-focus-within:text-purple-600">
                    Email Address
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
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1 animate-slideDown flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Field with Strength Indicator */}
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
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <div 
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              index < passwordStrength.score ? passwordStrength.bg : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength.color} font-medium`}>
                        Password Strength: {passwordStrength.text}
                      </p>
                    </div>
                  )}
                  
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1 animate-slideDown flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1 group">
                  <label className="block text-sm font-semibold text-slate-700 transition-all group-focus-within:text-purple-600">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
                      focusedField === 'confirmPassword' ? 'text-purple-500 scale-110' : fieldErrors.confirmPassword ? 'text-red-400' : 'text-slate-400'
                    }`} />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword} 
                      onChange={handleConfirmPasswordChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••" 
                      className={`w-full pl-9 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-slate-800 ${
                        focusedField === 'confirmPassword' 
                          ? 'border-purple-500 ring-4 ring-purple-100 scale-[1.02]' 
                          : fieldErrors.confirmPassword 
                            ? 'border-red-300 bg-red-50/50' 
                            : confirmPassword && password === confirmPassword
                              ? 'border-green-300 bg-green-50/30'
                              : 'border-slate-200 hover:border-purple-300'
                      }`} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-all duration-300 hover:scale-110"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {confirmPassword && password === confirmPassword && !fieldErrors.confirmPassword && (
                      <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 animate-scaleIn" />
                    )}
                    {confirmPassword && password !== confirmPassword && (
                      <XCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 animate-scaleIn" />
                    )}
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 animate-slideDown flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="relative w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 group overflow-hidden mt-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>

                {/* Login link */}
                <p className="text-center text-sm text-slate-500 pt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1">
                    Sign in here
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </form>
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
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
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
        .animate-widthExpand { animation: widthExpand 0.8s ease-out; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        
        /* Custom scrollbar for form */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default Register;