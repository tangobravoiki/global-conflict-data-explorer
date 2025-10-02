import { Info, Download, BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const menuItems = [
    { icon: Info, label: 'About', active: true },
    { icon: Download, label: 'API', active: false },
    { icon: Download, label: 'Download', active: false },
    { icon: Calendar, label: '2024', active: false },
    { icon: BarChart3, label: 'Charts', active: false },
  ];

  return (
    <div className={`w-16 bg-sidebar border-r border-sidebar-border flex flex-col ${className}`}>
      {/* Logo/Title */}
      <div className="p-4 border-b border-sidebar-border">
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        <div className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className={`w-full h-12 flex flex-col items-center justify-center gap-1 p-1 text-xs
                ${item.active 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }
              `}
            >
              <item.icon size={16} />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
      
      {/* Uppsala University Logo */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="w-8 h-8 mx-auto">
          <div className="w-full h-full bg-sidebar-accent rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};