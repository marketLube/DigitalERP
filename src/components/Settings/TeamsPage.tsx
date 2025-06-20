import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, CheckCircle, Clock, BarChart3, Flag, Eye, Settings } from 'lucide-react';
import DateRangePicker from '../Common/DateRangePicker';
import { Team, DateRange } from '../../types/teams';

interface TeamsPageProps {
  onViewTeam: (teamId: string, teamName: string) => void;
  onManageStatus: (teamId: string, teamName: string) => void;
}

const TeamsPage: React.FC<TeamsPageProps> = ({ onViewTeam, onManageStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  // Updated team data with new names and realistic data
  const teams: Team[] = [
    {
      id: '1',
      name: 'UI/UX Team',
      color: 'bg-blue-500',
      manager: 'Mike Chen',
      totalTasks: 28,
      activeTasks: 9,
      completedTasks: 19,
      statuses: 5,
      createdDate: '2024-01-10',
      tasks: []
    },
    {
      id: '2',
      name: 'Development Team',
      color: 'bg-green-500',
      manager: 'Emily Rodriguez',
      totalTasks: 45,
      activeTasks: 18,
      completedTasks: 27,
      statuses: 7,
      createdDate: '2024-01-20',
      tasks: []
    },
    {
      id: '3',
      name: 'Performance Marketing',
      color: 'bg-purple-500',
      manager: 'Sarah Johnson',
      totalTasks: 32,
      activeTasks: 12,
      completedTasks: 20,
      statuses: 6,
      createdDate: '2024-01-15',
      tasks: []
    },
    {
      id: '4',
      name: 'Video Production',
      color: 'bg-red-500',
      manager: 'Lisa Thompson',
      totalTasks: 19,
      activeTasks: 7,
      completedTasks: 12,
      statuses: 5,
      createdDate: '2024-01-18',
      tasks: []
    },
    {
      id: '5',
      name: 'Social Media',
      color: 'bg-indigo-500',
      manager: 'James Park',
      totalTasks: 35,
      activeTasks: 15,
      completedTasks: 20,
      statuses: 6,
      createdDate: '2024-01-25',
      tasks: []
    },
    {
      id: '6',
      name: 'Testing / QA',
      color: 'bg-orange-500',
      manager: 'David Wilson',
      totalTasks: 22,
      activeTasks: 8,
      completedTasks: 14,
      statuses: 4,
      createdDate: '2024-01-12',
      tasks: []
    }
  ];

  // Filter teams based on date range
  const filteredTeamsByDate = useMemo(() => {
    return teams.map(team => {
      if (!dateRange.start && !dateRange.end) {
        return team;
      }

      const filteredTasks = team.tasks.filter(task => {
        const taskDate = new Date(task.createdDate);
        const isAfterStart = !dateRange.start || taskDate >= dateRange.start;
        const isBeforeEnd = !dateRange.end || taskDate <= dateRange.end;
        return isAfterStart && isBeforeEnd;
      });

      const activeTasks = filteredTasks.filter(task => task.subStatus !== 'Completed').length;
      const completedTasks = filteredTasks.filter(task => task.subStatus === 'Completed').length;

      return {
        ...team,
        tasks: filteredTasks,
        totalTasks: filteredTasks.length,
        activeTasks,
        completedTasks
      };
    });
  }, [teams, dateRange]);

  const filteredTeams = filteredTeamsByDate.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'activeTasks':
        return b.activeTasks - a.activeTasks;
      case 'totalTasks':
        return b.totalTasks - a.totalTasks;
      case 'progress':
        const progressA = a.totalTasks > 0 ? (a.completedTasks / a.totalTasks) * 100 : 0;
        const progressB = b.totalTasks > 0 ? (b.completedTasks / b.totalTasks) * 100 : 0;
        return progressB - progressA;
      default:
        return 0;
    }
  });

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
          Team Management
        </h1>
        <p className="text-gray-600 font-poppins">
          Manage your organization's teams and track their progress across different time periods.
        </p>
      </div>

      {/* Compact Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Search, Sort, and Date Filter */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm transition-all duration-200"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm bg-white min-w-44 transition-all duration-200"
            >
              <option value="name">Sort by: A–Z</option>
              <option value="activeTasks">Sort by: Active Tasks</option>
              <option value="totalTasks">Sort by: Total Tasks</option>
              <option value="progress">Sort by: Progress</option>
            </select>

            {/* Date Range Picker */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Filter by Date Range"
            />
          </div>

          {/* Right side - Add Team Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-poppins font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105">
            <Plus size={16} />
            Add New Team
          </button>
        </div>

        {/* Active Filters Display */}
        {(dateRange.start || dateRange.end) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-poppins">
              <span>Active filters:</span>
              {dateRange.start && dateRange.end && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                  {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                </span>
              )}
              {dateRange.start && !dateRange.end && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                  From {dateRange.start.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Teams Grid - EXACTLY 4 COLUMNS ON DESKTOP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedTeams.map((team, index) => (
          <div
            key={team.id}
            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg hover:scale-102 transition-all duration-200 animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Team Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${team.color}`}></div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm truncate">
                  {team.name}
                </h3>
              </div>
              <Users size={16} className="text-gray-400 flex-shrink-0" />
            </div>

            {/* Manager Info */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 font-poppins">Manager</p>
              <p className="font-poppins font-medium text-gray-900 text-sm truncate">{team.manager}</p>
            </div>

            {/* Stats Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <div className="text-lg font-poppins font-bold text-blue-600">{team.totalTasks}</div>
                <div className="text-xs text-blue-600 font-poppins">Total</div>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg text-center">
                <div className="text-lg font-poppins font-bold text-orange-600">{team.activeTasks}</div>
                <div className="text-xs text-orange-600 font-poppins">Active</div>
              </div>
              <div className="bg-green-50 p-2 rounded-lg text-center">
                <div className="text-lg font-poppins font-bold text-green-600">{team.completedTasks}</div>
                <div className="text-xs text-green-600 font-poppins">Done</div>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg text-center">
                <div className="text-lg font-poppins font-bold text-purple-600">{team.statuses}</div>
                <div className="text-xs text-purple-600 font-poppins">Status</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-poppins text-gray-500">Progress</span>
                <span className="text-xs font-poppins text-gray-600 font-medium">
                  {team.totalTasks > 0 ? Math.round((team.completedTasks / team.totalTasks) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${team.color}`}
                  style={{ 
                    width: `${team.totalTasks > 0 ? (team.completedTasks / team.totalTasks) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button 
                onClick={() => onViewTeam(team.id, team.name)}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-poppins font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Eye size={14} />
                View Team
              </button>
              
              <button 
                onClick={() => onManageStatus(team.id, team.name)}
                className="w-full py-2 px-3 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-poppins font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Settings size={14} />
                Manage Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTeams.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No teams found
          </h3>
          <p className="text-gray-600 font-poppins mb-6">
            {searchQuery || dateRange.start || dateRange.end 
              ? 'Try adjusting your search criteria or date filters.' 
              : 'Get started by creating your first team.'
            }
          </p>
          {!searchQuery && !dateRange.start && !dateRange.end && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center gap-2 mx-auto hover:scale-105">
              <Plus size={20} />
              Add New Team
            </button>
          )}
        </div>
      )}

      {/* Mobile Sticky Button */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default TeamsPage;