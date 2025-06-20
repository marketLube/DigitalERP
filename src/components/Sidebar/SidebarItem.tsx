import React, { useState, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { SidebarModule } from '../../types/sidebar';
import SidebarFlyout from './SidebarFlyout';

interface SidebarItemProps {
  module: SidebarModule;
  isActive?: boolean;
  onNavigate?: (page: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ module, isActive = false, onNavigate }) => {
  const [showFlyout, setShowFlyout] = useState(false);
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const itemRef = useRef<HTMLButtonElement>(null);

  // Get the Lucide icon component
  const IconComponent = (LucideIcons as any)[module.icon] || LucideIcons.Square;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setFlyoutPosition({ top: rect.top });
    }
    
    setShowFlyout(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowFlyout(false);
    }, 150);
  };

  const handleFlyoutMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleFlyoutMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowFlyout(false);
    }, 150);
  };

  return (
    <>
      <button
        ref={itemRef}
        className={`
          relative w-14 h-14 flex items-center justify-center rounded-xl
          transition-all duration-200 ease-out group
          ${isActive 
            ? 'bg-blue-50 border-l-2 border-blue-500' 
            : 'hover:bg-gray-50 hover:border-l-2 hover:border-blue-500'
          }
        `}
        title={module.name}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <IconComponent 
          size={22} 
          className={`
            transition-colors duration-200
            ${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}
          `} 
        />
        {isActive && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full" />
        )}
      </button>
      
      <div
        onMouseEnter={handleFlyoutMouseEnter}
        onMouseLeave={handleFlyoutMouseLeave}
      >
        <SidebarFlyout
          title={module.name}
          subRoutes={module.subRoutes}
          isVisible={showFlyout}
          position={flyoutPosition}
          onNavigate={onNavigate}
        />
      </div>
    </>
  );
};

export default SidebarItem;