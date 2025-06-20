import React, { useState } from 'react';
import { ArrowLeft, Users, Filter, Calendar, BarChart3, User, Clock, CheckCircle } from 'lucide-react';
import { Team, Task, DateRange } from '../../types/teams';
import DateRangePicker from '../Common/DateRangePicker';

interface TeamOverviewProps {
  teamId: string;
  onBack: () => void;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({ teamId, onBack }) => {
  const [selectedMainStatus, setSelectedMainStatus] = useState('All');
  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Mock team data - in real app, this would be fetched based on teamId
  const team: Team = {
    id: teamId,
    name: 'Creative Team',
    color: 'bg-purple-500',
    manager: 'Sarah Johnson',
    totalTasks: 24,
    activeTasks: 8,
    completedTasks: 16,
    statuses: 5,
    createdDate: '2024-01-15',
    tasks: [
      {
        id: '1',
        title: 'Design Homepage Layout',
        assignee: 'John Doe',
        dueDate: '2024-02-15',
        createdDate: '2024-01-20',
        mainStatus: 'UI',
        subStatus: 'In Progress',
        progress: 60,
        tags: ['design', 'homepage']
      },
      {
        id: '2',
        title: 'Create Brand Guidelines',
        assignee: 'Jane Smith',
        dueDate: '2024-02-10',
        createdDate: '2024-01-25',
        mainStatus: 'Branding',
        subStatus: 'Review',
        progress: 80,
        tags: ['branding', 'guidelines']
      },
      {
        id: '3',
        title: 'Mobile App Icons',
        assignee: 'John Doe',
        dueDate: '2024-02-20',
        createdDate: '2024-01-22',
        mainStatus: 'UI',
        subStatus: 'Pending',
        progress: 20,
        tags: ['mobile', 'icons']
      },
      {
        id: '4',
        title: 'Logo Variations',
        assignee: 'Jane Smith',
        dueDate: '2024-02-12',
        createdDate: '2024-01-28',
        mainStatus: 'Branding',
        subStatus: 'Completed',
        progress: 100,
        tags: ['logo', 'branding']
      }
    ]
  };

  // Mock main statuses and sub-statuses
  const mainStatuses = ['All', 'UI', 'Branding', 'Marketing'];
  const subStatusesByMain = {
    'UI': ['Pending', 'In Progress', 'Review', 'Completed'],
    'Branding': ['Pending', 'In Progress', 'Review', 'Client Review', 'Completed'],
    'Marketing': ['Planning', 'In Progress', 'Review', 'Published']
  };

  const assignees = ['All', ...Array.from(new Set(team.tasks.map(task => task.assignee)))];

  // Filter tasks based on current filters
  const filteredTasks = team.tasks.filter(task => {
    const matchesMainStatus = selectedMainStatus === 'All' || task.mainStatus === selectedMainStatus;
    const matchesAssignee = selectedAssignee === 'All' || task.assignee === selectedAssignee;
    
    let matchesDateRange = true;
    if (dateRange.start || dateRange.end) {
      const taskDate = new Date(task.createdDate);
      const isAfterStart = !dateRange.start || taskDate >= dateRange.start;
      const isBeforeEnd = !dateRange.end || taskDate <= dateRange.end;
      matchesDateRange = isAfterStart && isBeforeEnd;
    }

    return matchesMainStatus && matchesAssignee && matchesDateRange;
  });

  // Group tasks by sub-status for Kanban view
  const tasksBySubStatus = filteredTasks.reduce((acc, task) => {
    if (!acc[task.subStatus]) {
      acc[task.subStatus] = [];
    }
    acc[task.subStatus].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const getSubStatusesForCurrentMain = () => {
    if (selectedMainStatus === 'All') {
      return Array.from(new Set(filteredTasks.map(task => task.subStatus)));
    }
    return subStatusesByMain[selectedMainStatus as keyof typeof subStatusesByMain] || [];
  };

  const getStatusColor = (subStatus: string) => {
    const colors = {
      'Pending': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Review': 'bg-yellow-100 text-yellow-700',
      'Client Review': 'bg-orange-100 text-orange-700',
      'Completed': 'bg-green-100 text-green-700',
      'Published': 'bg-purple-100 text-purple-700',
      'Planning': 'bg-indigo-100 text-indigo-700'
    };
    return colors[subStatus as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full ${team.color}`}></div>
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900">
              {team.name} Overview
            </h1>
            <p className="text-gray-600 font-poppins text-sm">
              Managed by {team.manager}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Main Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedMainStatus}
              onChange={(e) => setSelectedMainStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              {mainStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>
                  {assignee === 'All' ? 'All Assignees' : assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Filter by Date"
          />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-lg text-sm font-poppins transition-colors duration-200 ${
                viewMode === 'kanban' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-poppins transition-colors duration-200 ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={20} className="text-blue-600" />
            <span className="font-poppins font-medium text-gray-900">Total Tasks</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-gray-900">{filteredTasks.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-orange-600" />
            <span className="font-poppins font-medium text-gray-900">Active</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-orange-600">
            {filteredTasks.filter(task => task.subStatus !== 'Completed').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-poppins font-medium text-gray-900">Completed</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-green-600">
            {filteredTasks.filter(task => task.subStatus === 'Completed').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-purple-600" />
            <span className="font-poppins font-medium text-gray-900">Team Members</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-purple-600">
            {assignees.length - 1}
          </p>
        </div>
      </div>

      {/* Tasks Display */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getSubStatusesForCurrentMain().map(subStatus => (
            <div key={subStatus} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-semibold text-gray-900">{subStatus}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-poppins ${getStatusColor(subStatus)}`}>
                  {tasksBySubStatus[subStatus]?.length || 0}
                </span>
              </div>
              
              <div className="space-y-3">
                {(tasksBySubStatus[subStatus] || []).map(task => (
                  <div key={task.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <h4 className="font-poppins font-medium text-gray-900 mb-2">{task.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-poppins">{task.assignee}</span>
                      <span className="font-poppins">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {task.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-poppins">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6">
            <h3 className="font-poppins font-semibold text-gray-900 mb-4">Task List</h3>
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-1">
                    <h4 className="font-poppins font-medium text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-poppins">{task.assignee}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-poppins ${getStatusColor(task.subStatus)}`}>
                        {task.subStatus}
                      </span>
                      <span className="font-poppins">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-poppins text-gray-600 min-w-12">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 font-poppins">
            Try adjusting your filters to see more tasks.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamOverview;