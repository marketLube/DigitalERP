import React from 'react';
import { sidebarModules } from '../../data/sidebarData';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage = 'dashboard' }) => {
  const getActiveModule = (moduleId: string, currentPage: string) => {
    // Special mapping for modules that have different IDs vs currentPage values
    if (moduleId === 'tasks' && currentPage === 'taskboard') return true;
    if (moduleId === currentPage) return true;
    return false;
  };
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 z-40">
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">D</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="py-4 space-y-2 px-1">
        {sidebarModules.map((module) => (
          <SidebarItem
            key={module.id}
            module={module}
            isActive={getActiveModule(module.id, currentPage)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Bottom Section - Could add user profile or logout */}
      <div className="absolute bottom-4 left-1 right-1">
        <button className="w-14 h-14 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors duration-200">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;