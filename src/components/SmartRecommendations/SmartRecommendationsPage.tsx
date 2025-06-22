import React, { useState, useMemo } from 'react';
import { 
  Brain, Lightbulb, TrendingUp, AlertTriangle, Clock, Target, 
  DollarSign, Users, CheckCircle, BarChart3, Zap, ArrowRight,
  Eye, Filter, Download, RefreshCw, Star, Award, Briefcase,
  UserPlus, FileText, Calendar, Activity, Shield, Building,
  TrendingDown, AlertCircle, ChevronRight, Search, X
} from 'lucide-react';

interface SmartRecommendationPageProps {
  initialTab?: 'insights' | 'actions' | 'alerts' | 'optimization';
}

interface Recommendation {
  id: string;
  type: 'sales' | 'taskboard' | 'hr' | 'accounting' | 'performance' | 'system';
  category: 'insight' | 'action' | 'alert' | 'optimization';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionRequired: string;
  estimatedTime: string;
  potentialROI?: string;
  confidence: number;
  icon: any;
  color: string;
  module: string;
  tags: string[];
  dateCreated: string;
  status: 'new' | 'in-progress' | 'completed' | 'dismissed';
  relatedMetrics?: {
    current: string;
    target: string;
    improvement: string;
  };
}

// Comprehensive recommendations data
const mockRecommendations: Recommendation[] = [
  // Sales Insights
  {
    id: 'sales-001',
    type: 'sales',
    category: 'insight',
    priority: 'high',
    title: 'Lead Conversion Rate Below Industry Average',
    description: 'Your current lead conversion rate of 24.8% is below the industry standard of 30-35% for B2B SaaS companies.',
    impact: 'Could increase monthly revenue by $45K-60K',
    actionRequired: 'Implement lead scoring and nurturing campaigns',
    estimatedTime: '2-3 weeks',
    potentialROI: '250-300%',
    confidence: 87,
    icon: TrendingUp,
    color: 'bg-blue-500',
    module: 'Sales',
    tags: ['conversion', 'lead-management', 'revenue'],
    dateCreated: '2024-01-20',
    status: 'new',
    relatedMetrics: {
      current: '24.8%',
      target: '32%',
      improvement: '+29%'
    }
  },
  {
    id: 'sales-002',
    type: 'sales',
    category: 'action',
    priority: 'critical',
    title: 'High-Value Deals Stalling in Negotiation',
    description: '12 deals worth $320K total have been in negotiation stage for over 30 days. Immediate intervention needed.',
    impact: 'Risk of losing $320K in pipeline',
    actionRequired: 'Schedule follow-up calls and provide additional incentives',
    estimatedTime: '1 week',
    confidence: 94,
    icon: AlertTriangle,
    color: 'bg-red-500',
    module: 'Sales',
    tags: ['negotiation', 'pipeline', 'follow-up'],
    dateCreated: '2024-01-19',
    status: 'new'
  },
  
  // Task Management
  {
    id: 'task-001',
    type: 'taskboard',
    category: 'alert',
    priority: 'high',
    title: 'Overdue Tasks Affecting Team Productivity',
    description: '23 tasks are overdue, with 68% belonging to high-priority projects. This is impacting overall team velocity.',
    impact: 'Reducing team productivity by 15-20%',
    actionRequired: 'Reassign tasks or extend deadlines for overdue items',
    estimatedTime: '2-3 days',
    confidence: 91,
    icon: Clock,
    color: 'bg-orange-500',
    module: 'Taskboard',
    tags: ['overdue', 'productivity', 'deadlines'],
    dateCreated: '2024-01-20',
    status: 'new'
  },
  {
    id: 'task-002',
    type: 'taskboard',
    category: 'optimization',
    priority: 'medium',
    title: 'Optimize Task Distribution Across Teams',
    description: 'Development team has 45% higher task load compared to other teams. Consider redistribution.',
    impact: 'Could improve overall completion rate by 12%',
    actionRequired: 'Rebalance workload across teams',
    estimatedTime: '1 week',
    confidence: 79,
    icon: Target,
    color: 'bg-purple-500',
    module: 'Taskboard',
    tags: ['workload', 'distribution', 'teams'],
    dateCreated: '2024-01-18',
    status: 'new'
  },
  
  // HR Insights
  {
    id: 'hr-001',
    type: 'hr',
    category: 'insight',
    priority: 'medium',
    title: 'Employee Satisfaction Trending Downward',
    description: 'Based on recent activities and performance metrics, employee satisfaction shows a 8% decline this quarter.',
    impact: 'Risk of increased turnover and reduced productivity',
    actionRequired: 'Conduct team satisfaction survey and address concerns',
    estimatedTime: '2 weeks',
    confidence: 73,
    icon: Users,
    color: 'bg-indigo-500',
    module: 'HR',
    tags: ['satisfaction', 'retention', 'survey'],
    dateCreated: '2024-01-17',
    status: 'new'
  },
  {
    id: 'hr-002',
    type: 'hr',
    category: 'action',
    priority: 'high',
    title: 'Pending Approvals Creating Bottlenecks',
    description: '6 HR approvals are pending for over 5 days, creating workflow bottlenecks and employee frustration.',
    impact: 'Delaying onboarding and operational efficiency',
    actionRequired: 'Review and approve pending requests immediately',
    estimatedTime: '1 day',
    confidence: 98,
    icon: UserPlus,
    color: 'bg-green-500',
    module: 'HR',
    tags: ['approvals', 'workflow', 'efficiency'],
    dateCreated: '2024-01-20',
    status: 'new'
  },
  
  // Financial Insights
  {
    id: 'finance-001',
    type: 'accounting',
    category: 'alert',
    priority: 'critical',
    title: 'Cash Flow Risk from Overdue Payments',
    description: '8 payments totaling $127K are overdue by 15+ days. This poses immediate cash flow risks.',
    impact: 'Potential cash flow shortage next month',
    actionRequired: 'Initiate aggressive collection efforts',
    estimatedTime: '3-5 days',
    confidence: 96,
    icon: DollarSign,
    color: 'bg-yellow-500',
    module: 'Accounting',
    tags: ['cash-flow', 'collections', 'overdue'],
    dateCreated: '2024-01-20',
    status: 'new'
  },
  {
    id: 'finance-002',
    type: 'accounting',
    category: 'optimization',
    priority: 'medium',
    title: 'Expense Optimization Opportunities',
    description: 'Software subscriptions increased 23% without corresponding productivity gains. Review and optimize.',
    impact: 'Could save $15K-20K annually',
    actionRequired: 'Audit software subscriptions and eliminate redundancies',
    estimatedTime: '1-2 weeks',
    potentialROI: '400%',
    confidence: 82,
    icon: TrendingDown,
    color: 'bg-teal-500',
    module: 'Accounting',
    tags: ['expenses', 'optimization', 'subscriptions'],
    dateCreated: '2024-01-19',
    status: 'new'
  },
  
  // Performance Insights
  {
    id: 'perf-001',
    type: 'performance',
    category: 'insight',
    priority: 'high',
    title: 'Top Performers at Risk of Burnout',
    description: 'Your top 3 performers are showing signs of overwork with 60+ hour weeks consistently.',
    impact: 'Risk of losing key talent and knowledge',
    actionRequired: 'Provide additional support or redistribute workload',
    estimatedTime: '1 week',
    confidence: 85,
    icon: Award,
    color: 'bg-pink-500',
    module: 'Performance',
    tags: ['burnout', 'retention', 'workload'],
    dateCreated: '2024-01-18',
    status: 'new'
  },
  
  // System Optimization
  {
    id: 'sys-001',
    type: 'system',
    category: 'optimization',
    priority: 'low',
    title: 'System Performance Optimization',
    description: 'Storage usage at 67% and several optimization opportunities available to improve system speed.',
    impact: 'Improved user experience and system reliability',
    actionRequired: 'Clean up old files and optimize database queries',
    estimatedTime: '3-4 days',
    confidence: 77,
    icon: Zap,
    color: 'bg-gray-500',
    module: 'System',
    tags: ['performance', 'storage', 'optimization'],
    dateCreated: '2024-01-16',
    status: 'new'
  }
];

