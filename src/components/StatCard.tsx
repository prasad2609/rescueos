import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  color: 'green' | 'red' | 'blue' | 'orange' | 'yellow';
  trend?: string;
}

const colorMap = {
  green: { text: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/20' },
  red: { text: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/20' },
  blue: { text: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/20' },
  orange: { text: 'text-accent-orange', bg: 'bg-accent-orange/10', border: 'border-accent-orange/20' },
  yellow: { text: 'text-accent-yellow', bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/20' },
};

export default function StatCard({ icon: Icon, label, value, subValue, color, trend }: Props) {
  const c = colorMap[color];
  return (
    <div className="stat-card group">
      <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-navy-200 uppercase tracking-wider font-medium">{label}</div>
        <div className="text-2xl font-bold text-white leading-tight">{value}</div>
        {subValue && <div className={`text-xs ${c.text} font-medium`}>{subValue}</div>}
        {trend && <div className="text-[10px] text-navy-200 mt-0.5">{trend}</div>}
      </div>
    </div>
  );
}
