import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from '@/hooks/use-toast';
import { fetchConflictEvents, ConflictEvent } from '@/services/newsApi';

interface WorldMapProps {
  viewMode: 'conflict' | 'fatalities';
  searchQuery: string;
  filters: {
    stateViolence: boolean;
    nonStateViolence: boolean;
    oneSidedViolence: boolean;
  };
}

export const WorldMap = ({ viewMode, searchQuery, filters }: WorldMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [conflictEvents, setConflictEvents] = useState<ConflictEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ConflictEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch conflict events
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      const events = await fetchConflictEvents(filters);
      setConflictEvents(events);
      setIsLoading(false);
    };
    loadEvents();
  }, [filters]);

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

    // Add markers for conflict events
    conflictEvents.forEach((event) => {
      const categoryColors = {
        stateViolence: '#ef4444',
        nonStateViolence: '#3b82f6',
        oneSidedViolence: '#f59e0b'
      };
      
      const iconColor = categoryColors[event.category];
      const size = viewMode === 'fatalities' && event.fatalities 
        ? Math.min(Math.max(event.fatalities / 10 + 8, 8), 24)
        : 12;
      
      const conflictIcon = L.divIcon({
        className: 'custom-conflict-icon',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${iconColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            cursor: pointer;
            transition: all 0.3s;
          ">
            <div style="
              width: ${size * 0.4}px;
              height: ${size * 0.4}px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([event.location.lat, event.location.lng], { 
        icon: conflictIcon 
      });

      marker.on('click', () => {
        setSelectedEvent(event);
        map.setView([event.location.lat, event.location.lng], 6);
        
        toast({
          title: event.title,
          description: `${event.location.country} - ${event.date}`,
        });
      });

      const categoryLabels = {
        stateViolence: 'State-Based Violence',
        nonStateViolence: 'Non-State Violence',
        oneSidedViolence: 'One-Sided Violence'
      };

      marker.bindPopup(`
        <div class="conflict-popup" style="min-width: 200px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${event.title}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Location:</strong> ${event.location.country}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Date:</strong> ${event.date}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Type:</strong> ${categoryLabels[event.category]}</div>
          ${event.fatalities ? `<div style="font-size: 12px; margin-bottom: 8px;"><strong>Est. Fatalities:</strong> ${event.fatalities}</div>` : ''}
          ${event.summary ? `<div style="font-size: 11px; color: #666; margin-top: 8px; line-height: 1.4;">${event.summary.substring(0, 150)}...</div>` : ''}
        </div>
      `);

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Cleanup
    return () => {
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [viewMode, conflictEvents, toast]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery || !mapRef.current || conflictEvents.length === 0) return;

    const query = searchQuery.toLowerCase();
    const foundEvent = conflictEvents.find(
      event =>
        event.location.country.toLowerCase().includes(query) ||
        event.title.toLowerCase().includes(query)
    );

    if (foundEvent) {
      mapRef.current.setView([foundEvent.location.lat, foundEvent.location.lng], 6);
      toast({
        title: "Conflict Found",
        description: `${foundEvent.location.country} - ${foundEvent.title}`,
      });
    }
  }, [searchQuery, conflictEvents, toast]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute top-4 left-4 z-[1000] bg-card border border-border rounded px-3 py-2 text-sm">
          Loading conflict data...
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" style={{ background: 'hsl(var(--map-water))' }} />
      {selectedEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-card border border-border rounded-lg p-4 max-w-md">
          <h3 className="font-semibold text-sm mb-2">{selectedEvent.title}</h3>
          <div className="text-xs space-y-1 text-muted-foreground">
            <div><strong>Location:</strong> {selectedEvent.location.country}</div>
            <div><strong>Date:</strong> {selectedEvent.date}</div>
            {selectedEvent.fatalities && (
              <div><strong>Estimated Fatalities:</strong> {selectedEvent.fatalities}</div>
            )}
          </div>
          <button 
            onClick={() => setSelectedEvent(null)}
            className="mt-3 text-xs text-primary hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};