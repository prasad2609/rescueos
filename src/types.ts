export interface Shelter {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  capacity: number;
  occupied: number;
  foodKits: number;
  medicineKits: number;
  water: number;
  manager: string;
  phone: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  ambulances: number;
  contact: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skill: string;
  status: 'available' | 'assigned' | 'offline';
  assignedTo?: string;
  lat: number;
  lng: number;
  phone: string;
  zone: string;
}

export interface RescueRequest {
  id: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  people: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'assigned' | 'resolved';
  time: string;
  assignedVolunteer?: string;
  notes?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'shelter' | 'hospital' | 'volunteer' | 'cascade' | 'resource';
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  actions: string[];
  sourceId?: string;
  sourceName?: string;
  timestamp: number;
  acknowledged: boolean;
  executed?: boolean;
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  timestamp: number;
  category: 'shelter' | 'hospital' | 'volunteer' | 'request' | 'ai' | 'system';
}

export type ViewKey =
  | 'dashboard'
  | 'shelters'
  | 'hospitals'
  | 'volunteers'
  | 'requests'
  | 'ai';
