import { useState, useRef, useEffect } from 'react';
import { Bell, Radio, Activity, Clock } from 'lucide-react';
import type { Notification } from '../types';

interface Props {
  notifications: Notification[];
  onMarkRead: () => void;
  onDismiss: (id: string) => void;
  simRunning: boolean;
  onToggleSim: () => void;
  clock: Date;
}

const typeStyles: Record<Notification['type'], { color: string; bg: string }> = {
  alert: { color: 'text-accent-red', bg: 'bg-accent-red/10' },
  warning: { color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
  info: { color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  success: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
};

export default function TopBar({ notifications, onMarkRead, onDismiss, simRunning, onToggleSim, clock }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const timeStr = clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = clock.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="sticky top-0 z-40 bg-navy-900/70 backdrop-blur-xl border-b border-navy-500/20 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-sm font-semibold text-white">District Disaster Management Authority</div>
          <div className="text-[11px] text-navy-200">Chengalpattu Region - Tamil Nadu</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Clock */}
        <div className="hidden md:flex items-center gap-2 glass-card-flat px-3 py-1.5">
          <Clock className="w-4 h-4 text-navy-200" />
          <div className="font-mono text-sm text-slate-200">{timeStr}</div>
          <div className="text-[11px] text-navy-200 hidden lg:block">{dateStr}</div>
        </div>

        {/* Sim toggle */}
        <button
          onClick={onToggleSim}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
            simRunning
              ? 'bg-accent-green/15 text-accent-green border border-accent-green/30 hover:bg-accent-green/25'
              : 'bg-navy-700/40 text-slate-400 border border-navy-500/20 hover:bg-navy-600/40'
          }`}
        >
          <Activity className={`w-4 h-4 ${simRunning ? 'animate-pulse' : ''}`} />
          {simRunning ? 'LIVE' : 'PAUSED'}
        </button>

        {/* Alert level */}
        <div className="hidden sm:flex items-center gap-2 glass-card-flat px-3 py-1.5">
          <Radio className="w-4 h-4 text-accent-red animate-pulse" />
          <span className="text-xs font-semibold text-accent-red">RED ALERT</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setOpen(!open);
              if (!open && unread > 0) setTimeout(onMarkRead, 1000);
            }}
            className="relative p-2 rounded-lg bg-navy-700/40 hover:bg-navy-600/40 transition-all duration-200 active:scale-95"
          >
            <Bell className="w-5 h-5 text-slate-200" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse-slow">
                {unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card p-0 overflow-hidden animate-slide-in z-50">
              <div className="px-4 py-3 border-b border-navy-500/20 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <span className="text-[11px] text-navy-200">{notifications.length} total</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-navy-200">No notifications</div>
                ) : (
                  notifications.slice(0, 15).map((n) => {
                    const style = typeStyles[n.type];
                    return (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-navy-500/10 hover:bg-navy-700/30 transition-colors cursor-default ${style.bg}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className={`text-sm font-semibold ${style.color}`}>{n.title}</div>
                            <div className="text-xs text-slate-300 mt-0.5">{n.message}</div>
                            <div className="text-[10px] text-navy-200 mt-1">
                              {new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <button
                            onClick={() => onDismiss(n.id)}
                            className="text-navy-200 hover:text-slate-100 text-xs shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
