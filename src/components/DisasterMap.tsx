import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Shelter, Hospital, Volunteer, RescueRequest } from '../types';
import { chennaiCenter } from '../data';

interface Props {
  shelters: Shelter[];
  hospitals: Hospital[];
  volunteers: Volunteer[];
  requests: RescueRequest[];
  height?: string;
}

function createDivIcon(color: string, innerHTML: string, size: number = 28) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:${size}px;height:${size}px;background:${color};display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:14px;">${innerHTML}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const shelterIcon = createDivIcon('#22c55e', '&#9761;', 28);
const hospitalIcon = createDivIcon('#ef4444', '&#10013;', 28);
const volunteerIcon = createDivIcon('#3b82f6', '&#9679;', 22);
const requestCriticalIcon = createDivIcon('#f97316', '&#9888;', 30);
const requestHighIcon = createDivIcon('#eab308', '&#9888;', 26);

export default function DisasterMap({ shelters, hospitals, volunteers, requests, height = '400px' }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [chennaiCenter.lat, chennaiCenter.lng],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous layers - use a layer group
    const layerGroup = L.layerGroup().addTo(map);

    shelters.forEach((s) => {
      const occRate = Math.round((s.occupied / s.capacity) * 100);
      const marker = L.marker([s.lat, s.lng], { icon: shelterIcon }).addTo(layerGroup);
      marker.bindPopup(`
        <div style="min-width:180px;">
          <div style="font-weight:700;font-size:14px;color:#22c55e;margin-bottom:4px;">${s.name}</div>
          <div style="font-size:11px;color:#9ab4d4;margin-bottom:8px;">${s.location}</div>
          <div style="font-size:12px;">Occupancy: <b>${s.occupied}/${s.capacity}</b> (${occRate}%)</div>
          <div style="font-size:12px;">Food Kits: ${s.foodKits} | Medicine: ${s.medicineKits}</div>
          <div style="font-size:12px;">Manager: ${s.manager}</div>
        </div>
      `);
    });

    hospitals.forEach((h) => {
      const marker = L.marker([h.lat, h.lng], { icon: hospitalIcon }).addTo(layerGroup);
      marker.bindPopup(`
        <div style="min-width:180px;">
          <div style="font-weight:700;font-size:14px;color:#ef4444;margin-bottom:4px;">${h.name}</div>
          <div style="font-size:11px;color:#9ab4d4;margin-bottom:8px;">${h.location}</div>
          <div style="font-size:12px;">Beds: <b>${h.availableBeds}/${h.totalBeds}</b></div>
          <div style="font-size:12px;">ICU: ${h.icuBeds} | Ambulances: ${h.ambulances}</div>
        </div>
      `);
    });

    volunteers
      .filter((v) => v.status !== 'offline')
      .forEach((v) => {
        const marker = L.marker([v.lat, v.lng], { icon: volunteerIcon }).addTo(layerGroup);
        marker.bindPopup(`
          <div style="min-width:150px;">
            <div style="font-weight:700;font-size:14px;color:#3b82f6;">${v.name}</div>
            <div style="font-size:12px;">Skill: ${v.skill}</div>
            <div style="font-size:12px;">Status: ${v.status}</div>
            <div style="font-size:12px;">Zone: ${v.zone}</div>
          </div>
        `);
      });

    requests
      .filter((r) => r.status !== 'resolved')
      .forEach((r) => {
        const icon = r.priority === 'critical' ? requestCriticalIcon : requestHighIcon;
        const marker = L.marker([r.lat, r.lng], { icon }).addTo(layerGroup);
        marker.bindPopup(`
          <div style="min-width:180px;">
            <div style="font-weight:700;font-size:14px;color:#f97316;margin-bottom:4px;">${r.type}</div>
            <div style="font-size:11px;color:#9ab4d4;margin-bottom:8px;">${r.location}</div>
            <div style="font-size:12px;">People: <b>${r.people}</b></div>
            <div style="font-size:12px;">Priority: <b style="color:${r.priority === 'critical' ? '#ef4444' : '#eab308'};">${r.priority.toUpperCase()}</b></div>
            <div style="font-size:12px;">Status: ${r.status}</div>
          </div>
        `);
      });

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [shelters, hospitals, volunteers, requests]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
}
