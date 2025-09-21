import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SearchHeader } from '@/components/SearchHeader';
import { WorldMap } from '@/components/WorldMap';
import { ConflictChart } from '@/components/ConflictChart';
import { FilterPanel } from '@/components/FilterPanel';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    stateViolence: true,
    nonStateViolence: true,
    oneSidedViolence: true,
  });

  const handleFilterChange = (filter: keyof typeof filters, checked: boolean) => {
    setFilters(prev => ({ ...prev, [filter]: checked }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <SearchHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Map Area */}
          <div className="flex-1 p-4">
            <div className="h-full rounded-lg overflow-hidden shadow-elegant">
              <WorldMap />
            </div>
          </div>
          
          {/* Right Panel */}
          <div className="w-80 p-4 space-y-4">
            <FilterPanel 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
        
        {/* Bottom Chart */}
        <div className="p-4">
          <ConflictChart filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Index;
