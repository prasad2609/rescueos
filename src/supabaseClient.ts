import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mapping helpers between snake_case DB rows and camelCase app types

export interface ShelterRow {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  capacity: number;
  occupied: number;
  food_kits: number;
  medicine_kits: number;
  water: number;
  manager: string;
  phone: string;
}

export interface HospitalRow {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  total_beds: number;
  available_beds: number;
  icu_beds: number;
  ambulances: number;
  contact: string;
}

export interface VolunteerRow {
  id: string;
  name: string;
  skill: string;
  status: string;
  assigned_to: string | null;
  lat: number;
  lng: number;
  phone: string;
  zone: string;
}

export interface RequestRow {
  id: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  people: number;
  priority: string;
  status: string;
  time: string;
  assigned_volunteer: string | null;
  notes: string | null;
}

export interface ActivityLogRow {
  id: string;
  action: string;
  detail: string;
  category: string;
  created_at: string;
}
