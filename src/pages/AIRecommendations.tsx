import { Brain, BrainCircuit, Zap, Filter, CheckCircle2, Play, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AIRecommendationCard from '../components/AIRecommendationCard';
import type { AIRecommendation } from '../types';

interface Props {
  recommendations: AIRecommendation[];
  onAcknowledge: (id: string) => void;
  onExecute: (id: string) => void;
  onAcknowledgeAll: () => void;
  onClearAcknowledged: () => void;
}

export default function AIRecommendations({ recommendations, onAcknowledge, onExecute, onAcknowledgeAll, onClearAcknowledged }: Props) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const filtered = filter === 'all' ? recommendations : recommendations.filter((r) => r.priority === filter);
  const unack = recommendations.filter((r) => !r.acknowledged && !r.executed);
  const acked = recommendations.filter((r) => r.acknowledged || r.executed);
  const executed = recommendations.filter((r) => r.executed);

  const filters = [
    { key: 'all' as const, label: 'All', count: recommendations.length },
    { key: 'critical' as const, label: 'Critical', count: recommendations.filter((r) => r.priority === 'critical').length },
    { key: 'high' as const, label: 'High', count: recommendations.filter((r) => r.priority === 'high').length },
    { key: 'medium' as const, label: 'Medium', count: recommendations.filter((r) => r.priority === 'medium').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-accent-yellow" />
            AI Recommendation Engine
          </h1>
          <p className="text-sm text-navy-200 mt-1">Rule-based intelligence for coordinated disaster response</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card-flat px-4 py-2 text-center">
            <div className="text-lg font-bold text-accent-yellow">{unack.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Pending</div>
          </div>
          <div className="glass-card-flat px-4 py-2 text-center">
            <div className="text-lg font-bold text-accent-green">{executed.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Executed</div>
          </div>
          <div className="glass-card-flat px-4 py-2 text-center">
            <div className="text-lg font-bold text-slate-300">{acked.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Acknowledged</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 border border-accent-yellow/20 bg-gradient-to-r from-accent-yellow/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-accent-yellow" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">Resource Cascade Protocol (RCP) Active</div>
            <div className="text-xs text-navy-200">The engine automatically chains coordinated actions: detect overload, redirect evacuees, dispatch volunteers, notify hospitals, and transfer supplies. Click Execute on any recommendation to auto-apply the recommended actions.</div>
          </div>
          <Zap className="w-5 h-5 text-accent-yellow animate-pulse" />
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-navy-200" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === f.key
                  ? 'bg-navy-500/40 text-white border border-navy-400/30'
                  : 'bg-navy-700/30 text-navy-200 border border-transparent hover:bg-navy-600/30'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {unack.length > 0 && (
            <button onClick={onAcknowledgeAll} className="btn-ghost text-xs flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Acknowledge All
            </button>
          )}
          {acked.length > 0 && (
            <button onClick={onClearAcknowledged} className="btn-ghost text-xs flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Clear Handled
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="lg:col-span-2 glass-card p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-accent-green mx-auto mb-3" />
            <div className="text-base font-semibold text-white">All Clear</div>
            <div className="text-sm text-navy-200 mt-1">No recommendations in this category. The system is monitoring.</div>
          </div>
        ) : (
          filtered.map((rec) => (
            <AIRecommendationCard
              key={rec.id}
              recommendation={rec}
              onAcknowledge={onAcknowledge}
              onExecute={onExecute}
            />
          ))
        )}
      </div>
    </div>
  );
}
