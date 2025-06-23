import React, { useState } from 'react';
import { FileText, Search, Filter, Calendar, Download, Eye, BarChart3, Clock, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Users, Target } from 'lucide-react';

interface TaskReport {
  id: string;
  title: string;
  description: string;
  dateRange: string;
  generatedDate: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  avgCompletionTime: string;
  teamsCovered: string[];
  reportType: 'summary' | 'detailed' | 'performance' | 'timeline';
  status: 'ready' | 'generating';
}

interface TaskMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface TaskReportsPageProps {
  onBack: () => void;
}

const TaskReportsPage: React.FC<TaskReportsPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const taskMetrics: TaskMetric[] = [
    {
      title: 'Total Tasks',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Completed Tasks',
      value: '1,089',
      change: '+15.2%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Overdue Tasks',
      value: '23',
      change: '-8.7%',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Avg. Completion Time',
      value: '3.2 days',
      change: '-0.5 days',
      changeType: 'positive',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  const taskReports: TaskReport[] = [
    {
      id: '1',
      title: 'Weekly Task Performance Report',
      description: 'Comprehensive analysis of task completion rates and team performance',
      dateRange: 'Feb 8-14, 2024',
      generatedDate: '2024-02-15',
      totalTasks: 156,
      completedTasks: 142,
      overdueTasks: 3,
      avgCompletionTime: '2.8 days',
      teamsCovered: ['Development', 'Design', 'Marketing'],
      reportType: 'performance',
      status: 'ready'
    },
    {
      id: '2',
      title: 'Monthly Task Summary',
      description: 'High-level overview of task metrics and completion statistics',
      dateRange: 'January 2024',
      generatedDate: '2024-02-01',
      totalTasks: 487,
      completedTasks: 423,
      overdueTasks: 12,
      avgCompletionTime: '3.5 days',
      teamsCovered: ['All Teams'],
      reportType: 'summary',
      status: 'ready'
    },
    {
      id: '3',
      title: 'Project Timeline Analysis',
      description: 'Detailed timeline analysis with milestone tracking and dependencies',
      dateRange: 'Q1 2024',
      generatedDate: '2024-02-10',
      totalTasks: 234,
      completedTasks: 189,
      overdueTasks: 8,
      avgCompletionTime: '4.1 days',
      teamsCovered: ['Development', 'QA'],
      reportType: 'timeline',
      status: 'ready'
    },
    {
      id: '4',
      title: 'Team Productivity Deep Dive',
      description: 'In-depth analysis of individual and team productivity metrics',
      dateRange: 'Feb 1-15, 2024',
      generatedDate: '2024-02-15',
      totalTasks: 298,
      completedTasks: 267,
      overdueTasks: 5,
      avgCompletionTime: '2.9 days',
      teamsCovered: ['Design', 'Marketing', 'Sales'],
      reportType: 'detailed',
      status: 'generating'
    },
    {
      id: '5',
      title: 'Sprint Performance Report',
      description: 'Sprint-based task analysis with velocity and burndown metrics',
      dateRange: 'Sprint 12 (Feb 5-18)',
      generatedDate: '2024-02-12',
      totalTasks: 89,
      completedTasks: 76,
      overdueTasks: 2,
      avgCompletionTime: '2.1 days',
      teamsCovered: ['Development'],
      reportType: 'performance',
      status: 'ready'
    },
    {
      id: '6',
      title: 'Cross-Team Collaboration Report',
      description: 'Analysis of tasks involving multiple teams and collaboration patterns',
      dateRange: 'January 2024',
      generatedDate: '2024-02-08',
      totalTasks: 167,
      completedTasks: 145,
      overdueTasks: 7,
      avgCompletionTime: '3.8 days',
      teamsCovered: ['All Teams'],
      reportType: 'detailed',
      status: 'ready'
    }
  ];

  const reportTypes = ['All', 'Summary', 'Detailed', 'Performance', 'Timeline'];
  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'];

  const filteredReports = taskReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || report.reportType.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'summary': return 'bg-blue-100 text-blue-700';
      case 'detailed': return 'bg-green-100 text-green-700';
      case 'performance': return 'bg-purple-100 text-purple-700';
      case 'timeline': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'summary': return <BarChart3 size={14} />;
      case 'detailed': return <FileText size={14} />;
      case 'performance': return <TrendingUp size={14} />;
      case 'timeline': return <Calendar size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getCompletionRate = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Task Reports
            </h1>
            <p className="text-gray-600 font-poppins">
              Comprehensive task analytics, performance metrics, and productivity insights
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Task Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {taskMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color === 'text-blue-600' ? 'bg-blue-50' : metric.color === 'text-green-600' ? 'bg-green-50' : metric.color === 'text-red-600' ? 'bg-red-50' : 'bg-purple-50'}`}>
                  <IconComponent size={20} className={metric.color} />
                </div>
                <span className={`text-sm font-poppins font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-poppins font-semibold text-gray-900 mb-1">
                  {metric.value}
                </p>
                <p className="text-sm text-gray-600 font-poppins">
                  {metric.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-40"
          >
            {reportTypes.map(type => (
              <option key={type} value={type}>{type} Reports</option>
            ))}
          </select>

          <div className="text-sm text-gray-500 font-poppins">
            {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Reports Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Report Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-gray-900 mb-2 line-clamp-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-poppins line-clamp-2">
                    {report.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 ml-2 ${getReportTypeColor(report.reportType)}`}>
                  {getReportTypeIcon(report.reportType)}
                  {report.reportType}
                </span>
              </div>

              {/* Report Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-poppins font-bold text-blue-600">{report.totalTasks}</p>
                  <p className="text-xs text-blue-600 font-poppins">Total Tasks</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-poppins font-bold text-green-600">
                    {getCompletionRate(report.completedTasks, report.totalTasks)}%
                  </p>
                  <p className="text-xs text-green-600 font-poppins">Completed</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-poppins text-gray-600">Completion Rate</span>
                  <span className="text-sm font-poppins font-medium text-gray-900">
                    {report.completedTasks}/{report.totalTasks}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionRate(report.completedTasks, report.totalTasks)}%` }}
                  ></div>
                </div>
              </div>

              {/* Report Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-poppins">Date Range:</span>
                  <span className="font-poppins text-gray-900">{report.dateRange}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-poppins">Avg. Time:</span>
                  <span className="font-poppins text-gray-900">{report.avgCompletionTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-poppins">Overdue:</span>
                  <span className={`font-poppins font-medium ${report.overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.overdueTasks}
                  </span>
                </div>
              </div>

              {/* Teams Covered */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-poppins mb-2">Teams Covered:</p>
                <div className="flex flex-wrap gap-1">
                  {report.teamsCovered.slice(0, 3).map(team => (
                    <span key={team} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-poppins">
                      {team}
                    </span>
                  ))}
                  {report.teamsCovered.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-poppins">
                      +{report.teamsCovered.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-poppins font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-1">
                  <Eye size={14} />
                  View Report
                </button>
                
                {report.status === 'ready' && (
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Download">
                    <Download size={16} />
                  </button>
                )}
              </div>

              {/* Generated Date */}
              <p className="text-xs text-gray-500 font-poppins mt-3 text-center">
                Generated on {new Date(report.generatedDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Report</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Type</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Date Range</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Tasks</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Completion</th>
                  <th className="text-right px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-poppins font-medium text-gray-900">{report.title}</p>
                        <p className="text-sm text-gray-500 font-poppins line-clamp-1">{report.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 w-fit ${getReportTypeColor(report.reportType)}`}>
                        {getReportTypeIcon(report.reportType)}
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-poppins text-gray-900 text-sm">{report.dateRange}</p>
                      <p className="text-xs text-gray-500 font-poppins">
                        Generated: {new Date(report.generatedDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <p className="font-poppins font-semibold text-gray-900">{report.totalTasks}</p>
                        <p className="text-xs text-gray-500 font-poppins">
                          {report.overdueTasks} overdue
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getCompletionRate(report.completedTasks, report.totalTasks)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-poppins font-medium text-gray-900 min-w-12">
                          {getCompletionRate(report.completedTasks, report.totalTasks)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="View Report">
                          <Eye size={16} />
                        </button>
                        {report.status === 'ready' && (
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Download">
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No task reports found
          </h3>
          <p className="text-gray-600 font-poppins mb-6">
            {searchQuery || selectedType !== 'All' 
              ? 'Try adjusting your search criteria or filters.' 
              : 'Generate your first task report to get started with analytics.'
            }
          </p>
          {!searchQuery && selectedType === 'All' && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-colors duration-200 flex items-center gap-2 mx-auto">
              <Download size={20} />
              Generate First Report
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskReportsPage;