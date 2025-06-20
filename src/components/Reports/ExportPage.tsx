import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, Search, Eye, Trash2, Share2, Archive, CheckCircle, Clock, AlertCircle, File, FileSpreadsheet, Image } from 'lucide-react';

interface ExportRecord {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'csv' | 'json' | 'image';
  category: 'task' | 'team' | 'financial' | 'performance';
  size: string;
  createdDate: string;
  expiryDate: string;
  downloadCount: number;
  status: 'ready' | 'generating' | 'expired' | 'failed';
  description: string;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: string[];
  icon: React.ComponentType<any>;
  color: string;
}

interface ExportPageProps {
  onBack: () => void;
}

const ExportPage: React.FC<ExportPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState<'exports' | 'templates'>('exports');

  const exportRecords: ExportRecord[] = [
    {
      id: '1',
      name: 'Weekly Task Performance Report',
      type: 'pdf',
      category: 'task',
      size: '2.4 MB',
      createdDate: '2024-02-15',
      expiryDate: '2024-03-15',
      downloadCount: 12,
      status: 'ready',
      description: 'Comprehensive task analysis with performance metrics'
    },
    {
      id: '2',
      name: 'Team Productivity Data Export',
      type: 'excel',
      category: 'team',
      size: '1.8 MB',
      createdDate: '2024-02-14',
      expiryDate: '2024-03-14',
      downloadCount: 8,
      status: 'ready',
      description: 'Raw productivity data for all teams'
    },
    {
      id: '3',
      name: 'Financial Summary Q1 2024',
      type: 'pdf',
      category: 'financial',
      size: '3.2 MB',
      createdDate: '2024-02-13',
      expiryDate: '2024-03-13',
      downloadCount: 15,
      status: 'ready',
      description: 'Quarterly financial performance summary'
    },
    {
      id: '4',
      name: 'Performance Metrics Dashboard',
      type: 'image',
      category: 'performance',
      size: '1.5 MB',
      createdDate: '2024-02-12',
      expiryDate: '2024-03-12',
      downloadCount: 5,
      status: 'generating',
      description: 'Visual dashboard export with key metrics'
    },
    {
      id: '5',
      name: 'Task Data CSV Export',
      type: 'csv',
      category: 'task',
      size: '890 KB',
      createdDate: '2024-02-11',
      expiryDate: '2024-03-11',
      downloadCount: 23,
      status: 'ready',
      description: 'Raw task data in CSV format'
    },
    {
      id: '6',
      name: 'Team Analytics JSON',
      type: 'json',
      category: 'team',
      size: '1.2 MB',
      createdDate: '2024-02-10',
      expiryDate: '2024-03-10',
      downloadCount: 3,
      status: 'ready',
      description: 'Structured team analytics data'
    },
    {
      id: '7',
      name: 'Monthly Report Archive',
      type: 'pdf',
      category: 'performance',
      size: '4.1 MB',
      createdDate: '2024-01-31',
      expiryDate: '2024-02-28',
      downloadCount: 7,
      status: 'expired',
      description: 'Complete monthly performance report'
    }
  ];

  const exportTemplates: ExportTemplate[] = [
    {
      id: '1',
      name: 'Task Performance Report',
      description: 'Comprehensive task analytics with completion rates and timelines',
      category: 'Task Reports',
      fields: ['Task ID', 'Title', 'Assignee', 'Status', 'Due Date', 'Completion Rate'],
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Team Productivity Analysis',
      description: 'Team performance metrics and productivity insights',
      category: 'Team Reports',
      fields: ['Team Name', 'Members', 'Tasks Completed', 'Productivity Score', 'Response Time'],
      icon: FileSpreadsheet,
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Financial Summary',
      description: 'Revenue, expenses, and profit analysis',
      category: 'Financial Reports',
      fields: ['Period', 'Revenue', 'Expenses', 'Net Profit', 'Margin'],
      icon: File,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'Performance Dashboard',
      description: 'Visual performance metrics and KPI dashboard',
      category: 'Performance Reports',
      fields: ['KPI Name', 'Current Value', 'Target', 'Trend', 'Status'],
      icon: Image,
      color: 'bg-orange-500'
    }
  ];

  const categories = ['All', 'Task', 'Team', 'Financial', 'Performance'];
  const types = ['All', 'PDF', 'Excel', 'CSV', 'JSON', 'Image'];
  const statuses = ['All', 'Ready', 'Generating', 'Expired', 'Failed'];

  const filteredRecords = exportRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || record.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesType = selectedType === 'All' || record.type.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || record.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700';
      case 'generating': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={14} />;
      case 'generating': return <Clock size={14} />;
      case 'expired': return <AlertCircle size={14} />;
      case 'failed': return <AlertCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={16} className="text-red-600" />;
      case 'excel': return <FileSpreadsheet size={16} className="text-green-600" />;
      case 'csv': return <File size={16} className="text-blue-600" />;
      case 'json': return <File size={16} className="text-purple-600" />;
      case 'image': return <Image size={16} className="text-orange-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task': return 'bg-blue-100 text-blue-700';
      case 'team': return 'bg-green-100 text-green-700';
      case 'financial': return 'bg-purple-100 text-purple-700';
      case 'performance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownload = (record: ExportRecord) => {
    console.log('Download:', record);
  };

  const handleDelete = (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this export?')) {
      console.log('Delete:', recordId);
    }
  };

  const handleGenerateFromTemplate = (template: ExportTemplate) => {
    console.log('Generate from template:', template);
  };

  const totalSize = filteredRecords.reduce((acc, record) => {
    const size = parseFloat(record.size);
    const unit = record.size.includes('MB') ? 1 : 0.001;
    return acc + (size * unit);
  }, 0);

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Export Center
            </h1>
            <p className="text-gray-600 font-poppins">
              Download reports and data exports in various formats
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 font-poppins">
              {filteredRecords.length} exports • {totalSize.toFixed(1)} MB total
            </div>
            
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              New Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('exports')}
            className={`flex-1 py-2 px-4 rounded-md font-poppins font-medium text-sm transition-all duration-200 ${
              activeTab === 'exports'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Export History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 px-4 rounded-md font-poppins font-medium text-sm transition-all duration-200 ${
              activeTab === 'templates'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Export Templates
          </button>
        </nav>
      </div>

      {activeTab === 'exports' ? (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-36"
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

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-32"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Export Records */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Export</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Type</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Category</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Size</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                    <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Downloads</th>
                    <th className="text-right px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-poppins font-medium text-gray-900">{record.name}</p>
                          <p className="text-sm text-gray-500 font-poppins line-clamp-1">{record.description}</p>
                          <p className="text-xs text-gray-500 font-poppins mt-1">
                            Created: {new Date(record.createdDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(record.type)}
                          <span className="font-poppins text-gray-900 uppercase text-sm">{record.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${getCategoryColor(record.category)}`}>
                          {record.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-poppins text-gray-900">{record.size}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 w-fit ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-poppins text-gray-900">{record.downloadCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {record.status === 'ready' && (
                            <button
                              onClick={() => handleDownload(record)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="View Details">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Share">
                            <Share2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete"
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

          {/* Empty State */}
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Download size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
                No exports found
              </h3>
              <p className="text-gray-600 font-poppins mb-6">
                {searchQuery || selectedCategory !== 'All' || selectedType !== 'All' || selectedStatus !== 'All'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Create your first export to get started.'
                }
              </p>
            </div>
          )}
        </>
      ) : (
        /* Export Templates */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exportTemplates.map((template, index) => {
            const IconComponent = template.icon;
            return (
              <div
                key={template.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                
                <h3 className="font-poppins font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                
                <p className="text-sm text-gray-600 font-poppins mb-4">
                  {template.description}
                </p>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-poppins mb-2">Included Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.fields.slice(0, 3).map(field => (
                      <span key={field} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-poppins">
                        {field}
                      </span>
                    ))}
                    {template.fields.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-poppins">
                        +{template.fields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleGenerateFromTemplate(template)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Generate Export
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExportPage;