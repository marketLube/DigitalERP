import React from 'react';
import { SubRoute } from '../../types/sidebar';

interface SidebarFlyoutProps {
  title: string;
  subRoutes: SubRoute[];
  isVisible: boolean;
  position: { top: number };
  onNavigate?: (page: string) => void;
}

const SidebarFlyout: React.FC<SidebarFlyoutProps> = ({ 
  title, 
  subRoutes, 
  isVisible, 
  position,
  onNavigate
}) => {
  const handleRouteClick = (route: SubRoute) => {
    if (onNavigate) {
      // Dashboard routes
      if (route.href.startsWith('/dashboard/')) {
        onNavigate('dashboard');
      }
      
      // Task routes
      else if (route.href === '/tasks/all') {
        onNavigate('taskboard');
      } else if (route.href === '/tasks/notes') {
        onNavigate('taskboard-notes');
      } else if (route.href === '/tasks/my-tasks') {
        onNavigate('taskboard-my-tasks');
      } else if (route.href === '/tasks/calendar') {
        onNavigate('taskboard-calendar');
      } else if (route.href === '/tasks/reports') {
        onNavigate('taskboard-reports');
      } else if (route.href === '/tasks/settings') {
        onNavigate('taskboard-settings');
      } else if (route.href.startsWith('/tasks/')) {
        onNavigate('taskboard'); // Default to main taskboard for other task routes
      }
      
      // Sales routes
      else if (route.href === '/sales/pipeline') {
        onNavigate('sales-pipeline');
      } else if (route.href === '/sales/appointments') {
        onNavigate('sales-appointments');
      } else if (route.href === '/sales/proposals') {
        onNavigate('sales-proposals');
      } else if (route.href === '/sales/analytics') {
        onNavigate('sales-analytics');
      } else if (route.href === '/sales/settings') {
        onNavigate('sales-settings');
      }
      
      // HR routes
      else if (route.href === '/hr/dashboard') {
        onNavigate('hr-dashboard');
      } else if (route.href === '/hr/directory') {
        onNavigate('hr-directory');
      } else if (route.href === '/hr/attendance') {
        onNavigate('hr-attendance');
      } else if (route.href === '/hr/leave') {
        onNavigate('hr-leave');
      } else if (route.href === '/hr/recruitment') {
        onNavigate('hr-recruitment');
      } else if (route.href === '/hr/performance') {
        onNavigate('hr-performance');
      } else if (route.href === '/hr/payroll') {
        onNavigate('hr-payroll');
      } else if (route.href === '/hr/documents') {
        onNavigate('hr-documents');
      } else if (route.href === '/hr/reports') {
        onNavigate('hr-reports');
      } else if (route.href === '/hr/employee-hub') {
        onNavigate('hr-employee-hub');
      } else if (route.href === '/hr/settings') {
        onNavigate('hr-settings');
      }
      
      // Accounting routes
      else if (route.href === '/accounting/dashboard') {
        onNavigate('accounting-dashboard');
      } else if (route.href === '/accounting/daybook') {
        onNavigate('accounting-daybook');
      } else if (route.href === '/accounting/invoices') {
        onNavigate('accounting-invoices');
      } else if (route.href === '/accounting/tax') {
        onNavigate('accounting-tax');
      } else if (route.href === '/accounting/profit-loss') {
        onNavigate('accounting-profit-loss');
      } else if (route.href === '/accounting/settings') {
        onNavigate('accounting-settings');
      }
      
      // Reports routes
      else if (route.href === '/reports/dashboard') {
        onNavigate('reports-dashboard');
      } else if (route.href === '/reports/tasks') {
        onNavigate('reports-tasks');
      } else if (route.href === '/reports/team') {
        onNavigate('reports-team');
      } else if (route.href === '/reports/export') {
        onNavigate('reports-export');
      }
      
      // Settings routes
      else if (route.href === '/settings/general') {
        onNavigate('settings-general');
      } else if (route.href === '/settings/teams') {
        onNavigate('settings-teams');
      } else if (route.href === '/settings/roles') {
        onNavigate('settings-roles');
      } else if (route.href === '/settings/integrations') {
        onNavigate('settings-integrations');
      }
      
      // Test routes
      else if (route.href === '/test/compact') {
        onNavigate('test-compact');
      } else if (route.href === '/test/minimal') {
        onNavigate('test-minimal');
      } else if (route.href === '/test/animated') {
        onNavigate('test-animated');
      }
      
      // Fallback for unknown routes
      else {
        console.warn(`Unknown route: ${route.href}`);
        onNavigate('dashboard');
      }
    }
  };

  return (
    <div
      className={`
        fixed left-16 z-50 bg-white rounded-xl shadow-lg border border-gray-100
        transition-all duration-200 ease-out
        ${isVisible 
          ? 'opacity-100 translate-x-0 scale-100' 
          : 'opacity-0 -translate-x-2 scale-98 pointer-events-none'
        }
      `}
      style={{ top: position.top }}
    >
      <div className="px-4 py-3 max-w-55">
        <h3 className="font-poppins font-semibold text-gray-900 text-sm mb-2">
          {title}
        </h3>
        <nav className="space-y-1">
          {subRoutes.map((route, index) => (
            <button
              key={index}
              onClick={() => handleRouteClick(route)}
              className="
                block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg
                hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150
                font-poppins
              "
            >
              {route.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarFlyout;