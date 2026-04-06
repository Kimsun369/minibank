import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const SpendingSummary = () => {
  const data = [{
    name: 'Mon',
    value: 2400
  }, {
    name: 'Tue',
    value: 1398
  }, {
    name: 'Wed',
    value: 2800
  }, {
    name: 'Thu',
    value: 3908
  }, {
    name: 'Fri',
    value: 4800
  }, {
    name: 'Sat',
    value: 3800
  }, {
    name: 'Sun',
    value: 4300
  }];
  return <div className="card p-6">
      <h3 className="text-lg font-bold text-neutral-900 mb-6">Weekly Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{
          backgroundColor: '#1e293b',
          border: 'none',
          borderRadius: '8px',
          color: '#fff'
        }} />
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{
          fill: '#0ea5e9',
          r: 6
        }} activeDot={{
          r: 8
        }} fillOpacity={1} fill="url(#colorValue)" />
        </LineChart>
      </ResponsiveContainer>
    </div>;
};
export default SpendingSummary;