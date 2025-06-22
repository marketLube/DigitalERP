import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Users, DollarSign, TrendingUp, Clock, Target, Award, 
  CheckCircle, XCircle, AlertTriangle, Calendar, ArrowUp, ArrowDown, 
  Activity, Briefcase, UserPlus, ShoppingCart, FileText, Zap,
  Brain, ChevronRight, Eye, Filter, Download, Lightbulb, TrendingDown,
  PieChart, LineChart, Building, Shield, Star, Heart, Coffee, BookOpen
} from 'lucide-react';
import SmartRecommendationsPage from '../SmartRecommendations/SmartRecommendationsPage';

interface DashboardContentProps {
  defaultTab?: 'overview' | 'smart-recommendations' | 'team-progress' | 'revenue' | 'quick-stats';
}

// Mock data for comprehensive ERP analytics
const mockERPData = {
  // Sales Data
  sales: {
    totalLeads: 156,
    activeDeals: 43,
    monthlyRevenue: 124562,
    conversionRate: 24.8,
    averageDealSize: 2894,
    topPerformer: 'Mike Chen',
    recentDeals: [
      { company: 'TechFlow Inc', value: 15000, status: 'Closed Won', date: '2024-01-19' },
      { company: 'DataCorp Ltd', value: 8500, status: 'Negotiation', date: '2024-01-18' },
      { company: 'InnovateLabs', value: 12000, status: 'Proposal', date: '2024-01-17' }
    ],
    pipeline: {
      'New Leads': 45,
      'Qualified': 28,
      'Proposal': 18,
      'Negotiation': 12,
      'Closed Won': 53
    }
  },
  
  // HR Data
  hr: {
    totalEmployees: 247,
    activeEmployees: 235,
    onLeave: 8,
    newHires: 12,
    pendingApprovals: 6,
    attendanceRate: 94.2,
    topDepartment: 'Engineering',
    upcomingBirthdays: [
      { name: 'Sarah Johnson', date: '2024-01-25', department: 'Engineering' },
      { name: 'Emily Davis', date: '2024-01-28', department: 'Marketing' }
    ],
    departments: {
      'Engineering': 67,
      'Sales': 45,
      'Marketing': 38,
      'Design': 24,
      'HR': 15,
      'Finance': 12,
      'Operations': 28,
      'Support': 18
    }
  },
  
  // Taskboard Data
  taskboard: {
    totalTasks: 342,
    completedTasks: 198,
    inProgressTasks: 89,
    overdueeTasks: 23,
    highPriorityTasks: 45,
    completionRate: 57.9,
    topPerformer: 'Althameem Khan',
    recentActivities: [
      { task: 'Q4 Financial Report', assignee: 'Sarah Johnson', status: 'Completed', priority: 'High' },
      { task: 'Client Proposal Update', assignee: 'Mike Chen', status: 'In Progress', priority: 'Medium' },
      { task: 'Website Redesign', assignee: 'David Kim', status: 'In Progress', priority: 'High' }
    ],
    teamProgress: {
      'Development Team': 85,
      'Marketing Team': 72,
      'Sales Team': 94,
      'Design Team': 68,
      'QA Team': 91
    }
  },
  
  // Accounting Data
  accounting: {
    monthlyRevenue: 124562,
    monthlyExpenses: 78420,
    netProfit: 46142,
    profitMargin: 37.0,
    outstandingInvoices: 23,
    overduePayments: 8,
    cashFlow: 156780,
    recentTransactions: [
      { description: 'Client Payment - TechFlow', amount: 15000, type: 'Income', date: '2024-01-19' },
      { description: 'Office Supplies', amount: -450, type: 'Expense', date: '2024-01-18' },
      { description: 'Software License', amount: -1200, type: 'Expense', date: '2024-01-17' }
    ]
  },
  
  // System Health
  system: {
    activeUsers: 89,
    systemUptime: 99.8,
    storageUsed: 67.2,
    backupStatus: 'Completed',
    lastBackup: '2024-01-20 02:00',
    securityAlerts: 2,
    performanceScore: 94
  }
};

