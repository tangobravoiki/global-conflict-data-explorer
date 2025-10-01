import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ATCStream {
  id: string;
  code: string;
  name: string;
  url: string;
  position: [number, number];
}

const atcStreams: ATCStream[] = [
  { id: '1', code: 'LROP', name: 'Bucharest Henri Coandă', url: 'https://s1-fmt2.liveatc.net/lrop2', position: [44.5722, 26.1021] },
  { id: '2', code: 'LRBV', name: 'Bucharest Aurel Vlaicu', url: 'https://s1-bos.liveatc.net/lrbv2', position: [44.5031, 26.1022] },
  { id: '3', code: 'LRSB', name: 'Sibiu Airport', url: 'https://s1-bos.liveatc.net/lrsb2', position: [45.7856, 24.0913] },
  { id: '4', code: 'LBSF', name: 'Sofia Airport', url: 'https://s1-bos.liveatc.net/lbsf1', position: [42.6952, 23.4114] },
  { id: '5', code: 'LYNI', name: 'Niš Airport', url: 'https://s1-bos.liveatc.net/lyni2', position: [43.3373, 21.8537] },
  { id: '6', code: 'LLHZ', name: 'Haifa Airport', url: 'https://s1-bos.liveatc.net/llhz2_twr', position: [32.8094, 35.0431] },
  { id: '7', code: 'LTBA', name: 'Istanbul Airport', url: 'https://s1-fmt2.liveatc.net/ltba_s', position: [41.2753, 28.7519] },
  { id: '8', code: 'LWSK', name: 'Skopje Airport', url: 'https://s1-fmt2.liveatc.net/lwsk2_2', position: [41.9617, 21.6214] },
  { id: '9', code: 'OKBK', name: 'Kuwait Airport', url: 'https://s1-bos.liveatc.net/okbk2', position: [29.2267, 47.9689] },
  { id: '10', code: 'LTFJ', name: 'Istanbul Sabiha Gökçen', url: 'https://s1-fmt2.liveatc.net/ltfj2', position: [40.8986, 29.3092] },
  { id: '11', code: 'LGAV', name: 'Athens Airport', url: 'https://s1-fmt2.liveatc.net/lgav2', position: [37.9364, 23.9445] },
  { id: '12', code: 'LBBG', name: 'Burgas Airport', url: 'https://s1-bos.liveatc.net/lbbg2', position: [42.5697, 27.5152] },
  { id: '13', code: 'USTR', name: 'Astrakhan Airport', url: 'https://s1-bos.liveatc.net/ustr', position: [46.2833, 48.0063] },
  { id: '14', code: 'UNNT', name: 'Novokuznetsk Airport', url: 'https://s1-fmt2.liveatc.net/unnt', position: [53.8114, 86.8772] },
  { id: '15', code: 'OPLA', name: 'Lahore Airport', url: 'https://s1-bos.liveatc.net/opla_atis', position: [31.5217, 74.4036] },
  { id: '16', code: 'OPKC', name: 'Karachi Airport', url: 'https://s1-bos.liveatc.net/opkc', position: [24.9065, 67.1608] },
  { id: '17', code: 'LBPD', name: 'Plovdiv Airport', url: 'https://s1-bos.liveatc.net/lbsf2_lbpd_twr', position: [42.0678, 24.8508] },
  { id: '18', code: 'HAAB', name: 'Addis Ababa Airport', url: 'https://s1-bos.liveatc.net/haab2_twr', position: [8.9779, 38.7989] },
];


export const WorldMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

    // Add custom plane icon
    const planeIcon = L.divIcon({
      className: 'custom-plane-icon',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.3s;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add markers for each ATC stream
    atcStreams.forEach((stream) => {
      const marker = L.marker(stream.position, { icon: planeIcon });

      marker.on('click', () => {
        setSelectedStream(stream.id);
        
        // Play/stop audio
        if (isPlaying === stream.id) {
          audioRef.current?.pause();
          setIsPlaying(null);
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          audioRef.current = new Audio(stream.url);
          audioRef.current.play();
          setIsPlaying(stream.id);
        }
      });

      marker.bindPopup(`
        <div style="font-size: 14px; min-width: 200px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${stream.code}</div>
          <div style="color: #666; margin-bottom: 8px;">${stream.name}</div>
          <button 
            onclick="window.open('${stream.url}', '_blank')"
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              cursor: pointer;
              width: 100%;
              font-size: 12px;
            "
          >
            🎧 Listen Live
          </button>
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
      
      {/* Info Panel */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-elegant z-[1000] max-w-xs">
        <div className="text-xs font-medium text-foreground mb-2">🎧 Live ATC Streams</div>
        <div className="text-xs text-muted-foreground">
          Click on any airport icon to listen to live air traffic control communications
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-elegant z-[1000]">
        <div className="text-xs font-medium text-foreground mb-2">Airport Locations</div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <span className="text-xs text-muted-foreground">Live ATC Available</span>
        </div>
      </div>
    </div>
  );
};