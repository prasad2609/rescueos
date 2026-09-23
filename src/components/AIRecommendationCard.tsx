import { Brain, AlertTriangle, Activity, CheckCircle2, ChevronRight, Zap, Play } from 'lucide-react';
import type { AIRecommendation } from '../types';

interface Props {
  recommendation: AIRecommendation;
  onAcknowledge: (id: string) => void;
  onExecute?: (id: string) => void;
  compact?: boolean;
}

const priorityConfig = {
  critical: {
    color: 'text-accent-red',
    bg: 'bg-accent-red/10',
    border: 'border-accent-red/30',
    label: 'CRITICAL',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    icon: AlertTriangle,
    iconColor: 'text-accent-red',
    barColor: 'bg-accent-red',
    animate: 'animate-glow-red',
    badge: 'badge-red',
  },
  high: {
    color: 'text-accent-yellow',
    bg: 'bg-accent-yellow/10',
    border: 'border-accent-yellow/30',
    label: 'HIGH',
    glow: '',
    icon: AlertTriangle,
    iconColor: 'text-accent-yellow',
    barColor: 'bg-accent-yellow',
    animate: '',
    badge: 'badge-yellow',
  },
  medium: {
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
    border: 'border-accent-blue/30',
    label: 'MEDIUM',
    glow: '',
    icon: Activity,
    iconColor: 'text-accent-blue',
    barColor: 'bg-accent-blue',
    animate: '',
    badge: 'badge-blue',
  },
};

const typeLabels: Record<AIRecommendation['type'], string> = {
  shelter: 'Shelter',
  hospital: 'Hospital',
  volunteer: 'Volunteer',
  cascade: 'Cascade',
  resource: 'Resource',
};

export default function AIRecommendationCard({ recommendation: rec, onAcknowledge, onExecute, compact }: Props) {
  const config = priorityConfig[rec.priority];
  const Icon = config.icon;
  const isDone = rec.acknowledged || rec.executed;

  return (
    <div
      className={`glass-card p-4 border ${config.border} ${config.glow} ${isDone ? 'opacity-60' : ''} animate-slide-in`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.barColor} rounded-l-2xl`} />

      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${config.iconColor} ${config.animate}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${config.badge}`}>{config.label}</span>
            <span className="text-[10px] text-navy-200 uppercase tracking-wider font-medium">
              {typeLabels[rec.type]}
            </span>
            {rec.executed && (
              <span className="badge badge-green text-[9px]">
                <Zap className="w-2.5 h-2.5" /> Executed
              </span>
            )}
          </div>
          <h3 className={`text-sm font-bold ${config.color} leading-tight`}>{rec.title}</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rec.description}</p>
        </div>
      </div>

      {!compact && rec.actions.length > 0 && (
        <div className="space-y-1.5 mb-3 ml-12">
          {rec.actions.map((action, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
              <ChevronRight className="w-3 h-3 text-navy-200 mt-0.5 shrink-0" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between ml-12">
        <span className="text-[10px] text-navy-200">
          {new Date(rec.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        {!isDone && (
          <div className="flex items-center gap-3">
            {onExecute && (
              <button
                onClick={() => onExecute(rec.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-accent-yellow hover:text-yellow-300 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Execute
              </button>
            )}
            <button
              onClick={() => onAcknowledge(rec.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Acknowledge
            </button>
          </div>
        )}
        {isDone && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-accent-green">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {rec.executed ? 'Executed' : 'Acknowledged'}
          </span>
        )}
      </div>
    </div>
  );
}
