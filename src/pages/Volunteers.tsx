import { useState } from 'react';
import { Users, Phone, MapPin, Award, UserCheck, UserX, Circle, Plus, Search, UserMinus } from 'lucide-react';
import type { Volunteer, RescueRequest } from '../types';
import Modal from '../components/Modal';

interface Props {
  volunteers: Volunteer[];
  requests: RescueRequest[];
  onAssign: (requestId: string, volunteerId?: string) => void;
  onAdd: (data: Omit<Volunteer, 'id'>) => void;
  onUnassign: (volunteerId: string) => void;
}

const skillColors: Record<string, string> = {
  'First Aid': 'badge-red',
  'Logistics': 'badge-blue',
  'Rescue': 'badge-orange',
  'Medical': 'badge-green',
};

const allSkills = ['First Aid', 'Logistics', 'Rescue', 'Medical'];
const allZones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F', 'Zone G'];

const emptyForm: Omit<Volunteer, 'id'> = {
  name: '', skill: 'First Aid', status: 'available', lat: 13.0, lng: 80.2, phone: '', zone: 'Zone A',
};

export default function Volunteers({ volunteers, requests, onAssign, onAdd, onUnassign }: Props) {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'assigned' | 'offline'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = volunteers.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.zone.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === 'all' || v.skill === skillFilter;
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchSkill && matchStatus;
  });

  const available = volunteers.filter((v) => v.status === 'available');
  const assigned = volunteers.filter((v) => v.status === 'assigned');
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const handleAdd = () => {
    if (!form.name) return;
    onAdd(form);
    setForm(emptyForm);
    setAddOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-accent-blue" />
            RescueMatch - Volunteer Management
          </h1>
          <p className="text-sm text-navy-200 mt-1">Assign skilled volunteers to emergency rescue requests</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Volunteer
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center">
            <Circle className="w-5 h-5 text-accent-green" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{available.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Available</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{assigned.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Assigned</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-red/10 flex items-center justify-center">
            <UserX className="w-5 h-5 text-accent-red" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{pendingRequests.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Pending Requests</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{volunteers.length}</div>
            <div className="text-[10px] text-navy-200 uppercase">Total</div>
          </div>
        </div>
      </div>

      {/* Pending Requests - Assign Section */}
      {pendingRequests.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-yellow" />
            Pending Rescue Requests - Assign a Volunteer
          </h2>
          <div className="space-y-3">
            {pendingRequests.slice(0, 6).map((req) => {
              const priorityColor = req.priority === 'critical' ? 'border-accent-red/40' : req.priority === 'high' ? 'border-accent-orange/40' : 'border-navy-500/20';
              const priorityBadge = req.priority === 'critical' ? 'badge-red' : req.priority === 'high' ? 'badge-orange' : req.priority === 'medium' ? 'badge-yellow' : 'badge-neutral';
              const availableVols = volunteers.filter((v) => v.status === 'available');
              return (
                <div key={req.id} className={`glass-card-flat p-4 border-l-4 ${priorityColor} flex flex-wrap items-center justify-between gap-3`}>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${priorityBadge}`}>{req.priority.toUpperCase()}</span>
                      <span className="text-sm font-semibold text-white">{req.type}</span>
                    </div>
                    <div className="text-xs text-navy-200">{req.location} - {req.people} people - {req.time}</div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => onAssign(req.id)}
                      className="btn-primary text-xs whitespace-nowrap"
                      disabled={availableVols.length === 0}
                    >
                      Auto-Assign
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-navy-200 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or zone..."
            className="w-full bg-navy-800/40 border border-navy-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-navy-200 focus:outline-none focus:border-navy-400"
          />
        </div>
        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="bg-navy-800/40 border border-navy-500/20 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-navy-400"
        >
          <option value="all">All Skills</option>
          {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {(['all', 'available', 'assigned', 'offline'] as const).map((f) => (
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

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((v) => {
          const assignedReq = v.assignedTo ? requests.find((r) => r.id === v.assignedTo) : null;
          return (
            <div key={v.id} className={`glass-card p-4 ${v.status === 'assigned' ? 'border-accent-orange/30' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    v.status === 'available' ? 'bg-accent-green/15 text-accent-green' :
                    v.status === 'assigned' ? 'bg-accent-orange/15 text-accent-orange' :
                    'bg-navy-700/40 text-navy-200'
                  }`}>
                    {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{v.name}</div>
                    <div className="text-[11px] text-navy-200">{v.zone}</div>
                  </div>
                </div>
                <span className={`badge ${
                  v.status === 'available' ? 'badge-green' :
                  v.status === 'assigned' ? 'badge-orange' : 'badge-neutral'
                }`}>
                  <span className={`status-dot ${
                    v.status === 'available' ? 'bg-accent-green' :
                    v.status === 'assigned' ? 'bg-accent-orange' : 'bg-navy-400'
                  } ${v.status === 'available' ? 'animate-pulse' : ''}`} />
                  {v.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-navy-200">Skill</span>
                  <span className={`badge ${skillColors[v.skill] || 'badge-neutral'} text-[10px]`}>{v.skill}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="w-3 h-3 text-navy-200" />{v.phone}
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3 h-3 text-navy-200" />{v.lat.toFixed(3)}, {v.lng.toFixed(3)}
                </div>
                {assignedReq && (
                  <div className="mt-2 pt-2 border-t border-navy-500/15 text-[11px] text-accent-orange">
                    Assigned to: {assignedReq.location}
                  </div>
                )}
              </div>

              {v.status === 'assigned' && (
                <button
                  onClick={() => onUnassign(v.id)}
                  className="btn-ghost text-xs w-full mt-3 flex items-center justify-center gap-1.5"
                >
                  <UserMinus className="w-3 h-3" /> Release Volunteer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Users className="w-10 h-10 text-navy-200 mx-auto mb-3" />
          <div className="text-sm text-navy-200">No volunteers match your search.</div>
        </div>
      )}

      {/* Add Volunteer Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Register New Volunteer">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Volunteer Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              type="text"
              placeholder="Enter name..."
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-navy-200 font-medium mb-1 block">Skill</label>
              <select
                value={form.skill}
                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
              >
                {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-navy-200 font-medium mb-1 block">Zone</label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
              >
                {allZones.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              type="text"
              placeholder="+91 ..."
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setAddOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Register Volunteer</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
