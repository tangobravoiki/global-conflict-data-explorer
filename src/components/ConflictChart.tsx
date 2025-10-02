import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const conflictData = [
  { year: 1975, stateViolence: 25, nonStateViolence: 15, oneSidedViolence: 8 },
  { year: 1980, stateViolence: 30, nonStateViolence: 18, oneSidedViolence: 10 },
  { year: 1985, stateViolence: 28, nonStateViolence: 22, oneSidedViolence: 12 },
  { year: 1990, stateViolence: 35, nonStateViolence: 25, oneSidedViolence: 15 },
  { year: 1995, stateViolence: 42, nonStateViolence: 30, oneSidedViolence: 18 },
  { year: 2000, stateViolence: 38, nonStateViolence: 35, oneSidedViolence: 22 },
  { year: 2005, stateViolence: 45, nonStateViolence: 40, oneSidedViolence: 25 },
  { year: 2010, stateViolence: 48, nonStateViolence: 38, oneSidedViolence: 28 },
  { year: 2015, stateViolence: 52, nonStateViolence: 42, oneSidedViolence: 30 },
  { year: 2020, stateViolence: 55, nonStateViolence: 45, oneSidedViolence: 32 },
  { year: 2024, stateViolence: 58, nonStateViolence: 48, oneSidedViolence: 35 },
];

interface ConflictChartProps {
  filters: {
    stateViolence: boolean;
    nonStateViolence: boolean;
    oneSidedViolence: boolean;
  };
}

export const ConflictChart = ({ filters }: ConflictChartProps) => {
  return (
    <div className="w-full h-64 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Number of Conflicts</h3>
        <div className="text-sm text-muted-foreground">1975-2024</div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={conflictData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--chart-grid))" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))'
            }}
          />
          
          {filters.stateViolence && (
            <Line
              type="monotone"
              dataKey="stateViolence"
              stroke="hsl(var(--chart-violence))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--chart-violence))' }}
              name="State-Based Violence"
              activeDot={{ r: 5, stroke: 'hsl(var(--chart-violence))', strokeWidth: 2 }}
            />
          )}
          
          {filters.nonStateViolence && (
            <Line
              type="monotone"
              dataKey="nonStateViolence"
              stroke="hsl(var(--chart-nonstate))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--chart-nonstate))' }}
              name="Non-State Violence"
              activeDot={{ r: 5, stroke: 'hsl(var(--chart-nonstate))', strokeWidth: 2 }}
            />
          )}
          
          {filters.oneSidedViolence && (
            <Line
              type="monotone"
              dataKey="oneSidedViolence"
              stroke="hsl(var(--chart-onesided))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--chart-onesided))' }}
              name="One-Sided Violence"
              activeDot={{ r: 5, stroke: 'hsl(var(--chart-onesided))', strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};