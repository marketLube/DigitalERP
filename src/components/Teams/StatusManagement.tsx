import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { MainStatus, SubStatus } from '../../types/teams';

interface StatusManagementProps {
  teamId: string;
  teamName: string;
  onBack: () => void;
}

interface AddMainStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

interface AddSubStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (mainStatusId: string, name: string) => void;
  mainStatuses: MainStatus[];
}

const AddMainStatusModal: React.FC<AddMainStatusModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-poppins font-semibold text-gray-900">Add Main Status</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 font-poppins text-sm mt-2">
            Create a new main status category for your workflow
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                Status Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Wireframing, Design, Development"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm transition-all duration-200"
                autoFocus
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-poppins font-medium text-blue-900 text-sm mb-2">💡 Tips for Main Status</h4>
              <ul className="text-xs text-blue-800 font-poppins space-y-1">
                <li>• Use broad categories that represent major phases</li>
                <li>• Keep names short and descriptive</li>
                <li>• Examples: "Design", "Development", "Testing"</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-poppins font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddSubStatusModal: React.FC<AddSubStatusModalProps> = ({ isOpen, onClose, onAdd, mainStatuses }) => {
  const [selectedMainStatusId, setSelectedMainStatusId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedMainStatusId) {
      onAdd(selectedMainStatusId, name.trim());
      setName('');
      setSelectedMainStatusId('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-poppins font-semibold text-gray-900">Add Sub-Status</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 font-poppins text-sm mt-2">
            Add a workflow step to an existing main status
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                Main Status
              </label>
              <div className="relative">
                <select
                  value={selectedMainStatusId}
                  onChange={(e) => setSelectedMainStatusId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm bg-white appearance-none transition-all duration-200"
                >
                  <option value="">Choose a main status...</option>
                  {mainStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name} ({status.subStatuses.length} sub-statuses)
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                Sub-Status Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Not Started, In Progress, Review"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm transition-all duration-200"
              />
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-poppins font-medium text-green-900 text-sm mb-2">💡 Tips for Sub-Status</h4>
              <ul className="text-xs text-green-800 font-poppins space-y-1">
                <li>• Represents specific steps in your workflow</li>
                <li>• Will be ordered automatically based on creation</li>
                <li>• First and last steps are marked automatically</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !selectedMainStatusId}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-poppins font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Sub-Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatusManagement: React.FC<StatusManagementProps> = ({ teamId, teamName, onBack }) => {
  // Initialize with the specific team data based on your requirements
  const getInitialStatuses = (teamName: string): MainStatus[] => {
    switch (teamName) {
      case 'UI/UX Team':
        return [
          {
            id: '1',
            name: 'Wireframing',
            subStatuses: [
              { id: '1-1', name: 'Not Started', order: 1, isFirst: true, isLast: false },
              { id: '1-2', name: 'In Progress', order: 2, isFirst: false, isLast: false },
              { id: '1-3', name: 'Reviewed', order: 3, isFirst: false, isLast: false },
              { id: '1-4', name: 'Approved', order: 4, isFirst: false, isLast: true }
            ]
          },
          {
            id: '2',
            name: 'Design',
            subStatuses: [
              { id: '2-1', name: 'Not Started', order: 1, isFirst: true, isLast: false },
              { id: '2-2', name: 'In Progress', order: 2, isFirst: false, isLast: false },
              { id: '2-3', name: 'Client Review', order: 3, isFirst: false, isLast: false },
              { id: '2-4', name: 'Final Design', order: 4, isFirst: false, isLast: true }
            ]
          }
        ];
      case 'Development Team':
        return [
          {
            id: '1',
            name: 'Frontend Development',
            subStatuses: [
              { id: '1-1', name: 'Not Started', order: 1, isFirst: true, isLast: false },
              { id: '1-2', name: 'In Progress', order: 2, isFirst: false, isLast: false },
              { id: '1-3', name: 'Review', order: 3, isFirst: false, isLast: false },
              { id: '1-4', name: 'Merged', order: 4, isFirst: false, isLast: true }
            ]
          },
          {
            id: '2',
            name: 'Backend Development',
            subStatuses: [
              { id: '2-1', name: 'Planning', order: 1, isFirst: true, isLast: false },
              { id: '2-2', name: 'Development', order: 2, isFirst: false, isLast: false },
              { id: '2-3', name: 'Testing', order: 3, isFirst: false, isLast: false },
              { id: '2-4', name: 'Deployed', order: 4, isFirst: false, isLast: true }
            ]
          }
        ];
      case 'Performance Marketing':
        return [
          {
            id: '1',
            name: 'Campaign Setup',
            subStatuses: [
              { id: '1-1', name: 'Planning', order: 1, isFirst: true, isLast: false },
              { id: '1-2', name: 'Design Ready', order: 2, isFirst: false, isLast: false },
              { id: '1-3', name: 'Scheduled', order: 3, isFirst: false, isLast: false },
              { id: '1-4', name: 'Launched', order: 4, isFirst: false, isLast: true }
            ]
          },
          {
            id: '2',
            name: 'Campaign Monitoring',
            subStatuses: [
              { id: '2-1', name: 'Active', order: 1, isFirst: true, isLast: false },
              { id: '2-2', name: 'Paused', order: 2, isFirst: false, isLast: false },
              { id: '2-3', name: 'Underperforming', order: 3, isFirst: false, isLast: false },
              { id: '2-4', name: 'Completed', order: 4, isFirst: false, isLast: true }
            ]
          }
        ];
      case 'Video Production':
        return [
          {
            id: '1',
            name: 'Pre-Production',
            subStatuses: [
              { id: '1-1', name: 'Scripting', order: 1, isFirst: true, isLast: false },
              { id: '1-2', name: 'Approved', order: 2, isFirst: false, isLast: false },
              { id: '1-3', name: 'Shoot Scheduled', order: 3, isFirst: false, isLast: true }
            ]
          },
          {
            id: '2',
            name: 'Post-Production',
            subStatuses: [
              { id: '2-1', name: 'Editing', order: 1, isFirst: true, isLast: false },
              { id: '2-2', name: 'Review', order: 2, isFirst: false, isLast: false },
              { id: '2-3', name: 'Final Render', order: 3, isFirst: false, isLast: false },
              { id: '2-4', name: 'Delivered', order: 4, isFirst: false, isLast: true }
            ]
          }
        ];
      case 'Social Media':
        return [
          {
            id: '1',
            name: 'Content Creation',
            subStatuses: [
              { id: '1-1', name: 'Idea', order: 1, isFirst: true, isLast: false },
              { id: '1-2', name: 'In Progress', order: 2, isFirst: false, isLast: false },
              { id: '1-3', name: 'Review', order: 3, isFirst: false, isLast: false },
              { id: '1-4', name: 'Approved', order: 4, isFirst: false, isLast: true }
            ]
          },
          {
            id: '2',
            name: 'Publishing',
            subStatuses: [
              { id: '2-1', name: 'Scheduled', order: 1, isFirst: true, isLast: false },
              { id: '2-2', name: 'Published', order: 2, isFirst: false, isLast: false },
              { id: '2-3', name: 'Boosted', order: 3, isFirst: false, isLast: true }
            ]
          }
        ];
      case 'Testing / QA':
        return [
          {
            id: '1',
            name: 'Test Execution',
            subStatuses: [
              { id: '1-1', name: 'Planned', order: 1, isFirst: true, isLast: false },
              { id: '1-2', name: 'In Progress', order: 2, isFirst: false, isLast: false },
              { id: '1-3', name: 'Bugs Found', order: 3, isFirst: false, isLast: false },
              { id: '1-4', name: 'Fixed', order: 4, isFirst: false, isLast: true }
            ]
          },
          {
            id: '2',
            name: 'Final QA',
            subStatuses: [
              { id: '2-1', name: 'Verification', order: 1, isFirst: true, isLast: false },
              { id: '2-2', name: 'Final Review', order: 2, isFirst: false, isLast: false },
              { id: '2-3', name: 'UAT', order: 3, isFirst: false, isLast: false },
              { id: '2-4', name: 'Signed Off', order: 4, isFirst: false, isLast: true }
            ]
          }
        ];
      default:
        return [];
    }
  };

  const [mainStatuses, setMainStatuses] = useState<MainStatus[]>(getInitialStatuses(teamName));
  // CHANGED: First status is now collapsed by default (empty Set)
  const [expandedStatuses, setExpandedStatuses] = useState<Set<string>>(new Set());
  const [editingSubStatus, setEditingSubStatus] = useState<{ mainId: string; subId: string; name: string } | null>(null);
  const [showMainStatusModal, setShowMainStatusModal] = useState(false);
  const [showSubStatusModal, setShowSubStatusModal] = useState(false);

  const toggleExpanded = (statusId: string) => {
    const newExpanded = new Set(expandedStatuses);
    if (newExpanded.has(statusId)) {
      newExpanded.delete(statusId);
    } else {
      newExpanded.add(statusId);
    }
    setExpandedStatuses(newExpanded);
  };

  const addMainStatus = (name: string) => {
    const newMainStatus: MainStatus = {
      id: Date.now().toString(),
      name: name,
      subStatuses: []
    };

    setMainStatuses([...mainStatuses, newMainStatus]);
  };

  const deleteMainStatus = (mainStatusId: string) => {
    if (window.confirm('Are you sure you want to delete this main status? This will also delete all sub-statuses.')) {
      setMainStatuses(mainStatuses.filter(status => status.id !== mainStatusId));
      setExpandedStatuses(prev => {
        const newSet = new Set(prev);
        newSet.delete(mainStatusId);
        return newSet;
      });
    }
  };

  const addSubStatus = (mainStatusId: string, name: string) => {
    const updatedMainStatuses = mainStatuses.map(mainStatus => {
      if (mainStatus.id === mainStatusId) {
        const newOrder = mainStatus.subStatuses.length + 1;
        const newSubStatus: SubStatus = {
          id: `${mainStatus.id}-${Date.now()}`,
          name: name,
          order: newOrder,
          isFirst: newOrder === 1,
          isLast: true
        };

        const updatedSubStatuses = mainStatus.subStatuses.map(sub => ({
          ...sub,
          isLast: false
        }));

        return {
          ...mainStatus,
          subStatuses: [...updatedSubStatuses, newSubStatus]
        };
      }
      return mainStatus;
    });

    setMainStatuses(updatedMainStatuses);
  };

  const deleteSubStatus = (mainStatusId: string, subStatusId: string) => {
    const updatedMainStatuses = mainStatuses.map(mainStatus => {
      if (mainStatus.id === mainStatusId) {
        const filteredSubStatuses = mainStatus.subStatuses
          .filter(sub => sub.id !== subStatusId)
          .map((sub, index) => ({
            ...sub,
            order: index + 1,
            isFirst: index === 0,
            isLast: index === mainStatus.subStatuses.length - 2
          }));

        return {
          ...mainStatus,
          subStatuses: filteredSubStatuses
        };
      }
      return mainStatus;
    });

    setMainStatuses(updatedMainStatuses);
  };

  const startEditingSubStatus = (mainId: string, subId: string, currentName: string) => {
    setEditingSubStatus({ mainId, subId, name: currentName });
  };

  const saveSubStatusEdit = () => {
    if (!editingSubStatus || !editingSubStatus.name.trim()) return;

    const updatedMainStatuses = mainStatuses.map(mainStatus => {
      if (mainStatus.id === editingSubStatus.mainId) {
        const updatedSubStatuses = mainStatus.subStatuses.map(sub => {
          if (sub.id === editingSubStatus.subId) {
            return { ...sub, name: editingSubStatus.name.trim() };
          }
          return sub;
        });

        return { ...mainStatus, subStatuses: updatedSubStatuses };
      }
      return mainStatus;
    });

    setMainStatuses(updatedMainStatuses);
    setEditingSubStatus(null);
  };

  const cancelSubStatusEdit = () => {
    setEditingSubStatus(null);
  };

  const moveSubStatus = (mainStatusId: string, subStatusId: string, direction: 'up' | 'down') => {
    const updatedMainStatuses = mainStatuses.map(mainStatus => {
      if (mainStatus.id === mainStatusId) {
        const subStatuses = [...mainStatus.subStatuses];
        const currentIndex = subStatuses.findIndex(sub => sub.id === subStatusId);
        
        if (
          (direction === 'up' && currentIndex > 0) ||
          (direction === 'down' && currentIndex < subStatuses.length - 1)
        ) {
          const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
          [subStatuses[currentIndex], subStatuses[newIndex]] = [subStatuses[newIndex], subStatuses[currentIndex]];
          
          const reorderedSubStatuses = subStatuses.map((sub, index) => ({
            ...sub,
            order: index + 1,
            isFirst: index === 0,
            isLast: index === subStatuses.length - 1
          }));

          return { ...mainStatus, subStatuses: reorderedSubStatuses };
        }
      }
      return mainStatus;
    });

    setMainStatuses(updatedMainStatuses);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-poppins font-semibold text-gray-900">
            Status Management
          </h1>
          <p className="text-gray-600 font-poppins text-sm">
            Configure status hierarchy for <span className="font-medium text-gray-900">{teamName}</span>
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={() => setShowMainStatusModal(true)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Plus size={18} />
          </div>
          <div className="text-left">
            <div className="font-semibold">Add Main Status</div>
            <div className="text-xs text-blue-100">Create workflow category</div>
          </div>
        </button>
        
        <button
          onClick={() => setShowSubStatusModal(true)}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Plus size={18} />
          </div>
          <div className="text-left">
            <div className="font-semibold">Add Sub-Status</div>
            <div className="text-xs text-green-100">Add workflow step</div>
          </div>
        </button>
      </div>

      {/* Status Hierarchy Display - Accordion Style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-poppins font-semibold text-gray-900">
            Status Hierarchy
          </h2>
          <div className="text-sm text-gray-500 font-poppins">
            {mainStatuses.length} main status{mainStatuses.length !== 1 ? 'es' : ''} • {mainStatuses.reduce((acc, status) => acc + status.subStatuses.length, 0)} sub-statuses
          </div>
        </div>
        
        {mainStatuses.map((mainStatus) => (
          <div 
            key={mainStatus.id} 
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Main Status Header - Collapsible */}
            <div 
              className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
              onClick={() => toggleExpanded(mainStatus.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1 hover:bg-white hover:bg-opacity-50 rounded-lg transition-all duration-200">
                      {expandedStatuses.has(mainStatus.id) ? (
                        <ChevronDown size={20} className="text-gray-600" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-600" />
                      )}
                    </div>
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-gray-900 text-lg">
                      {mainStatus.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-poppins">
                      {mainStatus.subStatuses.length} workflow step{mainStatus.subStatuses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMainStatus(mainStatus.id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete Main Status"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Sub-Statuses - Expandable */}
            {expandedStatuses.has(mainStatus.id) && (
              <div className="p-6 bg-white">
                {mainStatus.subStatuses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                    <h4 className="font-poppins font-medium text-gray-900 mb-2">No workflow steps defined</h4>
                    <p className="text-gray-500 font-poppins text-sm mb-4">
                      Add sub-statuses to create a complete workflow for this main status.
                    </p>
                    <button
                      onClick={() => setShowSubStatusModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
                    >
                      <Plus size={16} />
                      Add First Sub-Status
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-poppins font-semibold text-gray-900">
                        Workflow Steps
                      </h4>
                      <button
                        onClick={() => setShowSubStatusModal(true)}
                        className="text-blue-600 hover:text-blue-700 font-poppins text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-lg transition-all duration-200"
                      >
                        <Plus size={14} />
                        Add Step
                      </button>
                    </div>
                    {mainStatus.subStatuses.map((subStatus, subIndex) => (
                      <div
                        key={subStatus.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Drag Handle */}
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => moveSubStatus(mainStatus.id, subStatus.id, 'up')}
                              disabled={subIndex === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded transition-all duration-200"
                            >
                              <GripVertical size={12} />
                            </button>
                            <button
                              onClick={() => moveSubStatus(mainStatus.id, subStatus.id, 'down')}
                              disabled={subIndex === mainStatus.subStatuses.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded transition-all duration-200"
                            >
                              <GripVertical size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Order Badge */}
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full font-poppins font-bold text-sm shadow-sm">
                              {subStatus.order}
                            </div>
                            
                            {/* Status Name */}
                            {editingSubStatus?.subId === subStatus.id ? (
                              <input
                                type="text"
                                value={editingSubStatus.name}
                                onChange={(e) => setEditingSubStatus({ ...editingSubStatus, name: e.target.value })}
                                className="px-3 py-2 border border-gray-200 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-40 bg-white"
                                onKeyPress={(e) => e.key === 'Enter' && saveSubStatusEdit()}
                                autoFocus
                              />
                            ) : (
                              <span className="font-poppins font-medium text-gray-900">
                                {subStatus.name}
                              </span>
                            )}

                            {/* Status Badges */}
                            <div className="flex gap-2">
                              {subStatus.isFirst && (
                                <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-poppins font-medium shadow-sm">
                                  Start
                                </span>
                              )}
                              {subStatus.isLast && (
                                <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1 rounded-full text-xs font-poppins font-medium shadow-sm">
                                  End
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {editingSubStatus?.subId === subStatus.id ? (
                            <>
                              <button
                                onClick={saveSubStatusEdit}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={cancelSubStatusEdit}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditingSubStatus(mainStatus.id, subStatus.id, subStatus.name)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => deleteSubStatus(mainStatus.id, subStatus.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mainStatuses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-3">
            No Status Hierarchy Defined
          </h3>
          <p className="text-gray-600 font-poppins mb-8 max-w-md mx-auto">
            Create your first main status category to start building your team's workflow structure.
          </p>
          <button
            onClick={() => setShowMainStatusModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center gap-2 mx-auto hover:scale-105"
          >
            <Plus size={20} />
            Create First Main Status
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h4 className="font-poppins font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">💡</span>
          </div>
          How Status Hierarchy Works
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800 font-poppins">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div><strong>Main Status:</strong> High-level categories like "Wireframing", "Design"</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div><strong>Sub-Status:</strong> Workflow steps within each main status</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div><strong>Order:</strong> Determines task progression and completion calculation</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div><strong>Start/End:</strong> First and last sub-statuses are automatically marked</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div><strong>Progress:</strong> Calculated based on sub-status order position</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div><strong>Workflow:</strong> Tasks move through sub-statuses in defined order</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMainStatusModal
        isOpen={showMainStatusModal}
        onClose={() => setShowMainStatusModal(false)}
        onAdd={addMainStatus}
      />

      <AddSubStatusModal
        isOpen={showSubStatusModal}
        onClose={() => setShowSubStatusModal(false)}
        onAdd={addSubStatus}
        mainStatuses={mainStatuses}
      />
    </div>
  );
};

export default StatusManagement;