/*
# RescueOS - Core Database Tables

## Purpose
Creates the four main data tables for the RescueOS emergency coordination platform:
shelters, hospitals, volunteers, and rescue_requests. Also creates an activity_logs
table for the audit trail. This is a single-tenant app with no sign-in, so all
policies allow both anon and authenticated roles to perform full CRUD.

## New Tables
1. `shelters` - Relief camp / shelter information with capacity, occupancy, and resource stock
2. `hospitals` - Hospital data with bed counts, ICU beds, and ambulance availability
3. `volunteers` - Volunteer roster with skills, status, and zone assignment
4. `rescue_requests` - Incoming rescue requests with priority, status, and volunteer assignment
5. `activity_logs` - Audit trail of all actions taken in the system

## Security
- RLS enabled on all tables
- All tables use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a single-tenant no-auth app where all data is intentionally shared
*/

-- Shelters
CREATE TABLE IF NOT EXISTS shelters (
  id text PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  occupied integer NOT NULL DEFAULT 0,
  food_kits integer NOT NULL DEFAULT 0,
  medicine_kits integer NOT NULL DEFAULT 0,
  water integer NOT NULL DEFAULT 0,
  manager text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_shelters" ON shelters;
CREATE POLICY "anon_select_shelters" ON shelters FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_shelters" ON shelters;
CREATE POLICY "anon_insert_shelters" ON shelters FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_shelters" ON shelters;
CREATE POLICY "anon_update_shelters" ON shelters FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_shelters" ON shelters;
CREATE POLICY "anon_delete_shelters" ON shelters FOR DELETE
  TO anon, authenticated USING (true);

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id text PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  total_beds integer NOT NULL DEFAULT 0,
  available_beds integer NOT NULL DEFAULT 0,
  icu_beds integer NOT NULL DEFAULT 0,
  ambulances integer NOT NULL DEFAULT 0,
  contact text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hospitals" ON hospitals;
CREATE POLICY "anon_select_hospitals" ON hospitals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hospitals" ON hospitals;
CREATE POLICY "anon_insert_hospitals" ON hospitals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hospitals" ON hospitals;
CREATE POLICY "anon_update_hospitals" ON hospitals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hospitals" ON hospitals;
CREATE POLICY "anon_delete_hospitals" ON hospitals FOR DELETE
  TO anon, authenticated USING (true);

-- Volunteers
CREATE TABLE IF NOT EXISTS volunteers (
  id text PRIMARY KEY,
  name text NOT NULL,
  skill text NOT NULL DEFAULT 'First Aid',
  status text NOT NULL DEFAULT 'available',
  assigned_to text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  phone text NOT NULL DEFAULT '',
  zone text NOT NULL DEFAULT 'Zone A',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_volunteers" ON volunteers;
CREATE POLICY "anon_select_volunteers" ON volunteers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_volunteers" ON volunteers;
CREATE POLICY "anon_insert_volunteers" ON volunteers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_volunteers" ON volunteers;
CREATE POLICY "anon_update_volunteers" ON volunteers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_volunteers" ON volunteers;
CREATE POLICY "anon_delete_volunteers" ON volunteers FOR DELETE
  TO anon, authenticated USING (true);

-- Rescue Requests
CREATE TABLE IF NOT EXISTS rescue_requests (
  id text PRIMARY KEY,
  location text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  type text NOT NULL,
  people integer NOT NULL DEFAULT 0,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  time text NOT NULL,
  assigned_volunteer text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rescue_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_requests" ON rescue_requests;
CREATE POLICY "anon_select_requests" ON rescue_requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_requests" ON rescue_requests;
CREATE POLICY "anon_insert_requests" ON rescue_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_requests" ON rescue_requests;
CREATE POLICY "anon_update_requests" ON rescue_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_requests" ON rescue_requests;
CREATE POLICY "anon_delete_requests" ON rescue_requests FOR DELETE
  TO anon, authenticated USING (true);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id text PRIMARY KEY,
  action text NOT NULL,
  detail text NOT NULL,
  category text NOT NULL DEFAULT 'system',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_activity" ON activity_logs;
CREATE POLICY "anon_select_activity" ON activity_logs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_activity" ON activity_logs;
CREATE POLICY "anon_insert_activity" ON activity_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_activity" ON activity_logs;
CREATE POLICY "anon_delete_activity" ON activity_logs FOR DELETE
  TO anon, authenticated USING (true);
