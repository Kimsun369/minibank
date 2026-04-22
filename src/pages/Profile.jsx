import React, { useState, useEffect } from "react";
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
        // Fetch fresh user data from backend
        const freshUserData = await api.getUser(user.username);
        
        // Update form with fresh backend data
        setFormData({
          full_name: freshUserData.full_name || "",
        });
      } catch (err) {
        console.warn("Could not fetch fresh user data:", err.message);
        // Fall back to context user data
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

      // Call API to update user on backend
      const response = await api.updateUser(user.username, payload);

      // Update local state with response from backend
      // Response format: { user: { username, full_name, email, ... } }
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
      // Call backend API to change password
      // Backend will verify current password
      await api.changePassword(
        user.username,
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      // Clear password fields
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
      // Show error message from backend (e.g., "Incorrect current password")
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
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-neutral-600">
            Manage your account information and preferences
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        <div className="card mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700" />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="relative">
                  {/* Default avatar based on user name */}
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || "user"}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg"
                  />
                </div>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {formData.full_name}
                  </h2>
                  <p className="text-neutral-600">{user?.email}</p>
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
                className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editMode
                  ? isLoading
                    ? "Saving..."
                    : "Save Profile"
                  : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
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
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-neutral-900">{formData.full_name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                  Email Address
                </label>
                <p className="text-neutral-900">{user?.email}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">
                  Username
                </p>
                <p className="text-neutral-900 font-mono">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">
                  Account Type
                </p>
                <p className="text-neutral-900 capitalize">
                  {account?.type} Account
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">
                  Account Number
                </p>
                <p className="text-neutral-900 font-mono">{account?.id}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">
                  Current Balance
                </p>
                <p className="text-2xl font-bold text-primary-600">
                  ${(account?.balance / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">
                  Member Since
                </p>
                <p className="text-neutral-900">
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

        <div className="card p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">
            Security Settings
          </h3>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-smooth"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-neutral-600" />
              <div className="text-left">
                <p className="font-semibold text-neutral-900">
                  Change Password
                </p>
                <p className="text-sm text-neutral-600">
                  Update your password regularly
                </p>
              </div>
            </div>
            <span className="text-neutral-400">→</span>
          </button>
        </div>

        <div className="card p-6 border-l-4 border-red-600">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">
            Danger Zone
          </h3>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-smooth"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowPasswordModal(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900">
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
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
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
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
                      className="absolute right-3 top-2.5 text-neutral-500"
                    >
                      {passwordData.showCurrent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
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
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
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
                      className="absolute right-3 top-2.5 text-neutral-500"
                    >
                      {passwordData.showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-2 block">
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
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
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
                      className="absolute right-3 top-2.5 text-neutral-500"
                    >
                      {passwordData.showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-200 hover:bg-neutral-300 font-semibold rounded-lg transition-smooth"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;