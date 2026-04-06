import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBank } from '../context/BankContext';
import { User, Mail, Phone, MapPin, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const {
    user,
    logout
  } = useAuth();
  const {
    account
  } = useBank();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profile Settings</h1>
          <p className="text-neutral-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Header Card */}
        <div className="card mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700" />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 mb-6">
              <div className="flex items-end gap-4">
                {user?.avatar && <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />}
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-neutral-900">{user?.name}</h2>
                  <p className="text-neutral-600">{user?.email}</p>
                </div>
              </div>
              <button onClick={() => setEditMode(!editMode)} className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-smooth">
                {editMode ? 'Done' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Details */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {editMode ? <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /> : <p className="text-neutral-900">{user?.name}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <p className="text-neutral-900">{user?.email}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                {editMode ? <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /> : <p className="text-neutral-900">+1 (555) 000-0000</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                {editMode ? <input type="text" defaultValue="123 Main Street, City, State 12345" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /> : <p className="text-neutral-900">123 Main Street, City, State 12345</p>}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">Account Type</p>
                <p className="text-neutral-900 capitalize">{account?.type} Account</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">Account Number</p>
                <p className="text-neutral-900 font-mono">{account?.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">Current Balance</p>
                <p className="text-2xl font-bold text-primary-600">${account?.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-700 mb-2">Member Since</p>
                <p className="text-neutral-900">January 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Security Settings</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-smooth">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-neutral-600" />
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">Change Password</p>
                  <p className="text-sm text-neutral-600">Update your password regularly</p>
                </div>
              </div>
              <span className="text-neutral-400">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-smooth">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">Two-Factor Authentication</p>
                  <p className="text-sm text-neutral-600">Enable additional security</p>
                </div>
              </div>
              <span className="text-neutral-400">→</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-l-4 border-red-600">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Danger Zone</h3>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-smooth">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>;
};
export default Profile;