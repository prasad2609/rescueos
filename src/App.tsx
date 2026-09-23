import { useState } from 'react';
import type { ViewKey } from './types';
import { useRescueState } from './useRescueState';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import Shelters from './pages/Shelters';
import Hospitals from './pages/Hospitals';
import Volunteers from './pages/Volunteers';
import RescueRequests from './pages/RescueRequests';
import AIRecommendations from './pages/AIRecommendations';

export default function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const state = useRescueState();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        active={view}
        onNavigate={setView}
        stats={{
          activeRequests: state.stats.activeRequests,
          unacknowledgedRecs: state.stats.unacknowledgedRecs,
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          notifications={state.notifications}
          onMarkRead={state.actions.markNotificationsRead}
          onDismiss={state.actions.dismissNotification}
          simRunning={state.simRunning}
          onToggleSim={state.actions.toggleSimulation}
          clock={state.clock}
        />

        <main className="flex-1 p-6 overflow-x-hidden">
          {view === 'dashboard' && <Dashboard state={state} />}
          {view === 'shelters' && (
            <Shelters
              shelters={state.shelters}
              onAdd={state.actions.addShelter}
              onRestock={state.actions.restockShelter}
              onTransferSupplies={state.actions.transferSupplies}
              onTransferOccupants={state.actions.transferOccupants}
            />
          )}
          {view === 'hospitals' && (
            <Hospitals
              hospitals={state.hospitals}
              requests={state.requests}
              onAssignNearest={state.actions.assignNearestHospital}
              onDispatchAmbulance={state.actions.dispatchAmbulance}
              onTransferPatients={state.actions.transferPatients}
              onReserveIcu={state.actions.reserveIcu}
            />
          )}
          {view === 'volunteers' && (
            <Volunteers
              volunteers={state.volunteers}
              requests={state.requests}
              onAssign={state.actions.assignVolunteer}
              onAdd={state.actions.addVolunteer}
              onUnassign={state.actions.unassignVolunteer}
            />
          )}
          {view === 'requests' && (
            <RescueRequests
              requests={state.requests}
              volunteers={state.volunteers}
              onAssign={state.actions.assignVolunteer}
              onResolve={state.actions.resolveRequest}
              onAdd={state.actions.addRequest}
              onEscalate={state.actions.escalateRequest}
              onCancel={state.actions.cancelRequest}
            />
          )}
          {view === 'ai' && (
            <AIRecommendations
              recommendations={state.recommendations}
              onAcknowledge={state.actions.acknowledgeRecommendation}
              onExecute={state.actions.executeRecommendation}
              onAcknowledgeAll={state.actions.acknowledgeAll}
              onClearAcknowledged={state.actions.clearAcknowledged}
            />
          )}
        </main>
      </div>

      <ToastContainer notifications={state.notifications} onDismiss={state.actions.dismissNotification} />
    </div>
  );
}
