import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Download, Filter, Search, BarChart3, Clock, CheckCircle, 
  AlertTriangle, TrendingUp, TrendingDown, User, Target, Award, ChevronDown,
  FileText, Star, Eye, Plus, Settings, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  client: string;
  dueDate: string;
  createdDate: string;
  mainStatus: string;
  subStatus: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
}

interface IndividualEmployeeReportProps {
  employee: string;
  onBack: () => void;
  allTasks: Task[];
}

const IndividualEmployeeReport: React.FC<IndividualEmployeeReportProps> = ({ 
  employee, 
  onBack, 
  allTasks 
}) => {
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'this-week' | 'this-month' | 'last-3-months' | 'this-year' | 'custom'>('this-month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'overview' | 'tasks' | 'timeline'>('overview');
  const [chartType, setChartType] = useState<'progress' | 'status' | 'priority'>('progress');

  // Get filtered tasks based on all filters
  const getFilteredTasks = () => {
    let filteredTasks = allTasks.filter(task => task.assignee === employee);

    // Date filtering
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'this-week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startDate = startOfWeek;
        break;
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-3-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (dateFilter !== 'custom' || (customStartDate && customEndDate)) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.createdDate);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    // Status filtering
    if (statusFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        if (statusFilter === 'pending') return task.progress === 0;
        if (statusFilter === 'in-progress') return task.progress > 0 && task.progress < 100;
        if (statusFilter === 'completed') return task.progress === 100;
        if (statusFilter === 'overdue') return isOverdue(task.dueDate, task.progress);
        return true;
      });
    }

    // Priority filtering
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority.toLowerCase() === priorityFilter);
    }

    // Search filtering
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filteredTasks;
  };

  const isOverdue = (dueDate: string, progress: number) => {
    if (progress === 100) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = getFilteredTasks();
  const pendingTasks = filteredTasks.filter(task => task.progress === 0);
  const ongoingTasks = filteredTasks.filter(task => task.progress > 0 && task.progress < 100);
  const completedTasks = filteredTasks.filter(task => task.progress === 100);
  const overdueTasks = filteredTasks.filter(task => isOverdue(task.dueDate, task.progress));

  const avgProgress = filteredTasks.length > 0 
    ? Math.round(filteredTasks.reduce((sum, task) => sum + task.progress, 0) / filteredTasks.length)
    : 0;

  const completionRate = filteredTasks.length > 0 
    ? Math.round((completedTasks.length / filteredTasks.length) * 100)
    : 0;

  const dueSoonTasks = filteredTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow && task.progress < 100;
  });

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      case 'last-3-months': return 'Last 3 Months';
      case 'this-year': return 'This Year';
      case 'custom': return 'Custom Range';
      default: return 'This Month';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (subStatus: string) => {
    const statusMap: { [key: string]: string } = {
      'To Do': 'border-l-gray-400',
      'In Progress': 'border-l-blue-500',
      'Review': 'border-l-yellow-500',
      'Done': 'border-l-green-500',
      'Blocked': 'border-l-red-500',
      'Testing': 'border-l-purple-500',
      'Approved': 'border-l-emerald-500',
      'Deployed': 'border-l-indigo-500'
    };
    return statusMap[subStatus] || 'border-l-gray-400';
  };

  const downloadReport = () => {
    const reportData = {
      employee,
      dateFilter: getDateFilterLabel(),
      totalTasks: filteredTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      ongoingTasks: ongoingTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate,
      avgProgress,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.replace(' ', '_')}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 border border-gray-200"
            >
              <ArrowLeft size={20} />
              Back to Reports
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {employee.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee}</h1>
                <p className="text-gray-600">Individual Performance Report</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download size={16} />
              Download Report
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Date Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {dateFilter === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </>
            )}

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              viewMode === 'overview' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('tasks')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              viewMode === 'tasks' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tasks Detail
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              viewMode === 'timeline' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <div className="space-y-8">
          {/* Summary Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {getDateFilterLabel()} Performance Summary
              </h2>
              <p className="text-gray-600">
                Showing {filteredTasks.length} tasks for {getDateFilterLabel().toLowerCase()}
              </p>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completionRate}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{avgProgress}%</div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{dueSoonTasks.length}</div>
                <div className="text-sm text-gray-600">Due This Week</div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{filteredTasks.length}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Clock size={24} className="text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{ongoingTasks.length}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Task Status Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span className="text-gray-700">Pending</span>
                  </div>
                  <span className="font-medium">{pendingTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-700">In Progress</span>
                  </div>
                  <span className="font-medium">{ongoingTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-700">Completed</span>
                  </div>
                  <span className="font-medium">{completedTasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-700">Overdue</span>
                  </div>
                  <span className="font-medium">{overdueTasks.length}</span>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Priority Distribution</h3>
              <div className="space-y-4">
                {['High', 'Medium', 'Low'].map(priority => {
                  const count = filteredTasks.filter(task => task.priority === priority).length;
                  const percentage = filteredTasks.length > 0 ? Math.round((count / filteredTasks.length) * 100) : 0;
                  return (
                    <div key={priority} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{priority} Priority</span>
                        <span className="font-medium">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            priority === 'High' ? 'bg-red-500' :
                            priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity & Due Soon */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Completed Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recently Completed</h3>
              <div className="space-y-3">
                {completedTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle size={16} className="text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                      <div className="text-xs text-gray-600">{task.client}</div>
                    </div>
                    <div className="text-xs text-green-600 font-medium">Completed</div>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center py-6 text-gray-500">No completed tasks in this period</div>
                )}
              </div>
            </div>

            {/* Due Soon */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Due This Week</h3>
              <div className="space-y-3">
                {dueSoonTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <Clock size={16} className="text-orange-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                      <div className="text-xs text-gray-600">{task.client}</div>
                    </div>
                    <div className="text-xs text-orange-600 font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {dueSoonTasks.length === 0 && (
                  <div className="text-center py-6 text-gray-500">No tasks due this week</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'tasks' && (
        <div className="space-y-6">
          {/* Task Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Tasks */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  Pending Tasks ({pendingTasks.length})
                </h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{task.client}</span>
                        <span className="text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border-l-4 ${getStatusColor(task.subStatus)} bg-gray-50`}>
                          {task.subStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No pending tasks</div>
                  )}
                </div>
              </div>
            </div>

            {/* In Progress Tasks */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  In Progress ({ongoingTasks.length})
                </h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {ongoingTasks.map(task => (
                    <div key={task.id} className="border border-blue-200 rounded-lg p-3 bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500">{task.client}</span>
                        <span className="text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-blue-600">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border-l-4 ${getStatusColor(task.subStatus)} bg-white`}>
                          {task.subStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                  {ongoingTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No tasks in progress</div>
                  )}
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-green-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Completed ({completedTasks.length})
                </h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <div key={task.id} className="border border-green-200 rounded-lg p-3 bg-green-50 hover:bg-green-100 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500">{task.client}</span>
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={12} />
                          <span className="font-medium">Completed</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border-l-4 ${getStatusColor(task.subStatus)} bg-white`}>
                          {task.subStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                  {completedTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No completed tasks</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Tasks (if any) */}
          {overdueTasks.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200">
              <div className="p-4 border-b border-red-200 bg-red-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  Overdue Tasks ({overdueTasks.length})
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overdueTasks.map(task => (
                    <div key={task.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500">{task.client}</span>
                        <span className="text-red-600 font-medium">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-red-600">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border-l-4 ${getStatusColor(task.subStatus)} bg-white`}>
                          {task.subStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Task Timeline</h3>
          <div className="space-y-4">
            {filteredTasks
              .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
              .map((task, index) => (
              <div key={task.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    task.progress === 100 ? 'bg-green-500' :
                    task.progress > 0 ? 'bg-blue-500' :
                    isOverdue(task.dueDate, task.progress) ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  {index < filteredTasks.length - 1 && (
                    <div className="w-px h-12 bg-gray-200 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.client}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)} mb-1`}>
                        {task.priority}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(task.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium border-l-4 ${getStatusColor(task.subStatus)} bg-gray-50`}>
                      {task.subStatus}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${
                          task.progress === 100 ? 'bg-green-500' :
                          task.progress > 0 ? 'bg-blue-500' : 'bg-gray-400'
                        }`} style={{ width: `${task.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600 w-10">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No tasks found for the selected filters
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualEmployeeReport; 