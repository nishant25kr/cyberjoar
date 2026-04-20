import React from 'react';
import { Eye, Users, Image, ShieldAlert } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface StatCardsProps {
  stats: DashboardStats;
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const items = [
    { label: 'Total Intel', value: stats.total, icon: ShieldAlert, color: 'text-white' },
    { label: 'OSINT', value: stats.osint, icon: Eye, color: 'text-osint' },
    { label: 'HUMINT', value: stats.humint, icon: Users, color: 'text-humint' },
    { label: 'IMINT', value: stats.imint, icon: Image, color: 'text-imint' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((stat, idx) => (
        <div key={idx} className="bg-surface p-5 rounded-2xl border border-white/5 shadow-lg group hover:border-primary/50 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-slate-800/50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Feed</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
