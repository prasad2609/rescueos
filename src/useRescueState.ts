import { useState, useEffect, useCallback } from 'react';
import type {
  Shelter,
  Hospital,
  Volunteer,
  RescueRequest,
  AIRecommendation,
  Notification,
  ActivityLog,
} from './types';
import {
  initialShelters,
  initialHospitals,
  initialVolunteers,
  initialRequests,
  rescueRequestTypes,
} from './data';
import { generateRecommendations, findBestVolunteerForRequest, findNearestHospital } from './ai';

let notifCounter = 0;
const notifId = () => `n-${Date.now()}-${notifCounter++}`;
let logCounter = 0;
const logId = () => `log-${Date.now()}-${logCounter++}`;

const randomRequestLocations = [
  { name: 'Flooded Area - Ward 5', lat: 12.97 + Math.random() * 0.1, lng: 80.14 + Math.random() * 0.1 },
  { name: 'Stranded Residents - Ward 8', lat: 13.01 + Math.random() * 0.1, lng: 80.22 + Math.random() * 0.1 },
  { name: 'Emergency Evacuation - Ward 15', lat: 12.93 + Math.random() * 0.1, lng: 80.12 + Math.random() * 0.1 },
  { name: 'Rising Water - Ward 3', lat: 13.05 + Math.random() * 0.1, lng: 80.25 + Math.random() * 0.1 },
  { name: 'Medical SOS - Ward 11', lat: 12.99 + Math.random() * 0.1, lng: 80.20 + Math.random() * 0.1 },
  { name: 'Rooftop Rescue - Ward 7', lat: 13.02 + Math.random() * 0.1, lng: 80.28 + Math.random() * 0.1 },
];

const alertMessages = [
  { type: 'alert' as const, title: 'Flood Alert', message: 'Water level rising in Ward 12. Evacuation advised.' },
  { type: 'warning' as const, title: 'Weather Update', message: 'Heavy rainfall expected for next 3 hours.' },
  { type: 'info' as const, title: 'NDRF Deployed', message: '2 teams dispatched to Tambaram zone.' },
  { type: 'alert' as const, title: 'Cyclone Watch', message: 'Depression intensifying off coast. Stay alert.' },
  { type: 'success' as const, title: 'Rescue Complete', message: '15 people evacuated from Velachery safely.' },
  { type: 'warning' as const, title: 'Power Outage', message: 'Grid failure in Zone D. Backup generators active.' },
];

