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
  // Original streams
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
  { id: '14', code: 'UNNT', name: 'Novosibirsk Airport', url: 'https://s1-fmt2.liveatc.net/unnt', position: [55.0126, 82.6507] },
  { id: '15', code: 'OPLA', name: 'Lahore Airport', url: 'https://s1-bos.liveatc.net/opla_atis', position: [31.5217, 74.4036] },
  { id: '16', code: 'OPKC', name: 'Karachi Airport', url: 'https://s1-bos.liveatc.net/opkc', position: [24.9065, 67.1608] },
  { id: '17', code: 'LBPD', name: 'Plovdiv Airport', url: 'https://s1-bos.liveatc.net/lbsf2_lbpd_twr', position: [42.0678, 24.8508] },
  { id: '18', code: 'HAAB', name: 'Addis Ababa Airport', url: 'https://s1-bos.liveatc.net/haab2_twr', position: [8.9779, 38.7989] },
  
  // Top 50 popular streams
  { id: '19', code: 'RJAA', name: 'Tokyo Narita', url: 'https://s1-bos.liveatc.net/rjaa', position: [35.7647, 140.3864] },
  { id: '20', code: 'EIDW', name: 'Dublin Airport', url: 'https://s1-bos.liveatc.net/eidw', position: [53.4213, -6.2701] },
  { id: '21', code: 'VHHH', name: 'Hong Kong Airport', url: 'https://s1-bos.liveatc.net/vhhh', position: [22.3080, 113.9185] },
  { id: '22', code: 'KJFK', name: 'New York JFK', url: 'https://s1-bos.liveatc.net/kjfk', position: [40.6413, -73.7781] },
  { id: '23', code: 'RJTT', name: 'Tokyo Haneda', url: 'https://s1-bos.liveatc.net/rjtt', position: [35.5494, 139.7798] },
  { id: '24', code: 'YMML', name: 'Melbourne Airport', url: 'https://s1-bos.liveatc.net/ymml', position: [-37.6690, 144.8410] },
  { id: '25', code: 'KLAX', name: 'Los Angeles LAX', url: 'https://s1-bos.liveatc.net/klax', position: [33.9416, -118.4085] },
  { id: '26', code: 'CYYZ', name: 'Toronto Pearson', url: 'https://s1-bos.liveatc.net/cyyz', position: [43.6777, -79.6248] },
  { id: '27', code: 'KBOS', name: 'Boston Logan', url: 'https://s1-bos.liveatc.net/kbos', position: [42.3656, -71.0096] },
  { id: '28', code: 'LSZH', name: 'Zurich Airport', url: 'https://s1-bos.liveatc.net/lszh', position: [47.4647, 8.5492] },
  { id: '29', code: 'RPLL', name: 'Manila Airport', url: 'https://s1-bos.liveatc.net/rpll', position: [14.5086, 121.0198] },
  { id: '30', code: 'RJOO', name: 'Osaka Itami', url: 'https://s1-bos.liveatc.net/rjoo', position: [34.7855, 135.4384] },
  { id: '31', code: 'KEWR', name: 'Newark Airport', url: 'https://s1-bos.liveatc.net/kewr', position: [40.6895, -74.1745] },
  { id: '32', code: 'EHAM', name: 'Amsterdam Schiphol', url: 'https://s1-bos.liveatc.net/eham', position: [52.3105, 4.7683] },
  { id: '33', code: 'EPWA', name: 'Warsaw Chopin', url: 'https://s1-bos.liveatc.net/epwa', position: [52.1657, 20.9671] },
  { id: '34', code: 'KATL', name: 'Atlanta Hartsfield', url: 'https://s1-bos.liveatc.net/katl', position: [33.6407, -84.4277] },
  { id: '35', code: 'KSFO', name: 'San Francisco', url: 'https://s1-bos.liveatc.net/ksfo', position: [37.6213, -122.3790] },
  { id: '36', code: 'EGLL', name: 'London Heathrow', url: 'https://s1-bos.liveatc.net/egll', position: [51.4700, -0.4543] },
  { id: '37', code: 'EDDF', name: 'Frankfurt Airport', url: 'https://s1-bos.liveatc.net/eddf', position: [50.0379, 8.5622] },
  { id: '38', code: 'LFPG', name: 'Paris Charles de Gaulle', url: 'https://s1-bos.liveatc.net/lfpg', position: [49.0097, 2.5479] },
  { id: '39', code: 'LEMD', name: 'Madrid Barajas', url: 'https://s1-bos.liveatc.net/lemd', position: [40.4719, -3.5626] },
  { id: '40', code: 'LIRF', name: 'Rome Fiumicino', url: 'https://s1-bos.liveatc.net/lirf', position: [41.8003, 12.2389] },
  { id: '41', code: 'LEBL', name: 'Barcelona El Prat', url: 'https://s1-bos.liveatc.net/lebl', position: [41.2974, 2.0833] },
  { id: '42', code: 'OMDB', name: 'Dubai Airport', url: 'https://s1-bos.liveatc.net/omdb', position: [25.2532, 55.3657] },
  { id: '43', code: 'WSSS', name: 'Singapore Changi', url: 'https://s1-bos.liveatc.net/wsss', position: [1.3644, 103.9915] },
  { id: '44', code: 'YSSY', name: 'Sydney Airport', url: 'https://s1-bos.liveatc.net/yssy', position: [-33.9399, 151.1753] },
  { id: '45', code: 'ZBAA', name: 'Beijing Capital', url: 'https://s1-bos.liveatc.net/zbaa', position: [40.0801, 116.5846] },
  { id: '46', code: 'RJBB', name: 'Osaka Kansai', url: 'https://s1-bos.liveatc.net/rjbb', position: [34.4347, 135.2440] },
  { id: '47', code: 'VIDP', name: 'Delhi Airport', url: 'https://s1-bos.liveatc.net/vidp', position: [28.5562, 77.1000] },
  { id: '48', code: 'VABB', name: 'Mumbai Airport', url: 'https://s1-bos.liveatc.net/vabb', position: [19.0896, 72.8656] },
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
    </div>
  );
};