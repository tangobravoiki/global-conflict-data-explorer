import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Country {
  id: string;
  name: string;
  conflicts: number;
  position: [number, number];
}

const mockCountries: Country[] = [
  { id: 'syria', name: 'Syria', conflicts: 8, position: [34.8021, 38.9968] },
  { id: 'ukraine', name: 'Ukraine', conflicts: 3, position: [48.3794, 31.1656] },
  { id: 'myanmar', name: 'Myanmar', conflicts: 5, position: [21.9162, 95.9560] },
  { id: 'afghanistan', name: 'Afghanistan', conflicts: 6, position: [33.9391, 67.7100] },
  { id: 'yemen', name: 'Yemen', conflicts: 4, position: [15.5527, 48.5164] },
  { id: 'somalia', name: 'Somalia', conflicts: 5, position: [5.1521, 46.1996] },
  { id: 'ethiopia', name: 'Ethiopia', conflicts: 4, position: [9.1450, 40.4897] },
  { id: 'nigeria', name: 'Nigeria', conflicts: 3, position: [9.0820, 8.6753] },
  { id: 'palestine', name: 'Palestine', conflicts: 7, position: [31.9522, 35.2332] },
  { id: 'iraq', name: 'Iraq', conflicts: 5, position: [33.2232, 43.6793] },
];

const getConflictColor = (conflicts: number) => {
  if (conflicts === 0) return '#94a3b8';
  if (conflicts <= 2) return '#fb923c';
  if (conflicts <= 5) return '#f97316';
  return '#dc2626';
};

const getConflictRadius = (conflicts: number) => {
  return Math.max(8, conflicts * 2);
};

export const WorldMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: false,
    });

    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      opacity: 0.7,
    }).addTo(map);

    // Add markers for each country
    mockCountries.forEach((country) => {
      const marker = L.circleMarker(country.position, {
        radius: getConflictRadius(country.conflicts),
        fillColor: getConflictColor(country.conflicts),
        fillOpacity: 0.7,
        color: '#fff',
        weight: 1,
      });

      marker.on('click', () => {
        setSelectedCountry(prev => prev === country.id ? null : country.id);
        marker.setStyle({
          color: selectedCountry === country.id ? '#fff' : '#3b82f6',
          weight: selectedCountry === country.id ? 1 : 3,
        });
      });

      marker.bindPopup(`
        <div style="font-size: 14px;">
          <div style="font-weight: 600;">${country.name}</div>
          <div style="color: #666;">${country.conflicts} active conflicts</div>
        </div>
      `);

      marker.addTo(map);
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" style={{ background: 'hsl(var(--map-water))' }} />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-elegant z-[1000]">
        <div className="text-xs font-medium text-foreground mb-2">Conflict Intensity</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#94a3b8' }}></div>
            <span className="text-xs text-muted-foreground">No conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fb923c' }}></div>
            <span className="text-xs text-muted-foreground">1-2 conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-xs text-muted-foreground">3-5 conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
            <span className="text-xs text-muted-foreground">6+ conflicts</span>
          </div>
        </div>
      </div>
    </div>
  );
};