import { Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchHeader = ({ searchQuery, onSearchChange }: SearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-background border-b border-border">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
      </div>
      
      {/* Search and Controls */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for actors, conflicts, countries..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-80 pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        <Button 
          variant="default" 
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
        >
          COUNTRIES IN CONFLICT VIEW
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          FATALITIES VIEW
        </Button>
        
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};