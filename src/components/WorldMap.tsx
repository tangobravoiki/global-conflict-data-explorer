import { useState } from 'react';

interface Country {
  id: string;
  name: string;
  conflicts: number;
  path: string;
}

const mockCountries: Country[] = [
  { id: 'syria', name: 'Syria', conflicts: 8, path: 'M600,200 L640,190 L650,220 L620,240 Z' },
  { id: 'ukraine', name: 'Ukraine', conflicts: 3, path: 'M550,180 L580,170 L590,190 L570,200 Z' },
  { id: 'myanmar', name: 'Myanmar', conflicts: 5, path: 'M720,280 L740,270 L750,300 L730,310 Z' },
  { id: 'afghanistan', name: 'Afghanistan', conflicts: 6, path: 'M650,220 L680,210 L690,240 L670,250 Z' },
];

export const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const getConflictColor = (conflicts: number) => {
    if (conflicts === 0) return 'hsl(var(--map-land))';
    if (conflicts <= 2) return 'hsl(35 70% 60%)';
    if (conflicts <= 5) return 'hsl(15 80% 55%)';
    return 'hsl(var(--map-conflict))';
  };

  return (
    <div className="relative w-full h-full bg-gradient-map overflow-hidden rounded-lg">
      {/* World Map SVG */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
      >
        {/* Water/Ocean Background */}
        <rect
          width="1000"
          height="500"
          fill="hsl(var(--map-water))"
        />
        
        {/* Simplified World Map Shapes */}
        {/* North America */}
        <path
          d="M50,150 L200,120 L250,180 L200,250 L100,280 L80,220 Z"
          fill="hsl(var(--map-land))"
          stroke="hsl(var(--map-border))"
          strokeWidth="0.5"
        />
        
        {/* South America */}
        <path
          d="M180,280 L220,270 L240,350 L200,420 L160,400 L150,320 Z"
          fill="hsl(var(--map-land))"
          stroke="hsl(var(--map-border))"
          strokeWidth="0.5"
        />
        
        {/* Africa */}
        <path
          d="M480,220 L550,200 L580,300 L560,380 L500,390 L460,320 Z"
          fill="hsl(var(--map-land))"
          stroke="hsl(var(--map-border))"
          strokeWidth="0.5"
        />
        
        {/* Europe */}
        <path
          d="M480,120 L580,110 L590,180 L520,190 L480,160 Z"
          fill="hsl(var(--map-land))"
          stroke="hsl(var(--map-border))"
          strokeWidth="0.5"
        />
        
        {/* Asia */}
        <path
          d="M580,100 L850,90 L900,200 L880,280 L750,300 L650,250 L590,180 Z"
          fill="hsl(var(--map-land))"
          stroke="hsl(var(--map-border))"
          strokeWidth="0.5"
        />
        
        {/* Australia */}
        <path
          d="M750,350 L850,340 L870,380 L820,400 L760,390 Z"
          fill="hsl(var(--map-land))"
          stroke="hsl(var(--map-border))"
          strokeWidth="0.5"
        />
        
        {/* Conflict Countries with Data */}
        {mockCountries.map((country) => (
          <path
            key={country.id}
            d={country.path}
            fill={getConflictColor(country.conflicts)}
            stroke={selectedCountry === country.id ? 'hsl(var(--primary))' : 'hsl(var(--map-border))'}
            strokeWidth={selectedCountry === country.id ? '2' : '0.5'}
            className="cursor-pointer transition-all duration-300 hover:brightness-110"
            onMouseEnter={() => setHoveredCountry(country.id)}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
          />
        ))}
        
        {/* Conflict Markers */}
        {mockCountries.map((country) => (
          <circle
            key={`marker-${country.id}`}
            cx={country.path.match(/M(\d+)/)?.[1] || '0'}
            cy={country.path.match(/M\d+,(\d+)/)?.[1] || '0'}
            r={Math.max(3, country.conflicts)}
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1"
            className="animate-pulse cursor-pointer"
            opacity="0.8"
            onMouseEnter={() => setHoveredCountry(country.id)}
            onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
          />
        ))}
      </svg>
      
      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-elegant">
          {(() => {
            const country = mockCountries.find(c => c.id === hoveredCountry);
            return country ? (
              <div className="text-sm">
                <div className="font-semibold text-foreground">{country.name}</div>
                <div className="text-muted-foreground">
                  {country.conflicts} active conflicts
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
        <div className="text-xs font-medium text-foreground mb-2">Conflict Intensity</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--map-land))' }}></div>
            <span className="text-xs text-muted-foreground">No conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(35 70% 60%)' }}></div>
            <span className="text-xs text-muted-foreground">1-2 conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(15 80% 55%)' }}></div>
            <span className="text-xs text-muted-foreground">3-5 conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--map-conflict))' }}></div>
            <span className="text-xs text-muted-foreground">6+ conflicts</span>
          </div>
        </div>
      </div>
    </div>
  );
};