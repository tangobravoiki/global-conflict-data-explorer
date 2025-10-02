import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { fetchConflictTrends } from '@/services/newsApi';

interface ConflictChartProps {
  filters: {
    stateViolence: boolean;
    nonStateViolence: boolean;
    oneSidedViolence: boolean;
  };
}

export const ConflictChart = ({ filters }: ConflictChartProps) => {
  const [conflictData, setConflictData] = useState<Array<{
    year: number;
    stateViolence: number;
    nonStateViolence: number;
    oneSidedViolence: number;
  }>>([]);

  useEffect(() => {
    const loadTrends = async () => {
      const trends = await fetchConflictTrends();
      setConflictData(trends);
    };
    loadTrends();
  }, []);

  return (
    <div className="w-full h-64 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Conflict Trends</h3>
        <div className="text-sm text-muted-foreground">2020-2024</div>
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