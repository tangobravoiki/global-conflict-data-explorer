import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

interface FilterPanelProps {
  filters: {
    stateViolence: boolean;
    nonStateViolence: boolean;
    oneSidedViolence: boolean;
  };
  onFilterChange: (filter: keyof FilterPanelProps['filters'], checked: boolean) => void;
}

export const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const filterOptions = [
    {
      key: 'stateViolence' as const,
      label: 'State-Based Violence',
      color: 'hsl(var(--chart-violence))',
      description: 'Armed conflicts between states or between state and non-state actors'
    },
    {
      key: 'nonStateViolence' as const,
      label: 'Non-State Violence',
      color: 'hsl(var(--chart-nonstate))',
      description: 'Armed conflicts between non-state actors'
    },
    {
      key: 'oneSidedViolence' as const,
      label: 'One-Sided Violence',
      color: 'hsl(var(--chart-onesided))',
      description: 'Intentional attacks on civilians by states or non-state actors'
    },
  ];

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Filter</h3>
      
      <div className="space-y-4">
        {filterOptions.map((option) => (
          <div key={option.key} className="flex items-start space-x-3">
            <Checkbox
              id={option.key}
              checked={filters[option.key]}
              onCheckedChange={(checked) => onFilterChange(option.key, checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor={option.key}
                className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer"
              >
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: option.color }}
                ></div>
                {option.label}
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          <div className="font-medium mb-2">Data Coverage</div>
          <div className="text-xs space-y-1">
            <div>• Temporal: 1975-2024</div>
            <div>• Geographical: Global</div>
            <div>• Threshold: 25+ battle deaths</div>
          </div>
        </div>
      </div>
    </Card>
  );
};