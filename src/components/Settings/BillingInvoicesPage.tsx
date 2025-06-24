import React, { useState } from 'react';
import { 
  CreditCard, Download, Calendar, Filter, Eye, CheckCircle, AlertCircle, 
  Crown, Zap, Shield, Users, Database, Headphones, ArrowRight, Star,
  TrendingUp, DollarSign, FileText, Clock, RefreshCw, Settings, 
  ChevronDown, Search, BarChart3, PieChart, Activity, Target
} from 'lucide-react';
import DateRangePicker, { DateRange } from '../Common/DateRangePicker';

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: {
    users: number | 'unlimited';
    storage: string;
    projects: number | 'unlimited';
    apiCalls: number | 'unlimited';
  };
  badge?: string;
  popular?: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  plan: string;
  billingPeriod: string;
  downloadUrl?: string;
}

interface BillingInvoicesPageProps {
  onBack: () => void;
}

const BillingInvoicesPage: React.FC<BillingInvoicesPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'plans'>('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    preset: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Current subscription data
  const currentPlan = {
    name: 'Professional',
    price: 49,
    billingCycle: 'monthly' as const,
    nextBilling: '2024-03-15',
    status: 'active',
    users: 25,
    usagePercentage: {
      users: 68,
      storage: 45,
      apiCalls: 23
    }
  };

  // Available plans
  const billingPlans: BillingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 19,
      billingCycle: 'monthly',
      features: [
        'Up to 5 team members',
        '10GB cloud storage',
        'Basic reporting',
        'Email support',
        'Core ERP modules'
      ],
      limits: {
        users: 5,
        storage: '10GB',
        projects: 10,
        apiCalls: 1000
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49,
      billingCycle: 'monthly',
      features: [
        'Up to 25 team members',
        '100GB cloud storage',
        'Advanced analytics',
        'Priority support',
        'All ERP modules',
        'Custom integrations'
      ],
      limits: {
        users: 25,
        storage: '100GB',
        projects: 50,
        apiCalls: 10000
      },
      popular: true,
      badge: 'Most Popular'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      billingCycle: 'monthly',
      features: [
        'Unlimited team members',
        '1TB cloud storage',
        'Real-time analytics',
        '24/7 phone support',
        'White-label solution',
        'Advanced security',
        'Custom development'
      ],
      limits: {
        users: 'unlimited',
        storage: '1TB',
        projects: 'unlimited',
        apiCalls: 'unlimited'
      },
      badge: 'Enterprise'
    }
  ];

  // Sample invoices data
  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      date: '2024-02-15',
      dueDate: '2024-03-15',
      amount: 49.00,
      status: 'paid',
      plan: 'Professional Plan',
      billingPeriod: 'Feb 15 - Mar 15, 2024'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 49.00,
      status: 'paid',
      plan: 'Professional Plan',
      billingPeriod: 'Jan 15 - Feb 15, 2024'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2023-012',
      date: '2023-12-15',
      dueDate: '2024-01-15',
      amount: 49.00,
      status: 'paid',
      plan: 'Professional Plan',
      billingPeriod: 'Dec 15, 2023 - Jan 15, 2024'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2023-011',
      date: '2023-11-15',
      dueDate: '2023-12-15',
      amount: 19.00,
      status: 'paid',
      plan: 'Starter Plan',
      billingPeriod: 'Nov 15 - Dec 15, 2023'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.plan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    const invoiceDate = new Date(invoice.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const matchesDateRange = dateRange.preset === 'all' || (invoiceDate >= startDate && invoiceDate <= endDate);
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'failed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'overdue': return <AlertCircle size={14} />;
      case 'failed': return <AlertCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const averageMonthly = totalSpent / 12;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} className="text-blue-600" />
              <h2 className="text-xl font-poppins font-semibold text-gray-900">Current Plan</h2>
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-poppins font-medium">
                Active
              </span>
            </div>
            <p className="text-gray-700 font-poppins">You're currently on the {currentPlan.name} plan</p>
          </div>
          <button
            onClick={() => setActiveTab('plans')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Zap size={16} />
            Upgrade Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-poppins text-gray-600">Monthly Cost</span>
              <DollarSign size={16} className="text-blue-600" />
            </div>
            <p className="text-2xl font-poppins font-semibold text-gray-900">${currentPlan.price}</p>
            <p className="text-xs text-gray-500 font-poppins">Next billing: {currentPlan.nextBilling}</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-poppins text-gray-600">Team Members</span>
              <Users size={16} className="text-green-600" />
            </div>
            <p className="text-2xl font-poppins font-semibold text-gray-900">{currentPlan.users}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-600 h-1.5 rounded-full" 
                style={{ width: `${currentPlan.usagePercentage.users}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 font-poppins mt-1">{currentPlan.usagePercentage.users}% used</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-poppins text-gray-600">Storage Used</span>
              <Database size={16} className="text-purple-600" />
            </div>
            <p className="text-2xl font-poppins font-semibold text-gray-900">45GB</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-purple-600 h-1.5 rounded-full" 
                style={{ width: `${currentPlan.usagePercentage.storage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 font-poppins mt-1">{currentPlan.usagePercentage.storage}% of 100GB</p>
          </div>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-green-600" />
            <span className="font-poppins font-medium text-gray-900">Total Spent</span>
          </div>
          <p className="text-3xl font-poppins font-semibold text-gray-900">${totalSpent.toFixed(2)}</p>
          <p className="text-sm text-gray-500 font-poppins mt-1">Lifetime billing</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={20} className="text-blue-600" />
            <span className="font-poppins font-medium text-gray-900">Monthly Average</span>
          </div>
          <p className="text-3xl font-poppins font-semibold text-gray-900">${averageMonthly.toFixed(2)}</p>
          <p className="text-sm text-gray-500 font-poppins mt-1">Over 12 months</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={20} className="text-purple-600" />
            <span className="font-poppins font-medium text-gray-900">Total Invoices</span>
          </div>
          <p className="text-3xl font-poppins font-semibold text-gray-900">{invoices.length}</p>
          <p className="text-sm text-gray-500 font-poppins mt-1">All time records</p>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">Recent Invoices</h3>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-blue-600 hover:text-blue-700 font-poppins font-medium text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {invoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-poppins font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500 font-poppins">{invoice.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-poppins font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-poppins font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-36"
              >
                <option value="All">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Date Range */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="min-w-44"
            />
          </div>

          {/* Export Button */}
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
            <Download size={16} />
            Export All
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Invoice</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Plan</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Amount</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Date</th>
                <th className="text-right px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-poppins font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-500 font-poppins">{invoice.billingPeriod}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-poppins text-gray-900">{invoice.plan}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-poppins font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-poppins font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-poppins text-gray-900">{new Date(invoice.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="View Invoice">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Download PDF">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600 font-poppins">Try adjusting your search criteria or date range.</p>
        </div>
      )}
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      {/* Plan Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {billingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border-2 p-6 relative ${
              plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            } ${currentPlan.name.toLowerCase() === plan.name.toLowerCase() ? 'ring-2 ring-green-500' : ''}`}
          >
            {plan.badge && (
              <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-poppins font-medium ${
                plan.popular ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {plan.badge}
              </div>
            )}

            {currentPlan.name.toLowerCase() === plan.name.toLowerCase() && (
              <div className="absolute -top-3 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-poppins font-medium">
                Current Plan
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-center justify-center gap-1 mb-4">
                <span className="text-3xl font-poppins font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500 font-poppins">/{plan.billingCycle}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                  <span className="text-sm font-poppins text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-poppins">Users:</span>
                <span className="font-poppins font-medium">{plan.limits.users}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-poppins">Storage:</span>
                <span className="font-poppins font-medium">{plan.limits.storage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-poppins">Projects:</span>
                <span className="font-poppins font-medium">{plan.limits.projects}</span>
              </div>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg font-poppins font-medium transition-colors duration-200 ${
                currentPlan.name.toLowerCase() === plan.name.toLowerCase()
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
              disabled={currentPlan.name.toLowerCase() === plan.name.toLowerCase()}
            >
              {currentPlan.name.toLowerCase() === plan.name.toLowerCase() 
                ? 'Current Plan' 
                : 'Upgrade to ' + plan.name
              }
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-poppins font-semibold text-gray-900">Detailed Feature Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900">Features</th>
                {billingPlans.map((plan) => (
                  <th key={plan.id} className="text-center px-6 py-4 font-poppins font-semibold text-gray-900">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-poppins text-gray-900">Team Members</td>
                {billingPlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-center font-poppins">{plan.limits.users}</td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-poppins text-gray-900">Cloud Storage</td>
                {billingPlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-center font-poppins">{plan.limits.storage}</td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-poppins text-gray-900">API Calls/Month</td>
                {billingPlans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-center font-poppins">{plan.limits.apiCalls}</td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-poppins text-gray-900">Priority Support</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">✅</td>
                <td className="px-6 py-4 text-center">✅</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-poppins text-gray-900">Custom Integrations</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">✅</td>
                <td className="px-6 py-4 text-center">✅</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-poppins text-gray-900">White-label Solution</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Billing & Invoices
            </h1>
            <p className="text-gray-600 font-poppins">
              Manage your subscription, view billing history, and upgrade your plan
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
              <Settings size={16} />
              Payment Methods
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'overview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'invoices' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={16} />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-3 border-b-2 font-poppins font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'plans' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Crown size={16} />
            Plans & Pricing
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'invoices' && renderInvoices()}
      {activeTab === 'plans' && renderPlans()}
    </div>
  );
};

export default BillingInvoicesPage; 