const SmartRecommendationsPage: React.FC<SmartRecommendationPageProps> = ({ 
  initialTab = 'insights' 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter recommendations based on active tab and filters
  const filteredRecommendations = useMemo(() => {
    let filtered = mockRecommendations;
    
    // Filter by tab category
    filtered = filtered.filter(rec => {
      switch (activeTab) {
        case 'insights': return rec.category === 'insight';
        case 'actions': return rec.category === 'action';
        case 'alerts': return rec.category === 'alert';
        case 'optimization': return rec.category === 'optimization';
        default: return true;
      }
    });
    
    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(rec => rec.priority === selectedPriority);
    }
    
    // Filter by module
    if (selectedModule !== 'all') {
      filtered = filtered.filter(rec => rec.type === selectedModule);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(rec => 
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort by priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }, [activeTab, selectedPriority, selectedModule, searchTerm]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-green-500 bg-green-50 text-green-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertCircle;
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Lightbulb;
    }
  };

  const getTabStats = () => {
    const stats = {
      insights: mockRecommendations.filter(r => r.category === 'insight').length,
      actions: mockRecommendations.filter(r => r.category === 'action').length,
      alerts: mockRecommendations.filter(r => r.category === 'alert').length,
      optimization: mockRecommendations.filter(r => r.category === 'optimization').length
    };
    return stats;
  };

  const stats = getTabStats();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Brain size={28} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-poppins font-bold text-gray-900">
                Smart Recommendations
              </h1>
              <p className="text-gray-600 font-poppins text-lg">
                AI-powered insights and actionable recommendations for your business
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins">
              <RefreshCw size={16} />
              Refresh Insights
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-poppins">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Lightbulb size={20} className="text-blue-600" />
              <span className="text-2xl font-poppins font-bold text-gray-900">{stats.insights}</span>
            </div>
            <p className="text-sm font-poppins text-gray-600">AI Insights</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Target size={20} className="text-green-600" />
              <span className="text-2xl font-poppins font-bold text-gray-900">{stats.actions}</span>
            </div>
            <p className="text-sm font-poppins text-gray-600">Action Items</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600" />
              <span className="text-2xl font-poppins font-bold text-gray-900">{stats.alerts}</span>
            </div>
            <p className="text-sm font-poppins text-gray-600">Performance Alerts</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              <span className="text-2xl font-poppins font-bold text-gray-900">{stats.optimization}</span>
            </div>
            <p className="text-sm font-poppins text-gray-600">Optimization Tips</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'insights', name: 'AI Insights', icon: Lightbulb, count: stats.insights },
              { id: 'actions', name: 'Action Items', icon: Target, count: stats.actions },
              { id: 'alerts', name: 'Performance Alerts', icon: AlertTriangle, count: stats.alerts },
              { id: 'optimization', name: 'Optimization Tips', icon: TrendingUp, count: stats.optimization }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-poppins font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.name}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recommendations..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-poppins"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
            
            <div className="text-sm font-poppins text-gray-600">
              Showing {filteredRecommendations.length} recommendations
            </div>
          </div>

          {showFilters && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
                  Module
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
                >
                  <option value="all">All Modules</option>
                  <option value="sales">Sales</option>
                  <option value="taskboard">Taskboard</option>
                  <option value="hr">HR</option>
                  <option value="accounting">Accounting</option>
                  <option value="performance">Performance</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <button
                onClick={() => {
                  setSelectedPriority('all');
                  setSelectedModule('all');
                  setSearchTerm('');
                }}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors font-poppins"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((rec) => {
          const IconComponent = rec.icon;
          const PriorityIcon = getPriorityIcon(rec.priority);
          
          return (
            <div
              key={rec.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 ${rec.color} rounded-lg shadow-sm`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-poppins font-semibold text-gray-900 text-lg">
                        {rec.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-poppins font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 font-poppins">
                      <span className="flex items-center gap-1">
                        <Building size={12} />
                        {rec.module}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={12} />
                        {rec.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <PriorityIcon size={20} className={`${
                  rec.priority === 'critical' ? 'text-red-500' :
                  rec.priority === 'high' ? 'text-orange-500' :
                  rec.priority === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`} />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-gray-700 font-poppins leading-relaxed">
                  {rec.description}
                </p>

                {/* Metrics */}
                {rec.relatedMetrics && (
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-poppins font-bold text-gray-900">
                        {rec.relatedMetrics.current}
                      </p>
                      <p className="text-xs font-poppins text-gray-600">Current</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-poppins font-bold text-blue-600">
                        {rec.relatedMetrics.target}
                      </p>
                      <p className="text-xs font-poppins text-gray-600">Target</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-poppins font-bold text-green-600">
                        {rec.relatedMetrics.improvement}
                      </p>
                      <p className="text-xs font-poppins text-gray-600">Improvement</p>
                    </div>
                  </div>
                )}

                {/* Impact & Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-poppins font-medium text-blue-700 mb-1">Impact</p>
                    <p className="text-sm font-poppins text-blue-600">{rec.impact}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-poppins font-medium text-green-700 mb-1">Action Required</p>
                    <p className="text-sm font-poppins text-green-600">{rec.actionRequired}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm font-poppins text-gray-600">
                  <span>Time needed: {rec.estimatedTime}</span>
                  {rec.potentialROI && (
                    <span className="text-green-600 font-medium">ROI: {rec.potentialROI}</span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {rec.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-poppins rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-poppins text-sm">
                    Take Action
                    <ArrowRight size={14} />
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-poppins text-sm">
                    Dismiss
                  </button>
                </div>
                <div className="text-xs font-poppins text-gray-500">
                  Created {new Date(rec.dateCreated).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Brain size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No recommendations found
          </h3>
          <p className="text-gray-600 font-poppins">
            Try adjusting your filters or check back later for new insights.
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendationsPage; 