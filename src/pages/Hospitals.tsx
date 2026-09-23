import { useState } from 'react';
import { HeartPulse, Phone, MapPin, Ambulance, BedDouble, Activity, Stethoscope, Zap, Search, ArrowRightLeft, ShieldPlus, Siren } from 'lucide-react';
import type { Hospital, RescueRequest } from '../types';
import Modal from '../components/Modal';

interface Props {
  hospitals: Hospital[];
  requests: RescueRequest[];
  onAssignNearest: () => void;
  onDispatchAmbulance: (hospitalId: string, requestId: string) => void;
  onTransferPatients: (fromId: string, toId: string, count: number) => void;
  onReserveIcu: (hospitalId: string) => void;
}

function getHospitalStatus(beds: number, total: number, icu: number) {
  const rate = beds / total;
  if (icu < 3) return { label: 'ICU Critical', badge: 'badge-red', dot: 'bg-accent-red', border: 'border-accent-red/30', glow: 'animate-glow-red' };
  if (rate < 0.1) return { label: 'Near Full', badge: 'badge-red', dot: 'bg-accent-red', border: 'border-accent-red/30', glow: '' };
  if (rate < 0.2) return { label: 'Limited', badge: 'badge-yellow', dot: 'bg-accent-yellow', border: 'border-accent-yellow/30', glow: '' };
  return { label: 'Available', badge: 'badge-green', dot: 'bg-accent-green', border: 'border-accent-green/30', glow: '' };
}

