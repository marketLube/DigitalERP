import { SidebarModule } from '../types/sidebar';

export const sidebarModules: SidebarModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    subRoutes: [
      { name: 'Overview', href: '/dashboard/overview' },
      { name: 'Smart Recommendations', href: '/dashboard/smart-recommendations' },
      { name: 'Team Progress', href: '/dashboard/team-progress' },
      { name: 'Revenue', href: '/dashboard/revenue' },
      { name: 'Quick Stats', href: '/dashboard/quick-stats' }
    ]
  },
  {
    id: 'tasks',
    name: 'Task Board',
    icon: 'ClipboardList',
    subRoutes: [
      { name: 'All Tasks', href: '/tasks/all' },
      { name: 'Notes', href: '/tasks/notes' },
      { name: 'My Tasks', href: '/tasks/my-tasks' },
      { name: 'Calendar', href: '/tasks/calendar' },
      { name: 'Reports', href: '/tasks/reports' },
      { name: 'Settings', href: '/tasks/settings' }
    ]
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: 'TrendingUp',
    subRoutes: [
      { name: 'Lead Pipeline', href: '/sales/pipeline' },
      { name: 'Appointments', href: '/sales/appointments' },
      { name: 'Proposals', href: '/sales/proposals' },
      { name: 'Analytics', href: '/sales/analytics' },
      { name: 'Settings', href: '/sales/settings' }
    ]
  },
  {
    id: 'hr',
    name: 'HR',
    icon: 'Users',
    subRoutes: [
      { name: 'Dashboard', href: '/hr/dashboard' },
      { name: 'Team Directory', href: '/hr/directory' },
      { name: 'Attendance', href: '/hr/attendance' },
      { name: 'Leave', href: '/hr/leave' },
      { name: 'Recruitment', href: '/hr/recruitment' },
      { name: 'Performance', href: '/hr/performance' },
      { name: 'Payroll', href: '/hr/payroll' },
      { name: 'Documents', href: '/hr/documents' },
      { name: 'Reports', href: '/hr/reports' },
      { name: 'Employee Hub', href: '/hr/employee-hub' },
      { name: 'Settings', href: '/hr/settings' }
    ]
  },
  {
    id: 'accounting',
    name: 'Accounting',
    icon: 'Calculator',
    subRoutes: [
      { name: 'Dashboard', href: '/accounting/dashboard' },
      { name: 'Day Book', href: '/accounting/daybook' },
      { name: 'Invoices', href: '/accounting/invoices' },
      { name: 'Tax Compliance', href: '/accounting/tax' },
      { name: 'P&L', href: '/accounting/profit-loss' },
      { name: 'Settings', href: '/accounting/settings' }
    ]
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: 'BarChart3',
    subRoutes: [
      { name: 'Dashboard', href: '/reports/dashboard' },
      { name: 'Task Reports', href: '/reports/tasks' },
      { name: 'Team Reports', href: '/reports/team' },
      { name: 'Export', href: '/reports/export' }
    ]
  },

  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    subRoutes: [
      { name: 'General', href: '/settings/general' },
      { name: 'Teams', href: '/settings/teams' },
      { name: 'Roles & Access', href: '/settings/roles' },
      { name: 'Integrations', href: '/settings/integrations' }
    ]
  },
  {
    id: 'test',
    name: 'Test Designs',
    icon: 'TestTube',
    subRoutes: [
      { name: 'Compact View', href: '/test/compact' },
      { name: 'Minimal View', href: '/test/minimal' },
      { name: 'Animated View', href: '/test/animated' }
    ]
  }
];