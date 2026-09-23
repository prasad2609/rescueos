import {
  LayoutDashboard,
  Home,
  HeartPulse,
  Users,
  Siren,
  Brain,
  ShieldAlert,
} from 'lucide-react';
import type { ViewKey } from '../types';

interface Props {
  active: ViewKey;
  onNavigate: (view: ViewKey) => void;
  stats: {
    activeRequests: number;
    unacknowledgedRecs: number;
  };
}

const navItems: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'shelters', label: 'Shelters', icon: Home },
  { key: 'hospitals', label: 'Hospitals', icon: HeartPulse },
  { key: 'volunteers', label: 'Volunteers', icon: Users },
  { key: 'requests', label: 'Rescue Requests', icon: Siren },
  { key: 'ai', label: 'AI Recommendations', icon: Brain },
];

export default function Sidebar({ active, onNavigate, stats }: Props) {
  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-navy-900/60 backdrop-blur-xl border-r border-navy-500/20 z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-navy-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-red to-navy-500 flex items-center justify-center shadow-lg shadow-accent-red/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-white tracking-tight">RescueOS</div>
            <div className="text-[10px] text-navy-200 font-medium uppercase tracking-wider">Emergency Command</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          const badge =
            item.key === 'requests'
              ? stats.activeRequests
              : item.key === 'ai'
                ? stats.unacknowledgedRecs
                : 0;
          return (
            <div
              key={item.key}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span className="bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center animate-pulse-slow">
                  {badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-navy-500/20">
        <div className="glass-card-flat p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="status-dot bg-accent-green animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">System Online</span>
          </div>
          <div className="text-[10px] text-navy-200">All modules operational</div>
        </div>
      </div>
    </aside>
  );
}
