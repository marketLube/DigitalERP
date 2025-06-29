import React, { useState } from 'react';
import { 
  Crown, Users, Building2, TrendingUp, DollarSign, Activity, 
  Globe, Server, Database, Shield, AlertTriangle, CheckCircle,
  Eye, Settings, BarChart3, PieChart, Calendar, MapPin
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  plan: 'basic' | 'premium' | 'enterprise';
  users: number;
  maxUsers: number;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  monthlyRevenue: number;
  location: string;
  joinedDate: string;
}

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const platformStats = {
    totalTenants: 247,
    activeTenants: 234,
    totalUsers: 6125,
    monthlyRevenue: 89750,
    systemUptime: '99.9%',
    storageUsed: '2.3TB',
    apiCalls: '1.2M'
  };

  const mockTenants: Tenant[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      email: 'admin@techcorp.com',
      plan: 'enterprise',
      users: 25,
      maxUsers: 50,
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      monthlyRevenue: 299,
      location: 'Mumbai, India',
      joinedDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'StartupXYZ',
      email: 'admin@startupxyz.com',
      plan: 'basic',
      users: 12,
      maxUsers: 25,
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      monthlyRevenue: 49,
      location: 'Bangalore, India',
      joinedDate: '2023-11-20'
    },
    {
      id: '3',
      name: 'Global Industries',
      email: 'admin@globalind.com',
      plan: 'premium',
      users: 18,
      maxUsers: 35,
      status: 'inactive',
      lastLogin: '2024-01-10T16:45:00Z',
      monthlyRevenue: 149,
      location: 'Delhi, India',
      joinedDate: '2023-08-10'
    }
  ];

  const revenueData = [
    { month: 'Jul', revenue: 67500 },
    { month: 'Aug', revenue: 71200 },
    { month: 'Sep', revenue: 74800 },
    { month: 'Oct', revenue: 78900 },
    { month: 'Nov', revenue: 82300 },
    { month: 'Dec', revenue: 85600 },
    { month: 'Jan', revenue: 89750 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
                <p className="text-sm text-gray-600">Platform-wide monitoring and control</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Platform Owner</p>
                <p className="font-semibold">owner@digitalerp.com</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tenants', label: 'Tenants', icon: Building2 },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
              { id: 'system', label: 'System Health', icon: Activity },
              { id: 'billing', label: 'Billing', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                    <p className="text-3xl font-bold text-gray-900">{platformStats.totalTenants}</p>
                    <p className="text-sm text-green-600">+12 this month</p>
                  </div>
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+234 this month</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(platformStats.monthlyRevenue)}</p>
                    <p className="text-sm text-green-600">+5.2% from last month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-3xl font-bold text-gray-900">{platformStats.systemUptime}</p>
                    <p className="text-sm text-green-600">30-day average</p>
                  </div>
                  <Activity className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-orange-500 to-yellow-500 rounded-t-md"
                      style={{ height: `${(data.revenue / 100000) * 200}px` }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">New tenant registration</p>
                    <p className="text-xs text-gray-600">TechCorp Solutions upgraded to Enterprise plan</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">System maintenance completed</p>
                    <p className="text-xs text-gray-600">Database optimization finished successfully</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">High API usage detected</p>
                    <p className="text-xs text-gray-600">StartupXYZ approaching rate limits</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tenants Tab */}
        {activeTab === 'tenants' && (
          <div className="space-y-6">
            
            {/* Tenants Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Tenant Management</h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Plans</option>
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>

            {/* Tenants Grid */}
            <div className="grid gap-6">
              {mockTenants.map((tenant) => (
                <div key={tenant.id} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center justify-between">
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-600">{tenant.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{tenant.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">Users</p>
                      <p className="text-lg font-semibold">{tenant.users}/{tenant.maxUsers}</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(tenant.users / tenant.maxUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-lg font-semibold">{formatCurrency(tenant.monthlyRevenue)}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                          {tenant.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(tenant.plan)}`}>
                          {tenant.plan}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Last login: {new Date(tenant.lastLogin).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Server Status</h3>
                  <Server className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">API Server</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Resource Usage</h3>
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">CPU Usage</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Memory</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Storage</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Security</h3>
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SSL Certificates</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Valid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Firewall</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Backup</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content can be added here */}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Analytics Dashboard</h3>
            <p className="text-gray-500">Advanced analytics coming soon...</p>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Billing Management</h3>
            <p className="text-gray-500">Billing features coming soon...</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default OwnerDashboard; 