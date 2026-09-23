import type {
  Shelter,
  Hospital,
  Volunteer,
  RescueRequest,
} from './types';

export const initialShelters: Shelter[] = [
  { id: 's1', name: 'REC Hall', location: 'Chromepet, Chennai', lat: 12.9516, lng: 80.1462, capacity: 500, occupied: 420, foodKits: 180, medicineKits: 45, water: 350, manager: 'R. Sundaram', phone: '+91 98400 11111' },
  { id: 's2', name: 'Government School', location: 'Tambaram, Chennai', lat: 12.9258, lng: 80.1218, capacity: 300, occupied: 180, foodKits: 220, medicineKits: 60, water: 400, manager: 'K. Lakshmi', phone: '+91 98400 22222' },
  { id: 's3', name: 'Temple Hall', location: 'Velachery, Chennai', lat: 12.9794, lng: 80.2217, capacity: 200, occupied: 198, foodKits: 30, medicineKits: 10, water: 50, manager: 'S. Murugan', phone: '+91 98400 33333' },
  { id: 's4', name: 'Community Center', location: 'Adyar, Chennai', lat: 13.0012, lng: 80.2555, capacity: 350, occupied: 140, foodKits: 300, medicineKits: 80, water: 500, manager: 'P. Vijaya', phone: '+91 98400 44444' },
  { id: 's5', name: 'St. Marys School', location: 'Guindy, Chennai', lat: 13.0067, lng: 80.2206, capacity: 250, occupied: 95, foodKits: 260, medicineKits: 70, water: 420, manager: 'A. Joseph', phone: '+91 98400 55555' },
  { id: 's6', name: 'Town Hall', location: 'T Nagar, Chennai', lat: 13.0418, lng: 80.2341, capacity: 400, occupied: 310, foodKits: 150, medicineKits: 35, water: 280, manager: 'D. Ramesh', phone: '+91 98400 66666' },
  { id: 's7', name: 'Kalyana Mandapam', location: 'Porur, Chennai', lat: 13.0359, lng: 80.1605, capacity: 280, occupied: 210, foodKits: 190, medicineKits: 50, water: 330, manager: 'V. Kavitha', phone: '+91 98400 77777' },
  { id: 's8', name: 'Govt College Hostel', location: 'Chengalpattu', lat: 12.9234, lng: 79.9750, capacity: 600, occupied: 380, foodKits: 310, medicineKits: 90, water: 600, manager: 'M. Baskar', phone: '+91 98400 88888' },
  { id: 's9', name: 'Marriage Hall', location: 'Kancheepuram', lat: 12.8389, lng: 79.7094, capacity: 320, occupied: 160, foodKits: 240, medicineKits: 65, water: 450, manager: 'T. Geetha', phone: '+91 98400 99999' },
  { id: 's10', name: 'Panchayat Hall', location: 'Ponneri', lat: 13.3204, lng: 80.1973, capacity: 180, occupied: 72, foodKits: 140, medicineKits: 40, water: 220, manager: 'N. Anbu', phone: '+91 98400 10101' },
];

export const initialHospitals: Hospital[] = [
  { id: 'h1', name: 'GH Chennai', location: 'Park Town, Chennai', lat: 13.0827, lng: 80.2785, totalBeds: 200, availableBeds: 32, icuBeds: 6, ambulances: 4, contact: '+91 44 2536 0000' },
  { id: 'h2', name: 'Stanley Medical', location: 'Royapuram, Chennai', lat: 13.1050, lng: 80.2960, totalBeds: 180, availableBeds: 10, icuBeds: 1, ambulances: 2, contact: '+91 44 2526 1234' },
  { id: 'h3', name: 'Apollo Hospitals', location: 'Greams Road, Chennai', lat: 13.0730, lng: 80.2620, totalBeds: 150, availableBeds: 18, icuBeds: 3, ambulances: 5, contact: '+91 44 2829 3333' },
  { id: 'h4', name: 'Kilpauk Medical', location: 'Kilpauk, Chennai', lat: 13.0810, lng: 80.2470, totalBeds: 160, availableBeds: 45, icuBeds: 8, ambulances: 3, contact: '+91 44 2536 4444' },
  { id: 'h5', name: 'Sundaram Medical', location: 'T Nagar, Chennai', lat: 13.0418, lng: 80.2341, totalBeds: 120, availableBeds: 22, icuBeds: 4, ambulances: 3, contact: '+91 44 2434 5555' },
  { id: 'h6', name: 'Chengalpattu GH', location: 'Chengalpattu', lat: 12.9234, lng: 79.9750, totalBeds: 100, availableBeds: 38, icuBeds: 5, ambulances: 2, contact: '+91 44 2726 6666' },
  { id: 'h7', name: 'Kancheepuram GH', location: 'Kancheepuram', lat: 12.8389, lng: 79.7094, totalBeds: 90, availableBeds: 28, icuBeds: 3, ambulances: 1, contact: '+91 44 2722 7777' },
  { id: 'h8', name: 'Ponneri PHC', location: 'Ponneri', lat: 13.3204, lng: 80.1973, totalBeds: 60, availableBeds: 15, icuBeds: 2, ambulances: 1, contact: '+91 44 2799 8888' },
];

export const initialVolunteers: Volunteer[] = [
  { id: 'v1', name: 'Arun Kumar', skill: 'First Aid', status: 'available', lat: 12.9516, lng: 80.1462, phone: '+91 90000 11111', zone: 'Zone A' },
  { id: 'v2', name: 'Priya Sharma', skill: 'Logistics', status: 'available', lat: 12.9258, lng: 80.1218, phone: '+91 90000 22222', zone: 'Zone B' },
  { id: 'v3', name: 'Kumar Raj', skill: 'Rescue', status: 'available', lat: 12.9794, lng: 80.2217, phone: '+91 90000 33333', zone: 'Zone C' },
  { id: 'v4', name: 'Deepa Nair', skill: 'Medical', status: 'available', lat: 13.0012, lng: 80.2555, phone: '+91 90000 44444', zone: 'Zone A' },
  { id: 'v5', name: 'Suresh Babu', skill: 'Rescue', status: 'assigned', assignedTo: 'r3', lat: 13.0067, lng: 80.2206, phone: '+91 90000 55555', zone: 'Zone D' },
  { id: 'v6', name: 'Meena Krishnan', skill: 'First Aid', status: 'available', lat: 13.0418, lng: 80.2341, phone: '+91 90000 66666', zone: 'Zone B' },
  { id: 'v7', name: 'Rajesh Menon', skill: 'Logistics', status: 'available', lat: 13.0359, lng: 80.1605, phone: '+91 90000 77777', zone: 'Zone C' },
  { id: 'v8', name: 'Lakshmi Iyer', skill: 'Medical', status: 'available', lat: 12.9234, lng: 79.9750, phone: '+91 90000 88888', zone: 'Zone E' },
  { id: 'v9', name: 'Vignesh Prabhu', skill: 'Rescue', status: 'available', lat: 12.8389, lng: 79.7094, phone: '+91 90000 99999', zone: 'Zone F' },
  { id: 'v10', name: 'Anitha Ravi', skill: 'First Aid', status: 'available', lat: 13.3204, lng: 80.1973, phone: '+91 90000 10101', zone: 'Zone G' },
  { id: 'v11', name: 'Mohan Das', skill: 'Logistics', status: 'available', lat: 12.9516, lng: 80.1462, phone: '+91 90000 20202', zone: 'Zone A' },
  { id: 'v12', name: 'Saravanan T', skill: 'Rescue', status: 'assigned', assignedTo: 'r7', lat: 13.0827, lng: 80.2785, phone: '+91 90000 30303', zone: 'Zone D' },
  { id: 'v13', name: 'Bhuvana S', skill: 'Medical', status: 'available', lat: 13.1050, lng: 80.2960, phone: '+91 90000 40404', zone: 'Zone B' },
  { id: 'v14', name: 'Karthik V', skill: 'First Aid', status: 'available', lat: 13.0810, lng: 80.2470, phone: '+91 90000 50505', zone: 'Zone C' },
  { id: 'v15', name: 'Divya Menon', skill: 'Logistics', status: 'available', lat: 13.0730, lng: 80.2620, phone: '+91 90000 60606', zone: 'Zone E' },
  { id: 'v16', name: 'Ganesh R', skill: 'Rescue', status: 'available', lat: 13.0418, lng: 80.2341, phone: '+91 90000 70707', zone: 'Zone F' },
  { id: 'v17', name: 'Hema Latha', skill: 'Medical', status: 'available', lat: 12.9794, lng: 80.2217, phone: '+91 90000 80808', zone: 'Zone A' },
  { id: 'v18', name: 'Jeevan K', skill: 'First Aid', status: 'available', lat: 12.9258, lng: 80.1218, phone: '+91 90000 90909', zone: 'Zone B' },
  { id: 'v19', name: 'Kavya R', skill: 'Logistics', status: 'available', lat: 13.0359, lng: 80.1605, phone: '+91 90000 12121', zone: 'Zone C' },
  { id: 'v20', name: 'Naveen S', skill: 'Rescue', status: 'available', lat: 13.0067, lng: 80.2206, phone: '+91 90000 23232', zone: 'Zone D' },
  { id: 'v21', name: 'Oviya P', skill: 'Medical', status: 'available', lat: 12.9234, lng: 79.9750, phone: '+91 90000 34343', zone: 'Zone E' },
  { id: 'v22', name: 'Prakash M', skill: 'First Aid', status: 'available', lat: 12.8389, lng: 79.7094, phone: '+91 90000 45454', zone: 'Zone F' },
  { id: 'v23', name: 'Ramya K', skill: 'Logistics', status: 'available', lat: 13.3204, lng: 80.1973, phone: '+91 90000 56565', zone: 'Zone G' },
  { id: 'v24', name: 'Senthil V', skill: 'Rescue', status: 'available', lat: 12.9516, lng: 80.1462, phone: '+91 90000 67676', zone: 'Zone A' },
  { id: 'v25', name: 'Uma Maheswari', skill: 'Medical', status: 'available', lat: 13.0827, lng: 80.2785, phone: '+91 90000 78787', zone: 'Zone B' },
  { id: 'v26', name: 'Vasanth R', skill: 'First Aid', status: 'available', lat: 13.1050, lng: 80.2960, phone: '+91 90000 89898', zone: 'Zone C' },
  { id: 'v27', name: 'Yamuna S', skill: 'Logistics', status: 'available', lat: 13.0810, lng: 80.2470, phone: '+91 90000 90901', zone: 'Zone D' },
  { id: 'v28', name: 'Bala Murugan', skill: 'Rescue', status: 'available', lat: 13.0730, lng: 80.2620, phone: '+91 90000 90902', zone: 'Zone E' },
  { id: 'v29', name: 'Chitra D', skill: 'Medical', status: 'available', lat: 13.0418, lng: 80.2341, phone: '+91 90000 90903', zone: 'Zone F' },
  { id: 'v30', name: 'Dinesh K', skill: 'First Aid', status: 'available', lat: 12.9794, lng: 80.2217, phone: '+91 90000 90904', zone: 'Zone G' },
];

