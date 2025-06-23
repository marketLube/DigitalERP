import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, FileText, Receipt, PieChart, Calendar, ArrowUpRight, ArrowDownRight, Eye, Download, Plus, Filter, LayoutGrid, BookOpen, BarChart3, Settings } from 'lucide-react';
import InvoicesPage from './InvoicesPage';
import DayBookPage from './DayBookPage';
import ProfitLossPage from './ProfitLossPage';
import TaxCompliancePage from './TaxCompliancePage';

interface QuickStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

interface AccountingDashboardProps {
  initialTab?: 'overview' | 'invoices' | 'daybook' | 'profit-loss' | 'tax-compliance' | 'settings';
  onTabChange?: (tab: string) => void;
  onNavigate?: (page: string) => void;
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ 
  initialTab = 'overview', 
  onTabChange,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'daybook' | 'profit-loss' | 'tax-compliance' | 'settings'>(initialTab);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  // Sync activeTab with initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabSwitch = (tab: 'overview' | 'invoices' | 'daybook' | 'profit-loss' | 'tax-compliance' | 'settings') => {
    setActiveTab(tab);
    if (onTabChange) {
      // Map tab names to page names for routing
      const tabToPageMap = {
        'overview': 'accounting-dashboard',
        'invoices': 'accounting-invoices', 
        'daybook': 'accounting-daybook',
        'profit-loss': 'accounting-profit-loss',
        'tax-compliance': 'accounting-tax',
        'settings': 'accounting-settings'
      };
      onTabChange(tabToPageMap[tab]);
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Accounting';
      case 'invoices':
        return 'Invoices';
      case 'daybook':
        return 'Day Book';
      case 'profit-loss':
        return 'Profit & Loss';
      case 'tax-compliance':
        return 'Tax Compliance';
      case 'settings':
        return 'Settings';
      default:
        return 'Accounting';
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case 'overview':
        return 'Monitor your financial performance and manage accounting operations';
      case 'invoices':
        return 'Create, manage, and track your invoices and payments';
      case 'daybook':
        return 'Record and manage daily financial transactions';
      case 'profit-loss':
        return 'Analyze profit and loss statements for financial insights';
      case 'tax-compliance':
        return 'Manage tax filings, compliance, and regulatory reports';
      case 'settings':
        return 'Configure accounting preferences and system settings';
      default:
        return 'Monitor your financial performance and manage accounting operations';
    }
  };

  const quickStats: QuickStat[] = [
    {
      title: 'Total Revenue',
      value: '$124,562',
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: '$89,234',
      change: '+8.2%',
      changeType: 'negative',
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      title: 'Net Profit',
      value: '$35,328',
      change: '+18.7%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'Outstanding Invoices',
      value: '$18,450',
      change: '-5.3%',
      changeType: 'positive',
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-02-15',
      description: 'Client Payment - TechCorp Project',
      category: 'Revenue',
      amount: 15000,
      type: 'income',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-02-14',
      description: 'Office Rent Payment',
      category: 'Operating Expenses',
      amount: 3500,
      type: 'expense',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-02-13',
      description: 'Software Subscription - Adobe Creative',
      category: 'Software & Tools',
      amount: 599,
      type: 'expense',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-02-12',
      description: 'Freelancer Payment - Design Work',
      category: 'Contractor Fees',
      amount: 2800,
      type: 'expense',
      status: 'pending'
    },
    {
      id: '5',
      date: '2024-02-11',
      description: 'Product Sales - E-commerce',
      category: 'Product Revenue',
      amount: 8750,
      type: 'income',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate new invoice',
      icon: FileText,
      color: 'bg-blue-500',
      onClick: () => handleTabSwitch('invoices')
    },
    {
      title: 'Day Book Entry',
      description: 'Record daily transactions',
      icon: BookOpen,
      color: 'bg-green-500',
      onClick: () => handleTabSwitch('daybook')
    },
    {
      title: 'P&L Report',
      description: 'Profit & Loss analysis',
      icon: BarChart3,
      color: 'bg-orange-500',
      onClick: () => handleTabSwitch('profit-loss')
    },
    {
      title: 'Tax Filing',
      description: 'Tax reports & compliance',
      icon: Receipt,
      color: 'bg-purple-500',
      onClick: () => handleTabSwitch('tax-compliance')
    }
  ];

  const renderOverviewTab = () => (
    <div className="animate-fadeIn">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-poppins font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-poppins text-sm font-medium transition-colors duration-200 flex items-center gap-1">
              <Eye size={14} />
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200 animate-slideUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={16} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-gray-900">
                      {transaction.description}
                    </h4>
                    <p className="text-sm text-gray-500 font-poppins">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-poppins font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs font-poppins px-2 py-1 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-poppins">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header with Tabs in Top Right */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 font-poppins">
              {getPageDescription()}
            </p>
          </div>
          
          {/* Tab Navigation - Top Right */}
          <div className="flex items-center gap-6 border-b border-gray-200 pb-3">
            <button
              onClick={() => handleTabSwitch('overview')}
              className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutGrid size={16} />
              Dashboard
            </button>
            <button
              onClick={() => handleTabSwitch('daybook')}
              className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'daybook' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen size={16} />
              Day Book
            </button>
            <button
              onClick={() => handleTabSwitch('invoices')}
              className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'invoices' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText size={16} />
              Invoices
            </button>
            <button
              onClick={() => handleTabSwitch('tax-compliance')}
              className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'tax-compliance' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Receipt size={16} />
              Tax Compliance
            </button>
            <button
              onClick={() => handleTabSwitch('profit-loss')}
              className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'profit-loss' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 size={16} />
              P&L
            </button>
            <button
              onClick={() => handleTabSwitch('settings')}
              className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'settings' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>

        {/* Overview Summary Stats - Only show on Overview tab */}
        {activeTab === 'overview' && (
          <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 flex-wrap">
                {/* Total Revenue */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-gray-900">
                      $124,562
                    </div>
                    <div className="text-xs text-gray-500">
                      Total Revenue
                    </div>
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown size={16} className="text-red-600" />
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-gray-900">
                      $89,234
                    </div>
                    <div className="text-xs text-gray-500">
                      Total Expenses
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-gray-900">
                      $35,328
                    </div>
                    <div className="text-xs text-gray-500">
                      Net Profit
                    </div>
                  </div>
                </div>

                {/* Outstanding Invoices */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-gray-900">
                      $18,450
                    </div>
                    <div className="text-xs text-gray-500">
                      Outstanding
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
                >
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Quarter">This Quarter</option>
                  <option value="This Year">This Year</option>
                </select>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'daybook' && <DayBookPage onBack={() => handleTabSwitch('overview')} showHeader={false} />}
        {activeTab === 'invoices' && <InvoicesPage onBack={() => handleTabSwitch('overview')} showHeader={false} onNavigate={onNavigate} />}
        {activeTab === 'tax-compliance' && <TaxCompliancePage onBack={() => handleTabSwitch('overview')} showHeader={false} />}
        {activeTab === 'profit-loss' && <ProfitLossPage onBack={() => handleTabSwitch('overview')} showHeader={false} />}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-6">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Fiscal Year Start
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="january">January</option>
                    <option value="april">April</option>
                    <option value="july">July</option>
                    <option value="october">October</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Number Format
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="1,234.56">1,234.56</option>
                    <option value="1.234,56">1.234,56</option>
                    <option value="1 234.56">1 234.56</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-6">Invoice Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Invoice Number Prefix
                  </label>
                  <input 
                    type="text" 
                    defaultValue="INV-"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Default Payment Terms
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="15">Net 15</option>
                    <option value="30">Net 30</option>
                    <option value="45">Net 45</option>
                    <option value="60">Net 60</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Default Tax Rate (%)
                  </label>
                  <input 
                    type="number" 
                    defaultValue="8.25"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Late Fee (%)
                  </label>
                  <input 
                    type="number" 
                    defaultValue="1.5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm font-poppins text-gray-700">Send automatic payment reminders</span>
                </label>
              </div>
            </div>

            {/* Tax Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-6">Tax Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Tax ID Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your tax ID"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Tax Filing Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm font-poppins text-gray-700">Enable automatic tax calculations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm font-poppins text-gray-700">Send tax filing reminders</span>
                </label>
              </div>
            </div>

            {/* Backup & Export */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-6">Backup & Export</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Auto Backup Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins">
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
                  <Download size={16} />
                  Export Data
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200">
                  Backup Now
                </button>
              </div>
            </div>

            {/* Save Changes */}
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-poppins font-medium transition-colors duration-200">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingDashboard;