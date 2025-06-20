import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus, Download, Eye, Edit3, Trash2, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  category: string;
  subcategory: string;
  amount: number;
  type: 'income' | 'expense';
  paymentMethod: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  attachments: number;
  notes: string;
}

interface DayBookPageProps {
  onBack: () => void;
}

const DayBookPage: React.FC<DayBookPageProps> = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'summary'>('list');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-02-15',
      time: '09:30 AM',
      description: 'Client Payment - TechCorp Project Phase 1',
      category: 'Revenue',
      subcategory: 'Project Revenue',
      amount: 15000,
      type: 'income',
      paymentMethod: 'Bank Transfer',
      reference: 'TXN-2024-001',
      status: 'completed',
      attachments: 2,
      notes: 'First milestone payment received'
    },
    {
      id: '2',
      date: '2024-02-15',
      time: '10:15 AM',
      description: 'Office Rent Payment - February',
      category: 'Operating Expenses',
      subcategory: 'Rent & Utilities',
      amount: 3500,
      type: 'expense',
      paymentMethod: 'Check',
      reference: 'CHK-2024-045',
      status: 'completed',
      attachments: 1,
      notes: 'Monthly office rent'
    },
    {
      id: '3',
      date: '2024-02-15',
      time: '11:45 AM',
      description: 'Software Subscription - Adobe Creative Suite',
      category: 'Software & Tools',
      subcategory: 'Design Software',
      amount: 599,
      type: 'expense',
      paymentMethod: 'Credit Card',
      reference: 'CC-2024-089',
      status: 'completed',
      attachments: 0,
      notes: 'Annual subscription renewal'
    },
    {
      id: '4',
      date: '2024-02-15',
      time: '02:20 PM',
      description: 'Freelancer Payment - UI/UX Design',
      category: 'Contractor Fees',
      subcategory: 'Design Services',
      amount: 2800,
      type: 'expense',
      paymentMethod: 'PayPal',
      reference: 'PP-2024-156',
      status: 'pending',
      attachments: 1,
      notes: 'Payment for mobile app design'
    },
    {
      id: '5',
      date: '2024-02-15',
      time: '03:55 PM',
      description: 'Product Sales - E-commerce Platform',
      category: 'Product Revenue',
      subcategory: 'Online Sales',
      amount: 8750,
      type: 'income',
      paymentMethod: 'Stripe',
      reference: 'STR-2024-234',
      status: 'completed',
      attachments: 0,
      notes: 'Multiple product sales'
    },
    {
      id: '6',
      date: '2024-02-15',
      time: '04:30 PM',
      description: 'Marketing Campaign - Google Ads',
      category: 'Marketing',
      subcategory: 'Digital Advertising',
      amount: 1200,
      type: 'expense',
      paymentMethod: 'Credit Card',
      reference: 'CC-2024-090',
      status: 'completed',
      attachments: 2,
      notes: 'Q1 marketing campaign'
    }
  ];

  const categories = ['All', 'Revenue', 'Operating Expenses', 'Software & Tools', 'Contractor Fees', 'Product Revenue', 'Marketing'];
  const types = ['All', 'Income', 'Expense'];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || transaction.category === selectedCategory;
    const matchesType = selectedType === 'All' || transaction.type.toLowerCase() === selectedType.toLowerCase();
    const matchesDate = transaction.date === selectedDate;
    
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  const handleEditTransaction = (transaction: Transaction) => {
    console.log('Edit transaction:', transaction);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      console.log('Delete transaction:', transactionId);
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Day Book
            </h1>
            <p className="text-gray-600 font-poppins">
              Daily transaction records and financial activity
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'summary' : 'list')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              {viewMode === 'list' ? 'Summary View' : 'List View'}
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Plus size={16} />
              Add Transaction
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Date and Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Date Selector */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Calendar size={20} className="text-blue-600" />
            <span className="font-poppins font-medium text-gray-900">Selected Date</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
          />
        </div>

        {/* Income */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={20} className="text-green-600" />
            <span className="font-poppins font-medium text-gray-900">Total Income</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-green-600">
            ${totalIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {filteredTransactions.filter(t => t.type === 'income').length} transactions
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown size={20} className="text-red-600" />
            <span className="font-poppins font-medium text-gray-900">Total Expenses</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-red-600">
            ${totalExpenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {filteredTransactions.filter(t => t.type === 'expense').length} transactions
          </p>
        </div>

        {/* Net Amount */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign size={20} className={netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'} />
            <span className="font-poppins font-medium text-gray-900">Net Amount</span>
          </div>
          <p className={`text-2xl font-poppins font-semibold ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            ${Math.abs(netAmount).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {netAmount >= 0 ? 'Profit' : 'Loss'} for the day
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-40"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-32"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className="text-sm text-gray-500 font-poppins">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-poppins font-semibold text-gray-900">
            Transaction Details
          </h2>
        </div>
        
        <div className="p-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600 font-poppins mb-6">
                No transactions recorded for the selected date and filters.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-colors duration-200 flex items-center gap-2 mx-auto">
                <Plus size={20} />
                Add First Transaction
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowDownRight size={20} className="text-green-600" />
                      ) : (
                        <ArrowUpRight size={20} className="text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-poppins font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 font-poppins">
                        <span>{transaction.time}</span>
                        <span>•</span>
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.paymentMethod}</span>
                        <span>•</span>
                        <span>{transaction.reference}</span>
                        {transaction.attachments > 0 && (
                          <>
                            <span>•</span>
                            <span>{transaction.attachments} attachment{transaction.attachments !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>
                      
                      {transaction.notes && (
                        <p className="text-sm text-gray-600 font-poppins mt-1 italic">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-poppins font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit Transaction"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete Transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayBookPage;