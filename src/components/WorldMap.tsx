import { useState } from 'react';

interface Country {
  id: string;
  name: string;
  conflicts: number;
  path: string;
}

interface CountryData extends Country {
  cx: number;
  cy: number;
}

const mockCountries: CountryData[] = [
  { id: 'syria', name: 'Syria', conflicts: 8, path: 'M600,200 L640,190 L650,220 L620,240 Z', cx: 620, cy: 210 },
  { id: 'ukraine', name: 'Ukraine', conflicts: 3, path: 'M520,165 L545,160 L555,175 L540,185 Z', cx: 537, cy: 172 },
  { id: 'myanmar', name: 'Myanmar', conflicts: 5, path: 'M720,250 L740,245 L745,275 L730,285 Z', cx: 735, cy: 265 },
  { id: 'afghanistan', name: 'Afghanistan', conflicts: 6, path: 'M650,220 L680,210 L690,240 L670,250 Z', cx: 670, cy: 230 },
  { id: 'yemen', name: 'Yemen', conflicts: 4, path: 'M590,260 L610,255 L615,275 L600,280 Z', cx: 605, cy: 267 },
  { id: 'somalia', name: 'Somalia', conflicts: 5, path: 'M570,300 L585,295 L595,320 L580,330 Z', cx: 583, cy: 312 },
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
          <g key={`marker-${country.id}`}>
            <circle
              cx={country.cx}
              cy={country.cy}
              r={Math.max(4, country.conflicts * 1.2)}
              fill="hsl(var(--primary))"
              opacity="0.3"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredCountry(country.id)}
              onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
            >
              <animate
                attributeName="r"
                from={Math.max(4, country.conflicts * 1.2)}
                to={Math.max(6, country.conflicts * 1.5)}
                dur="2s"
                repeatCount="indefinite"
                values={`${Math.max(4, country.conflicts * 1.2)};${Math.max(6, country.conflicts * 1.5)};${Math.max(4, country.conflicts * 1.2)}`}
              />
            </circle>
            <circle
              cx={country.cx}
              cy={country.cy}
              r={Math.max(3, country.conflicts)}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="1"
              opacity="0.9"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredCountry(country.id)}
              onClick={() => setSelectedCountry(selectedCountry === country.id ? null : country.id)}
            />
          </g>
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