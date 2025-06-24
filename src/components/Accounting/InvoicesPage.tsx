import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, Download, Eye, Edit3, Trash2, Send, DollarSign, Calendar, Clock, CheckCircle, AlertCircle, Copy, ChevronDown, LayoutGrid, List, ToggleLeft, ToggleRight, DollarSign as Currency, X, ArrowLeft, ArrowRight } from 'lucide-react';
import DateRangePicker, { DateRange } from '../Common/DateRangePicker';
import CreateInvoiceModal from './CreateInvoiceModal';
import InlineInvoiceMaker from './InlineInvoiceMaker';


interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  notes: string;
  paymentTerms: string;
  currency: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoicesPageProps {
  onBack: () => void;
  showHeader?: boolean;
  onNavigate?: (page: string) => void;
}

const InvoicesPage: React.FC<InvoicesPageProps> = ({ onBack, showHeader = true, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [selectedAmountRange, setSelectedAmountRange] = useState('All Amounts');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    preset: 'all'
  });
  const [showOverdue, setShowOverdue] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Create Invoice State
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      clientName: 'TechCorp Industries',
      clientEmail: 'billing@techcorp.com',
      issueDate: '2024-02-01',
      dueDate: '2024-02-15',
      amount: 15000,
      status: 'paid',
      currency: 'USD',
      paymentTerms: 'Net 15',
      notes: 'Thank you for your business!',
      items: [
        { id: '1', description: 'Web Development - Phase 1', quantity: 1, rate: 15000, amount: 15000 }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      clientName: 'StartupXYZ',
      clientEmail: 'finance@startupxyz.com',
      issueDate: '2024-02-05',
      dueDate: '2024-02-20',
      amount: 8500,
      status: 'sent',
      currency: 'USD',
      paymentTerms: 'Net 15',
      notes: 'Mobile app development services',
      items: [
        { id: '1', description: 'Mobile App UI/UX Design', quantity: 1, rate: 5000, amount: 5000 },
        { id: '2', description: 'Mobile App Development', quantity: 1, rate: 3500, amount: 3500 }
      ]
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      clientName: 'E-commerce Solutions',
      clientEmail: 'accounts@ecommerce.com',
      issueDate: '2024-01-20',
      dueDate: '2024-02-05',
      amount: 12000,
      status: 'overdue',
      currency: 'USD',
      paymentTerms: 'Net 15',
      notes: 'E-commerce platform development',
      items: [
        { id: '1', description: 'E-commerce Platform Setup', quantity: 1, rate: 8000, amount: 8000 },
        { id: '2', description: 'Payment Gateway Integration', quantity: 1, rate: 4000, amount: 4000 }
      ]
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      clientName: 'Marketing Agency Pro',
      clientEmail: 'billing@marketingpro.com',
      issueDate: '2024-02-10',
      dueDate: '2024-02-25',
      amount: 6500,
      status: 'draft',
      currency: 'USD',
      paymentTerms: 'Net 15',
      notes: 'Digital marketing consultation',
      items: [
        { id: '1', description: 'Marketing Strategy Consultation', quantity: 10, rate: 650, amount: 6500 }
      ]
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-005',
      clientName: 'FinTech Innovations',
      clientEmail: 'finance@fintech.com',
      issueDate: '2024-02-12',
      dueDate: '2024-02-27',
      amount: 22000,
      status: 'sent',
      currency: 'USD',
      paymentTerms: 'Net 15',
      notes: 'Financial software development',
      items: [
        { id: '1', description: 'Backend API Development', quantity: 1, rate: 12000, amount: 12000 },
        { id: '2', description: 'Frontend Dashboard', quantity: 1, rate: 10000, amount: 10000 }
      ]
    }
  ];

  const statuses = ['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];
  const clients = ['All Clients', ...Array.from(new Set(invoices.map(inv => inv.clientName)))];
  const amountRanges = [
    'All Amounts',
    'Under $5,000',
    '$5,000 - $10,000', 
    '$10,000 - $20,000',
    'Over $20,000'
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.amount.toString().includes(searchQuery) ||
                         invoice.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || invoice.status.toLowerCase() === selectedStatus.toLowerCase();
    
    const matchesClient = selectedClient === 'All Clients' || invoice.clientName === selectedClient;
    
    const matchesAmountRange = (() => {
      if (selectedAmountRange === 'All Amounts') return true;
      if (selectedAmountRange === 'Under $5,000') return invoice.amount < 5000;
      if (selectedAmountRange === '$5,000 - $10,000') return invoice.amount >= 5000 && invoice.amount <= 10000;
      if (selectedAmountRange === '$10,000 - $20,000') return invoice.amount >= 10000 && invoice.amount <= 20000;
      if (selectedAmountRange === 'Over $20,000') return invoice.amount > 20000;
      return true;
    })();

    const matchesDateRange = (() => {
      if (dateRange.preset === 'all') return true;
      const invoiceDate = new Date(invoice.issueDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return invoiceDate >= startDate && invoiceDate <= endDate;
    })();

    const matchesOverdue = showOverdue ? invoice.status === 'overdue' : true;
    
    return matchesSearch && matchesStatus && matchesClient && matchesAmountRange && matchesDateRange && matchesOverdue;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit3 size={14} />;
      case 'sent': return <Send size={14} />;
      case 'paid': return <CheckCircle size={14} />;
      case 'overdue': return <AlertCircle size={14} />;
      case 'cancelled': return <Clock size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    console.log('Edit invoice:', invoice);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      console.log('Delete invoice:', invoiceId);
    }
  };

  const handleSendInvoice = (invoiceId: string) => {
    console.log('Send invoice:', invoiceId);
  };

  const handleCreateInvoice = () => {
    setShowCreateInvoice(true);
  };

  const handleSaveNewInvoice = (newInvoice: any) => {
    console.log('Saving new invoice:', newInvoice);
    // Add the new invoice to the list (in a real app, this would make an API call)
    setShowCreateInvoice(false);
  };

  return (
    <div className={showHeader ? "p-6 animate-fadeIn" : "animate-fadeIn"}>
      {/* Header - Only show when showHeader is true */}
      {showHeader && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
                Invoices
              </h1>
              <p className="text-gray-600 font-poppins">
                Create, manage, and track your invoices and payments
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                <Download size={16} />
                Export All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <FileText size={20} className="text-blue-600" />
            <span className="font-poppins font-medium text-gray-900">Total Invoices</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-gray-900">
            {filteredInvoices.length}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            ${totalAmount.toLocaleString()} total value
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-poppins font-medium text-gray-900">Paid</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-green-600">
            ${paidAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {filteredInvoices.filter(inv => inv.status === 'paid').length} invoices
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} className="text-orange-600" />
            <span className="font-poppins font-medium text-gray-900">Pending</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-orange-600">
            ${pendingAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {filteredInvoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length} invoices
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="font-poppins font-medium text-gray-900">Overdue</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-red-600">
            {filteredInvoices.filter(inv => inv.status === 'overdue').length}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            ${filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Left side filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Client Dropdown */}
            <div className="relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-36"
              >
                {clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-36"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Amount Range Filter */}
            <div className="relative">
              <select
                value={selectedAmountRange}
                onChange={(e) => setSelectedAmountRange(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-36"
              >
                {amountRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Date Range Filter */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="min-w-44"
            />

            {/* Search Bar - Enhanced */}
            <div className="relative flex-1 min-w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices, clients, amounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* View Toggle Icons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

            {/* Overdue Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverdue(!showOverdue)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-poppins text-sm transition-all duration-200 ${
                  showOverdue 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Toggle Overdue Filter"
              >
                {showOverdue ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                Overdue
              </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 font-poppins whitespace-nowrap">
              {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
            </div>

            {/* Create Invoice Button */}
            <button 
              onClick={handleCreateInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-poppins font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105 whitespace-nowrap"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create Invoice</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice, index) => (
            <div
              key={invoice.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Invoice Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-poppins font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-600 font-poppins">
                    {invoice.clientName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <p className="text-2xl font-poppins font-semibold text-gray-900">
                  ${invoice.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 font-poppins">
                  {invoice.currency}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 font-poppins">Issue Date</p>
                  <p className="text-sm font-poppins text-gray-900">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-poppins">Due Date</p>
                  <p className={`text-sm font-poppins ${
                    invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-900'
                  }`}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewInvoice(invoice)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-poppins font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  <Eye size={14} />
                  View
                </button>
                
                {invoice.status === 'draft' && (
                  <button
                    onClick={() => handleSendInvoice(invoice.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-poppins font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    <Send size={14} />
                    Send
                  </button>
                )}
                
                <button
                  onClick={() => handleEditInvoice(invoice)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
                
                <button
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Invoice</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Client</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Amount</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Due Date</th>
                  <th className="text-right px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-poppins font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500 font-poppins">
                          Issued {new Date(invoice.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-poppins font-medium text-gray-900">{invoice.clientName}</p>
                        <p className="text-sm text-gray-500 font-poppins">{invoice.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-poppins font-semibold text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 font-poppins">{invoice.currency}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-poppins ${
                        invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-900'
                      }`}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="View Invoice"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          title="Edit Invoice"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete Invoice"
                        >
                          <Trash2 size={16} />
                        </button>
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
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No invoices found
          </h3>
          <p className="text-gray-600 font-poppins mb-6">
            {searchQuery || selectedStatus !== 'All' 
              ? 'Try adjusting your search criteria or filters.' 
              : 'Create your first invoice to get started with billing.'
            }
          </p>
          {!searchQuery && selectedStatus === 'All' && (
            <button 
              onClick={handleCreateInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create First Invoice
            </button>
          )}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-semibold">{selectedInvoice.invoiceNumber}</h2>
                  <p className="text-blue-100 font-poppins text-sm">{selectedInvoice.clientName}</p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-3">Bill To:</h3>
                  <p className="font-poppins font-medium text-gray-900">{selectedInvoice.clientName}</p>
                  <p className="text-gray-600 font-poppins text-sm">{selectedInvoice.clientEmail}</p>
                </div>
                
                <div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-3">Invoice Details:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-poppins text-sm">Issue Date:</span>
                      <span className="font-poppins text-sm">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-poppins text-sm">Due Date:</span>
                      <span className="font-poppins text-sm">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-poppins text-sm">Payment Terms:</span>
                      <span className="font-poppins text-sm">{selectedInvoice.paymentTerms}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-6">
                <h3 className="font-poppins font-semibold text-gray-900 mb-3">Items:</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Description</th>
                        <th className="text-center px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Qty</th>
                        <th className="text-right px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Rate</th>
                        <th className="text-right px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-200">
                          <td className="px-4 py-3 font-poppins text-sm">{item.description}</td>
                          <td className="px-4 py-3 font-poppins text-sm text-center">{item.quantity}</td>
                          <td className="px-4 py-3 font-poppins text-sm text-right">${item.rate.toLocaleString()}</td>
                          <td className="px-4 py-3 font-poppins text-sm text-right font-medium">${item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-t border-gray-200">
                      <span className="font-poppins font-semibold text-gray-900">Total:</span>
                      <span className="font-poppins font-semibold text-gray-900 text-lg">
                        ${selectedInvoice.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-3">Notes:</h3>
                  <p className="text-gray-600 font-poppins text-sm bg-gray-50 p-4 rounded-lg">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-poppins font-medium flex items-center gap-2 ${getStatusColor(selectedInvoice.status)}`}>
                {getStatusIcon(selectedInvoice.status)}
                {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
                  <Download size={16} />
                  Download PDF
                </button>
                {selectedInvoice.status === 'draft' && (
                  <button
                    onClick={() => handleSendInvoice(selectedInvoice.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
        onSave={handleSaveNewInvoice}
        invoiceCount={invoices.length}
      />

    </div>
  );
};

export default InvoicesPage;