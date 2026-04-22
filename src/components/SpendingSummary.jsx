import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBank } from '../context/BankContext';
import { TrendingUp, ChevronDown } from 'lucide-react';
import api from '../lib/api';

const SpendingSummary = () => {
  const { transactions } = useBank();

  // Calculate weekly spending from transactions
  const getWeeklySpending = () => {
    const now = new Date();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = weekDays.map(day => ({ name: day, value: 0 }));

    // Get transactions from the last 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate >= sevenDaysAgo && tx.type === 'debit') {
        const dayIndex = txDate.getDay();
        weekData[dayIndex].value += tx.amount;
      }
    });

    return weekData;
  };

  const data = getWeeklySpending();
  const totalSpent = data.reduce((sum, day) => sum + day.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Weekly Spending</h3>
              <p className="text-xs text-slate-400">Last 7 days activity</p>
            </div>
          </div>
          <ClearSpendingControl />
        </div>
      </div>

      {/* Total Spent Summary */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">${totalSpent.toFixed(2)}</span>
          <span className="text-sm text-slate-400">total spent</span>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                padding: '8px 12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              labelStyle={{ color: '#94a3b8', fontSize: 12 }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#spendingGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Clear Spending Control Component
function ClearSpendingControl() {
  const { fetchTransactions } = useBank();
  const [config, setConfig] = React.useState({ enabled: false, options: [] });
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    let mounted = true;
    api.getSpendingClearConfig().then(cfg => {
      console.debug('spending clear config response:', cfg);
      if (!mounted) return;
      setConfig(cfg);
    }).catch(err => {
      console.debug('spending clear config error:', err);
    });
    return () => { mounted = false };
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await api.clearSpending(action);
      await fetchTransactions();
      setOpen(false);
    } catch (e) {
      console.error('Failed to clear spending:', e);
    } finally {
      setLoading(false);
    }
  };

  const getOptionLabel = (opt) => {
    const labels = {
      'today': 'Clear Today',
      'this_week': 'Clear This Week',
      'this_month': 'Clear This Month'
    };
    return labels[opt] || opt;
  };

  if (!config.enabled || !Array.isArray(config.options) || config.options.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-300"
        disabled={loading}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Clear Data
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
          {config.options.map(opt => (
            <button
              key={opt}
              onClick={() => handleAction(opt)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              disabled={loading}
            >
              {getOptionLabel(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpendingSummary;