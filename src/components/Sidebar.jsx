import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Plus, Minus, History, X, User, LayoutDashboard, CreditCard, ArrowLeftRight, Shield } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: History,
    },
    {
      path: "/deposit",
      label: "Deposit",
      icon: Plus,
    },
    {
      path: "/withdraw",
      label: "Withdraw",
      icon: Minus,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
    },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative left-0 top-0 h-screen w-72 bg-white shadow-xl border-r border-slate-100 transition-transform lg:translate-x-0 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Navigation
              </h2>
              <p className="text-xs text-slate-400">Main Menu</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-white/50 rounded-xl transition-all duration-300"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  active 
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-l-4 border-purple-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  active ? "text-purple-600" : ""
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-medium text-slate-600">System Online</p>
          </div>
          <p className="text-xs font-semibold text-slate-700">Mini Bank v1.0</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Professional Banking Dashboard
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;