export function useRescueState() {
  const [shelters, setShelters] = useState<Shelter[]>(initialShelters);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [requests, setRequests] = useState<RescueRequest[]>(initialRequests);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [simRunning, setSimRunning] = useState(true);
  const [clock, setClock] = useState(new Date());

  const pushNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    setNotifications((prev) => [
      { id: notifId(), type, title, message, timestamp: Date.now(), read: false },
      ...prev,
    ].slice(0, 30));
  }, []);

  const logActivity = useCallback((action: string, detail: string, category: ActivityLog['category']) => {
    setActivityLog((prev) => [
      { id: logId(), action, detail, timestamp: Date.now(), category },
      ...prev,
    ].slice(0, 50));
  }, []);

  // AI engine
  const runAI = useCallback(() => {
    setRecommendations((prev) => {
      const newRecs = generateRecommendations(shelters, hospitals, volunteers, requests, prev);
      if (newRecs.length > 0) {
        for (const rec of newRecs.slice(0, 2)) {
          pushNotification(
            rec.priority === 'critical' ? 'alert' : 'warning',
            `AI: ${rec.title}`,
            rec.actions[0] || rec.description,
          );
        }
      }
      return [...newRecs, ...prev].slice(0, 50);
    });
  }, [shelters, hospitals, volunteers, requests, pushNotification]);

  // Simulation tick
  useEffect(() => {
    if (!simRunning) return;
    const interval = setInterval(() => {
      setClock(new Date());

      setShelters((prev) =>
        prev.map((s) => {
          if (s.occupied >= s.capacity) return s;
          const increase = Math.random() < 0.35 ? Math.floor(Math.random() * 6) + 1 : 0;
          const newOccupied = Math.min(s.capacity, s.occupied + increase);
          const foodDecrease = increase > 0 ? Math.floor(Math.random() * 4) + 1 : 0;
          return {
            ...s,
            occupied: newOccupied,
            foodKits: Math.max(0, s.foodKits - foodDecrease),
          };
        }),
      );

      setHospitals((prev) =>
        prev.map((h) => {
          const bedChange = Math.random() < 0.2 ? Math.floor(Math.random() * 5) - 2 : 0;
          const newBeds = Math.max(0, Math.min(h.totalBeds, h.availableBeds + bedChange));
          const ambChange = Math.random() < 0.15 ? Math.floor(Math.random() * 3) - 1 : 0;
          const newAmb = Math.max(0, h.ambulances + ambChange);
          return { ...h, availableBeds: newBeds, ambulances: newAmb };
        }),
      );

      if (Math.random() < 0.25) {
        const loc = randomRequestLocations[Math.floor(Math.random() * randomRequestLocations.length)];
        const type = rescueRequestTypes[Math.floor(Math.random() * rescueRequestTypes.length)];
        const priorities: RescueRequest['priority'][] = ['critical', 'high', 'medium', 'low'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const people = Math.floor(Math.random() * 20) + 1;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const newReq: RescueRequest = {
          id: `r-${Date.now()}`,
          location: loc.name,
          lat: loc.lat,
          lng: loc.lng,
          type,
          people,
          priority,
          status: 'pending',
          time: timeStr,
        };
        setRequests((prev) => [newReq, ...prev].slice(0, 30));
        pushNotification('alert', `New Rescue Request`, `${type} at ${loc.name} - ${people} people`);
      }

      if (Math.random() < 0.15) {
        const alert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        pushNotification(alert.type, alert.title, alert.message);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [simRunning, pushNotification]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runAI();
    }, 500);
    return () => clearTimeout(timer);
  }, [runAI]);

  // --- Shelter Actions ---
  const addShelter = useCallback((data: Omit<Shelter, 'id'>) => {
    const newShelter: Shelter = { ...data, id: `s-${Date.now()}` };
    setShelters((prev) => [...prev, newShelter]);
    pushNotification('success', 'Shelter Added', `${newShelter.name} has been registered.`);
    logActivity('Shelter Added', `${newShelter.name} at ${newShelter.location}`, 'shelter');
  }, [pushNotification, logActivity]);

  const updateShelter = useCallback((id: string, data: Partial<Shelter>) => {
    setShelters((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    const shelter = shelters.find((s) => s.id === id);
    if (shelter) {
      logActivity('Shelter Updated', `${shelter.name} details modified`, 'shelter');
    }
  }, [shelters, logActivity]);

  const restockShelter = useCallback((id: string, resource: 'foodKits' | 'medicineKits' | 'water', amount: number) => {
    setShelters((prev) => prev.map((s) =>
      s.id === id ? { ...s, [resource]: s[resource] + amount } : s,
    ));
    const shelter = shelters.find((s) => s.id === id);
    const labels: Record<string, string> = { foodKits: 'food kits', medicineKits: 'medicine kits', water: 'water (L)' };
    if (shelter) {
      pushNotification('success', 'Restocked', `${amount} ${labels[resource]} added to ${shelter.name}`);
      logActivity('Shelter Restocked', `${amount} ${labels[resource]} to ${shelter.name}`, 'shelter');
    }
  }, [shelters, pushNotification, logActivity]);

  const transferSupplies = useCallback((fromId: string, toId: string, resource: 'foodKits' | 'medicineKits' | 'water', amount: number) => {
    setShelters((prev) => prev.map((s) => {
      if (s.id === fromId) return { ...s, [resource]: Math.max(0, s[resource] - amount) };
      if (s.id === toId) return { ...s, [resource]: s[resource] + amount };
      return s;
    }));
    const from = shelters.find((s) => s.id === fromId);
    const to = shelters.find((s) => s.id === toId);
    const labels: Record<string, string> = { foodKits: 'food kits', medicineKits: 'medicine kits', water: 'water (L)' };
    if (from && to) {
      pushNotification('info', 'Supply Transfer', `${amount} ${labels[resource]} from ${from.name} to ${to.name}`);
      logActivity('Supply Transfer', `${amount} ${labels[resource]}: ${from.name} -> ${to.name}`, 'shelter');
    }
  }, [shelters, pushNotification, logActivity]);

  const transferOccupants = useCallback((fromId: string, toId: string, amount: number) => {
    setShelters((prev) => prev.map((s) => {
      if (s.id === fromId) return { ...s, occupied: Math.max(0, s.occupied - amount) };
      if (s.id === toId) return { ...s, occupied: Math.min(s.capacity, s.occupied + amount) };
      return s;
    }));
    const from = shelters.find((s) => s.id === fromId);
    const to = shelters.find((s) => s.id === toId);
    if (from && to) {
      pushNotification('info', 'Evacuee Transfer', `${amount} people redirected from ${from.name} to ${to.name}`);
      logActivity('Evacuee Transfer', `${amount} people: ${from.name} -> ${to.name}`, 'shelter');
    }
  }, [shelters, pushNotification, logActivity]);

  // --- Hospital Actions ---
  const dispatchAmbulance = useCallback((hospitalId: string, requestId: string) => {
    setHospitals((prev) => prev.map((h) =>
      h.id === hospitalId && h.ambulances > 0 ? { ...h, ambulances: h.ambulances - 1 } : h,
    ));
    const hospital = hospitals.find((h) => h.id === hospitalId);
    if (hospital) {
      pushNotification('info', 'Ambulance Dispatched', `${hospital.name} ambulance sent to rescue site`);
      logActivity('Ambulance Dispatched', `From ${hospital.name}`, 'hospital');
    }
  }, [hospitals, pushNotification, logActivity]);

  const transferPatients = useCallback((fromId: string, toId: string, count: number) => {
    setHospitals((prev) => prev.map((h) => {
      if (h.id === fromId) return { ...h, availableBeds: Math.min(h.totalBeds, h.availableBeds + count) };
      if (h.id === toId) return { ...h, availableBeds: Math.max(0, h.availableBeds - count) };
      return h;
    }));
    const from = hospitals.find((h) => h.id === fromId);
    const to = hospitals.find((h) => h.id === toId);
    if (from && to) {
      pushNotification('info', 'Patient Transfer', `${count} patients transferred from ${from.name} to ${to.name}`);
      logActivity('Patient Transfer', `${count} patients: ${from.name} -> ${to.name}`, 'hospital');
    }
  }, [hospitals, pushNotification, logActivity]);

  const reserveIcu = useCallback((hospitalId: string) => {
    setHospitals((prev) => prev.map((h) =>
      h.id === hospitalId && h.icuBeds > 0 ? { ...h, icuBeds: h.icuBeds - 1 } : h,
    ));
    const hospital = hospitals.find((h) => h.id === hospitalId);
    if (hospital) {
      pushNotification('warning', 'ICU Reserved', `1 ICU bed reserved at ${hospital.name} for critical patient`);
      logActivity('ICU Reserved', `1 bed at ${hospital.name}`, 'hospital');
    }
  }, [hospitals, pushNotification, logActivity]);

  const assignNearestHospital = useCallback(() => {
    setHospitals((prev) => {
      const best = findNearestHospital(prev);
      if (best) {
        pushNotification('info', 'Hospital Assigned', `${best.name} selected - ${best.availableBeds} beds available`);
        logActivity('Hospital Auto-Selected', `${best.name} - ${best.availableBeds} beds`, 'hospital');
      }
      return prev;
    });
  }, [pushNotification, logActivity]);

  // --- Volunteer Actions ---
  const addVolunteer = useCallback((data: Omit<Volunteer, 'id'>) => {
    const newVol: Volunteer = { ...data, id: `v-${Date.now()}` };
    setVolunteers((prev) => [...prev, newVol]);
    pushNotification('success', 'Volunteer Added', `${newVol.name} (${newVol.skill}) registered.`);
    logActivity('Volunteer Added', `${newVol.name} - ${newVol.skill}`, 'volunteer');
  }, [pushNotification, logActivity]);

  const unassignVolunteer = useCallback((volunteerId: string) => {
    setVolunteers((prev) => prev.map((v) => {
      if (v.id !== volunteerId || v.status !== 'assigned') return v;
      const reqId = v.assignedTo;
      if (reqId) {
        setRequests((prevReqs) => prevReqs.map((r) =>
          r.id === reqId ? { ...r, status: 'pending' as const, assignedVolunteer: undefined } : r,
        ));
      }
      return { ...v, status: 'available' as const, assignedTo: undefined };
    }));
    const vol = volunteers.find((v) => v.id === volunteerId);
    if (vol) {
      pushNotification('info', 'Volunteer Released', `${vol.name} is now available`);
      logActivity('Volunteer Unassigned', vol.name, 'volunteer');
    }
  }, [volunteers, pushNotification, logActivity]);

  const assignVolunteer = useCallback((requestId: string, volunteerId?: string) => {
    setRequests((prevReqs) => {
      const req = prevReqs.find((r) => r.id === requestId);
      if (!req || req.status !== 'pending') return prevReqs;

      setVolunteers((prevVols) => {
        let chosen: Volunteer | undefined;
        if (volunteerId) {
          chosen = prevVols.find((v) => v.id === volunteerId && v.status === 'available');
        } else {
          chosen = findBestVolunteerForRequest(prevVols, req) || undefined;
        }
        if (!chosen) return prevVols;

        pushNotification('success', 'Volunteer Assigned', `${chosen.name} assigned to ${req.location}`);
        logActivity('Volunteer Assigned', `${chosen.name} -> ${req.location}`, 'volunteer');

        return prevVols.map((v) =>
          v.id === chosen!.id
            ? { ...v, status: 'assigned' as const, assignedTo: requestId }
            : v,
        );
      });

      return prevReqs.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'assigned' as const,
              assignedVolunteer:
                volunteers.find((v) => v.id === volunteerId)?.name ||
                findBestVolunteerForRequest(volunteers, req)?.name ||
                'Auto-assigned',
            }
          : r,
      );
    });
  }, [volunteers, pushNotification, logActivity]);

  const resolveRequest = useCallback((requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'resolved' as const } : r)),
    );
    setVolunteers((prev) =>
      prev.map((v) =>
        v.assignedTo === requestId
          ? { ...v, status: 'available' as const, assignedTo: undefined }
          : v,
      ),
    );
    pushNotification('success', 'Request Resolved', `Rescue operation completed successfully.`);
    logActivity('Request Resolved', `Request ${requestId} marked resolved`, 'request');
  }, [pushNotification, logActivity]);

  // --- Request Actions ---
  const addRequest = useCallback((data: Omit<RescueRequest, 'id' | 'time' | 'status'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newReq: RescueRequest = {
      ...data,
      id: `r-${Date.now()}`,
      time: timeStr,
      status: 'pending',
    };
    setRequests((prev) => [newReq, ...prev].slice(0, 30));
    pushNotification('alert', `New Rescue Request`, `${newReq.type} at ${newReq.location} - ${newReq.people} people`);
    logActivity('Request Created', `${newReq.type} at ${newReq.location}`, 'request');
  }, [pushNotification, logActivity]);

  const escalateRequest = useCallback((requestId: string) => {
    setRequests((prev) => prev.map((r) => {
      if (r.id !== requestId) return r;
      const levels: RescueRequest['priority'][] = ['low', 'medium', 'high', 'critical'];
      const currentIdx = levels.indexOf(r.priority);
      const newPriority = levels[Math.min(levels.length - 1, currentIdx + 1)];
      return { ...r, priority: newPriority };
    }));
    pushNotification('alert', 'Request Escalated', `Priority increased for request ${requestId}`);
    logActivity('Request Escalated', `Request ${requestId} priority raised`, 'request');
  }, [pushNotification, logActivity]);

  const cancelRequest = useCallback((requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    setVolunteers((prev) => prev.map((v) =>
      v.assignedTo === requestId
        ? { ...v, status: 'available' as const, assignedTo: undefined }
        : v,
    ));
    pushNotification('info', 'Request Cancelled', `Request ${requestId} has been cancelled`);
    logActivity('Request Cancelled', `Request ${requestId} removed`, 'request');
  }, [pushNotification, logActivity]);

  // --- AI Actions ---
  const acknowledgeRecommendation = useCallback((recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, acknowledged: true } : r)),
    );
  }, []);

  const executeRecommendation = useCallback((recId: string) => {
    setRecommendations((prev) => {
      const rec = prev.find((r) => r.id === recId);
      if (!rec || rec.executed) return prev;

      // Auto-execute the first actionable item
      if (rec.type === 'cascade' && rec.sourceId) {
        const shelter = shelters.find((s) => s.id === rec.sourceId);
        if (shelter) {
          const safer = shelters
            .filter((s) => s.id !== shelter.id && s.occupied / s.capacity < 0.7)
            .sort((a, b) => a.occupied / a.capacity - b.occupied / b.capacity)[0];
          if (safer) {
            const transferAmount = Math.min(20, shelter.occupied);
            transferOccupants(shelter.id, safer.id, transferAmount);
          }
          const availableVol = volunteers.find((v) => v.status === 'available' && (v.skill === 'Logistics' || v.skill === 'First Aid'));
          if (availableVol) {
            const pendingReq = requests.find((r) => r.status === 'pending');
            if (pendingReq) {
              assignVolunteer(pendingReq.id, availableVol.id);
            }
          }
        }
      } else if (rec.type === 'volunteer' && rec.sourceId) {
        const req = requests.find((r) => r.id === rec.sourceId);
        if (req && req.status === 'pending') {
          assignVolunteer(req.id);
        }
      } else if (rec.type === 'hospital' && rec.sourceId) {
        const hospital = hospitals.find((h) => h.id === rec.sourceId);
        if (hospital && hospital.icuBeds < 3) {
          const reserve = hospitals
            .filter((h) => h.id !== hospital.id && h.icuBeds >= 3)
            .sort((a, b) => b.icuBeds - a.icuBeds)[0];
          if (reserve) {
            reserveIcu(reserve.id);
          }
        }
      } else if (rec.type === 'resource' && rec.sourceId) {
        const shelter = shelters.find((s) => s.id === rec.sourceId);
        if (shelter) {
          if (shelter.foodKits < 50) {
            const donor = shelters.find((s) => s.id !== shelter.id && s.foodKits > 150);
            if (donor) {
              transferSupplies(donor.id, shelter.id, 'foodKits', 20);
            } else {
              restockShelter(shelter.id, 'foodKits', 50);
            }
          }
          if (shelter.medicineKits < 15) {
            restockShelter(shelter.id, 'medicineKits', 20);
          }
        }
      }

      pushNotification('success', 'AI Action Executed', rec.title);
      logActivity('AI Executed', rec.title, 'ai');

      return prev.map((r) => (r.id === recId ? { ...r, executed: true, acknowledged: true } : r));
    });
  }, [shelters, hospitals, volunteers, requests, pushNotification, logActivity, transferOccupants, assignVolunteer, reserveIcu, transferSupplies, restockShelter]);

  const clearAcknowledged = useCallback(() => {
    setRecommendations((prev) => prev.filter((r) => !r.acknowledged));
  }, []);

  const acknowledgeAll = useCallback(() => {
    setRecommendations((prev) => prev.map((r) => ({ ...r, acknowledged: true })));
  }, []);

  // --- Notification Actions ---
  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleSimulation = useCallback(() => {
    setSimRunning((prev) => !prev);
    logActivity('Simulation Toggled', simRunning ? 'Paused' : 'Resumed', 'system');
  }, [simRunning, logActivity]);

  // Derived stats
  const totalShelters = shelters.length;
  const totalOccupied = shelters.reduce((sum, s) => sum + s.occupied, 0);
  const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
  const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);
  const hospitalsAvailable = hospitals.length;
  const volunteersActive = volunteers.filter((v) => v.status === 'assigned').length;
  const volunteersAvailable = volunteers.filter((v) => v.status === 'available').length;
  const activeRequests = requests.filter((r) => r.status === 'pending').length;
  const criticalRequests = requests.filter((r) => r.priority === 'critical' && r.status === 'pending').length;
  const unacknowledgedRecs = recommendations.filter((r) => !r.acknowledged).length;
  const totalFoodKits = shelters.reduce((sum, s) => sum + s.foodKits, 0);
  const totalMedKits = shelters.reduce((sum, s) => sum + s.medicineKits, 0);
  const totalWater = shelters.reduce((sum, s) => sum + s.water, 0);
  const totalBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const totalIcu = hospitals.reduce((sum, h) => sum + h.icuBeds, 0);
  const totalAmbulances = hospitals.reduce((sum, h) => sum + h.ambulances, 0);
  const resolvedRequests = requests.filter((r) => r.status === 'resolved').length;

  return {
    shelters,
    hospitals,
    volunteers,
    requests,
    recommendations,
    notifications,
    activityLog,
    simRunning,
    clock,
    stats: {
      totalShelters,
      totalOccupied,
      totalCapacity,
      occupancyRate,
      hospitalsAvailable,
      volunteersActive,
      volunteersAvailable,
      activeRequests,
      criticalRequests,
      unacknowledgedRecs,
      totalFoodKits,
      totalMedKits,
      totalWater,
      totalBeds,
      totalIcu,
      totalAmbulances,
      resolvedRequests,
    },
    actions: {
      assignVolunteer,
      unassignVolunteer,
      resolveRequest,
      cancelRequest,
      escalateRequest,
      addRequest,
      assignNearestHospital,
      dispatchAmbulance,
      transferPatients,
      reserveIcu,
      addShelter,
      updateShelter,
      restockShelter,
      transferSupplies,
      transferOccupants,
      addVolunteer,
      acknowledgeRecommendation,
      executeRecommendation,
      acknowledgeAll,
      clearAcknowledged,
      markNotificationsRead,
      dismissNotification,
      clearNotifications,
      toggleSimulation,
      pushNotification,
      logActivity,
    },
  };
}

export type RescueState = ReturnType<typeof useRescueState>;
