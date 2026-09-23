import { useState } from 'react';
import { Siren, MapPin, Clock, Users, CheckCircle2, UserPlus, AlertTriangle, Search, Plus, ArrowUp, X, Filter } from 'lucide-react';
import type { RescueRequest, Volunteer } from '../types';
import Modal from '../components/Modal';

interface Props {
  requests: RescueRequest[];
  volunteers: Volunteer[];
  onAssign: (requestId: string, volunteerId?: string) => void;
  onResolve: (requestId: string) => void;
  onAdd: (data: Omit<RescueRequest, 'id' | 'time' | 'status'>) => void;
  onEscalate: (requestId: string) => void;
  onCancel: (requestId: string) => void;
}

const priorityConfig = {
  critical: { badge: 'badge-red', border: 'border-accent-red/40', text: 'text-accent-red', label: 'CRITICAL' },
  high: { badge: 'badge-orange', border: 'border-accent-orange/40', text: 'text-accent-orange', label: 'HIGH' },
  medium: { badge: 'badge-yellow', border: 'border-accent-yellow/30', text: 'text-accent-yellow', label: 'MEDIUM' },
  low: { badge: 'badge-neutral', border: 'border-navy-500/20', text: 'text-slate-300', label: 'LOW' },
};

const statusConfig = {
  pending: { badge: 'badge-orange', label: 'Pending', dot: 'bg-accent-orange' },
  assigned: { badge: 'badge-blue', label: 'Assigned', dot: 'bg-accent-blue' },
  resolved: { badge: 'badge-green', label: 'Resolved', dot: 'bg-accent-green' },
};

const requestTypes = [
  'Flood Rescue', 'Structural Collapse', 'Medical Evacuation', 'Evacuation',
  'Debris Clearance', 'Electrical Hazard', 'Fire Response', 'Landslide',
  'Water Rescue', 'Relief Supply', 'Crowd Management', 'Medical Aid',
];

const emptyForm = {
  location: '', lat: 13.0, lng: 80.2, type: 'Flood Rescue',
  people: 5, priority: 'high' as RescueRequest['priority'], notes: '',
};

export default function RescueRequests({ requests, volunteers, onAssign, onResolve, onAdd, onEscalate, onCancel }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'assigned' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = requests.filter((r) => {
    const matchSearch = r.location.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const pending = requests.filter((r) => r.status === 'pending');
  const assigned = requests.filter((r) => r.status === 'assigned');
  const resolved = requests.filter((r) => r.status === 'resolved');
  const availableVols = volunteers.filter((v) => v.status === 'available');

  const handleAdd = () => {
    if (!form.location) return;
    onAdd(form);
    setForm(emptyForm);
    setAddOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Siren className="w-6 h-6 text-accent-orange" />
            Rescue Requests - Live Operations
          </h1>
          <p className="text-sm text-navy-200 mt-1">All incoming rescue requests with priority and assignment tracking</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{pending.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Pending</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{assigned.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Assigned</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-accent-green" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{resolved.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Resolved</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-red/10 flex items-center justify-center">
            <Siren className="w-5 h-5 text-accent-red" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{requests.filter((r) => r.priority === 'critical').length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Critical</div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-navy-200 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location or type..."
            className="w-full bg-navy-800/40 border border-navy-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-navy-200 focus:outline-none focus:border-navy-400"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
          className="bg-navy-800/40 border border-navy-500/20 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-navy-400"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {(['all', 'pending', 'assigned', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
              statusFilter === f
                ? 'bg-navy-500/40 text-white border border-navy-400/30'
                : 'bg-navy-700/30 text-navy-200 border border-transparent hover:bg-navy-600/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const pConfig = priorityConfig[req.priority];
          const sConfig = statusConfig[req.status];
          const assignedVol = req.assignedVolunteer ? volunteers.find((v) => v.name === req.assignedVolunteer) : null;
          return (
            <div key={req.id} className={`glass-card p-4 border-l-4 ${pConfig.border} ${req.priority === 'critical' && req.status === 'pending' ? 'animate-glow-red' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-[250px]">
                  <div className={`w-12 h-12 rounded-xl ${pConfig.badge} bg-opacity-10 flex items-center justify-center shrink-0`}>
                    <Siren className={`w-5 h-5 ${pConfig.text}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${pConfig.badge}`}>{pConfig.label}</span>
                      <span className="text-sm font-bold text-white">{req.type}</span>
                      <span className={`badge ${sConfig.badge}`}>
                        <span className={`status-dot ${sConfig.dot}`} />{sConfig.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-200">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{req.people} people</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{req.time}</span>
                      {assignedVol && (
                        <span className="flex items-center gap-1 text-accent-blue">
                          <UserPlus className="w-3 h-3" />{assignedVol.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {req.status === 'pending' && (
                    <>
                      <select
                        className="bg-navy-700/60 border border-navy-500/30 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-navy-400"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            onAssign(req.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      >
                        <option value="">Select volunteer...</option>
                        {availableVols.map((v) => (
                          <option key={v.id} value={v.id}>{v.name} - {v.skill}</option>
                        ))}
                      </select>
                      <button onClick={() => onAssign(req.id)} className="btn-primary text-xs whitespace-nowrap">
                        Auto-Assign
                      </button>
                      <button onClick={() => onEscalate(req.id)} className="btn-ghost text-xs flex items-center gap-1.5" title="Escalate Priority">
                        <ArrowUp className="w-3.5 h-3.5" /> Escalate
                      </button>
                      <button onClick={() => onCancel(req.id)} className="btn-ghost text-xs flex items-center gap-1.5 text-accent-red" title="Cancel Request">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {req.status === 'assigned' && (
                    <>
                      <button onClick={() => onResolve(req.id)} className="btn-success text-xs whitespace-nowrap flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                      <button onClick={() => onCancel(req.id)} className="btn-ghost text-xs flex items-center gap-1.5 text-accent-red" title="Cancel Request">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {req.status === 'resolved' && (
                    <span className="text-xs text-accent-green font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Siren className="w-10 h-10 text-navy-200 mx-auto mb-3" />
          <div className="text-sm text-navy-200">No requests match your filters.</div>
        </div>
      )}

      {/* Add Request Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create New Rescue Request">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              type="text"
              placeholder="e.g. Flooded Street - Ward 12"
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-navy-200 font-medium mb-1 block">Request Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
              >
                {requestTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-navy-200 font-medium mb-1 block">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as RescueRequest['priority'] })}
                className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Number of People</label>
            <input
              value={form.people}
              onChange={(e) => setForm({ ...form, people: parseInt(e.target.value) || 0 })}
              type="number"
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setAddOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
              <Siren className="w-4 h-4" /> Create Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
