import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useBank } from "../context/BankContext";
import {
  User,
  Lock,
  LogOut,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  CreditCard,
  Calendar,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const { account } = useBank();
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetchingUser, setIsFetchingUser] = useState(false);
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

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  // Fetch fresh user data from backend on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.username) return;

      setIsFetchingUser(true);
      try {
        const freshUserData = await api.getUser(user.username);
        setFormData({
          full_name: freshUserData.full_name || "",
        });
      } catch (err) {
        console.warn("Could not fetch fresh user data:", err.message);
        if (user) {
          setFormData({
            full_name: user.full_name || "",
          });
        }
      } finally {
        setIsFetchingUser(false);
      }
    };

    fetchUserData();
  }, [user?.username]);

  // Sync formData when user changes
  useEffect(() => {
    if (user && !editMode) {
      setFormData({
        full_name: user.full_name || "",
      });
    }
  }, [user, editMode]);

  const showMessage = (message, type) => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSaveProfile = async () => {
    if (!formData.full_name.trim()) {
      showMessage("Full name cannot be empty", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
      };

      const response = await api.updateUser(user.username, payload);
      const updatedUserData = response.user || response;
      const updatedUser = {
        ...user,
        full_name: updatedUserData.full_name || formData.full_name,
      };
      
      setUser(updatedUser);
      setEditMode(false);
      showMessage("Profile updated successfully", "success");
    } catch (apiError) {
      const errorMsg = apiError.message || "Failed to update profile";
      showMessage(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      showMessage("Current password is required", "error");
      return;
    }

    if (!passwordData.newPassword) {
      showMessage("New password is required", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("New passwords do not match", "error");
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      showMessage(
        "Password must be at least 6 characters with uppercase, lowercase, and number",
        "error",
      );
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      showMessage(
        "New password must be different from current password",
        "error",
      );
      return;
    }

    setIsLoading(true);
    try {
      await api.changePassword(
        user.username,
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrent: false,
        showNew: false,
        showConfirm: false,
      });
      setShowPasswordModal(false);
      showMessage("Password changed successfully", "success");
    } catch (apiError) {
      const errorMsg = apiError.message || "Failed to change password";
      showMessage(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          <div className="flex items-center gap-4 animate-slideDown">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Profile Settings</h1>
              <p className="text-white/60">Manage your account information and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Messages */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-slideDown">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600" />
          <div className="px-6 lg:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || "user"}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg"
                  />
                </div>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {formData.full_name}
                  </h2>
                  <p className="text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (editMode) {
                    handleSaveProfile();
                  } else {
                    setEditMode(true);
                  }
                }}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/25"
              >
                {editMode ? (isLoading ? "Saving..." : "Save Profile") : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Personal Information
            </h3>
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">{formData.full_name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <p className="text-slate-800">{user?.email}</p>
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Username</p>
                <p className="text-slate-800 font-mono">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Account Type</p>
                <p className="text-slate-800 capitalize">{account?.type} Account</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Account Number</p>
                <p className="text-slate-800 font-mono">{account?.id}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(account?.balance / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Member Since</p>
                <p className="text-slate-800">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings Card */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-all duration-300">
          <div className="p-6 lg:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Security Settings
            </h3>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-slate-600 group-hover:text-purple-600 transition-colors" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                    Change Password
                  </p>
                  <p className="text-sm text-slate-500">
                    Update your password regularly for better security
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
          <div className="p-6 lg:p-8">
            <h3 className="text-lg font-bold text-red-600 mb-6">Danger Zone</h3>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal - Styled to match Dashboard */}
      {showPasswordModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setShowPasswordModal(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleUp">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-600" />
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.showCurrent ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordData({
                          ...passwordData,
                          showCurrent: !passwordData.showCurrent,
                        })
                      }
                      className="absolute right-3 top-3 text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      {passwordData.showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.showNew ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 pr-10"
                      placeholder="Min 6 chars: uppercase, lowercase, number"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordData({
                          ...passwordData,
                          showNew: !passwordData.showNew,
                        })
                      }
                      className="absolute right-3 top-3 text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      {passwordData.showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Must contain uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.showConfirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordData({
                          ...passwordData,
                          showConfirm: !passwordData.showConfirm,
                        })
                      }
                      className="absolute right-3 top-3 text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      {passwordData.showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2.5 text-slate-700 bg-slate-200 hover:bg-slate-300 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  {isLoading ? "Updating..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        .animate-scaleUp { animation: scaleUp 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Profile;