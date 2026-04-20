import React from 'react';
import { LayoutDashboard, Map as MapIcon, Upload, Database, Settings, Shield } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'map', icon: MapIcon, label: 'Geo-Fusion' },
    { id: 'database', icon: Database, label: 'Intelligence' },
    { id: 'upload', icon: Upload, label: 'Ingest Data' },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
          <Shield className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">CYBER<span className="text-primary italic font-black">JOAR</span></h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={clsx("w-5 h-5", activeTab === item.id ? "text-primary" : "text-slate-400 group-hover:text-white")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-slate-300">System Secure</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
