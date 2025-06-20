import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TenantHeader from './components/Common/TenantHeader';
import DashboardContent from './components/Dashboard/DashboardContent';
import TeamsPage from './components/Settings/TeamsPage';
import RolesAccessPage from './components/Settings/RolesAccessPage';
import TeamOverview from './components/Teams/TeamOverview';
import StatusManagement from './components/Teams/StatusManagement';
import TaskboardPage from './components/Taskboard/TaskboardPage';
import LeadPipelinePage from './components/Sales/LeadPipelinePage';
import ProposalsPage from './components/Sales/ProposalsPage';
import TeamDirectoryPage from './components/HR/TeamDirectoryPage';
import AttendancePage from './components/HR/AttendancePage';
import HRDashboard from './components/HR/HRDashboard';
import AccountingDashboard from './components/Accounting/AccountingDashboard';
import DayBookPage from './components/Accounting/DayBookPage';
import InvoicesPage from './components/Accounting/InvoicesPage';
import TaxCompliancePage from './components/Accounting/TaxCompliancePage';
import ProfitLossPage from './components/Accounting/ProfitLossPage';
import ReportsDashboard from './components/Reports/ReportsDashboard';
import TaskReportsPage from './components/Reports/TaskReportsPage';
import TeamReportsPage from './components/Reports/TeamReportsPage';
import ExportPage from './components/Reports/ExportPage';
import TestDesigns from './components/Test/TestDesigns';

type PageType = 
  | 'dashboard' 
  | 'taskboard' | 'taskboard-notes' | 'taskboard-my-tasks' | 'taskboard-calendar' | 'taskboard-reports' | 'taskboard-settings'
  | 'sales-pipeline' | 'sales-appointments' | 'sales-proposals' | 'sales-analytics' | 'sales-settings'
  | 'hr-dashboard' | 'hr-directory' | 'hr-attendance' | 'hr-leave' | 'hr-recruitment' | 'hr-performance' | 'hr-payroll' | 'hr-documents' | 'hr-reports' | 'hr-employee-hub' | 'hr-settings'
  | 'accounting-dashboard' | 'accounting-daybook' | 'accounting-invoices' | 'accounting-tax' | 'accounting-profit-loss' | 'accounting-settings'
  | 'reports-dashboard' | 'reports-tasks' | 'reports-team' | 'reports-export'
  | 'settings-general' | 'settings-teams' | 'settings-roles' | 'settings-integrations'
  | 'team-overview' | 'status-management'
  | 'test-compact' | 'test-minimal' | 'test-animated';

