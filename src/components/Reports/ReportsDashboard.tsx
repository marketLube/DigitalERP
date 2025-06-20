import React, { useState } from 'react';
import { BarChart3, FileText, Users, Download, TrendingUp, TrendingDown, Calendar, Clock, CheckCircle, AlertCircle, Eye, Filter, ArrowUpRight } from 'lucide-react';

interface QuickStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface RecentReport {
  id: string;
  name: string;
  type: 'task' | 'team' | 'performance' | 'financial';
  generatedDate: string;
  generatedBy: string;
  size: string;
  status: 'ready' | 'generating' | 'failed';
}

interface ReportsDashboardProps {
  onNavigate: (page: string) => void;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const quickStats: QuickStat[] = [
    {
      title: 'Total Reports Generated',
      value: '247',
      change: '+18.2%',
      changeType: 'positive',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Active Projects',
      value: '34',
      change: '+5.8%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      title: 'Team Performance',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Completion Rate',
      value: '87.5%',
      change: '-1.3%',
      changeType: 'negative',
      icon: CheckCircle,
      color: 'text-orange-600'
    }
  ];

  const recentReports: RecentReport[] = [
    {
      id: '1',
      name: 'Weekly Task Performance Report',
      type: 'task',
      generatedDate: '2024-02-15',
      generatedBy: 'John Smith',
      size: '2.4 MB',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Team Productivity Analysis',
      type: 'team',
      generatedDate: '2024-02-14',
      generatedBy: 'Emily Davis',
      size: '1.8 MB',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Monthly Performance Dashboard',
      type: 'performance',
      generatedDate: '2024-02-13',
      generatedBy: 'Sarah Wilson',
      size: '3.2 MB',
      status: 'ready'
    },
    {
      id: '4',
      name: 'Project Timeline Report',
      type: 'task',
      generatedDate: '2024-02-12',
      generatedBy: 'Mike Johnson',
      size: '1.5 MB',
      status: 'generating'
    },
    {
      id: '5',
      name: 'Resource Allocation Report',
      type: 'team',
      generatedDate: '2024-02-11',
      generatedBy: 'Lisa Chen',
      size: '2.1 MB',
      status: 'ready'
    }
  ];

  const quickActions = [
    {
      title: 'Task Reports',
      description: 'Detailed task analytics and performance metrics',
      icon: FileText,
      color: 'bg-blue-500',
      onClick: () => onNavigate('task-reports')
    },
    {
      title: 'Team Reports',
      description: 'Team performance and productivity insights',
      icon: Users,
      color: 'bg-green-500',
      onClick: () => onNavigate('team-reports')
    },
    {
      title: 'Export Center',
      description: 'Export and download reports in various formats',
      icon: Download,
      color: 'bg-purple-500',
      onClick: () => onNavigate('export')
    },
    {
      title: 'Custom Reports',
      description: 'Create custom reports with advanced filters',
      icon: BarChart3,
      color: 'bg-orange-500',
      onClick: () => {}
    }
  ];

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'bg-blue-100 text-blue-700';
      case 'team': return 'bg-green-100 text-green-700';
      case 'performance': return 'bg-purple-100 text-purple-700';
      case 'financial': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700';
      case 'generating': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={14} />;
      case 'generating': return <Clock size={14} />;
      case 'failed': return <AlertCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Reports Dashboard
            </h1>
            <p className="text-gray-600 font-poppins">
              Comprehensive analytics and reporting for your organization
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color === 'text-blue-600' ? 'bg-blue-50' : stat.color === 'text-green-600' ? 'bg-green-50' : stat.color === 'text-purple-600' ? 'bg-purple-50' : 'bg-orange-50'}`}>
                  <IconComponent size={20} className={stat.color} />
                </div>
                <span className={`text-sm font-poppins font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-poppins font-semibold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 font-poppins">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
          Report Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200 text-left group animate-slideUp"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 font-poppins">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-poppins font-semibold text-gray-900">
                Recent Reports
              </h2>
              <button
                onClick={() => onNavigate('export')}
                className="text-blue-600 hover:text-blue-700 font-poppins font-medium text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200"
              >
                View All
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slideUp"
                  style={{ animationDelay: `${(index + 8) * 50}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getReportTypeColor(report.type)}`}>
                      <FileText size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-poppins font-medium text-gray-900 text-sm">
                        {report.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500 font-poppins">
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </p>
                        <span className="text-xs text-gray-500">•</span>
                        <p className="text-xs text-gray-500 font-poppins">
                          by {report.generatedBy}
                        </p>
                        <span className="text-xs text-gray-500">•</span>
                        <p className="text-xs text-gray-500 font-poppins">
                          {report.size}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </span>
                    {report.status === 'ready' && (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <Download size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Analytics */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-poppins font-semibold text-gray-900">
              Report Analytics
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Report Types Distribution */}
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 mb-3">Report Types</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Task Reports', count: 45, percentage: 40, color: 'bg-blue-500' },
                    { type: 'Team Reports', count: 32, percentage: 28, color: 'bg-green-500' },
                    { type: 'Performance', count: 23, percentage: 20, color: 'bg-purple-500' },
                    { type: 'Financial', count: 14, percentage: 12, color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div key={index} className="animate-slideUp" style={{ animationDelay: `${(index + 12) * 100}ms` }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-poppins font-medium text-gray-900">
                          {item.type}
                        </span>
                        <span className="text-sm font-poppins text-gray-600">
                          {item.count} reports
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Statistics */}
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 mb-3">Usage Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-poppins font-bold text-blue-600">156</p>
                    <p className="text-sm text-blue-600 font-poppins">This Month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-poppins font-bold text-green-600">1,247</p>
                    <p className="text-sm text-green-600 font-poppins">Total Reports</p>
                  </div>
                </div>
              </div>

              {/* Top Users */}
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 mb-3">Top Report Generators</h3>
                <div className="space-y-2">
                  {[
                    { name: 'John Smith', reports: 23 },
                    { name: 'Emily Davis', reports: 18 },
                    { name: 'Sarah Wilson', reports: 15 }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-poppins text-gray-900">{user.name}</span>
                      </div>
                      <span className="text-sm font-poppins font-medium text-gray-600">{user.reports}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;