// Smart Recommendations Engine
const generateSmartRecommendations = () => {
  const recommendations = [];
  
  // Sales Recommendations
  if (mockERPData.sales.conversionRate < 30) {
    recommendations.push({
      id: 'sales-1',
      type: 'sales',
      priority: 'high',
      title: 'Improve Lead Conversion',
      description: 'Your conversion rate is 24.8%. Consider implementing lead scoring and nurturing campaigns.',
      action: 'Review lead qualification process',
      impact: 'Could increase revenue by 15-20%',
      icon: TrendingUp,
      color: 'bg-blue-500'
    });
  }
  
  // Task Management Recommendations
  if (mockERPData.taskboard.overdueeTasks > 20) {
    recommendations.push({
      id: 'task-1',
      type: 'taskboard',
      priority: 'high',
      title: 'Address Overdue Tasks',
      description: `You have ${mockERPData.taskboard.overdueeTasks} overdue tasks. Immediate attention required.`,
      action: 'Reassign or extend deadlines',
      impact: 'Improve team productivity',
      icon: Clock,
      color: 'bg-red-500'
    });
  }
  
  // HR Recommendations
  if (mockERPData.hr.pendingApprovals > 5) {
    recommendations.push({
      id: 'hr-1',
      type: 'hr',
      priority: 'medium',
      title: 'Pending HR Approvals',
      description: `${mockERPData.hr.pendingApprovals} items need your approval in HR module.`,
      action: 'Review pending requests',
      impact: 'Keep team processes smooth',
      icon: UserPlus,
      color: 'bg-orange-500'
    });
  }
  
  // Financial Recommendations
  if (mockERPData.accounting.overduePayments > 5) {
    recommendations.push({
      id: 'finance-1',
      type: 'accounting',
      priority: 'high',
      title: 'Overdue Payments Alert',
      description: `${mockERPData.accounting.overduePayments} payments are overdue. Cash flow impact possible.`,
      action: 'Follow up with clients',
      impact: 'Improve cash flow',
      icon: DollarSign,
      color: 'bg-yellow-500'
    });
  }
  
  // Performance Recommendations
  if (mockERPData.taskboard.completionRate < 60) {
    recommendations.push({
      id: 'performance-1',
      type: 'performance',
      priority: 'medium',
      title: 'Task Completion Rate Low',
      description: 'Overall task completion rate is below 60%. Consider workload redistribution.',
      action: 'Analyze team capacity',
      impact: 'Boost team productivity',
      icon: Target,
      color: 'bg-purple-500'
    });
  }
  
  return recommendations.slice(0, 6); // Show top 6 recommendations
};

const DashboardContent: React.FC<DashboardContentProps> = ({ defaultTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'quarter'>('month');
  const [showRecommendations, setShowRecommendations] = useState(true);

  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  if (activeTab === 'smart-recommendations') {
    return <SmartRecommendationsPage />;
  }
  
  const smartRecommendations = useMemo(() => generateSmartRecommendations(), []);
  
  // Key Performance Indicators
  const kpis = [
    {
      title: 'Monthly Revenue',
      value: `$${mockERPData.accounting.monthlyRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'vs last month',
      color: 'bg-green-500'
    },
    {
      title: 'Active Deals',
      value: mockERPData.sales.activeDeals.toString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: Briefcase,
      description: 'in pipeline',
      color: 'bg-blue-500'
    },
    {
      title: 'Team Members',
      value: mockERPData.hr.activeEmployees.toString(),
      change: `+${mockERPData.hr.newHires}`,
      changeType: 'positive',
      icon: Users,
      description: 'new this month',
      color: 'bg-purple-500'
    },
    {
      title: 'Task Completion',
      value: `${mockERPData.taskboard.completionRate}%`,
      change: '+3.1%',
      changeType: 'positive',
      icon: CheckCircle,
      description: 'completion rate',
      color: 'bg-orange-500'
    },
    {
      title: 'Profit Margin',
      value: `${mockERPData.accounting.profitMargin}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'net margin',
      color: 'bg-teal-500'
    },
    {
      title: 'System Health',
      value: `${mockERPData.system.performanceScore}%`,
      change: '+1.8%',
      changeType: 'positive',
      icon: Activity,
      description: 'performance score',
      color: 'bg-indigo-500'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Lightbulb;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
              Executive Dashboard
            </h1>
            <p className="text-gray-600 font-poppins text-lg">
              Welcome back! Here's your business overview with smart insights.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-poppins">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Smart Recommendations Section */}
      {showRecommendations && smartRecommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="text-purple-600" size={24} />
              <h2 className="text-xl font-poppins font-semibold text-gray-900">
                Smart Recommendations
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('smart-recommendations')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-poppins"
              >
                View All
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setShowRecommendations(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartRecommendations.map((rec) => {
              const IconComponent = rec.icon;
              const PriorityIcon = getPriorityIcon(rec.priority);
              
              return (
                <div
                  key={rec.id}
                  className={`bg-white border-l-4 ${getPriorityColor(rec.priority)} rounded-lg p-5 hover:shadow-lg transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 ${rec.color} rounded-lg`}>
                      <IconComponent size={18} className="text-white" />
                    </div>
                    <PriorityIcon size={16} className={`${
                      rec.priority === 'high' ? 'text-red-500' :
                      rec.priority === 'medium' ? 'text-orange-500' :
                      'text-green-500'
                    }`} />
                  </div>
                  
                  <h3 className="font-poppins font-semibold text-gray-900 mb-2">
                    {rec.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 font-poppins mb-3">
                    {rec.description}
                  </p>
                  
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 font-poppins font-medium">
                        {rec.action}
                      </span>
                      <span className="text-gray-500 font-poppins">
                        {rec.impact}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${kpi.color} rounded-xl shadow-lg`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <span className={`text-sm font-poppins font-semibold flex items-center gap-1 ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 
                  kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.changeType === 'positive' ? <ArrowUp size={14} /> : 
                   kpi.changeType === 'negative' ? <ArrowDown size={14} /> : null}
                  {kpi.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900 mb-1">
                  {kpi.value}
                </p>
                <p className="text-sm text-gray-600 font-poppins font-medium">
                  {kpi.title}
                </p>
                <p className="text-xs text-gray-500 font-poppins mt-1">
                  {kpi.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Sales Pipeline Overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">
              Sales Pipeline
            </h3>
            <BarChart3 className="text-blue-600" size={20} />
          </div>
          
          <div className="space-y-3">
            {Object.entries(mockERPData.sales.pipeline).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm font-poppins text-gray-700">{stage}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / 60) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-poppins font-semibold text-gray-900 w-8">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-poppins">
                Total Pipeline Value: <span className="font-semibold text-green-600">$1.6M</span>
              </p>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">
              Team Performance
            </h3>
            <Users className="text-purple-600" size={20} />
          </div>
          
          <div className="space-y-4">
            {Object.entries(mockERPData.taskboard.teamProgress).map(([team, progress]) => (
              <div key={team}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-poppins font-medium text-gray-900">
                    {team}
                  </span>
                  <span className="text-sm font-poppins text-gray-600 font-semibold">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      progress >= 90 ? 'bg-green-500' :
                      progress >= 75 ? 'bg-blue-500' :
                      progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">
              Financial Health
            </h3>
            <DollarSign className="text-green-600" size={20} />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-poppins text-gray-700">Revenue</span>
              <span className="text-lg font-poppins font-bold text-green-600">
                ${mockERPData.accounting.monthlyRevenue.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-poppins text-gray-700">Expenses</span>
              <span className="text-lg font-poppins font-bold text-red-600">
                ${mockERPData.accounting.monthlyExpenses.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-poppins text-gray-700">Net Profit</span>
              <span className="text-lg font-poppins font-bold text-blue-600">
                ${mockERPData.accounting.netProfit.toLocaleString()}
              </span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-poppins text-gray-600">Profit Margin</span>
                <span className="text-sm font-poppins font-semibold text-gray-900">
                  {mockERPData.accounting.profitMargin}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">
              Recent Activities
            </h3>
            <Activity className="text-orange-600" size={20} />
          </div>
          
          <div className="space-y-4">
            {[
              ...mockERPData.taskboard.recentActivities.map(activity => ({
                ...activity,
                type: 'task',
                icon: CheckCircle,
                color: 'text-blue-600'
              })),
              ...mockERPData.sales.recentDeals.slice(0, 2).map(deal => ({
                title: `Deal closed with ${deal.company}`,
                assignee: 'Sales Team',
                status: deal.status,
                priority: 'High',
                type: 'sales',
                icon: DollarSign,
                color: 'text-green-600'
              }))
            ].slice(0, 6).map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                  <activity.icon size={16} className={activity.color} />
                </div>
                                 <div className="flex-1">
                   <p className="font-poppins font-medium text-gray-900 text-sm">
                     {(activity as any).title || (activity as any).task}
                   </p>
                  <p className="text-xs text-gray-600 font-poppins">
                    {activity.assignee} • {activity.status}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-poppins font-medium rounded-full ${
                  activity.priority === 'High' ? 'bg-red-100 text-red-700' :
                  activity.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {activity.priority}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-700 font-poppins font-medium text-sm flex items-center gap-1 mx-auto">
              View All Activities
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* System Status & Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">
              System Status
            </h3>
            <Shield className="text-indigo-600" size={20} />
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-poppins text-gray-700">System Uptime</span>
              </div>
              <span className="text-sm font-poppins font-semibold text-green-600">
                {mockERPData.system.systemUptime}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-poppins text-gray-700">Active Users</span>
              </div>
              <span className="text-sm font-poppins font-semibold text-blue-600">
                {mockERPData.system.activeUsers}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-poppins text-gray-700">Storage Used</span>
              </div>
              <span className="text-sm font-poppins font-semibold text-orange-600">
                {mockERPData.system.storageUsed}%
              </span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-sm font-poppins font-semibold text-gray-900 mb-3">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <FileText size={14} className="text-blue-600" />
                <span className="text-xs font-poppins text-blue-700">Generate Report</span>
              </button>
              <button className="flex items-center gap-2 p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <UserPlus size={14} className="text-green-600" />
                <span className="text-xs font-poppins text-green-700">Add Employee</span>
              </button>
              <button className="flex items-center gap-2 p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Target size={14} className="text-purple-600" />
                <span className="text-xs font-poppins text-purple-700">Create Task</span>
              </button>
              <button className="flex items-center gap-2 p-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <Briefcase size={14} className="text-orange-600" />
                <span className="text-xs font-poppins text-orange-700">New Lead</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;