interface AppState {
  currentPage: PageType;
  selectedTeamId?: string;
  selectedTeamName?: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'dashboard'
  });

  const navigateToPage = (page: PageType, teamId?: string, teamName?: string) => {
    setAppState({
      currentPage: page,
      selectedTeamId: teamId,
      selectedTeamName: teamName
    });
  };

  const goBackToDashboard = () => {
    setAppState({ currentPage: 'dashboard' });
  };

  const goBackToSettings = () => {
    setAppState({ currentPage: 'settings-teams' });
  };

  const renderContent = () => {
    switch (appState.currentPage) {
      // Dashboard
      case 'dashboard':
        return <DashboardContent />;

      // Taskboard
      case 'taskboard':
        return <TaskboardPage initialTab="tasks" onTabChange={(tab) => navigateToPage(tab as PageType)} />;
      case 'taskboard-notes':
        return <TaskboardPage initialTab="notes" onTabChange={(tab) => navigateToPage(tab as PageType)} />;
      case 'taskboard-my-tasks':
        return <TaskboardPage initialTab="my-tasks" onTabChange={(tab) => navigateToPage(tab as PageType)} />;
      case 'taskboard-calendar':
        return <TaskboardPage initialTab="calendar" onTabChange={(tab) => navigateToPage(tab as PageType)} />;
      case 'taskboard-reports':
        return <TaskboardPage initialTab="reports" onTabChange={(tab) => navigateToPage(tab as PageType)} />;
      case 'taskboard-settings':
        return <TaskboardPage initialTab="settings" onTabChange={(tab) => navigateToPage(tab as PageType)} />;

      // Sales
      case 'sales-pipeline':
        return <LeadPipelinePage defaultTab="pipeline" />;
      case 'sales-appointments':
        return <LeadPipelinePage defaultTab="appointments" />;
      case 'sales-proposals':
        return <LeadPipelinePage defaultTab="proposals" />;
      case 'sales-analytics':
        return <LeadPipelinePage defaultTab="analytics" />;
      case 'sales-settings':
        return <LeadPipelinePage defaultTab="settings" />;

      // HR
      case 'hr-dashboard':
        return <HRDashboard defaultTab="dashboard" />;
      case 'hr-directory':
        return <HRDashboard defaultTab="directory" />;
      case 'hr-attendance':
        return <HRDashboard defaultTab="attendance" />;
      case 'hr-leave':
        return <HRDashboard defaultTab="leave" />;
      case 'hr-recruitment':
        return <HRDashboard defaultTab="recruitment" />;
      case 'hr-performance':
        return <HRDashboard defaultTab="performance" />;
      case 'hr-payroll':
        return <HRDashboard defaultTab="payroll" />;
      case 'hr-documents':
        return <HRDashboard defaultTab="documents" />;
      case 'hr-reports':
        return <HRDashboard defaultTab="reports" />;
      case 'hr-employee-hub':
        return <HRDashboard defaultTab="employee-hub" />;
      case 'hr-settings':
        return <HRDashboard defaultTab="settings" />;

      // Accounting
      case 'accounting-dashboard':
        return <AccountingDashboard onNavigate={(page) => navigateToPage(`accounting-${page}` as PageType)} />;
      case 'accounting-daybook':
        return <DayBookPage onBack={() => navigateToPage('accounting-dashboard')} />;
      case 'accounting-invoices':
        return <InvoicesPage onBack={() => navigateToPage('accounting-dashboard')} />;
      case 'accounting-tax':
        return <TaxCompliancePage onBack={() => navigateToPage('accounting-dashboard')} />;
      case 'accounting-profit-loss':
        return <ProfitLossPage onBack={() => navigateToPage('accounting-dashboard')} />;
      case 'accounting-settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-4">Accounting Settings</h1>
            <p className="text-gray-600 font-poppins">Accounting settings page coming soon...</p>
          </div>
        );

      // Reports
      case 'reports-dashboard':
        return <ReportsDashboard onNavigate={(page) => navigateToPage(`reports-${page}` as PageType)} />;
      case 'reports-tasks':
        return <TaskReportsPage onBack={() => navigateToPage('reports-dashboard')} />;
      case 'reports-team':
        return <TeamReportsPage onBack={() => navigateToPage('reports-dashboard')} />;
      case 'reports-export':
        return <ExportPage onBack={() => navigateToPage('reports-dashboard')} />;

      // Settings
      case 'settings-general':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-4">General Settings</h1>
            <p className="text-gray-600 font-poppins">General settings page coming soon...</p>
          </div>
        );
      case 'settings-teams':
        return (
          <TeamsPage 
            onViewTeam={(teamId, teamName) => navigateToPage('team-overview', teamId, teamName)}
            onManageStatus={(teamId, teamName) => navigateToPage('status-management', teamId, teamName)}
          />
        );
      case 'settings-roles':
        return <RolesAccessPage onBack={goBackToDashboard} />;
      case 'settings-integrations':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-4">Integrations</h1>
            <p className="text-gray-600 font-poppins">Integrations page coming soon...</p>
          </div>
        );

      // Team Management
      case 'team-overview':
        return (
          <TeamOverview 
            teamId={appState.selectedTeamId!}
            onBack={goBackToSettings}
          />
        );
      case 'status-management':
        return (
          <StatusManagement 
            teamId={appState.selectedTeamId!}
            teamName={appState.selectedTeamName!}
            onBack={goBackToSettings}
          />
        );

      // Test Designs
      case 'test-compact':
      case 'test-minimal':
      case 'test-animated':
        return <TestDesigns />;

      default:
        return <DashboardContent />;
    }
  };

  const getCurrentActiveModule = () => {
    const page = appState.currentPage;
    if (page === 'dashboard') return 'dashboard';
    if (page.startsWith('taskboard')) return 'tasks';
    if (page.startsWith('sales')) return 'sales';
    if (page.startsWith('hr')) return 'hr';
    if (page.startsWith('accounting')) return 'accounting';
    if (page.startsWith('reports')) return 'reports';
    if (page.startsWith('settings') || page === 'team-overview' || page === 'status-management') return 'settings';
    if (page.startsWith('test')) return 'test';
    return 'dashboard';
  };

  return (
    <div className="bg-gray-50 font-poppins min-h-screen">
      <Sidebar 
        onNavigate={(page) => navigateToPage(page as PageType)} 
        currentPage={getCurrentActiveModule()}
      />
      <div className="ml-16">
        <TenantHeader />
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;