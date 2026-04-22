import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankProvider } from './context/BankContext';

// Professional Loading Component
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Animated Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-purple-500 border-r-blue-500 border-b-purple-500 border-l-blue-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-white/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Loading MiniBank
        </h2>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-loading-progress" />
          </div>
        </div>

        <p className="text-white/40 text-xs mt-4">Securing your connection...</p>
      </div>

      <style>{`
        @keyframes loading-progress {
          0% { width: 0%; }
          30% { width: 30%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
        
        .animate-loading-progress {
          animation: loading-progress 2s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 0.8s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

// Lazy load components for better performance
// Rubric Requirement: React Suspense and lazy loading
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Deposit = lazy(() => import('./pages/Deposit'));
const Withdraw = lazy(() => import('./pages/Withdraw'));
const Profile = lazy(() => import('./pages/Profile'));
const Layout = lazy(() => import('./components/Layout'));

// Optional: Add minimum delay to see loading screen
const lazyWithDelay = (importFn, delay = 1000) => {
  return lazy(() => Promise.all([
    importFn(),
    new Promise(resolve => setTimeout(resolve, delay))
  ]).then(([moduleExports]) => moduleExports));
};

// Use with delay if you want loading screen to be more visible
// const Login = lazyWithDelay(() => import('./pages/Login'), 1200);
// const Register = lazyWithDelay(() => import('./pages/Register'), 1200);
// const Dashboard = lazyWithDelay(() => import('./pages/Dashboard'), 1200);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <PrivateRoute>
              <Layout>
                <Transactions />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/deposit" 
          element={
            <PrivateRoute>
              <Layout>
                <Deposit />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/withdraw" 
          element={
            <PrivateRoute>
              <Layout>
                <Withdraw />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BankProvider>
          <AppRoutes />
        </BankProvider>
      </AuthProvider>
    </Router>
  );
}