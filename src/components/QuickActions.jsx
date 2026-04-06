import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Plus, Minus, Download } from 'lucide-react';
const QuickActions = () => {
  const actions = [{
    icon: Send,
    label: 'Transfer',
    path: '/transfer',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50'
  }, {
    icon: Plus,
    label: 'Deposit',
    path: '/deposit',
    color: 'text-accent-600',
    bgColor: 'bg-accent-50'
  }, {
    icon: Minus,
    label: 'Withdraw',
    path: '/withdraw',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50'
  }, {
    icon: Download,
    label: 'Download',
    path: '#',
    color: 'text-neutral-600',
    bgColor: 'bg-neutral-50'
  }];
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map(action => {
      const Icon = action.icon;
      return <Link key={action.label} to={action.path} className="group card p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-smooth">
            <div className={`${action.bgColor} p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <p className="font-semibold text-neutral-900">{action.label}</p>
            <p className="text-xs text-neutral-500 mt-1">Quick access</p>
          </Link>;
    })}
    </div>;
};
export default QuickActions;