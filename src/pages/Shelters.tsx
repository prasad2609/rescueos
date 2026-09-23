import { useState } from 'react';
import { Home, Phone, MapPin, User, Utensils, Pill, Droplets, AlertTriangle, Plus, Search, RefreshCw, ArrowRightLeft, Users, Package } from 'lucide-react';
import type { Shelter } from '../types';
import Modal from '../components/Modal';

interface Props {
  shelters: Shelter[];
  onAdd: (data: Omit<Shelter, 'id'>) => void;
  onRestock: (id: string, resource: 'foodKits' | 'medicineKits' | 'water', amount: number) => void;
  onTransferSupplies: (fromId: string, toId: string, resource: 'foodKits' | 'medicineKits' | 'water', amount: number) => void;
  onTransferOccupants: (fromId: string, toId: string, amount: number) => void;
}

function getShelterStatus(occupied: number, capacity: number) {
  const rate = occupied / capacity;
  if (rate >= 0.9) return { label: 'Critical', badge: 'badge-red', bar: 'bg-accent-red', dot: 'bg-accent-red', glow: 'animate-glow-red' };
  if (rate >= 0.75) return { label: 'Almost Full', badge: 'badge-yellow', bar: 'bg-accent-yellow', dot: 'bg-accent-yellow', glow: '' };
  return { label: 'Safe', badge: 'badge-green', bar: 'bg-accent-green', dot: 'bg-accent-green', glow: '' };
}

const emptyForm: Omit<Shelter, 'id'> = {
  name: '', location: '', lat: 13.0, lng: 80.2, capacity: 200, occupied: 0,
  foodKits: 100, medicineKits: 30, water: 200, manager: '', phone: '',
};

