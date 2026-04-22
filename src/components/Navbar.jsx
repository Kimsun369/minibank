import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, Shield, LayoutDashboard, CreditCard, ArrowLeftRight, Plus, Minus } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Mini Bank
              </h1>
              <p className="text-xs text-slate-400">Professional Banking Platform</p>
            </div>
          </div>
        </div>

        {/* Right Section - User Info & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {/* User Info - Desktop */}
              <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.full_name} 
                    className="w-10 h-10 rounded-full border-2 border-purple-200 object-cover" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border-2 border-purple-200">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800">{user.full_name || user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/profile')}
                  className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition-all duration-300 hover:scale-110"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-red-50 rounded-xl text-red-500 transition-all duration-300 hover:scale-110"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;