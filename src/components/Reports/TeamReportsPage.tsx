import React, { useState } from 'react';
import { Users, Search, Filter, Calendar, Download, Eye, BarChart3, TrendingUp, TrendingDown, Clock, Target, Award, Activity } from 'lucide-react';

interface TeamReport {
  id: string;
  title: string;
  description: string;
  teamName: string;
  dateRange: string;
  generatedDate: string;
  totalMembers: number;
  activeMembers: number;
  productivity: number;
  tasksCompleted: number;
  avgResponseTime: string;
  reportType: 'performance' | 'productivity' | 'collaboration' | 'attendance';
  status: 'ready' | 'generating';
}

interface TeamMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface TeamReportsPageProps {
  onBack: () => void;
}

const TeamReportsPage: React.FC<TeamReportsPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const teamMetrics: TeamMetric[] = [
    {
      title: 'Team Productivity',
      value: '94.2%',
      change: '+5.8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active Members',
      value: '87',
      change: '+3',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Avg. Response Time',
      value: '2.4 hrs',
      change: '-0.3 hrs',
      changeType: 'positive',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Team Satisfaction',
      value: '4.7/5',
      change: '+0.2',
      changeType: 'positive',
      icon: Award,
      color: 'text-orange-600'
    }
  ];

  const teamReports: TeamReport[] = [
    {
      id: '1',
      title: 'Development Team Performance Analysis',
      description: 'Comprehensive performance review including code quality, delivery metrics, and collaboration patterns',
      teamName: 'Development Team',
      dateRange: 'Feb 1-15, 2024',
      generatedDate: '2024-02-15',
      totalMembers: 12,
      activeMembers: 11,
      productivity: 96,
      tasksCompleted: 89,
      avgResponseTime: '1.8 hrs',
      reportType: 'performance',
      status: 'ready'
    },
    {
      id: '2',
      title: 'UI/UX Team Productivity Report',
      description: 'Design workflow efficiency, creative output metrics, and client feedback analysis',
      teamName: 'UI/UX Team',
      dateRange: 'January 2024',
      generatedDate: '2024-02-01',
      totalMembers: 8,
      activeMembers: 8,
      productivity: 92,
      tasksCompleted: 67,
      avgResponseTime: '2.1 hrs',
      reportType: 'productivity',
      status: 'ready'
    },
    {
      id: '3',
      title: 'Marketing Team Collaboration Study',
      description: 'Cross-functional collaboration patterns, campaign coordination, and communication effectiveness',
      teamName: 'Performance Marketing',
      dateRange: 'Q1 2024',
      generatedDate: '2024-02-10',
      totalMembers: 15,
      activeMembers: 14,
      productivity: 88,
      tasksCompleted: 156,
      avgResponseTime: '3.2 hrs',
      reportType: 'collaboration',
      status: 'ready'
    },
    {
      id: '4',
      title: 'QA Team Attendance & Engagement',
      description: 'Attendance patterns, engagement levels, and work-life balance analysis',
      teamName: 'Testing / QA',
      dateRange: 'February 2024',
      generatedDate: '2024-02-14',
      totalMembers: 6,
      activeMembers: 5,
      productivity: 94,
      tasksCompleted: 43,
      avgResponseTime: '1.5 hrs',
      reportType: 'attendance',
      status: 'generating'
    },
    {
      id: '5',
      title: 'Video Production Team Performance',
      description: 'Content creation metrics, project delivery timelines, and creative quality assessment',
      teamName: 'Video Production',
      dateRange: 'Jan 15 - Feb 15, 2024',
      generatedDate: '2024-02-12',
      totalMembers: 9,
      activeMembers: 9,
      productivity: 91,
      tasksCompleted: 34,
      avgResponseTime: '4.1 hrs',
      reportType: 'performance',
      status: 'ready'
    },
    {
      id: '6',
      title: 'Social Media Team Productivity Analysis',
      description: 'Content output, engagement metrics, and campaign performance evaluation',
      teamName: 'Social Media',
      dateRange: 'February 2024',
      generatedDate: '2024-02-13',
      totalMembers: 7,
      activeMembers: 7,
      productivity: 89,
      tasksCompleted: 78,
      avgResponseTime: '2.8 hrs',
      reportType: 'productivity',
      status: 'ready'
    }
  ];

  const reportTypes = ['All', 'Performance', 'Productivity', 'Collaboration', 'Attendance'];
  const teams = ['All Teams', 'Development Team', 'UI/UX Team', 'Performance Marketing', 'Testing / QA', 'Video Production', 'Social Media'];

  const filteredReports = teamReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || report.reportType.toLowerCase() === selectedType.toLowerCase();
    const matchesTeam = selectedTeam === 'All Teams' || report.teamName === selectedTeam;
    
    return matchesSearch && matchesType && matchesTeam;
  });

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-blue-100 text-blue-700';
      case 'productivity': return 'bg-green-100 text-green-700';
      case 'collaboration': return 'bg-purple-100 text-purple-700';
      case 'attendance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <BarChart3 size={14} />;
      case 'productivity': return <TrendingUp size={14} />;
      case 'collaboration': return <Users size={14} />;
      case 'attendance': return <Clock size={14} />;
      default: return <BarChart3 size={14} />;
    }
  };

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 95) return 'text-green-600';
    if (productivity >= 85) return 'text-blue-600';
    if (productivity >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Team Reports
            </h1>
            <p className="text-gray-600 font-poppins">
              Team performance analytics, productivity insights, and collaboration metrics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {teamMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color === 'text-green-600' ? 'bg-green-50' : metric.color === 'text-blue-600' ? 'bg-blue-50' : metric.color === 'text-purple-600' ? 'bg-purple-50' : 'bg-orange-50'}`}>
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
              placeholder="Search team reports..."
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

          {/* Team Filter */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-44"
          >
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
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

              {/* Team Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-blue-600" />
                  <span className="font-poppins font-medium text-gray-900">{report.teamName}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-poppins">Members:</span>
                    <span className="font-poppins font-medium text-gray-900 ml-1">
                      {report.activeMembers}/{report.totalMembers}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-poppins">Tasks:</span>
                    <span className="font-poppins font-medium text-gray-900 ml-1">{report.tasksCompleted}</span>
                  </div>
                </div>
              </div>

              {/* Productivity Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-poppins text-gray-600">Productivity Score</span>
                  <span className={`text-lg font-poppins font-bold ${getProductivityColor(report.productivity)}`}>
                    {report.productivity}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      report.productivity >= 95 ? 'bg-green-500' :
                      report.productivity >= 85 ? 'bg-blue-500' :
                      report.productivity >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${report.productivity}%` }}
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
                  <span className="text-gray-600 font-poppins">Response Time:</span>
                  <span className="font-poppins text-gray-900">{report.avgResponseTime}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-poppins font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-1">
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
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Team</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Type</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Productivity</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Members</th>
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
                        <p className="text-xs text-gray-500 font-poppins mt-1">{report.dateRange}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        <span className="font-poppins text-gray-900">{report.teamName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 w-fit ${getReportTypeColor(report.reportType)}`}>
                        {getReportTypeIcon(report.reportType)}
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-16">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                report.productivity >= 95 ? 'bg-green-500' :
                                report.productivity >= 85 ? 'bg-blue-500' :
                                report.productivity >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${report.productivity}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className={`text-sm font-poppins font-bold min-w-12 ${getProductivityColor(report.productivity)}`}>
                          {report.productivity}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <p className="font-poppins font-semibold text-gray-900">
                          {report.activeMembers}/{report.totalMembers}
                        </p>
                        <p className="text-xs text-gray-500 font-poppins">
                          {report.tasksCompleted} tasks
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200" title="View Report">
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
          <Users size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No team reports found
          </h3>
          <p className="text-gray-600 font-poppins mb-6">
            {searchQuery || selectedType !== 'All' || selectedTeam !== 'All Teams'
              ? 'Try adjusting your search criteria or filters.' 
              : 'Generate your first team report to get started with team analytics.'
            }
          </p>
          {!searchQuery && selectedType === 'All' && selectedTeam === 'All Teams' && (
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-colors duration-200 flex items-center gap-2 mx-auto">
              <Download size={20} />
              Generate First Report
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamReportsPage;