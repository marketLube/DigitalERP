import React, { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, FileText, Receipt, PieChart, Calendar, ArrowUpRight, ArrowDownRight, Eye, Download, Plus, Filter } from 'lucide-react';

interface QuickStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

interface AccountingDashboardProps {
  onNavigate: (page: string) => void;
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const quickStats: QuickStat[] = [
    {
      title: 'Total Revenue',
      value: '$124,562',
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: '$89,234',
      change: '+8.2%',
      changeType: 'negative',
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      title: 'Net Profit',
      value: '$35,328',
      change: '+18.7%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'Outstanding Invoices',
      value: '$18,450',
      change: '-5.3%',
      changeType: 'positive',
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-02-15',
      description: 'Client Payment - TechCorp Project',
      category: 'Revenue',
      amount: 15000,
      type: 'income',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-02-14',
      description: 'Office Rent Payment',
      category: 'Operating Expenses',
      amount: 3500,
      type: 'expense',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-02-13',
      description: 'Software Subscription - Adobe Creative',
      category: 'Software & Tools',
      amount: 599,
      type: 'expense',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-02-12',
      description: 'Freelancer Payment - Design Work',
      category: 'Contractor Fees',
      amount: 2800,
      type: 'expense',
      status: 'pending'
    },
    {
      id: '5',
      date: '2024-02-11',
      description: 'Product Sales - E-commerce',
      category: 'Product Revenue',
      amount: 8750,
      type: 'income',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Day Book',
      description: 'Daily transaction records',
      icon: Calendar,
      color: 'bg-blue-500',
      onClick: () => onNavigate('daybook')
    },
    {
      title: 'Create Invoice',
      description: 'Generate new invoice',
      icon: FileText,
      color: 'bg-green-500',
      onClick: () => onNavigate('invoices')
    },
    {
      title: 'Tax Compliance',
      description: 'Tax reports & filing',
      icon: Receipt,
      color: 'bg-purple-500',
      onClick: () => onNavigate('tax')
    },
    {
      title: 'P&L Report',
      description: 'Profit & Loss analysis',
      icon: PieChart,
      color: 'bg-orange-500',
      onClick: () => onNavigate('profit-loss')
    }
  ];

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Accounting Dashboard
            </h1>
            <p className="text-gray-600 font-poppins">
              Monitor your financial performance and manage accounting operations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color === 'text-green-600' ? 'bg-green-50' : stat.color === 'text-red-600' ? 'bg-red-50' : stat.color === 'text-blue-600' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                  <IconComponent size={20} className={stat.color} />
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
        <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200 text-left group animate-slideUp"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 font-poppins">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-poppins font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <button
              onClick={() => onNavigate('daybook')}
              className="text-blue-600 hover:text-blue-700 font-poppins font-medium text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200"
            >
              View All
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slideUp"
                style={{ animationDelay: `${(index + 8) * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowDownRight size={16} className="text-green-600" />
                    ) : (
                      <ArrowUpRight size={16} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-poppins font-medium text-gray-900 text-sm">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-gray-500 font-poppins">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <span className="text-xs text-gray-500">•</span>
                      <p className="text-xs text-gray-500 font-poppins">
                        {transaction.category}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-poppins font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;