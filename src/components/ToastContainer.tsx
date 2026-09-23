import { useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import type { Notification } from '../types';

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const config = {
  alert: { icon: AlertTriangle, color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' },
  warning: { icon: AlertTriangle, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/30' },
  info: { icon: Info, color: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/30' },
  success: { icon: CheckCircle, color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' },
};

function Toast({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) {
  const c = config[notification.type];
  const Icon = c.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div className={`glass-card p-3.5 border ${c.border} animate-slide-in-right flex items-start gap-3 min-w-[280px] max-w-sm`}>
      <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${c.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${c.color}`}>{notification.title}</div>
        <div className="text-xs text-slate-300 mt-0.5">{notification.message}</div>
      </div>
      <button onClick={() => onDismiss(notification.id)} className="text-navy-200 hover:text-slate-100 shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer({ notifications, onDismiss }: Props) {
  // Only show the most recent 3 unread as toasts
  const toasts = notifications.filter((n) => !n.read).slice(0, 3);

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3">
      {toasts.map((n) => (
        <Toast key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
