import type {
  Shelter,
  Hospital,
  Volunteer,
  RescueRequest,
  AIRecommendation,
} from './types';

let recCounter = 0;
const nextRecId = () => `ai-${Date.now()}-${recCounter++}`;

export function generateRecommendations(
  shelters: Shelter[],
  hospitals: Hospital[],
  volunteers: Volunteer[],
  requests: RescueRequest[],
  existing: AIRecommendation[],
): AIRecommendation[] {
  const recs: AIRecommendation[] = [];
  const existingKeys = new Set(
    existing
      .filter((r) => !r.acknowledged)
      .map((r) => `${r.type}-${r.sourceId}-${r.title}`),
  );

  const addRec = (rec: Omit<AIRecommendation, 'id' | 'timestamp' | 'acknowledged'>) => {
    const key = `${rec.type}-${rec.sourceId}-${rec.title}`;
    if (existingKeys.has(key)) return;
    recs.push({
      ...rec,
      id: nextRecId(),
      timestamp: Date.now(),
      acknowledged: false,
    });
  };

  // Shelter overload detection
  for (const shelter of shelters) {
    const occupancyRate = shelter.occupied / shelter.capacity;

    if (occupancyRate >= 0.9) {
      const saferShelter = shelters
        .filter((s) => s.id !== shelter.id && s.occupied / s.capacity < 0.7)
        .sort((a, b) => a.occupied / a.capacity - b.occupied / b.capacity)[0];

      const availableVol = volunteers.find(
        (v) => v.status === 'available' && (v.skill === 'Logistics' || v.skill === 'First Aid'),
      );

      const actions: string[] = [];
      if (saferShelter) {
        actions.push(`Redirect new arrivals to ${saferShelter.name} (${saferShelter.location})`);
      }
      if (availableVol) {
        actions.push(`Dispatch ${availableVol.name} (${availableVol.skill}) to assist transfer`);
      }
      if (shelter.foodKits < 50) {
        const donorShelter = shelters.find((s) => s.id !== shelter.id && s.foodKits > 150);
        if (donorShelter) {
          actions.push(`Transfer 20 food kits from ${donorShelter.name}`);
        }
      }
      if (shelter.medicineKits < 15) {
        actions.push(`Request emergency medicine supply for ${shelter.name}`);
      }

      addRec({
        type: 'cascade',
        priority: occupancyRate >= 0.95 ? 'critical' : 'high',
        title: `${shelter.name} at ${Math.round(occupancyRate * 100)}% capacity`,
        description: `Resource Cascade Protocol triggered for ${shelter.name}. Coordinated response required.`,
        actions,
        sourceId: shelter.id,
        sourceName: shelter.name,
      });
    } else if (occupancyRate >= 0.75) {
      addRec({
        type: 'shelter',
        priority: 'medium',
        title: `${shelter.name} approaching capacity`,
        description: `Occupancy at ${Math.round(occupancyRate * 100)}%. Monitor incoming evacuees.`,
        actions: [`Prepare contingency plan for ${shelter.name}`, 'Alert nearby shelters for overflow'],
        sourceId: shelter.id,
        sourceName: shelter.name,
      });
    }

    if (shelter.foodKits < 50) {
      addRec({
        type: 'resource',
        priority: 'high',
        title: `Critical food shortage at ${shelter.name}`,
        description: `Only ${shelter.foodKits} food kits remaining for ${shelter.occupied} occupants.`,
        actions: ['Dispatch food supply truck', 'Coordinate with NGO partners for emergency rations'],
        sourceId: shelter.id,
        sourceName: shelter.name,
      });
    }
    if (shelter.medicineKits < 15) {
      addRec({
        type: 'resource',
        priority: 'high',
        title: `Medicine shortage at ${shelter.name}`,
        description: `Only ${shelter.medicineKits} medicine kits left. Health risk for evacuees.`,
        actions: ['Request medical supply from district health officer', 'Dispatch pharmacy team'],
        sourceId: shelter.id,
        sourceName: shelter.name,
      });
    }
  }

  // Hospital ICU critical
  for (const hospital of hospitals) {
    if (hospital.icuBeds < 3) {
      const reserveHospital = hospitals
        .filter((h) => h.id !== hospital.id && h.icuBeds >= 3)
        .sort((a, b) => b.icuBeds - a.icuBeds)[0];

      addRec({
        type: 'hospital',
        priority: 'critical',
        title: `ICU beds critical at ${hospital.name}`,
        description: `Only ${hospital.icuBeds} ICU bed(s) available. Reserve for critical patients.`,
        actions: reserveHospital
          ? [`Reserve ${reserveHospital.name} for critical patients (${reserveHospital.icuBeds} ICU beds)`, 'Redirect non-critical cases to other facilities']
          : ['Alert district health authority for ICU support', 'Coordinate inter-hospital transfer'],
        sourceId: hospital.id,
        sourceName: hospital.name,
      });
    }
    if (hospital.availableBeds < 15) {
      addRec({
        type: 'hospital',
        priority: 'high',
        title: `${hospital.name} nearing capacity`,
        description: `Only ${hospital.availableBeds} general beds available.`,
        actions: ['Prepare overflow protocol', 'Coordinate with nearby hospitals for transfers'],
        sourceId: hospital.id,
        sourceName: hospital.name,
      });
    }
  }

  // Pending critical rescue requests
  const criticalPending = requests.filter((r) => r.status === 'pending' && r.priority === 'critical');
  for (const req of criticalPending) {
    const availableVol = volunteers.find(
      (v) => v.status === 'available' && (v.skill === 'Rescue' || v.skill === 'First Aid'),
    );
    addRec({
      type: 'volunteer',
      priority: 'critical',
      title: `Critical rescue: ${req.location}`,
      description: `${req.people} people in danger. ${req.type} requires immediate response.`,
      actions: availableVol
        ? [`Assign ${availableVol.name} (${availableVol.skill}) immediately`, `Dispatch to ${req.location}`]
        : ['No available rescue volunteers - escalate to NDRF', 'Alert district control room'],
      sourceId: req.id,
      sourceName: req.location,
    });
  }

  // High priority pending requests
  const highPending = requests.filter((r) => r.status === 'pending' && r.priority === 'high').slice(0, 3);
  for (const req of highPending) {
    const availableVol = volunteers.find((v) => v.status === 'available');
    addRec({
      type: 'volunteer',
      priority: 'high',
      title: `High priority: ${req.location}`,
      description: `${req.people} people need assistance. ${req.type}.`,
      actions: availableVol
        ? [`Assign ${availableVol.name} (${availableVol.skill})`, `Dispatch to ${req.location}`]
        : ['Queue for next available volunteer'],
      sourceId: req.id,
      sourceName: req.location,
    });
  }

  return recs;
}

export function findNearestHospital(hospitals: Hospital[]): Hospital | null {
  if (hospitals.length === 0) return null;
  return [...hospitals].sort((a, b) => b.availableBeds - a.availableBeds)[0];
}

export function findBestVolunteerForRequest(
  volunteers: Volunteer[],
  request: RescueRequest,
): Volunteer | null {
  const skillPriority: Record<string, string[]> = {
    'Flood Rescue': ['Rescue', 'First Aid'],
    'Medical Evacuation': ['Medical', 'First Aid'],
    Evacuation: ['Rescue', 'Logistics'],
    'Structural Collapse': ['Rescue'],
    'Water Rescue': ['Rescue', 'First Aid'],
    'Fire Response': ['Rescue', 'First Aid'],
    Landslide: ['Rescue'],
    'Debris Clearance': ['Logistics', 'Rescue'],
    'Electrical Hazard': ['Logistics'],
    'Relief Supply': ['Logistics'],
    'Crowd Management': ['Logistics', 'First Aid'],
    'Medical Aid': ['Medical', 'First Aid'],
    'Supply Chain': ['Logistics'],
    Infrastructure: ['Logistics'],
  };

  const preferredSkills = skillPriority[request.type] || ['First Aid'];
  for (const skill of preferredSkills) {
    const vol = volunteers.find((v) => v.status === 'available' && v.skill === skill);
    if (vol) return vol;
  }
  return volunteers.find((v) => v.status === 'available') || null;
}
