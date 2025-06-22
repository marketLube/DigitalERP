import React, { useState, useMemo } from 'react';
import { 
  Brain, Search, Filter, TrendingUp, AlertTriangle, Zap, Target, DollarSign, Users,
  BarChart3, PieChart, ArrowUp, ArrowDown, Clock, CheckCircle, XCircle, 
  Lightbulb, Activity, Shield, Globe, Cpu, Database, Smartphone, Gauge,
  TrendingDown, Calendar, FileText, Settings, Star, Award, Briefcase,
  ChevronRight, Eye, ThumbsUp, AlertCircle, Info, 
  Factory, ShoppingCart, CreditCard, Truck, MessageSquare, UserCheck
} from 'lucide-react';

interface SmartRecommendationsPageProps {
  initialTab?: 'insights' | 'actions' | 'alerts' | 'optimization';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'efficiency' | 'cost' | 'risk' | 'compliance' | 'growth' | 'customer' | 'operations';
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeToImplement: string;
  estimatedSavings?: string;
  estimatedROI?: string;
  module: 'sales' | 'taskboard' | 'hr' | 'accounting' | 'reports' | 'system' | 'cross-module';
  tags: string[];
  actionItems: string[];
  metrics: {
    current: string;
    target: string;
    benchmark: string;
  };
  relatedData?: any;
}

const SmartRecommendationsPage: React.FC<SmartRecommendationsPageProps> = ({ initialTab = 'insights' }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'actions' | 'alerts' | 'optimization'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Comprehensive, next-level recommendations based on ERP best practices and AI insights
  const recommendations: Recommendation[] = [
    // SALES MODULE INSIGHTS
    {
      id: 'sales-conversion-optimization',
      title: 'Optimize Lead Conversion Funnel',
      description: 'Current conversion rate of 24.8% is below industry benchmark of 30-35%. Advanced analytics reveal 47% of qualified leads stagnate in proposal stage for >21 days.',
      category: 'revenue',
      priority: 'critical',
      confidence: 94,
      impact: 'high',
      timeToImplement: '2-3 weeks',
      estimatedSavings: '$127K annually',
      estimatedROI: '340%',
      module: 'sales',
      tags: ['conversion', 'revenue', 'pipeline', 'automation'],
      actionItems: [
        'Implement automated follow-up sequences for proposals >14 days',
        'Deploy AI-powered lead scoring based on engagement patterns',
        'Create dynamic pricing models for faster deal closure',
        'Set up real-time alerts for high-value prospects going cold'
      ],
      metrics: {
        current: '24.8% conversion rate',
        target: '32% conversion rate',
        benchmark: '30-35% industry average'
      }
    },
    {
      id: 'deal-velocity-acceleration',
      title: 'Accelerate Deal Velocity',
      description: 'Average deal cycle of 67 days is 23% longer than industry average. Predictive analytics identify 3 key bottlenecks causing delays in the sales process.',
      category: 'efficiency',
      priority: 'high',
      confidence: 89,
      impact: 'high',
      timeToImplement: '1-2 weeks',
      estimatedSavings: '$89K annually',
      estimatedROI: '280%',
      module: 'sales',
      tags: ['velocity', 'automation', 'bottlenecks', 'process'],
      actionItems: [
        'Automate proposal generation with smart templates',
        'Implement e-signature workflow for faster approvals',
        'Deploy real-time deal health scoring',
        'Create sales playbooks for common objections'
      ],
      metrics: {
        current: '67 days average cycle',
        target: '45 days average cycle',
        benchmark: '52 days industry average'
      }
    },
    
    // TASKBOARD/PROJECT INSIGHTS
    {
      id: 'overdue-task-crisis',
      title: 'Address Critical Task Overdue Crisis',
      description: '23 overdue tasks representing $127K in potential revenue impact. AI analysis reveals systemic resource allocation issues and capacity planning gaps.',
      category: 'risk',
      priority: 'critical',
      confidence: 96,
      impact: 'high',
      timeToImplement: '1 week',
      estimatedSavings: '$127K revenue protection',
      estimatedROI: 'Immediate',
      module: 'taskboard',
      tags: ['overdue', 'resource-allocation', 'capacity', 'urgent'],
      actionItems: [
        'Implement AI-powered workload balancing',
        'Deploy predictive task completion modeling',
        'Create automated escalation workflows',
        'Establish real-time capacity monitoring'
      ],
      metrics: {
        current: '23 overdue tasks',
        target: '<5 overdue tasks',
        benchmark: '3-5 overdue tasks per 100'
      }
    },
    {
      id: 'team-productivity-optimization',
      title: 'Optimize Team Productivity Distribution',
      description: 'Task distribution analysis reveals 78% productivity variance across teams. Video Production team is operating at 134% capacity while Social Media team is at 67%.',
      category: 'efficiency',
      priority: 'high',
      confidence: 92,
      impact: 'medium',
      timeToImplement: '2-3 weeks',
      estimatedSavings: '$45K annually',
      estimatedROI: '180%',
      module: 'taskboard',
      tags: ['productivity', 'balance', 'capacity', 'redistribution'],
      actionItems: [
        'Implement dynamic resource reallocation system',
        'Deploy cross-team skill sharing programs',
        'Create automated workload balancing alerts',
        'Establish productivity benchmarking dashboards'
      ],
      metrics: {
        current: '78% variance in productivity',
        target: '<25% variance',
        benchmark: '15-20% optimal variance'
      }
    },

    // HR MODULE INSIGHTS
    {
      id: 'employee-burnout-prevention',
      title: 'Prevent Employee Burnout Crisis',
      description: 'Predictive analytics identify 6 employees at high burnout risk. Correlation analysis shows 78% higher turnover probability for employees with >55 hour work weeks.',
      category: 'risk',
      priority: 'critical',
      confidence: 87,
      impact: 'high',
      timeToImplement: '1-2 weeks',
      estimatedSavings: '$78K in replacement costs',
      estimatedROI: '450%',
      module: 'hr',
      tags: ['burnout', 'retention', 'wellness', 'predictive'],
      actionItems: [
        'Deploy AI-powered workload monitoring',
        'Implement automated wellness check-ins',
        'Create flexible work arrangement protocols',
        'Establish burnout risk scoring system'
      ],
      metrics: {
        current: '6 high-risk employees',
        target: '0 high-risk employees',
        benchmark: '<2% of workforce at risk'
      }
    },
    {
      id: 'leave-approval-bottleneck',
      title: 'Streamline Leave Approval Process',
      description: '6 pending leave requests averaging 12 days approval time. Automated workflow could reduce to 2 days while improving employee satisfaction by 34%.',
      category: 'efficiency',
      priority: 'medium',
      confidence: 85,
      impact: 'medium',
      timeToImplement: '1 week',
      estimatedSavings: '$12K annually',
      estimatedROI: '240%',
      module: 'hr',
      tags: ['approval', 'automation', 'satisfaction', 'workflow'],
      actionItems: [
        'Implement automated approval workflows',
        'Deploy manager notification systems',
        'Create self-service leave management portal',
        'Establish approval SLA monitoring'
      ],
      metrics: {
        current: '12 days average approval',
        target: '2 days average approval',
        benchmark: '3-4 days industry standard'
      }
    },

    // ACCOUNTING MODULE INSIGHTS
    {
      id: 'cash-flow-optimization',
      title: 'Optimize Cash Flow Management',
      description: '8 overdue payments totaling $127K. AI analysis reveals payment pattern insights that could accelerate collections by 40% through strategic timing.',
      category: 'cost',
      priority: 'critical',
      confidence: 91,
      impact: 'high',
      timeToImplement: '1-2 weeks',
      estimatedSavings: '$51K cash flow improvement',
      estimatedROI: '380%',
      module: 'accounting',
      tags: ['cash-flow', 'collections', 'automation', 'timing'],
      actionItems: [
        'Implement AI-powered payment prediction',
        'Deploy automated dunning workflows',
        'Create customer payment behavior scoring',
        'Establish early payment incentive programs'
      ],
      metrics: {
        current: '$127K overdue payments',
        target: '<$25K overdue payments',
        benchmark: '<5% of AR overdue'
      }
    },
    {
      id: 'expense-anomaly-detection',
      title: 'Implement Smart Expense Controls',
      description: 'ML algorithms detected $23K in expense anomalies this quarter. Pattern analysis suggests 15% potential cost reduction through automated expense validation.',
      category: 'cost',
      priority: 'high',
      confidence: 88,
      impact: 'medium',
      timeToImplement: '2-3 weeks',
      estimatedSavings: '$34K annually',
      estimatedROI: '220%',
      module: 'accounting',
      tags: ['expenses', 'anomaly', 'validation', 'control'],
      actionItems: [
        'Deploy ML-based expense anomaly detection',
        'Implement real-time expense validation',
        'Create automated approval workflows',
        'Establish spending pattern alerts'
      ],
      metrics: {
        current: '$23K anomalies detected',
        target: '<$5K anomalies per quarter',
        benchmark: '<2% of total expenses'
      }
    },

    // CROSS-MODULE INSIGHTS
    {
      id: 'data-integration-optimization',
      title: 'Eliminate Data Silos',
      description: 'Cross-system analysis reveals 23% data inconsistency between modules. Unified data strategy could improve decision-making accuracy by 45%.',
      category: 'efficiency',
      priority: 'high',
      confidence: 93,
      impact: 'high',
      timeToImplement: '3-4 weeks',
      estimatedSavings: '$67K annually',
      estimatedROI: '290%',
      module: 'cross-module',
      tags: ['integration', 'data-quality', 'consistency', 'automation'],
      actionItems: [
        'Implement real-time data synchronization',
        'Deploy data quality monitoring',
        'Create unified dashboard views',
        'Establish data governance protocols'
      ],
      metrics: {
        current: '23% data inconsistency',
        target: '<5% data inconsistency',
        benchmark: '<3% for mature ERP systems'
      }
    },
    {
      id: 'predictive-maintenance',
      title: 'Deploy Predictive System Maintenance',
      description: 'System performance analytics indicate potential performance degradation. Proactive maintenance could prevent 89% of system issues before they impact users.',
      category: 'risk',
      priority: 'medium',
      confidence: 84,
      impact: 'medium',
      timeToImplement: '2-3 weeks',
      estimatedSavings: '$28K in downtime prevention',
      estimatedROI: '320%',
      module: 'system',
      tags: ['maintenance', 'performance', 'prevention', 'monitoring'],
      actionItems: [
        'Implement automated system health monitoring',
        'Deploy predictive performance analytics',
        'Create proactive maintenance schedules',
        'Establish performance baseline monitoring'
      ],
      metrics: {
        current: '94% system health',
        target: '>98% system health',
        benchmark: '99% for enterprise systems'
      }
    },

    // ADVANCED BUSINESS INTELLIGENCE
    {
      id: 'customer-churn-prediction',
      title: 'Prevent Customer Churn with AI',
      description: 'Advanced analytics identify 12 customers at high churn risk representing $89K annual revenue. Proactive intervention could retain 85% of at-risk customers.',
      category: 'customer',
      priority: 'high',
      confidence: 89,
      impact: 'high',
      timeToImplement: '2 weeks',
      estimatedSavings: '$75K revenue retention',
      estimatedROI: '420%',
      module: 'sales',
      tags: ['churn', 'retention', 'prediction', 'intervention'],
      actionItems: [
        'Deploy AI-powered churn prediction models',
        'Implement automated retention campaigns',
        'Create customer health scoring',
        'Establish proactive outreach protocols'
      ],
      metrics: {
        current: '12 at-risk customers',
        target: '<5 at-risk customers',
        benchmark: '<3% customer churn rate'
      }
    },
    
    // COMPETITIVE INTELLIGENCE
    {
      id: 'market-positioning-optimization',
      title: 'Optimize Market Positioning Strategy',
      description: 'Competitive analysis reveals opportunity to capture 12% additional market share in Video Production services. Strategic pricing adjustments could increase margins by 8%.',
      category: 'growth',
      priority: 'medium',
      confidence: 82,
      impact: 'high',
      timeToImplement: '4-6 weeks',
      estimatedSavings: '$156K revenue opportunity',
      estimatedROI: '280%',
      module: 'sales',
      tags: ['positioning', 'competitive', 'pricing', 'market-share'],
      actionItems: [
        'Implement dynamic competitive pricing',
        'Deploy market intelligence monitoring',
        'Create value proposition optimization',
        'Establish competitive response protocols'
      ],
      metrics: {
        current: '23% market share',
        target: '35% market share',
        benchmark: '28% industry leader share'
      }
    }
  ];

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const matchesSearch = searchQuery === '' || 
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPriority = selectedPriority === 'all' || rec.priority === selectedPriority;
      const matchesModule = selectedModule === 'all' || rec.module === selectedModule;
      const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;

      return matchesSearch && matchesPriority && matchesModule && matchesCategory;
    });
  }, [searchQuery, selectedPriority, selectedModule, selectedCategory, recommendations]);

  const getRecommendationsByTab = () => {
    switch (activeTab) {
      case 'insights':
        return filteredRecommendations.filter(r => ['revenue', 'growth', 'customer'].includes(r.category));
      case 'actions':
        return filteredRecommendations.filter(r => r.priority === 'critical' || r.priority === 'high');
      case 'alerts':
        return filteredRecommendations.filter(r => r.category === 'risk' || r.priority === 'critical');
      case 'optimization':
        return filteredRecommendations.filter(r => ['efficiency', 'cost', 'operations'].includes(r.category));
      default:
        return filteredRecommendations;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign size={16} />;
      case 'efficiency': return <Zap size={16} />;
      case 'cost': return <TrendingDown size={16} />;
      case 'risk': return <AlertTriangle size={16} />;
      case 'compliance': return <Shield size={16} />;
      case 'growth': return <TrendingUp size={16} />;
      case 'customer': return <Users size={16} />;
      case 'operations': return <Settings size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'sales': return <ShoppingCart size={16} />;
      case 'taskboard': return <CheckCircle size={16} />;
      case 'hr': return <Users size={16} />;
      case 'accounting': return <CreditCard size={16} />;
      case 'reports': return <BarChart3 size={16} />;
      case 'system': return <Cpu size={16} />;
      case 'cross-module': return <Globe size={16} />;
      default: return <Briefcase size={16} />;
    }
  };

  // Quick stats for the dashboard
  const quickStats = {
    totalRecommendations: recommendations.length,
    criticalAlerts: recommendations.filter(r => r.priority === 'critical').length,
    potentialSavings: '$547K',
    averageROI: '312%',
    implementationTime: '2.3 weeks avg'
  };

  const displayRecommendations = getRecommendationsByTab();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">Smart Recommendations</h1>
            <p className="text-gray-600 font-poppins">AI-powered insights for operational excellence</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Insights</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{quickStats.totalRecommendations}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm font-medium text-gray-600">Critical Alerts</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{quickStats.criticalAlerts}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-sm font-medium text-gray-600">Potential Savings</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{quickStats.potentialSavings}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Average ROI</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{quickStats.averageROI}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Avg Implementation</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{quickStats.implementationTime}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-6 border-b border-gray-200 mb-6">
          {[
            { id: 'insights', label: 'AI Insights', icon: Brain },
            { id: 'actions', label: 'Action Items', icon: Target },
            { id: 'alerts', label: 'Critical Alerts', icon: AlertTriangle },
            { id: 'optimization', label: 'Optimization', icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-32"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-32"
            >
              <option value="all">All Modules</option>
              <option value="sales">Sales</option>
              <option value="taskboard">Taskboard</option>
              <option value="hr">HR</option>
              <option value="accounting">Accounting</option>
              <option value="reports">Reports</option>
              <option value="system">System</option>
              <option value="cross-module">Cross-Module</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-32"
            >
              <option value="all">All Categories</option>
              <option value="revenue">Revenue</option>
              <option value="efficiency">Efficiency</option>
              <option value="cost">Cost</option>
              <option value="risk">Risk</option>
              <option value="growth">Growth</option>
              <option value="customer">Customer</option>
              <option value="operations">Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {displayRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    recommendation.category === 'revenue' ? 'bg-green-100' :
                    recommendation.category === 'efficiency' ? 'bg-blue-100' :
                    recommendation.category === 'cost' ? 'bg-purple-100' :
                    recommendation.category === 'risk' ? 'bg-red-100' :
                    recommendation.category === 'growth' ? 'bg-orange-100' :
                    'bg-gray-100'
                  }`}>
                    {getCategoryIcon(recommendation.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 font-poppins">{recommendation.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                        {recommendation.priority.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                        {getModuleIcon(recommendation.module)}
                        {recommendation.module}
                      </span>
                      <span className="text-xs text-gray-500">
                        {recommendation.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {recommendation.estimatedSavings && (
                    <p className="text-lg font-bold text-green-600">{recommendation.estimatedSavings}</p>
                  )}
                  {recommendation.estimatedROI && (
                    <p className="text-sm text-gray-600">{recommendation.estimatedROI} ROI</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 font-poppins">{recommendation.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Current</p>
                  <p className="text-sm font-semibold text-red-700">{recommendation.metrics.current}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Target</p>
                  <p className="text-sm font-semibold text-blue-700">{recommendation.metrics.target}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Benchmark</p>
                  <p className="text-sm font-semibold text-green-700">{recommendation.metrics.benchmark}</p>
                </div>
              </div>

              {/* Action Items */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target size={16} />
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {recommendation.actionItems.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags and Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {recommendation.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {recommendation.timeToImplement}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity size={14} />
                    {recommendation.impact} impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayRecommendations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Brain size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendationsPage; 