export default function Hospitals({ hospitals, requests, onAssignNearest, onDispatchAmbulance, onTransferPatients, onReserveIcu }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'limited' | 'available'>('all');
  const [ambulanceTarget, setAmbulanceTarget] = useState<Hospital | null>(null);
  const [transferTarget, setTransferTarget] = useState<Hospital | null>(null);
  const [transferTo, setTransferTo] = useState('');
  const [transferCount, setTransferCount] = useState(5);

  const filtered = hospitals.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase());
    const status = getHospitalStatus(h.availableBeds, h.totalBeds, h.icuBeds);
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'critical' && status.label === 'ICU Critical') ||
      (statusFilter === 'limited' && (status.label === 'Near Full' || status.label === 'Limited')) ||
      (statusFilter === 'available' && status.label === 'Available');
    return matchSearch && matchStatus;
  });

  const totalBeds = hospitals.reduce((s, h) => s + h.availableBeds, 0);
  const totalIcu = hospitals.reduce((s, h) => s + h.icuBeds, 0);
  const totalAmb = hospitals.reduce((s, h) => s + h.ambulances, 0);
  const bestHospital = [...hospitals].sort((a, b) => b.availableBeds - a.availableBeds)[0];
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const handleAmbulance = () => {
    if (ambulanceTarget && ambulanceTarget.ambulances > 0) {
      const req = pendingRequests[0];
      if (req) {
        onDispatchAmbulance(ambulanceTarget.id, req.id);
      }
      setAmbulanceTarget(null);
    }
  };

  const handleTransfer = () => {
    if (transferTarget && transferTo && transferCount > 0) {
      onTransferPatients(transferTarget.id, transferTo, transferCount);
      setTransferTarget(null);
      setTransferTo('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-accent-red" />
            MedicBridge - Hospital Coordination
          </h1>
          <p className="text-sm text-navy-200 mt-1">Real-time bed availability, ICU capacity, and ambulance dispatch</p>
        </div>
        <button onClick={onAssignNearest} className="btn-primary flex items-center gap-2">
          <Zap className="w-4 h-4" /> Assign Nearest Hospital
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
            <BedDouble className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{totalBeds}</div>
            <div className="text-[10px] text-navy-200 uppercase">Available Beds</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-red/10 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-accent-red" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{totalIcu}</div>
            <div className="text-[10px] text-navy-200 uppercase">ICU Beds</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-yellow/10 flex items-center justify-center">
            <Ambulance className="w-5 h-5 text-accent-yellow" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{totalAmb}</div>
            <div className="text-[10px] text-navy-200 uppercase">Ambulances</div>
          </div>
        </div>
      </div>

      {bestHospital && (
        <div className="glass-card p-4 border border-accent-green/30 bg-accent-green/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-green/15 flex items-center justify-center">
            <Activity className="w-6 h-6 text-accent-green" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-accent-green font-semibold uppercase tracking-wider">Recommended Facility</div>
            <div className="text-base font-bold text-white">{bestHospital.name} - {bestHospital.availableBeds} beds, {bestHospital.icuBeds} ICU</div>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-navy-200 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospitals by name or location..."
            className="w-full bg-navy-800/40 border border-navy-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-navy-200 focus:outline-none focus:border-navy-400"
          />
        </div>
        {(['all', 'critical', 'limited', 'available'] as const).map((f) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((h) => {
          const status = getHospitalStatus(h.availableBeds, h.totalBeds, h.icuBeds);
          const bedRate = Math.round((h.availableBeds / h.totalBeds) * 100);
          return (
            <div key={h.id} className={`glass-card p-5 border ${status.border} ${status.glow}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{h.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-navy-200 mt-0.5">
                    <MapPin className="w-3 h-3" />{h.location}
                  </div>
                </div>
                <span className={`badge ${status.badge}`}>
                  <span className={`status-dot ${status.dot}`} />{status.label}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Available Beds</span>
                  <span className="font-mono font-bold text-white">{h.availableBeds}/{h.totalBeds}</span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${bedRate < 10 ? 'bg-accent-red' : bedRate < 20 ? 'bg-accent-yellow' : 'bg-accent-green'}`}
                    style={{ width: `${bedRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className={`glass-card-flat p-2.5 text-center ${h.icuBeds < 3 ? 'border-accent-red/30' : ''}`}>
                  <div className={`text-lg font-bold ${h.icuBeds < 3 ? 'text-accent-red' : 'text-white'}`}>{h.icuBeds}</div>
                  <div className="text-[9px] text-navy-200 uppercase">ICU Beds</div>
                </div>
                <div className="glass-card-flat p-2.5 text-center">
                  <div className="text-lg font-bold text-white">{h.ambulances}</div>
                  <div className="text-[9px] text-navy-200 uppercase">Ambulances</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <button
                  onClick={() => setAmbulanceTarget(h)}
                  disabled={h.ambulances === 0 || pendingRequests.length === 0}
                  className="btn-ghost text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Siren className="w-3 h-3" /> Dispatch
                </button>
                <button
                  onClick={() => onReserveIcu(h.id)}
                  disabled={h.icuBeds === 0}
                  className="btn-ghost text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShieldPlus className="w-3 h-3" /> Reserve ICU
                </button>
                <button
                  onClick={() => { setTransferTarget(h); setTransferTo(''); setTransferCount(5); }}
                  className="btn-ghost text-xs flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3 h-3" /> Transfer
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-navy-200 pt-2 border-t border-navy-500/15">
                <Phone className="w-3 h-3" />{h.contact}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <HeartPulse className="w-10 h-10 text-navy-200 mx-auto mb-3" />
          <div className="text-sm text-navy-200">No hospitals match your search.</div>
        </div>
      )}

      {/* Ambulance Dispatch Modal */}
      <Modal open={!!ambulanceTarget} onClose={() => setAmbulanceTarget(null)} title={`Dispatch Ambulance from ${ambulanceTarget?.name || ''}`} maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="glass-card-flat p-3 text-sm text-slate-200">
            <div className="flex items-center gap-2 mb-1"><Ambulance className="w-4 h-4 text-accent-yellow" /> Available ambulances: <b>{ambulanceTarget?.ambulances}</b></div>
            <div className="text-xs text-navy-200">This will dispatch an ambulance to the highest-priority pending rescue request.</div>
          </div>
          {pendingRequests.length > 0 && (
            <div className="glass-card-flat p-3">
              <div className="text-xs text-navy-200 mb-1">Target request:</div>
              <div className="text-sm font-semibold text-white">{pendingRequests[0].type}</div>
              <div className="text-xs text-slate-300">{pendingRequests[0].location} - {pendingRequests[0].people} people</div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setAmbulanceTarget(null)} className="btn-ghost">Cancel</button>
            <button onClick={handleAmbulance} className="btn-primary flex items-center gap-2">
              <Ambulance className="w-4 h-4" /> Dispatch Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Patient Transfer Modal */}
      <Modal open={!!transferTarget} onClose={() => setTransferTarget(null)} title={`Transfer Patients from ${transferTarget?.name || ''}`} maxWidth="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Transfer To</label>
            <select
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            >
              <option value="">Select hospital...</option>
              {hospitals.filter((h) => h.id !== transferTarget?.id).map((h) => (
                <option key={h.id} value={h.id}>{h.name} ({h.availableBeds} beds)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Number of Patients</label>
            <input
              value={transferCount}
              onChange={(e) => setTransferCount(parseInt(e.target.value) || 0)}
              type="number"
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setTransferTarget(null)} className="btn-ghost">Cancel</button>
            <button onClick={handleTransfer} className="btn-primary flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" /> Confirm Transfer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
