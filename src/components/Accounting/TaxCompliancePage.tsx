import React, { useState } from 'react';
import { Receipt, Calendar, Download, FileText, AlertTriangle, CheckCircle, Clock, TrendingUp, Calculator, Eye, Plus, Filter } from 'lucide-react';

interface TaxRecord {
  id: string;
  period: string;
  type: 'quarterly' | 'annual' | 'monthly';
  status: 'pending' | 'filed' | 'overdue' | 'paid';
  dueDate: string;
  filedDate?: string;
  amount: number;
  taxType: string;
  description: string;
  attachments: number;
}

interface TaxSummary {
  totalTaxLiability: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}

interface TaxCompliancePageProps {
  onBack: () => void;
}

const TaxCompliancePage: React.FC<TaxCompliancePageProps> = ({ onBack }) => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'overview' | 'records'>('overview');

  const taxRecords: TaxRecord[] = [
    {
      id: '1',
      period: 'Q1 2024',
      type: 'quarterly',
      status: 'filed',
      dueDate: '2024-04-15',
      filedDate: '2024-04-10',
      amount: 12500,
      taxType: 'Income Tax',
      description: 'Quarterly income tax payment',
      attachments: 3
    },
    {
      id: '2',
      period: 'Q2 2024',
      type: 'quarterly',
      status: 'pending',
      dueDate: '2024-07-15',
      amount: 15200,
      taxType: 'Income Tax',
      description: 'Quarterly income tax payment',
      attachments: 2
    },
    {
      id: '3',
      period: 'March 2024',
      type: 'monthly',
      status: 'paid',
      dueDate: '2024-04-20',
      filedDate: '2024-04-18',
      amount: 3200,
      taxType: 'Sales Tax',
      description: 'Monthly sales tax return',
      attachments: 1
    },
    {
      id: '4',
      period: 'April 2024',
      type: 'monthly',
      status: 'overdue',
      dueDate: '2024-05-20',
      amount: 3800,
      taxType: 'Sales Tax',
      description: 'Monthly sales tax return',
      attachments: 0
    },
    {
      id: '5',
      period: '2023',
      type: 'annual',
      status: 'filed',
      dueDate: '2024-03-15',
      filedDate: '2024-03-10',
      amount: 45000,
      taxType: 'Annual Return',
      description: 'Annual tax return filing',
      attachments: 8
    }
  ];

  const taxTypes = ['All', 'Income Tax', 'Sales Tax', 'Annual Return', 'Payroll Tax'];
  const statuses = ['All', 'Pending', 'Filed', 'Overdue', 'Paid'];

  const filteredRecords = taxRecords.filter(record => {
    const matchesType = selectedType === 'All' || record.taxType === selectedType;
    const matchesStatus = selectedStatus === 'All' || record.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesType && matchesStatus;
  });

  const taxSummary: TaxSummary = {
    totalTaxLiability: filteredRecords.reduce((sum, record) => sum + record.amount, 0),
    totalPaid: filteredRecords.filter(r => r.status === 'paid' || r.status === 'filed').reduce((sum, record) => sum + record.amount, 0),
    totalPending: filteredRecords.filter(r => r.status === 'pending').reduce((sum, record) => sum + record.amount, 0),
    totalOverdue: filteredRecords.filter(r => r.status === 'overdue').reduce((sum, record) => sum + record.amount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'filed': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'paid': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'filed': return <CheckCircle size={14} />;
      case 'overdue': return <AlertTriangle size={14} />;
      case 'paid': return <CheckCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const upcomingDeadlines = taxRecords
    .filter(record => record.status === 'pending' || record.status === 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Tax Compliance
            </h1>
            <p className="text-gray-600 font-poppins">
              Manage tax filings, deadlines, and compliance requirements
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            
            <button
              onClick={() => setViewMode(viewMode === 'overview' ? 'records' : 'overview')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              {viewMode === 'overview' ? 'View Records' : 'Overview'}
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          {/* Tax Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Calculator size={20} className="text-blue-600" />
                <span className="font-poppins font-medium text-gray-900">Total Liability</span>
              </div>
              <p className="text-2xl font-poppins font-semibold text-gray-900">
                ${taxSummary.totalTaxLiability.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 font-poppins mt-1">
                {filteredRecords.length} tax obligations
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-poppins font-medium text-gray-900">Paid/Filed</span>
              </div>
              <p className="text-2xl font-poppins font-semibold text-green-600">
                ${taxSummary.totalPaid.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 font-poppins mt-1">
                {Math.round((taxSummary.totalPaid / taxSummary.totalTaxLiability) * 100)}% completed
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={20} className="text-yellow-600" />
                <span className="font-poppins font-medium text-gray-900">Pending</span>
              </div>
              <p className="text-2xl font-poppins font-semibold text-yellow-600">
                ${taxSummary.totalPending.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 font-poppins mt-1">
                {filteredRecords.filter(r => r.status === 'pending').length} pending filings
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={20} className="text-red-600" />
                <span className="font-poppins font-medium text-gray-900">Overdue</span>
              </div>
              <p className="text-2xl font-poppins font-semibold text-red-600">
                ${taxSummary.totalOverdue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 font-poppins mt-1">
                {filteredRecords.filter(r => r.status === 'overdue').length} overdue items
              </p>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-poppins font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar size={20} className="text-orange-600" />
                  Upcoming Deadlines
                </h2>
              </div>
              <div className="p-6">
                {upcomingDeadlines.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-poppins">All tax obligations are up to date!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingDeadlines.map((record, index) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-slideUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            record.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            {getStatusIcon(record.status)}
                          </div>
                          <div>
                            <p className="font-poppins font-medium text-gray-900 text-sm">
                              {record.taxType} - {record.period}
                            </p>
                            <p className="text-xs text-gray-500 font-poppins">
                              Due: {new Date(record.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-poppins font-semibold text-gray-900 text-sm">
                            ${record.amount.toLocaleString()}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tax Calendar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-poppins font-semibold text-gray-900 flex items-center gap-2">
                  <Receipt size={20} className="text-purple-600" />
                  Tax Calendar {selectedYear}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { month: 'January', items: ['Annual W-2 Forms Due', 'Q4 Payroll Tax'] },
                    { month: 'March', items: ['Annual Tax Return Due', 'Q1 Estimated Tax'] },
                    { month: 'April', items: ['Q1 Payroll Tax', 'Sales Tax Return'] },
                    { month: 'June', items: ['Q2 Estimated Tax', 'Q1 Income Tax'] },
                    { month: 'September', items: ['Q3 Estimated Tax', 'Q2 Income Tax'] },
                    { month: 'December', items: ['Q4 Estimated Tax', 'Year-end Planning'] }
                  ].map((month, index) => (
                    <div key={month.month} className="animate-slideUp" style={{ animationDelay: `${index * 100}ms` }}>
                      <h4 className="font-poppins font-semibold text-gray-900 text-sm mb-2">
                        {month.month}
                      </h4>
                      <div className="space-y-1">
                        {month.items.map((item, itemIndex) => (
                          <p key={itemIndex} className="text-sm text-gray-600 font-poppins pl-4 border-l-2 border-blue-200">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-poppins font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                      <FileText size={20} className="text-blue-600" />
                    </div>
                    <h3 className="font-poppins font-semibold text-gray-900">File Tax Return</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-poppins">
                    Prepare and file quarterly or annual tax returns
                  </p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                      <Calculator size={20} className="text-green-600" />
                    </div>
                    <h3 className="font-poppins font-semibold text-gray-900">Tax Calculator</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-poppins">
                    Calculate estimated tax payments and liabilities
                  </p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                      <Download size={20} className="text-purple-600" />
                    </div>
                    <h3 className="font-poppins font-semibold text-gray-900">Download Forms</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-poppins">
                    Access tax forms and compliance documents
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Filters for Records View */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-40"
              >
                {taxTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-32"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <div className="text-sm text-gray-500 font-poppins ml-auto">
                {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Tax Records Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Period</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Tax Type</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Amount</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Due Date</th>
                    <th className="text-right px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-poppins font-medium text-gray-900">{record.period}</p>
                          <p className="text-sm text-gray-500 font-poppins capitalize">{record.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-poppins text-gray-900">{record.taxType}</p>
                        <p className="text-sm text-gray-500 font-poppins">{record.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-poppins font-semibold text-gray-900">
                          ${record.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 w-fit ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-poppins ${
                          record.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-900'
                        }`}>
                          {new Date(record.dueDate).toLocaleDateString()}
                        </p>
                        {record.filedDate && (
                          <p className="text-sm text-gray-500 font-poppins">
                            Filed: {new Date(record.filedDate).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="View Details">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Download">
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
        </>
      )}
    </div>
  );
};

export default TaxCompliancePage;