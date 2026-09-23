import { Home, HeartPulse, Users, Siren, Brain, TrendingUp, Activity, ScrollText } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import StatCard from '../components/StatCard';
import DisasterMap from '../components/DisasterMap';
import AIRecommendationCard from '../components/AIRecommendationCard';
import type { RescueState } from '../useRescueState';
import type { ActivityLog } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface Props {
  state: RescueState;
}

const chartColors = {
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  blue: '#3b82f6',
  orange: '#f97316',
  navy: '#1f4a85',
};

const categoryColors: Record<ActivityLog['category'], string> = {
  shelter: 'text-accent-green',
  hospital: 'text-accent-red',
  volunteer: 'text-accent-blue',
  request: 'text-accent-orange',
  ai: 'text-accent-yellow',
  system: 'text-slate-300',
};

export default function Dashboard({ state }: Props) {
  const { shelters, hospitals, volunteers, requests, recommendations, activityLog, stats, actions } = state;

  const criticalShelters = shelters.filter((s) => (s.occupied / s.capacity) >= 0.9);
  const pendingRecs = recommendations.filter((r) => !r.acknowledged && !r.executed).slice(0, 4);

  // Doughnut: request status breakdown
  const requestStatusData = {
    labels: ['Pending', 'Assigned', 'Resolved'],
    datasets: [{
      data: [
        requests.filter((r) => r.status === 'pending').length,
        requests.filter((r) => r.status === 'assigned').length,
        requests.filter((r) => r.status === 'resolved').length,
      ],
      backgroundColor: [chartColors.orange, chartColors.blue, chartColors.green],
      borderWidth: 0,
    }],
  };

  // Bar: hospital bed availability
  const hospitalBedData = {
    labels: hospitals.map((h) => h.name.split(' ')[0]),
    datasets: [
      {
        label: 'Available',
        data: hospitals.map((h) => h.availableBeds),
        backgroundColor: chartColors.green,
        borderRadius: 4,
      },
      {
        label: 'ICU',
        data: hospitals.map((h) => h.icuBeds),
        backgroundColor: chartColors.red,
        borderRadius: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#c5d4e8', font: { size: 11 }, padding: 12, usePointStyle: true },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#c5d4e8', font: { size: 11 }, padding: 12, usePointStyle: true },
      },
    },
    scales: {
      x: { ticks: { color: '#6a8fc0', font: { size: 10 } }, grid: { display: false } },
      y: { ticks: { color: '#6a8fc0', font: { size: 10 } }, grid: { color: 'rgba(31,74,133,0.15)' } },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Home} label="Shelters" value={stats.totalShelters} subValue={`${stats.occupancyRate}% occupied`} color="green" />
        <StatCard icon={HeartPulse} label="Hospitals" value={stats.hospitalsAvailable} subValue={`${stats.totalBeds} beds`} color="red" />
        <StatCard icon={Users} label="Volunteers" value={`${stats.volunteersActive}/${volunteers.length}`} subValue={`${stats.volunteersAvailable} available`} color="blue" />
        <StatCard icon={Siren} label="Active Requests" value={stats.activeRequests} subValue={`${stats.criticalRequests} critical`} color="orange" />
        <StatCard icon={Brain} label="AI Alerts" value={stats.unacknowledgedRecs} subValue="Pending review" color="yellow" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Disaster Response Map</h2>
              <p className="text-xs text-navy-200">Real-time resource and incident tracking</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="status-dot bg-accent-green" /> Shelter</span>
              <span className="flex items-center gap-1.5"><span className="status-dot bg-accent-red" /> Hospital</span>
              <span className="flex items-center gap-1.5"><span className="status-dot bg-accent-blue" /> Volunteer</span>
              <span className="flex items-center gap-1.5"><span className="status-dot bg-accent-orange" /> Request</span>
            </div>
          </div>
          <DisasterMap
            shelters={shelters}
            hospitals={hospitals}
            volunteers={volunteers}
            requests={requests}
            height="380px"
          />
        </div>

        {/* AI Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-base font-bold text-white">AI Recommendations</h2>
            </div>
            <span className="badge badge-yellow">{stats.unacknowledgedRecs} new</span>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {pendingRecs.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <div className="text-sm text-navy-200">All clear. No critical alerts.</div>
              </div>
            ) : (
              pendingRecs.map((rec) => (
                <AIRecommendationCard key={rec.id} recommendation={rec} onAcknowledge={actions.acknowledgeRecommendation} onExecute={actions.executeRecommendation} compact />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Charts + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shelter Occupancy */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-blue" />
              <h2 className="text-base font-bold text-white">Shelter Occupancy Overview</h2>
            </div>
          </div>
          <div className="space-y-3">
            {shelters.map((s) => {
              const rate = Math.round((s.occupied / s.capacity) * 100);
              const color = rate >= 90 ? 'bg-accent-red' : rate >= 75 ? 'bg-accent-yellow' : 'bg-accent-green';
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-slate-200 font-medium truncate">{s.name}</div>
                  <div className="flex-1 progress-track">
                    <div className={`progress-fill ${color}`} style={{ width: `${rate}%` }} />
                  </div>
                  <div className="w-16 text-right text-xs font-mono text-slate-300">{s.occupied}/{s.capacity}</div>
                  <div className="w-10 text-right text-xs font-bold" style={{ color: rate >= 90 ? '#ef4444' : rate >= 75 ? '#eab308' : '#22c55e' }}>{rate}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Alerts Panel */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Siren className="w-5 h-5 text-accent-red" />
            <h2 className="text-base font-bold text-white">Critical Situations</h2>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {criticalShelters.length === 0 && stats.criticalRequests === 0 ? (
              <div className="text-sm text-navy-200 text-center py-4">No critical situations</div>
            ) : (
              <>
                {criticalShelters.map((s) => (
                  <div key={s.id} className="glass-card-flat p-3 border-l-2 border-accent-red animate-glow-red">
                    <div className="text-xs font-bold text-accent-red">{s.name} - {Math.round((s.occupied / s.capacity) * 100)}% full</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{s.occupied}/{s.capacity} occupants</div>
                  </div>
                ))}
                {requests.filter((r) => r.priority === 'critical' && r.status === 'pending').slice(0, 4).map((r) => (
                  <div key={r.id} className="glass-card-flat p-3 border-l-2 border-accent-orange">
                    <div className="text-xs font-bold text-accent-orange">{r.type}</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{r.location} - {r.people} people</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Status Doughnut */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-accent-orange" />
            <h2 className="text-base font-bold text-white">Request Status</h2>
          </div>
          <div style={{ height: '220px' }}>
            <Doughnut data={requestStatusData} options={doughnutOptions} />
          </div>
        </div>

        {/* Hospital Beds Bar Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse className="w-5 h-5 text-accent-red" />
            <h2 className="text-base font-bold text-white">Hospital Bed Availability</h2>
          </div>
          <div style={{ height: '220px' }}>
            <Bar data={hospitalBedData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 text-accent-blue" />
          <h2 className="text-base font-bold text-white">Activity Log</h2>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {activityLog.length === 0 ? (
            <div className="text-sm text-navy-200 text-center py-4">No activity recorded yet.</div>
          ) : (
            activityLog.slice(0, 15).map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-xs glass-card-flat p-2.5">
                <span className={`status-dot ${log.category === 'shelter' ? 'bg-accent-green' : log.category === 'hospital' ? 'bg-accent-red' : log.category === 'volunteer' ? 'bg-accent-blue' : log.category === 'request' ? 'bg-accent-orange' : log.category === 'ai' ? 'bg-accent-yellow' : 'bg-slate-400'}`} />
                <span className={`font-semibold ${categoryColors[log.category]}`}>{log.action}</span>
                <span className="text-slate-300 flex-1 truncate">{log.detail}</span>
                <span className="text-navy-200 text-[10px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
