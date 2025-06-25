import React from 'react';
import { BarChart3, Users, DollarSign, TrendingUp, FileText, Plus } from 'lucide-react';

interface DashboardContentProps {
  onNavigate?: (page: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ onNavigate }) => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,562',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Active Tasks',
      value: '248',
      change: '+8.2%',
      changeType: 'positive',
      icon: BarChart3
    },
    {
      title: 'Team Members',
      value: '32',
      change: '+2',
      changeType: 'neutral',
      icon: Users
    },
    {
      title: 'Growth Rate',
      value: '18.7%',
      change: '+3.1%',
      changeType: 'positive',
      icon: TrendingUp
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 font-poppins">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <IconComponent size={20} className="text-blue-600" />
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
        <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('new-invoice')}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-poppins font-medium text-gray-900 text-sm">New Invoice</p>
              <p className="text-xs text-gray-600 font-poppins">Create invoice</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('taskboard')}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <Plus size={20} className="text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-poppins font-medium text-gray-900 text-sm">New Task</p>
              <p className="text-xs text-gray-600 font-poppins">Add task</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('sales-pipeline')}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-poppins font-medium text-gray-900 text-sm">Add Lead</p>
              <p className="text-xs text-gray-600 font-poppins">New prospect</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('hr-directory')}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
              <Users size={20} className="text-orange-600" />
            </div>
            <div className="text-left">
              <p className="font-poppins font-medium text-gray-900 text-sm">Add Member</p>
              <p className="text-xs text-gray-600 font-poppins">New team member</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
            Recent Tasks
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Review Q4 Financial Report', status: 'In Progress', priority: 'High' },
              { title: 'Update Client Proposals', status: 'Completed', priority: 'Medium' },
              { title: 'Team Performance Review', status: 'Pending', priority: 'High' },
              { title: 'Website Maintenance', status: 'In Progress', priority: 'Low' }
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-poppins font-medium text-gray-900 text-sm">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-600 font-poppins">
                    {task.status}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-poppins font-medium rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
            Team Progress
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Development Team', progress: 85, color: 'bg-blue-500' },
              { name: 'Marketing Team', progress: 72, color: 'bg-green-500' },
              { name: 'Sales Team', progress: 94, color: 'bg-purple-500' },
              { name: 'Support Team', progress: 68, color: 'bg-orange-500' }
            ].map((team, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-poppins font-medium text-gray-900">
                    {team.name}
                  </span>
                  <span className="text-sm font-poppins text-gray-600">
                    {team.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${team.color}`}
                    style={{ width: `${team.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;