export const initialRequests: RescueRequest[] = [
  { id: 'r1', location: 'Flooded Street - Ward 12', lat: 12.9616, lng: 80.1562, type: 'Flood Rescue', people: 12, priority: 'critical', status: 'pending', time: '14:32' },
  { id: 'r2', location: 'Collapsed Building - Anna Nagar', lat: 13.0850, lng: 80.2100, type: 'Structural Collapse', people: 5, priority: 'critical', status: 'pending', time: '14:35' },
  { id: 'r3', location: 'Marooned Village - Tambaram', lat: 12.9358, lng: 80.1318, type: 'Flood Rescue', people: 30, priority: 'high', status: 'assigned', time: '14:28', assignedVolunteer: 'Suresh Babu' },
  { id: 'r4', location: 'Tree Fall - Velachery Main Rd', lat: 12.9894, lng: 80.2317, type: 'Debris Clearance', people: 0, priority: 'medium', status: 'pending', time: '14:40' },
  { id: 'r5', location: 'Medical Emergency - Adyar', lat: 13.0112, lng: 80.2655, type: 'Medical Evacuation', people: 2, priority: 'critical', status: 'pending', time: '14:42' },
  { id: 'r6', location: 'Stranded Elderly - Guindy', lat: 13.0167, lng: 80.2306, type: 'Evacuation', people: 8, priority: 'high', status: 'pending', time: '14:44' },
  { id: 'r7', location: 'Flooded Underpass - T Nagar', lat: 13.0518, lng: 80.2441, type: 'Flood Rescue', people: 15, priority: 'high', status: 'assigned', time: '14:30', assignedVolunteer: 'Saravanan T' },
  { id: 'r8', location: 'Power Line Down - Porur', lat: 13.0459, lng: 80.1705, type: 'Electrical Hazard', people: 0, priority: 'medium', status: 'pending', time: '14:46' },
  { id: 'r9', location: 'Boat Rescue - Chengalpattu', lat: 12.9334, lng: 79.9850, type: 'Flood Rescue', people: 25, priority: 'critical', status: 'pending', time: '14:48' },
  { id: 'r10', location: 'Food Shortage - Kancheepuram', lat: 12.8489, lng: 79.7194, type: 'Relief Supply', people: 40, priority: 'high', status: 'pending', time: '14:50' },
  { id: 'r11', location: 'Medical Camp - Ponneri', lat: 13.3304, lng: 80.2073, type: 'Medical Aid', people: 6, priority: 'medium', status: 'pending', time: '14:52' },
  { id: 'r12', location: 'Water Logging - Chromepet', lat: 12.9616, lng: 80.1562, type: 'Flood Rescue', people: 4, priority: 'low', status: 'pending', time: '14:54' },
  { id: 'r13', location: 'Fire Alert - Royapuram', lat: 13.1150, lng: 80.3060, type: 'Fire Response', people: 3, priority: 'high', status: 'pending', time: '14:56' },
  { id: 'r14', location: 'Landslide - Tambaram Hills', lat: 12.9158, lng: 80.1118, type: 'Landslide', people: 7, priority: 'critical', status: 'pending', time: '14:58' },
  { id: 'r15', location: 'Stranded Family - Velachery Lake', lat: 12.9994, lng: 80.2417, type: 'Evacuation', people: 5, priority: 'high', status: 'pending', time: '15:00' },
  { id: 'r16', location: 'Road Cave-in - Guindy Industrial', lat: 13.0267, lng: 80.2406, type: 'Infrastructure', people: 0, priority: 'medium', status: 'pending', time: '15:02' },
  { id: 'r17', location: 'Boat Capsized - Adyar Creek', lat: 13.0212, lng: 80.2755, type: 'Water Rescue', people: 6, priority: 'critical', status: 'pending', time: '15:04' },
  { id: 'r18', location: 'Relief Camp Overflow - Porur', lat: 13.0559, lng: 80.1805, type: 'Crowd Management', people: 50, priority: 'high', status: 'pending', time: '15:06' },
  { id: 'r19', location: 'Medical Supply Needed - Chengalpattu', lat: 12.9434, lng: 79.9950, type: 'Supply Chain', people: 0, priority: 'medium', status: 'pending', time: '15:08' },
  { id: 'r20', location: 'Rooftop Rescue - Kancheepuram', lat: 12.8589, lng: 79.7294, type: 'Flood Rescue', people: 9, priority: 'critical', status: 'pending', time: '15:10' },
];

export const disasterZones = [
  { name: 'Chennai Central', lat: 13.0827, lng: 80.2707, radius: 15000 },
];

export const rescueRequestTypes = [
  'Flood Rescue',
  'Structural Collapse',
  'Medical Evacuation',
  'Evacuation',
  'Debris Clearance',
  'Electrical Hazard',
  'Fire Response',
  'Landslide',
  'Water Rescue',
  'Relief Supply',
];

export const volunteerSkills = [
  'First Aid',
  'Logistics',
  'Rescue',
  'Medical',
];

export const chennaiCenter = { lat: 13.0, lng: 80.2 };