export default function Shelters({ shelters, onAdd, onRestock, onTransferSupplies, onTransferOccupants }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'warning' | 'safe'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [restockTarget, setRestockTarget] = useState<Shelter | null>(null);
  const [restockResource, setRestockResource] = useState<'foodKits' | 'medicineKits' | 'water'>('foodKits');
  const [restockAmount, setRestockAmount] = useState(50);
  const [transferTarget, setTransferTarget] = useState<Shelter | null>(null);
  const [transferMode, setTransferMode] = useState<'supplies' | 'occupants'>('supplies');
  const [transferResource, setTransferResource] = useState<'foodKits' | 'medicineKits' | 'water'>('foodKits');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState(20);

  const filtered = shelters.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase());
    const rate = s.occupied / s.capacity;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'critical' && rate >= 0.9) ||
      (statusFilter === 'warning' && rate >= 0.75 && rate < 0.9) ||
      (statusFilter === 'safe' && rate < 0.75);
    return matchSearch && matchStatus;
  });

  const totalOccupied = shelters.reduce((s, sh) => s + sh.occupied, 0);
  const totalCapacity = shelters.reduce((s, sh) => s + sh.capacity, 0);
  const criticalCount = shelters.filter((s) => s.occupied / s.capacity >= 0.9).length;
  const safeCount = shelters.filter((s) => s.occupied / s.capacity < 0.75).length;

  const handleAdd = () => {
    if (!form.name || !form.location) return;
    onAdd(form);
    setForm(emptyForm);
    setAddOpen(false);
  };

  const handleRestock = () => {
    if (restockTarget && restockAmount > 0) {
      onRestock(restockTarget.id, restockResource, restockAmount);
      setRestockTarget(null);
    }
  };

  const handleTransfer = () => {
    if (!transferTarget || !transferTo) return;
    if (transferMode === 'supplies') {
      onTransferSupplies(transferTarget.id, transferTo, transferResource, transferAmount);
    } else {
      onTransferOccupants(transferTarget.id, transferTo, transferAmount);
    }
    setTransferTarget(null);
    setTransferTo('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Home className="w-6 h-6 text-accent-green" />
            ShelterSync - Relief Camp Management
          </h1>
          <p className="text-sm text-navy-200 mt-1">Monitor shelter capacity, resources, and occupancy in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card-flat px-4 py-2 text-center">
            <div className="text-2xl font-bold text-white">{totalOccupied}<span className="text-sm text-navy-200">/{totalCapacity}</span></div>
            <div className="text-[10px] text-navy-200 uppercase">Total Occupancy</div>
          </div>
          <div className="glass-card-flat px-4 py-2 text-center">
            <div className="text-2xl font-bold text-accent-red">{criticalCount}</div>
            <div className="text-[10px] text-navy-200 uppercase">Critical</div>
          </div>
          <div className="glass-card-flat px-4 py-2 text-center">
            <div className="text-2xl font-bold text-accent-green">{safeCount}</div>
            <div className="text-[10px] text-navy-200 uppercase">Safe</div>
          </div>
          <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Shelter
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-navy-200 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shelters by name or location..."
            className="w-full bg-navy-800/40 border border-navy-500/20 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-navy-200 focus:outline-none focus:border-navy-400"
          />
        </div>
        {(['all', 'critical', 'warning', 'safe'] as const).map((f) => (
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

      {/* Shelter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((shelter) => {
          const status = getShelterStatus(shelter.occupied, shelter.capacity);
          const rate = Math.round((shelter.occupied / shelter.capacity) * 100);
          const foodLow = shelter.foodKits < 50;
          const medLow = shelter.medicineKits < 15;
          const waterLow = shelter.water < 100;

          return (
            <div key={shelter.id} className={`glass-card p-5 ${status.glow}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{shelter.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-navy-200 mt-0.5">
                    <MapPin className="w-3 h-3" />{shelter.location}
                  </div>
                </div>
                <span className={`badge ${status.badge}`}>
                  <span className={`status-dot ${status.dot}`} />{status.label}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Occupancy</span>
                  <span className="font-mono font-bold text-white">{shelter.occupied}/{shelter.capacity} ({rate}%)</span>
                </div>
                <div className="progress-track h-2.5">
                  <div className={`progress-fill ${status.bar}`} style={{ width: `${rate}%` }} />
                </div>
                {rate >= 90 && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-accent-red font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                    Over 90% capacity - redirect new arrivals
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={`glass-card-flat p-2.5 text-center ${foodLow ? 'border-accent-red/30' : ''}`}>
                  <Utensils className={`w-4 h-4 mx-auto mb-1 ${foodLow ? 'text-accent-red' : 'text-slate-300'}`} />
                  <div className="text-sm font-bold text-white">{shelter.foodKits}</div>
                  <div className="text-[9px] text-navy-200 uppercase">Food</div>
                </div>
                <div className={`glass-card-flat p-2.5 text-center ${medLow ? 'border-accent-red/30' : ''}`}>
                  <Pill className={`w-4 h-4 mx-auto mb-1 ${medLow ? 'text-accent-red' : 'text-slate-300'}`} />
                  <div className="text-sm font-bold text-white">{shelter.medicineKits}</div>
                  <div className="text-[9px] text-navy-200 uppercase">Medicine</div>
                </div>
                <div className={`glass-card-flat p-2.5 text-center ${waterLow ? 'border-accent-red/30' : ''}`}>
                  <Droplets className={`w-4 h-4 mx-auto mb-1 ${waterLow ? 'text-accent-red' : 'text-slate-300'}`} />
                  <div className="text-sm font-bold text-white">{shelter.water}</div>
                  <div className="text-[9px] text-navy-200 uppercase">Water (L)</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <button
                  onClick={() => { setRestockTarget(shelter); setRestockResource('foodKits'); setRestockAmount(50); }}
                  className="btn-ghost text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" /> Restock
                </button>
                <button
                  onClick={() => { setTransferTarget(shelter); setTransferMode('supplies'); setTransferTo(''); setTransferAmount(20); }}
                  className="btn-ghost text-xs flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3 h-3" /> Transfer
                </button>
                {rate >= 75 && (
                  <button
                    onClick={() => { setTransferTarget(shelter); setTransferMode('occupants'); setTransferTo(''); setTransferAmount(20); }}
                    className="btn-ghost text-xs flex items-center gap-1.5 text-accent-yellow"
                  >
                    <Users className="w-3 h-3" /> Redirect
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-navy-200 pt-3 border-t border-navy-500/15">
                <div className="flex items-center gap-1.5"><User className="w-3 h-3" />{shelter.manager}</div>
                <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{shelter.phone}</div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Home className="w-10 h-10 text-navy-200 mx-auto mb-3" />
          <div className="text-sm text-navy-200">No shelters match your search.</div>
        </div>
      )}

      {/* Add Shelter Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Register New Shelter">
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Shelter Name', type: 'text' },
            { key: 'location', label: 'Location', type: 'text' },
            { key: 'manager', label: 'Manager Name', type: 'text' },
            { key: 'phone', label: 'Phone Number', type: 'text' },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-navy-200 font-medium mb-1 block">{f.label}</label>
              <input
                value={(form as Record<string, string | number>)[f.key] as string}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                type={f.type}
                className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'capacity', label: 'Capacity' },
              { key: 'foodKits', label: 'Food Kits' },
              { key: 'medicineKits', label: 'Medicine Kits' },
              { key: 'water', label: 'Water (L)' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs text-navy-200 font-medium mb-1 block">{f.label}</label>
                <input
                  value={(form as Record<string, string | number>)[f.key] as number}
                  onChange={(e) => setForm({ ...form, [f.key]: parseInt(e.target.value) || 0 })}
                  type="number"
                  className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setAddOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary">Register Shelter</button>
          </div>
        </div>
      </Modal>

      {/* Restock Modal */}
      <Modal open={!!restockTarget} onClose={() => setRestockTarget(null)} title={`Restock ${restockTarget?.name || ''}`}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Resource</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'foodKits', label: 'Food Kits', icon: Utensils },
                { key: 'medicineKits', label: 'Medicine', icon: Pill },
                { key: 'water', label: 'Water (L)', icon: Droplets },
              ] as const).map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.key}
                    onClick={() => setRestockResource(r.key)}
                    className={`p-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      restockResource === r.key ? 'bg-navy-500/40 text-white border border-navy-400/30' : 'bg-navy-700/30 text-navy-200 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />{r.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">Amount to Add</label>
            <input
              value={restockAmount}
              onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
              type="number"
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setRestockTarget(null)} className="btn-ghost">Cancel</button>
            <button onClick={handleRestock} className="btn-primary flex items-center gap-2">
              <Package className="w-4 h-4" /> Restock Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal open={!!transferTarget} onClose={() => setTransferTarget(null)} title={`${transferMode === 'supplies' ? 'Transfer Supplies' : 'Redirect Evacuees'}: ${transferTarget?.name || ''}`}>
        <div className="space-y-4">
          {transferMode === 'supplies' && (
            <div>
              <label className="text-xs text-navy-200 font-medium mb-1 block">Resource</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'foodKits', label: 'Food Kits' },
                  { key: 'medicineKits', label: 'Medicine' },
                  { key: 'water', label: 'Water (L)' },
                ] as const).map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setTransferResource(r.key)}
                    className={`p-3 rounded-lg text-xs font-semibold transition-all ${
                      transferResource === r.key ? 'bg-navy-500/40 text-white border border-navy-400/30' : 'bg-navy-700/30 text-navy-200 border border-transparent'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">
              {transferMode === 'supplies' ? 'Transfer To' : 'Redirect To'}
            </label>
            <select
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              className="w-full bg-navy-800/60 border border-navy-500/20 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-navy-400"
            >
              <option value="">Select shelter...</option>
              {shelters.filter((s) => s.id !== transferTarget?.id).map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-navy-200 font-medium mb-1 block">
              {transferMode === 'supplies' ? 'Amount' : 'Number of People'}
            </label>
            <input
              value={transferAmount}
              onChange={(e) => setTransferAmount(parseInt(e.target.value) || 0)}
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
