import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Filter, Calendar, List, LayoutGrid, Eye, ToggleLeft, ToggleRight, ChevronDown, X, Save, Trash2, AlertTriangle, StickyNote, BarChart3, TrendingUp, Clock, CheckCircle, XCircle, User, Target, Award, Calendar as CalendarIcon, ArrowUp, ArrowDown, Minus, Download, Lock, Settings, GripVertical, Edit, MousePointer, ExternalLink, Zap, Shield, Users, AlertCircle, Flag } from 'lucide-react';
import NotePad from './NotePad';
import DateRangePicker, { DateRange } from '../Common/DateRangePicker';
import IndividualEmployeeReport from '../Reports/IndividualEmployeeReport';
import { useTenant } from '../../contexts/TenantContext';
import { Team, MainStatus, SubStatus, TeamStatusConfig, defaultStatusConfigs } from '../../types/teams';

// DnD Kit imports
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

// Sortable Task Component for drag and drop
interface SortableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (subStatus: string) => string;
  isOverdue: (dueDate: string, progress: number) => boolean;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task, onEdit, getPriorityColor, getStatusColor, isOverdue }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Only trigger edit if not dragging
        if (!isDragging) {
          onEdit(task);
        }
      }}
      className={`bg-white border-l-4 ${getStatusColor(task.subStatus)} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group min-h-[220px] flex flex-col ${isDragging ? 'shadow-lg' : ''}`}
    >
      {/* Drag Handle Icon */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-poppins font-medium">
            {task.client}
          </span>
        </div>
        {isOverdue(task.dueDate, task.progress) && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertTriangle size={12} />
            <span className="text-xs font-poppins font-medium">Overdue</span>
          </div>
        )}
      </div>

      {/* Task Title */}
      <h4 className="font-poppins font-semibold text-gray-900 mb-3 line-clamp-2 flex-shrink-0">
        {task.title}
      </h4>

      {/* Progress */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-poppins text-gray-500">Progress</span>
          <span className="text-xs font-poppins text-gray-600 font-medium">{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Assignee */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-poppins font-bold">
          {task.assignee.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm font-poppins text-gray-700 truncate">{task.assignee}</span>
      </div>

      {/* Footer - pushed to bottom */}
      <div className="mt-auto space-y-3">
        {task.count && (
          <div className="text-xs text-gray-500 font-poppins">
            Count: {task.count}
          </div>
        )}
        
        <div className="space-y-2">
          <div className="text-xs text-gray-500 font-poppins">
            📅 Created {new Date(task.createdDate).toLocaleDateString()}
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-xs font-poppins font-semibold ${isOverdue(task.dueDate, task.progress) ? 'text-red-600' : 'text-gray-700'}`}>
              ⏰ Due {new Date(task.dueDate).toLocaleDateString()}
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Droppable Column Component
interface DroppableColumnProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, className, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
};

interface TaskboardPageProps {
  initialTab?: 'tasks' | 'notes' | 'my-tasks' | 'calendar' | 'reports' | 'settings';
  onTabChange?: (tab: 'tasks' | 'notes' | 'my-tasks' | 'calendar' | 'reports' | 'settings' | string) => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  client: string;
  dueDate: string;
  createdDate: string;
  mainStatus: string;
  subStatus: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
  count?: number;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  mainStatuses: string[];
  subStatusesByMain: Record<string, string[]>;
  assignees: string[];
  prefilledMainStatus?: string;
  prefilledSubStatus?: string;
}

interface AddMainStatusFormProps {
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
}

interface AddSubStatusFormProps {
  onSubmit: (name: string, color: string, isFirst: boolean, isLast: boolean) => void;
  onCancel: () => void;
}

// Form component for adding main statuses
const AddMainStatusForm: React.FC<AddMainStatusFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), color);
      setName('');
      setColor('#3b82f6');
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Status Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Planning, Execution"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 border border-gray-200 rounded cursor-pointer"
              />
              <span className="text-sm font-poppins text-gray-600">{color}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-poppins font-medium transition-colors duration-200"
          >
            Add Status
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-poppins font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Form component for adding sub statuses
const AddSubStatusForm: React.FC<AddSubStatusFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#10b981');
  const [isFirst, setIsFirst] = useState(false);
  const [isLast, setIsLast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), color, isFirst, isLast);
      setName('');
      setColor('#10b981');
      setIsFirst(false);
      setIsLast(false);
    }
  };

  return (
    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">
              Sub-Status Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., In Review, Completed"
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500 font-poppins"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
              />
              <span className="text-xs font-poppins text-gray-600">{color}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFirst}
              onChange={(e) => setIsFirst(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-xs font-poppins text-gray-700">Start Status</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isLast}
              onChange={(e) => setIsLast(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-xs font-poppins text-gray-700">End Status</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-poppins font-medium transition-colors duration-200"
          >
            Add
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-poppins font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const EditTaskModal: React.FC<EditTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  task, 
  onSave, 
  onDelete,
  mainStatuses, 
  subStatusesByMain, 
  assignees,
  prefilledMainStatus,
  prefilledSubStatus
}) => {
  const [formData, setFormData] = useState<Task>(
    task || {
      id: '',
      title: '',
      description: '',
      assignee: '',
      client: '',
      dueDate: '',
      createdDate: new Date().toISOString().split('T')[0],
      mainStatus: prefilledMainStatus || '',
      subStatus: prefilledSubStatus || '',
      progress: 0,
      priority: 'Medium',
      tags: [],
      count: 0
    }
  );
  const [showCount, setShowCount] = useState(!!task?.count);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update form data when task prop changes (for editing existing tasks)
  React.useEffect(() => {
    if (task) {
      setFormData(task);
      setShowCount(!!task.count);
    } else {
      // Reset to default values for new task
      setFormData({
        id: '',
        title: '',
        description: '',
        assignee: '',
        client: '',
        dueDate: '',
        createdDate: new Date().toISOString().split('T')[0],
        mainStatus: prefilledMainStatus || '',
        subStatus: prefilledSubStatus || '',
        progress: 0,
        priority: 'Medium',
        tags: [],
        count: 0
      });
      setShowCount(false);
    }
  }, [task, prefilledMainStatus, prefilledSubStatus]);

  // Update form data when prefilled values change for new tasks
  React.useEffect(() => {
    if (!task && (prefilledMainStatus || prefilledSubStatus)) {
      setFormData(prev => ({
        ...prev,
        mainStatus: prefilledMainStatus || prev.mainStatus,
        subStatus: prefilledSubStatus || prev.subStatus
      }));
    }
  }, [prefilledMainStatus, prefilledSubStatus, task]);

  const handleSave = () => {
    const taskToSave = {
      ...formData,
      count: showCount ? formData.count : undefined
    };
    onSave(taskToSave);
    onClose();
  };

  const handleDelete = () => {
    if (task?.id) {
      onDelete(task.id);
      onClose();
      setShowDeleteConfirm(false);
    }
  };

  const availableSubStatuses = formData.mainStatus ? subStatusesByMain[formData.mainStatus as keyof typeof subStatusesByMain] || [] : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-poppins font-semibold text-gray-900">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-gray-600 font-poppins text-sm mt-1">
                {task ? 'Update task details and progress' : 'Add a new task to your workflow'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                placeholder="Enter task title"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm resize-none"
                placeholder="Enter task description"
              />
            </div>

            {/* Count Toggle and Input */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-poppins font-medium text-gray-700">
                  Task Count
                </label>
                <button
                  onClick={() => setShowCount(!showCount)}
                  className="flex items-center gap-2"
                >
                  {showCount ? (
                    <ToggleRight size={20} className="text-blue-600" />
                  ) : (
                    <ToggleLeft size={20} className="text-gray-400" />
                  )}
                  <span className="text-sm font-poppins text-gray-600">
                    {showCount ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </div>
              {showCount && (
                <input
                  type="number"
                  value={formData.count || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                  placeholder="Enter count"
                  min="0"
                />
              )}
            </div>

            {/* Row 1: Assignee and Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Assignee *
                </label>
                <div className="relative">
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none"
                  >
                    <option value="">Select assignee</option>
                    {assignees.map(assignee => (
                      <option key={assignee} value={assignee}>{assignee}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                  placeholder="Enter client name"
                />
              </div>
            </div>

            {/* Row 2: Main Status and Sub Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Main Status *
                </label>
                <div className="relative">
                  <select
                    value={formData.mainStatus}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      mainStatus: e.target.value,
                      subStatus: '' // Reset sub status when main status changes
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none"
                  >
                    <option value="">Select main status</option>
                    {mainStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Sub Status *
                </label>
                <div className="relative">
                  <select
                    value={formData.subStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, subStatus: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none"
                    disabled={!formData.mainStatus}
                  >
                    <option value="">Select sub status</option>
                    {availableSubStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 3: Priority and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'High' | 'Medium' | 'Low' }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                />
              </div>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                Progress: {formData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <div>
            {task && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Task
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-poppins font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Save size={16} />
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-poppins font-semibold text-gray-900">Delete Task</h3>
                  <p className="text-gray-600 font-poppins text-sm">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 font-poppins mb-6">
                Are you sure you want to delete "<span className="font-medium">{task?.title}</span>"?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-poppins font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskboardPage: React.FC<TaskboardPageProps> = ({ initialTab = 'tasks', onTabChange }) => {
  const { user } = useTenant();
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes' | 'my-tasks' | 'calendar' | 'reports' | 'settings'>(initialTab);

  // Sync activeTab with initialTab prop changes (sidebar navigation)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Role-based access control
  const userRole = user?.role || 'employee';
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';
  const isManager = userRole === 'manager';
  const isEmployee = userRole === 'employee';
  const currentUserName = user ? `${user.firstName} ${user.lastName}` : 'Althameem';

  // Enhanced tab switching function
  const handleTabSwitch = (tab: 'tasks' | 'notes') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Video Production');
  const [selectedMainStatus, setSelectedMainStatus] = useState('Pre-Production');
  const [selectedAssignee, setSelectedAssignee] = useState('All Assignees');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [showOverdue, setShowOverdue] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedProgress, setSelectedProgress] = useState('All Progress');

  // Status management state
  const [selectedTeamForStatus, setSelectedTeamForStatus] = useState('Video Production');
  const [editingMainStatus, setEditingMainStatus] = useState<MainStatus | null>(null);
  const [editingSubStatus, setEditingSubStatus] = useState<SubStatus | null>(null);
  const [showAddMainStatus, setShowAddMainStatus] = useState(false);
  const [showAddSubStatus, setShowAddSubStatus] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [teamStatuses, setTeamStatuses] = useState<{ [teamName: string]: TeamStatusConfig }>({});
  
  // Date filtering state
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: 'all',
    startDate: '2020-01-01',
    endDate: '2030-12-31'
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prefilledMainStatus, setPrefilledMainStatus] = useState<string>('');
  const [prefilledSubStatus, setPrefilledSubStatus] = useState<string>('');
  
  // Employee Modal States (keeping for compatibility)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeForTasks, setSelectedEmployeeForTasks] = useState<string>('All Assignees');
  const [selectedTeamForTasks, setSelectedTeamForTasks] = useState<string>('All Teams');
  const [selectedTeamForPerformance, setSelectedTeamForPerformance] = useState<string>('All Teams');
  const [employeeModalDateFilter, setEmployeeModalDateFilter] = useState<'today' | 'week' | 'month' | '3months' | '6months' | 'year'>('month');
  
  // Individual Employee Report States
  const [showIndividualReport, setShowIndividualReport] = useState(false);
  const [selectedEmployeeForReport, setSelectedEmployeeForReport] = useState<string>('');
  const [reportsSearchQuery, setReportsSearchQuery] = useState('');
  const [reportsTeamFilter, setReportsTeamFilter] = useState('All Teams');
  const [reportsViewMode, setReportsViewMode] = useState<'cards' | 'list'>('cards');
  
  // Drag and drop state
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts
      },
    })
  );

  // Horizontal scrolling ref for Kanban view
  const kanbanContainerRef = useRef<HTMLDivElement>(null);

  // Ultra-fast, native-feeling horizontal scrolling for Kanban view
  useEffect(() => {
    if (viewMode === 'kanban' && kanbanContainerRef.current) {
      const container = kanbanContainerRef.current;
      
      const handleWheel = (e: WheelEvent) => {
        // Only handle when horizontal scroll is the primary direction
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.deltaX !== 0) {
          e.preventDefault();
          // Direct horizontal scroll manipulation
          container.scrollLeft += e.deltaX * 2;
        }
      };

      // Add wheel listener
      container.addEventListener('wheel', handleWheel, { passive: false });

      // Cleanup
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [viewMode]);

  // Generate current month dates for tasks
  const getCurrentMonthDate = (day: number) => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const [tasks, setTasks] = useState<Task[]>([
    // VIDEO PRODUCTION TEAM TASKS (90 tasks)
    // Pre-Production - Scripting
    {
      id: 'vp1',
      title: 'Product Demo Video Script',
      description: 'Create engaging script for new product demonstration with detailed storyboard and technical specifications',
      assignee: 'Althameem',
      client: 'TechCorp Inc.',
      dueDate: getCurrentMonthDate(5),
      createdDate: '2024-01-02',
      mainStatus: 'Pre-Production',
      subStatus: 'Scripting',
      progress: 75,
      priority: 'High',
      tags: ['script', 'product'],
      count: 5
    },
    {
      id: 'vp1a',
      title: 'Brand Story Video Concept',
      description: 'Develop creative concept for brand storytelling video series',
      assignee: 'Althameem',
      client: 'Brand Inc.',
      dueDate: getCurrentMonthDate(8),
      createdDate: '2024-01-03',
      mainStatus: 'Pre-Production',
      subStatus: 'Planning',
      progress: 45,
      priority: 'Medium',
      tags: ['concept', 'brand'],
      count: 3
    },
    {
      id: 'vp1b',
      title: 'Tutorial Video Series Script',
      description: 'Write comprehensive scripts for 5-part tutorial video series',
      assignee: 'Althameem',
      client: 'EduTech Solutions',
      dueDate: getCurrentMonthDate(12),
      createdDate: '2024-01-04',
      mainStatus: 'Pre-Production',
      subStatus: 'Planning',
      progress: 80,
      priority: 'High',
      tags: ['tutorial', 'series'],
      count: 5
    },
    {
      id: 'vp1c',
      title: 'Marketing Campaign Video',
      description: 'Complete video production for Q1 marketing campaign',
      assignee: 'Althameem',
      client: 'Fashion Retail Co.',
      dueDate: getCurrentMonthDate(15),
      createdDate: '2024-01-05',
      mainStatus: 'Post-Production',
      subStatus: 'Editing',
      progress: 60,
      priority: 'High',
      tags: ['marketing', 'campaign'],
      count: 4
    },
    {
      id: 'vp1d',
      title: 'Product Unboxing Video',
      description: 'Create engaging unboxing experience video for new product launch',
      assignee: 'Althameem',
      client: 'Tech Gadgets Ltd.',
      dueDate: getCurrentMonthDate(20),
      createdDate: '2024-01-06',
      mainStatus: 'Post-Production',
      subStatus: 'Final Review',
      progress: 90,
      priority: 'Medium',
      tags: ['unboxing', 'product'],
      count: 2
    },
    {
      id: 'vp1e',
      title: 'Corporate Training Video',
      description: 'Produce comprehensive training video for employee onboarding',
      assignee: 'Althameem',
      client: 'Corporate Services Inc.',
      dueDate: getCurrentMonthDate(25),
      createdDate: '2024-01-07',
      mainStatus: 'Post-Production',
      subStatus: 'Delivered',
      progress: 100,
      priority: 'Low',
      tags: ['training', 'corporate'],
      count: 1
    },
    {
      id: 'vp2',
      title: 'Client Presentation Deck',
      description: 'Design comprehensive presentation for quarterly business review',
      assignee: 'Sarah Johnson',
      client: 'BusinessCorp',
      dueDate: getCurrentMonthDate(8),
      createdDate: '2024-02-10',
      mainStatus: 'Pre-Production',
      subStatus: 'Scripting',
      progress: 40,
      priority: 'High',
      tags: ['presentation', 'client'],
      count: 2
    },
    {
      id: 'vp3',
      title: 'Social Media Campaign Script',
      description: 'Create engaging script for social media marketing campaign',
      assignee: 'Sarah Johnson',
      client: 'SocialBuzz',
      dueDate: '2024-01-15',
      createdDate: '2024-01-01',
      mainStatus: 'Pre-Production',
      subStatus: 'Scripting',
      progress: 85,
      priority: 'Medium',
      tags: ['social', 'marketing'],
      count: 3
    },
    {
      id: 'vp4',
      title: 'Training Module Series Script',
      description: 'Educational content scripts for employee training program',
      assignee: 'Mike Chen',
      client: 'LearnCorp',
      dueDate: '2024-02-12',
      createdDate: '2024-01-20',
      mainStatus: 'Pre-Production',
      subStatus: 'Scripting',
      progress: 30,
      priority: 'Medium',
      tags: ['training', 'education'],
      count: 8
    },
    {
      id: 'vp5',
      title: 'Company Anniversary Script',
      description: 'Commemorative script for company milestone celebration',
      assignee: 'James Park',
      client: 'CelebrateTech',
      dueDate: '2024-03-01',
      createdDate: '2024-02-01',
      mainStatus: 'Pre-Production',
      subStatus: 'Scripting',
      progress: 15,
      priority: 'High',
      tags: ['anniversary', 'celebration'],
      count: 1
    },
    // Pre-Production - Approved
    {
      id: 'vp6',
      title: 'Product Demo Walkthrough',
      description: 'Interactive product demonstration for new features',
      assignee: 'Sarah Johnson',
      client: 'TechStart',
      dueDate: '2024-01-28',
      createdDate: '2024-01-10',
      mainStatus: 'Pre-Production',
      subStatus: 'Approved',
      progress: 100,
      priority: 'High',
      tags: ['demo', 'product'],
      count: 1
    },
    {
      id: 'vp7',
      title: 'Customer Success Stories',
      description: 'Collection of customer testimonial videos',
      assignee: 'Althameem',
      client: 'HappyClients',
      dueDate: '2024-03-15',
      createdDate: '2024-02-15',
      mainStatus: 'Pre-Production',
      subStatus: 'Approved',
      progress: 100,
      priority: 'Medium',
      tags: ['testimonial', 'success'],
      count: 5
    },
    {
      id: 'vp8',
      title: 'Product Launch Teaser',
      description: 'Short teaser video for upcoming product launch',
      assignee: 'Mike Chen',
      client: 'LaunchPad',
      dueDate: '2024-04-15',
      createdDate: '2024-03-20',
      mainStatus: 'Pre-Production',
      subStatus: 'Approved',
      progress: 100,
      priority: 'High',
      tags: ['teaser', 'launch'],
      count: 1
    },
    // Pre-Production - Shoot Scheduled
    {
      id: 'vp9',
      title: 'Corporate Values Video',
      description: 'Video showcasing company culture and values',
      assignee: 'James Park',
      client: 'ValuesCorp',
      dueDate: '2024-05-20',
      createdDate: '2024-04-15',
      mainStatus: 'Pre-Production',
      subStatus: 'Shoot Scheduled',
      progress: 40,
      priority: 'Medium',
      tags: ['values', 'culture'],
      count: 1
    },
    {
      id: 'vp10',
      title: 'Holiday Campaign Video',
      description: 'Seasonal marketing campaign for holiday period',
      assignee: 'Sarah Johnson',
      client: 'HolidayBrand',
      dueDate: '2024-10-01',
      createdDate: '2024-09-01',
      mainStatus: 'Pre-Production',
      subStatus: 'Shoot Scheduled',
      progress: 20,
      priority: 'High',
      tags: ['holiday', 'campaign'],
      count: 1
    },
    // Post-Production - Editing
    {
      id: 'vp11',
      title: 'Industry Conference Recap',
      description: 'Highlights from recent industry conference',
      assignee: 'Mike Chen',
      client: 'ConferencePro',
      dueDate: '2024-06-01',
      createdDate: '2024-05-15',
      mainStatus: 'Post-Production',
      subStatus: 'Editing',
      progress: 55,
      priority: 'Low',
      tags: ['conference', 'recap'],
      count: 1
    },
    {
      id: 'vp12',
      title: 'Awards Ceremony Highlight',
      description: 'Highlights from company awards ceremony',
      assignee: 'Althameem',
      client: 'AwardWinner',
      dueDate: '2024-11-01',
      createdDate: '2024-10-01',
      mainStatus: 'Post-Production',
      subStatus: 'Editing',
      progress: 70,
      priority: 'Medium',
      tags: ['awards', 'ceremony'],
      count: 1
    },
    // Post-Production - Review
    {
      id: 'vp13',
      title: 'Webinar Introduction Video',
      description: 'Opening video for monthly webinar series',
      assignee: 'Sarah Johnson',
      client: 'WebinarPro',
      dueDate: '2024-04-01',
      createdDate: '2024-03-01',
      mainStatus: 'Post-Production',
      subStatus: 'Review',
      progress: 90,
      priority: 'High',
      tags: ['webinar', 'intro'],
      count: 1
    },
    {
      id: 'vp14',
      title: 'New Hire Orientation',
      description: 'Welcome video for new employee onboarding',
      assignee: 'James Park',
      client: 'OnboardPro',
      dueDate: '2024-08-15',
      createdDate: '2024-07-15',
      mainStatus: 'Post-Production',
      subStatus: 'Review',
      progress: 80,
      priority: 'Medium',
      tags: ['onboarding', 'orientation'],
      count: 1
    },
    // Post-Production - Final Render
    {
      id: 'vp15',
      title: 'Social Media Promo',
      description: 'Short promotional video for social media campaigns',
      assignee: 'Mike Chen',
      client: 'SocialBrand',
      dueDate: getCurrentMonthDate(25),
      createdDate: '2024-02-12',
      mainStatus: 'Post-Production',
      subStatus: 'Final Render',
      progress: 95,
      priority: 'Low',
      tags: ['social', 'promo'],
      count: 5
    },
    {
      id: 'vp16',
      title: 'Training Module Series',
      description: 'Create series of training modules for employee onboarding',
      assignee: 'Althameem',
      client: 'CorporateTraining',
      dueDate: getCurrentMonthDate(26),
      createdDate: '2024-02-05',
      mainStatus: 'Post-Production',
      subStatus: 'Final Render',
      progress: 80,
      priority: 'Medium',
      tags: ['training', 'corporate'],
      count: 15
    },
    // Post-Production - Delivered
    {
      id: 'vp17',
      title: 'Corporate Training Video',
      description: 'Professional training video for corporate clients',
      assignee: 'Sarah Johnson',
      client: 'BigCorp',
      dueDate: getCurrentMonthDate(28),
      createdDate: '2024-02-10',
      mainStatus: 'Post-Production',
      subStatus: 'Delivered',
      progress: 100,
      priority: 'Medium',
      tags: ['corporate', 'training'],
      count: 7
    },
    {
      id: 'vp18',
      title: 'Annual Report Video',
      description: 'Executive summary video for annual company report',
      assignee: 'Mike Chen',
      client: 'AnnualCorp',
      dueDate: getCurrentMonthDate(30),
      createdDate: '2024-02-15',
      mainStatus: 'Post-Production',
      subStatus: 'Delivered',
      progress: 100,
      priority: 'High',
      tags: ['annual', 'report'],
      count: 4
    },

    // DIGITAL MARKETING TEAM TASKS (90 tasks)
    // Campaign Planning - Research
    {
      id: 'dm1',
      title: 'Market Research Analysis',
      description: 'Comprehensive market analysis for Q2 campaigns',
      assignee: 'Emily Rodriguez',
      client: 'MarketLeader',
      dueDate: getCurrentMonthDate(10),
      createdDate: '2024-01-15',
      mainStatus: 'Campaign Planning',
      subStatus: 'Research',
      progress: 60,
      priority: 'High',
      tags: ['research', 'market'],
      count: 1
    },
    {
      id: 'dm2',
      title: 'Competitor Analysis Report',
      description: 'Detailed analysis of competitor strategies and positioning',
      assignee: 'David Kim',
      client: 'CompAnalytics',
      dueDate: '2024-03-20',
      createdDate: '2024-02-20',
      mainStatus: 'Campaign Planning',
      subStatus: 'Research',
      progress: 45,
      priority: 'Medium',
      tags: ['competitors', 'analysis'],
      count: 1
    },
    {
      id: 'dm3',
      title: 'Target Audience Segmentation',
      description: 'Customer persona development and audience segmentation',
      assignee: 'Lisa Wang',
      client: 'AudienceFirst',
      dueDate: '2024-04-10',
      createdDate: '2024-03-10',
      mainStatus: 'Campaign Planning',
      subStatus: 'Research',
      progress: 30,
      priority: 'High',
      tags: ['audience', 'personas'],
      count: 3
    },
    // Campaign Planning - Strategy
    {
      id: 'dm4',
      title: 'Social Media Strategy',
      description: 'Comprehensive social media marketing strategy for brand awareness',
      assignee: 'Emily Rodriguez',
      client: 'SocialGrowth',
      dueDate: '2024-05-15',
      createdDate: '2024-04-15',
      mainStatus: 'Campaign Planning',
      subStatus: 'Strategy',
      progress: 75,
      priority: 'High',
      tags: ['social', 'strategy'],
      count: 1
    },
    {
      id: 'dm5',
      title: 'Content Marketing Plan',
      description: 'Annual content marketing roadmap with editorial calendar',
      assignee: 'David Kim',
      client: 'ContentMasters',
      dueDate: '2024-06-01',
      createdDate: '2024-05-01',
      mainStatus: 'Campaign Planning',
      subStatus: 'Strategy',
      progress: 55,
      priority: 'Medium',
      tags: ['content', 'planning'],
      count: 12
    },
    // Campaign Execution - Active
    {
      id: 'dm6',
      title: 'LinkedIn Ad Campaign',
      description: 'B2B lead generation campaign on LinkedIn platform',
      assignee: 'Lisa Wang',
      client: 'B2BLeads',
      dueDate: getCurrentMonthDate(20),
      createdDate: '2024-02-01',
      mainStatus: 'Campaign Execution',
      subStatus: 'Active',
      progress: 85,
      priority: 'High',
      tags: ['linkedin', 'ads'],
      count: 1
    },
    {
      id: 'dm7',
      title: 'Google Ads Campaign',
      description: 'Search and display advertising campaign for product promotion',
      assignee: 'Emily Rodriguez',
      client: 'SearchFirst',
      dueDate: getCurrentMonthDate(15),
      createdDate: '2024-01-20',
      mainStatus: 'Campaign Execution',
      subStatus: 'Active',
      progress: 90,
      priority: 'High',
      tags: ['google', 'ads'],
      count: 1
    },
    // Campaign Execution - Completed
    {
      id: 'dm8',
      title: 'Email Marketing Campaign',
      description: 'Automated email nurture sequence for lead conversion',
      assignee: 'David Kim',
      client: 'EmailPro',
      dueDate: '2024-03-30',
      createdDate: '2024-02-28',
      mainStatus: 'Campaign Execution',
      subStatus: 'Completed',
      progress: 100,
      priority: 'Medium',
      tags: ['email', 'automation'],
      count: 8
    },
    {
      id: 'dm9',
      title: 'Influencer Partnership Campaign',
      description: 'Collaboration with industry influencers for brand promotion',
      assignee: 'Lisa Wang',
      client: 'InfluencerHub',
      dueDate: '2024-04-20',
      createdDate: '2024-03-15',
      mainStatus: 'Campaign Execution',
      subStatus: 'Completed',
      progress: 100,
      priority: 'High',
      tags: ['influencer', 'partnership'],
      count: 5
    },

    // UI/UX TEAM TASKS (70 tasks)
    // Research - User Research
    {
      id: 'ux1',
      title: 'User Journey Mapping',
      description: 'Comprehensive user journey analysis for mobile app redesign',
      assignee: 'Amanda Davis',
      client: 'MobileFirst',
      dueDate: getCurrentMonthDate(12),
      createdDate: '2024-01-08',
      mainStatus: 'Research',
      subStatus: 'User Research',
      progress: 65,
      priority: 'High',
      tags: ['journey', 'mapping'],
      count: 1
    },
    {
      id: 'ux2',
      title: 'Usability Testing Sessions',
      description: 'Conduct user testing sessions for e-commerce platform',
      assignee: 'Chris Taylor',
      client: 'ShopEasy',
      dueDate: '2024-03-25',
      createdDate: '2024-02-25',
      mainStatus: 'Research',
      subStatus: 'User Research',
      progress: 40,
      priority: 'Medium',
      tags: ['testing', 'usability'],
      count: 10
    },
    // Design - Wireframing
    {
      id: 'ux3',
      title: 'Dashboard Wireframes',
      description: 'Low-fidelity wireframes for analytics dashboard interface',
      assignee: 'Samantha Lee',
      client: 'DataViz',
      dueDate: '2024-04-18',
      createdDate: '2024-03-18',
      mainStatus: 'Design',
      subStatus: 'Wireframing',
      progress: 80,
      priority: 'High',
      tags: ['wireframes', 'dashboard'],
      count: 15
    },
    {
      id: 'ux4',
      title: 'Mobile App Wireframes',
      description: 'Complete wireframe set for iOS and Android applications',
      assignee: 'Amanda Davis',
      client: 'AppCreators',
      dueDate: '2024-05-10',
      createdDate: '2024-04-10',
      mainStatus: 'Design',
      subStatus: 'Wireframing',
      progress: 50,
      priority: 'Medium',
      tags: ['mobile', 'wireframes'],
      count: 25
    },
    // Design - Prototyping
    {
      id: 'ux5',
      title: 'Interactive Prototype',
      description: 'High-fidelity interactive prototype for user testing',
      assignee: 'Chris Taylor',
      client: 'ProtoTech',
      dueDate: getCurrentMonthDate(22),
      createdDate: '2024-02-15',
      mainStatus: 'Design',
      subStatus: 'Prototyping',
      progress: 75,
      priority: 'High',
      tags: ['prototype', 'interactive'],
      count: 1
    },
    // Design - Final Design
    {
      id: 'ux6',
      title: 'Brand Identity Design',
      description: 'Complete brand identity package including logo and guidelines',
      assignee: 'Samantha Lee',
      client: 'BrandNew',
      dueDate: '2024-06-15',
      createdDate: '2024-05-15',
      mainStatus: 'Design',
      subStatus: 'Final Design',
      progress: 90,
      priority: 'Medium',
      tags: ['branding', 'identity'],
      count: 1
    },
    {
      id: 'ux7',
      title: 'Website Redesign',
      description: 'Complete website redesign with modern UI/UX principles',
      assignee: 'Amanda Davis',
      client: 'WebModern',
      dueDate: getCurrentMonthDate(28),
      createdDate: '2024-02-01',
      mainStatus: 'Design',
      subStatus: 'Final Design',
      progress: 95,
      priority: 'High',
      tags: ['website', 'redesign'],
      count: 1
    },

    // DEVELOPMENT TEAM TASKS (80 tasks)
    // Planning - Requirements
    {
      id: 'dev1',
      title: 'Technical Requirements Analysis',
      description: 'Comprehensive technical analysis for new platform development',
      assignee: 'Tom Wilson',
      client: 'TechBuild',
      dueDate: getCurrentMonthDate(14),
      createdDate: '2024-01-10',
      mainStatus: 'Planning',
      subStatus: 'Requirements',
      progress: 70,
      priority: 'High',
      tags: ['requirements', 'analysis'],
      count: 1
    },
    {
      id: 'dev2',
      title: 'Database Schema Design',
      description: 'Design optimal database structure for customer management system',
      assignee: 'Jessica Brown',
      client: 'DataBase Inc',
      dueDate: '2024-03-22',
      createdDate: '2024-02-22',
      mainStatus: 'Planning',
      subStatus: 'Requirements',
      progress: 55,
      priority: 'Medium',
      tags: ['database', 'schema'],
      count: 1
    },
    // Development - Coding
    {
      id: 'dev3',
      title: 'API Development',
      description: 'RESTful API development for mobile application backend',
      assignee: 'Kevin Martinez',
      client: 'APIFirst',
      dueDate: '2024-04-25',
      createdDate: '2024-03-25',
      mainStatus: 'Development',
      subStatus: 'Coding',
      progress: 60,
      priority: 'High',
      tags: ['api', 'backend'],
      count: 1
    },
    {
      id: 'dev4',
      title: 'Frontend Implementation',
      description: 'React.js frontend development for dashboard interface',
      assignee: 'Tom Wilson',
      client: 'FrontendPro',
      dueDate: getCurrentMonthDate(18),
      createdDate: '2024-02-08',
      mainStatus: 'Development',
      subStatus: 'Coding',
      progress: 85,
      priority: 'High',
      tags: ['frontend', 'react'],
      count: 1
    },
    // Testing - QA Testing
    {
      id: 'dev5',
      title: 'Automated Testing Suite',
      description: 'Comprehensive automated testing implementation',
      assignee: 'Jessica Brown',
      client: 'TestMasters',
      dueDate: '2024-05-30',
      createdDate: '2024-04-30',
      mainStatus: 'Testing',
      subStatus: 'QA Testing',
      progress: 40,
      priority: 'Medium',
      tags: ['testing', 'automation'],
      count: 50
    },
    // Deployment - Production
    {
      id: 'dev6',
      title: 'Cloud Infrastructure Setup',
      description: 'AWS cloud infrastructure deployment and configuration',
      assignee: 'Kevin Martinez',
      client: 'CloudFirst',
      dueDate: getCurrentMonthDate(24),
      createdDate: '2024-02-20',
      mainStatus: 'Deployment',
      subStatus: 'Production',
      progress: 95,
      priority: 'High',
      tags: ['cloud', 'deployment'],
      count: 1
    },
    {
      id: 'dev7',
      title: 'Mobile App Deployment',
      description: 'iOS and Android app store deployment process',
      assignee: 'Tom Wilson',
      client: 'MobileStore',
      dueDate: '2024-06-10',
      createdDate: '2024-05-10',
      mainStatus: 'Deployment',
      subStatus: 'Production',
      progress: 100,
      priority: 'Medium',
      tags: ['mobile', 'appstore'],
      count: 1
    },

    // PERFORMANCE MARKETING TEAM TASKS (60 tasks)
    // Analytics - Data Collection
    {
      id: 'pm1',
      title: 'Google Analytics Setup',
      description: 'Comprehensive Google Analytics 4 implementation and configuration',
      assignee: 'Robert Anderson',
      client: 'AnalyticsPro',
      dueDate: getCurrentMonthDate(16),
      createdDate: '2024-01-12',
      mainStatus: 'Analytics',
      subStatus: 'Data Collection',
      progress: 80,
      priority: 'High',
      tags: ['analytics', 'google'],
      count: 1
    },
    {
      id: 'pm2',
      title: 'Conversion Tracking Setup',
      description: 'Multi-platform conversion tracking implementation',
      assignee: 'Nicole Thomas',
      client: 'ConversionMax',
      dueDate: '2024-03-28',
      createdDate: '2024-02-28',
      mainStatus: 'Analytics',
      subStatus: 'Data Collection',
      progress: 65,
      priority: 'Medium',
      tags: ['conversion', 'tracking'],
      count: 15
    },
    // Optimization - A/B Testing
    {
      id: 'pm3',
      title: 'Landing Page A/B Test',
      description: 'Split testing for conversion rate optimization',
      assignee: 'Steven Clark',
      client: 'TestingLab',
      dueDate: '2024-04-12',
      createdDate: '2024-03-12',
      mainStatus: 'Optimization',
      subStatus: 'A/B Testing',
      progress: 45,
      priority: 'High',
      tags: ['testing', 'optimization'],
      count: 5
    },
    // Optimization - Performance Boost
    {
      id: 'pm4',
      title: 'Ad Campaign Optimization',
      description: 'Performance optimization for Google and Facebook ad campaigns',
      assignee: 'Robert Anderson',
      client: 'AdOptimize',
      dueDate: getCurrentMonthDate(26),
      createdDate: '2024-02-18',
      mainStatus: 'Optimization',
      subStatus: 'Performance Boost',
      progress: 90,
      priority: 'High',
      tags: ['ads', 'optimization'],
      count: 1
    },
    {
      id: 'pm5',
      title: 'Website Speed Optimization',
      description: 'Technical SEO and page speed optimization',
      assignee: 'Nicole Thomas',
      client: 'SpeedFirst',
      dueDate: '2024-05-25',
      createdDate: '2024-04-25',
      mainStatus: 'Optimization',
      subStatus: 'Performance Boost',
      progress: 70,
      priority: 'Medium',
      tags: ['speed', 'seo'],
      count: 1
    },

    // SALES TEAM TASKS (40 tasks)
    // Lead Generation - Prospecting
    {
      id: 'sales1',
      title: 'Enterprise Lead Research',
      description: 'Research and qualification of enterprise-level prospects',
      assignee: 'Alex Thompson',
      client: 'Enterprise Corp',
      dueDate: getCurrentMonthDate(11),
      createdDate: '2024-01-05',
      mainStatus: 'Lead Generation',
      subStatus: 'Prospecting',
      progress: 60,
      priority: 'High',
      tags: ['enterprise', 'leads'],
      count: 25
    },
    {
      id: 'sales2',
      title: 'SMB Outreach Campaign',
      description: 'Small and medium business outreach and lead generation',
      assignee: 'Maria Garcia',
      client: 'SMB Solutions',
      dueDate: '2024-03-16',
      createdDate: '2024-02-16',
      mainStatus: 'Lead Generation',
      subStatus: 'Prospecting',
      progress: 75,
      priority: 'Medium',
      tags: ['smb', 'outreach'],
      count: 50
    },
    // Sales Process - Qualification
    {
      id: 'sales3',
      title: 'Lead Qualification Process',
      description: 'BANT qualification for incoming leads',
      assignee: 'Ryan O\'Connor',
      client: 'QualifyFirst',
      dueDate: '2024-04-08',
      createdDate: '2024-03-08',
      mainStatus: 'Sales Process',
      subStatus: 'Qualification',
      progress: 85,
      priority: 'High',
      tags: ['qualification', 'bant'],
      count: 20
    },
    // Sales Process - Closed Won
    {
      id: 'sales4',
      title: 'SaaS Platform Deal',
      description: 'Annual SaaS subscription deal with enterprise client',
      assignee: 'Alex Thompson',
      client: 'BigTech Inc',
      dueDate: getCurrentMonthDate(30),
      createdDate: '2024-02-01',
      mainStatus: 'Sales Process',
      subStatus: 'Closed Won',
      progress: 100,
      priority: 'High',
      tags: ['saas', 'enterprise'],
      count: 1
    },
    {
      id: 'sales5',
      title: 'Marketing Automation Deal',
      description: 'Marketing automation platform implementation',
      assignee: 'Maria Garcia',
      client: 'AutoMarketing',
      dueDate: '2024-06-05',
      createdDate: '2024-05-05',
      mainStatus: 'Sales Process',
      subStatus: 'Closed Won',
      progress: 100,
      priority: 'Medium',
      tags: ['automation', 'marketing'],
      count: 1
    },

    // OPERATIONS TEAM TASKS (50 tasks)
    // Planning - Resource Planning
    {
      id: 'ops1',
      title: 'Quarterly Resource Allocation',
      description: 'Strategic resource planning for Q2 initiatives',
      assignee: 'Robert Anderson',
      client: 'Internal',
      dueDate: getCurrentMonthDate(13),
      createdDate: '2024-01-07',
      mainStatus: 'Planning',
      subStatus: 'Resource Planning',
      progress: 70,
      priority: 'High',
      tags: ['resources', 'planning'],
      count: 1
    },
    {
      id: 'ops2',
      title: 'Budget Analysis Report',
      description: 'Comprehensive budget analysis and forecasting',
      assignee: 'Nicole Thomas',
      client: 'Finance Dept',
      dueDate: '2024-03-19',
      createdDate: '2024-02-19',
      mainStatus: 'Planning',
      subStatus: 'Resource Planning',
      progress: 55,
      priority: 'Medium',
      tags: ['budget', 'analysis'],
      count: 1
    },
    // Execution - Process Implementation
    {
      id: 'ops3',
      title: 'Workflow Automation',
      description: 'Implementation of automated workflow processes',
      assignee: 'Steven Clark',
      client: 'ProcessPro',
      dueDate: '2024-04-22',
      createdDate: '2024-03-22',
      mainStatus: 'Execution',
      subStatus: 'Process Implementation',
      progress: 40,
      priority: 'High',
      tags: ['automation', 'workflow'],
      count: 8
    },
    // Execution - Completed
    {
      id: 'ops4',
      title: 'Quality Assurance Framework',
      description: 'Comprehensive QA framework implementation',
      assignee: 'Robert Anderson',
      client: 'QualityFirst',
      dueDate: getCurrentMonthDate(27),
      createdDate: '2024-02-12',
      mainStatus: 'Execution',
      subStatus: 'Completed',
      progress: 100,
      priority: 'Medium',
      tags: ['qa', 'framework'],
      count: 1
    },
    {
      id: 'ops5',
      title: 'Vendor Management System',
      description: 'Centralized vendor management and evaluation system',
      assignee: 'Nicole Thomas',
      client: 'VendorTrack',
      dueDate: '2024-05-18',
      createdDate: '2024-04-18',
      mainStatus: 'Execution',
      subStatus: 'Completed',
      progress: 100,
      priority: 'High',
      tags: ['vendor', 'management'],
      count: 1
    }
  ]);

  const teams = ['Video Production', 'Digital Marketing', 'UI/UX Team', 'Development Team', 'Performance Marketing', 'Sales Team', 'Operations Team'];
  const mainStatuses = ['Pre-Production', 'Post-Production', 'Campaign Planning', 'Campaign Execution', 'Research', 'Design', 'Planning', 'Development', 'Testing', 'Deployment', 'Analytics', 'Optimization', 'Lead Generation', 'Sales Process', 'Execution'];
  const subStatusesByMain = {
    'Pre-Production': ['Scripting', 'Approved', 'Shoot Scheduled'],
    'Post-Production': ['Editing', 'Review', 'Final Render', 'Delivered'],
    'Campaign Planning': ['Research', 'Strategy'],
    'Campaign Execution': ['Active', 'Completed'],
    'Research': ['User Research'],
    'Design': ['Wireframing', 'Prototyping', 'Final Design'],
    'Planning': ['Requirements', 'Resource Planning'],
    'Development': ['Coding'],
    'Testing': ['QA Testing'],
    'Deployment': ['Production'],
    'Analytics': ['Data Collection'],
    'Optimization': ['A/B Testing', 'Performance Boost'],
    'Lead Generation': ['Prospecting'],
    'Sales Process': ['Qualification', 'Closed Won'],
    'Execution': ['Process Implementation', 'Completed']
  };
  const assignees = ['Althameem', 'Sarah Johnson', 'Mike Chen', 'James Park', 'Emily Rodriguez', 'David Kim', 'Lisa Wang', 'Amanda Davis', 'Chris Taylor', 'Samantha Lee', 'Tom Wilson', 'Jessica Brown', 'Kevin Martinez', 'Robert Anderson', 'Nicole Thomas', 'Steven Clark', 'Alex Thompson', 'Maria Garcia', 'Ryan O\'Connor'];
  const timeframes = ['All Time', 'This Week', 'This Month', 'Last 30 Days'];

  // Role-based task filtering
  const getAccessibleTasks = () => {
    if (isAdmin) {
      // Super Admin and Admin can see all tasks
      return tasks;
    } else if (isManager) {
      // Managers can see tasks assigned to their team members and themselves
      const managedTeamMembers = assignees.filter(assignee => assignee !== 'All Assignees');
      return tasks.filter(task => managedTeamMembers.includes(task.assignee));
    } else {
      // Employees can only see their own tasks
      return tasks.filter(task => task.assignee === currentUserName);
    }
  };

  // Enhanced filter with role-based access control
  const filteredTasks = useMemo(() => {
    const accessibleTasks = getAccessibleTasks();
    
    return accessibleTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Team filtering - only available for admin/manager roles
      const matchesTeam = selectedTeam === 'All Teams' || !isAdmin || true;
      
      const matchesMainStatus = selectedMainStatus === 'All Statuses' || task.mainStatus === selectedMainStatus;
      
      // Assignee filtering - restricted based on role
      let matchesAssignee = true;
      if (isAdmin || isManager) {
        matchesAssignee = selectedAssignee === 'All Assignees' || task.assignee === selectedAssignee;
      }
      
      // Priority filtering
      const matchesPriority = selectedPriority === 'All Priorities' || task.priority === selectedPriority;
      
      // Progress filtering
      let matchesProgress = true;
      if (selectedProgress !== 'All Progress') {
        if (selectedProgress === 'Not Started') matchesProgress = task.progress === 0;
        else if (selectedProgress === 'In Progress') matchesProgress = task.progress > 0 && task.progress < 100;
        else if (selectedProgress === 'Completed') matchesProgress = task.progress === 100;
      }
      
      // Date filtering based on createdDate
      const taskDate = new Date(task.createdDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const matchesDateRange = taskDate >= startDate && taskDate <= endDate;
      
      const isOverdue = new Date(task.dueDate) < new Date() && task.progress < 100;
      const matchesOverdue = !showOverdue || isOverdue;

      return matchesSearch && matchesTeam && matchesMainStatus && matchesAssignee && matchesPriority && matchesProgress && matchesDateRange && matchesOverdue;
    });
  }, [tasks, searchQuery, selectedTeam, selectedMainStatus, selectedAssignee, selectedPriority, selectedProgress, dateRange, showOverdue, userRole, currentUserName]);

  // Group tasks by sub-status for Kanban view
  const tasksBySubStatus = useMemo(() => {
    const grouped = filteredTasks.reduce((acc, task) => {
      if (!acc[task.subStatus]) {
        acc[task.subStatus] = [];
      }
      acc[task.subStatus].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
    return grouped;
  }, [filteredTasks]);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setPrefilledMainStatus('');
    setPrefilledSubStatus('');
    setShowEditModal(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    if (updatedTask.id) {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    } else {
      const newTask = { ...updatedTask, id: Date.now().toString() };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setPrefilledMainStatus('');
    setPrefilledSubStatus('');
    setShowEditModal(true);
  };

  const handleCreateTaskInStatus = (mainStatus: string, subStatus: string) => {
    setSelectedTask(null);
    setPrefilledMainStatus(mainStatus);
    setPrefilledSubStatus(subStatus);
    setShowEditModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Helper function to get filtered assignees for reports with team and search filtering
  const getFilteredReportsAssignees = () => {
    let assigneesToShow = assignees;
    
    // Filter by team
    if (reportsTeamFilter !== 'All Teams') {
      const teamAssignees = teamAssigneeMapping[reportsTeamFilter as keyof typeof teamAssigneeMapping] || [];
      assigneesToShow = assignees.filter((assignee: string) => teamAssignees.includes(assignee));
    }
    
    // Filter by search query
    if (reportsSearchQuery.trim() !== '') {
      assigneesToShow = assigneesToShow.filter((assignee: string) =>
        assignee.toLowerCase().includes(reportsSearchQuery.toLowerCase())
      );
    }
    
    // Only return assignees who have tasks
    return assigneesToShow.filter((assignee: string) => 
      filteredTasks.some(task => task.assignee === assignee)
    );
  };

  const getStatusColor = (subStatus: string) => {
    const colors = {
      'Scripting': 'border-l-red-500',
      'Approved': 'border-l-yellow-500',
      'Shoot Scheduled': 'border-l-yellow-500',
      'Editing': 'border-l-red-500',
      'Review': 'border-l-yellow-500',
      'Final Render': 'border-l-yellow-500',
      'Delivered': 'border-l-green-500'
    };
    return colors[subStatus as keyof typeof colors] || 'border-l-gray-500';
  };

  const isOverdue = (dueDate: string, progress: number) => {
    return new Date(dueDate) < new Date() && progress < 100;
  };

  // Calendar view helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return displayTasks.filter(task => task.dueDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Drag and drop event handlers for dnd-kit
  const handleDndDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(task => task.id === active.id);
    setActiveId(active.id);
    setDraggedTask(task || null);
  };

  const handleDndDragOver = (event: DragOverEvent) => {
    // This could be used for visual feedback during drag
  };

  const handleDndDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedTask(null);

    if (!over) {
      console.log('No drop target');
      return;
    }

    // Check if dropping on a different column
    const overId = over.id as string;
    const activeTaskId = active.id as string;
    
    console.log('Drag ended:', { activeTaskId, overId });
    
    // Extract the subStatus from the overId (format: "column-{subStatus}")
    if (overId.startsWith('column-')) {
      const newSubStatus = overId.replace('column-', '');
      const taskToMove = tasks.find(task => task.id === activeTaskId);
      
      console.log('Task to move:', taskToMove);
      console.log('New sub status:', newSubStatus);
      
      if (taskToMove && taskToMove.subStatus !== newSubStatus) {
        // Update task status
        const updatedTasks = tasks.map(task =>
          task.id === activeTaskId
            ? { ...task, subStatus: newSubStatus }
            : task
        );
        
        console.log('Updating tasks...', { 
          oldStatus: taskToMove.subStatus, 
          newStatus: newSubStatus,
          taskTitle: taskToMove.title 
        });
        
        setTasks(updatedTasks);
        
        // Show success feedback
        alert(`✅ Moved "${taskToMove.title}" from ${taskToMove.subStatus} to ${newSubStatus}`);
      } else if (taskToMove) {
        console.log('Task dropped in same column');
      } else {
        console.log('Task not found');
      }
    } else {
      console.log('Not a column drop zone');
    }
  };

  const renderKanbanView = () => {
    const currentSubStatuses = selectedMainStatus === 'All Statuses' 
      ? Array.from(new Set(displayTasks.map(task => task.subStatus)))
      : subStatusesByMain[selectedMainStatus as keyof typeof subStatusesByMain] || [];

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDndDragStart}
        onDragOver={handleDndDragOver}
        onDragEnd={handleDndDragEnd}
      >
        <div 
          ref={kanbanContainerRef}
          className="kanban-container flex gap-6 pb-6" 
          style={{ 
            minWidth: `${currentSubStatuses.length * 320}px`,
            width: '100%'
          }}
        >
        {currentSubStatuses.map((subStatus: string) => (
          <DroppableColumn key={subStatus} id={`column-${subStatus}`} className="flex-shrink-0 w-80">
            <div 
              className="bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200" 
              style={{ 
                height: 'calc(100vh - 180px)',
                minHeight: '70vh'
              }}
            >
              {/* Column Header with Add Task Button */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-poppins font-semibold text-gray-900">{subStatus}</h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-poppins">
                    {displayTasks.filter(task => task.subStatus === subStatus).length || 0}
                  </span>
                </div>
                
                {/* Add Task Button - Role Restricted */}
                {(isAdmin || isManager) ? (
                  <button
                    onClick={() => handleCreateTaskInStatus(selectedMainStatus, subStatus)}
                    className="w-full py-2 px-3 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-gray-600 hover:text-blue-600 font-poppins font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus size={16} />
                    Add Task
                  </button>
                ) : (
                  <div className="w-full py-2 px-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-poppins text-sm flex items-center justify-center gap-2">
                    <Lock size={14} />
                    <span>Admin Only</span>
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div 
                className="p-4 space-y-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" 
                style={{ 
                  minHeight: '60vh', 
                  maxHeight: 'calc(100vh - 200px)',
                  height: 'calc(100vh - 200px)'
                }}
              >
                {displayTasks.filter(task => task.subStatus === subStatus).map(task => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                    isOverdue={isOverdue}
                  />
                ))}
              </div>
            </div>
          </DroppableColumn>
        ))}
        </div>
        <DragOverlay>
          {draggedTask && (
            <SortableTask
              task={draggedTask}
              onEdit={() => {}}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
              isOverdue={isOverdue}
            />
          )}
        </DragOverlay>
      </DndContext>
    );
  };

  const renderListView = () => {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Task</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Assignee</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Client</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Priority</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Progress</th>
                <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayTasks.map(task => (
                <tr 
                  key={task.id} 
                  onClick={() => handleEditTask(task)}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-poppins font-medium text-gray-900 flex items-center gap-2">
                        {task.title}
                        {isOverdue(task.dueDate, task.progress) && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle size={12} />
                            <span className="text-xs font-poppins">Overdue</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 font-poppins truncate max-w-xs">
                        {task.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-poppins font-bold">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-poppins text-gray-900">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-poppins font-medium">
                      {task.client}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-poppins">
                      {task.subStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-poppins text-gray-600">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-poppins ${isOverdue(task.dueDate, task.progress) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Calculate filtered tasks based on active tab and user role
  const displayTasks = useMemo(() => {
    if (activeTab === 'my-tasks') {
      if (isEmployee) {
        // Employees always see only their own tasks in any tab
        return filteredTasks;
      } else {
        // Admins and managers can see their own tasks in My Tasks tab
        return filteredTasks.filter(task => task.assignee === currentUserName);
      }
    }
    return filteredTasks;
  }, [activeTab, filteredTasks, isEmployee, currentUserName]);

  // Calculate dynamic status counts with proper ordering: pending, sub-statuses, completed, overdue
  const statusCounts = useMemo(() => {
    const orderedCounts: { [key: string]: number } = {};
    
    // Get current team configuration for ordering
    const currentTeamConfig = teamStatuses[selectedTeam] || teamStatuses[selectedTeamForStatus] || teamStatuses['Video Production'];
    const allSubStatuses = currentTeamConfig?.mainStatuses.flatMap(ms => 
      ms.subStatuses.map(ss => ({ ...ss, mainOrder: ms.order }))
    ).sort((a, b) => a.mainOrder - b.mainOrder || a.order - b.order) || [];
    
    // Count tasks by status type using team configuration
    const pendingTasks = displayTasks.filter(task => {
      const subStatus = allSubStatuses.find(ss => ss.name === task.subStatus);
      return subStatus?.isFirst || false;
    });
    
    const inProgressTasks = displayTasks.filter(task => {
      const subStatus = allSubStatuses.find(ss => ss.name === task.subStatus);
      return subStatus && !subStatus.isFirst && !subStatus.isLast;
    });
    
    const completedTasks = displayTasks.filter(task => {
      const subStatus = allSubStatuses.find(ss => ss.name === task.subStatus);
      return subStatus?.isLast || false;
    });
    
    const overdueTasks = displayTasks.filter(task => {
      const isTaskOverdue = new Date(task.dueDate) < new Date() && task.progress < 100;
      return isTaskOverdue;
    });
    
    // Add Total Pending (first statuses only)
    if (pendingTasks.length > 0) {
      orderedCounts['Pending Tasks'] = pendingTasks.length;
    }
    
    // Add sub-status counts in configured order (excluding first and last)
    allSubStatuses.forEach(subStatus => {
      if (!subStatus.isFirst && !subStatus.isLast) {
        const count = displayTasks.filter(task => task.subStatus === subStatus.name).length;
        if (count > 0) {
          orderedCounts[subStatus.name] = count;
        }
      }
    });
    
    // Add Total Completed (last statuses only)
    if (completedTasks.length > 0) {
      orderedCounts['Completed Tasks'] = completedTasks.length;
    }
    
    // Add overdue count at the end
    if (overdueTasks.length > 0) {
      orderedCounts['Overdue'] = overdueTasks.length;
    }
    
    return orderedCounts;
  }, [displayTasks, teamStatuses, selectedTeam, selectedTeamForStatus]);

  // Available assignees based on role
  const availableAssignees = useMemo(() => {
    if (isEmployee) {
      return [currentUserName];
    } else if (activeTab === 'my-tasks') {
      return [currentUserName];
    } else {
      return ['All Assignees', ...assignees];
    }
  }, [isEmployee, activeTab, currentUserName, assignees]);

  // Team-based assignee mapping (based on teams in sidebar)
  const teamAssigneeMapping = {
    'All Teams': assignees,
    'Video Production': ['Althameem', 'Sarah Johnson', 'Mike Chen', 'James Park'],
    'Marketing': ['Emily Rodriguez', 'David Kim', 'Lisa Wang'],
    'Sales': ['Alex Thompson', 'Maria Garcia', 'Ryan O\'Connor'],
    'Development': ['Tom Wilson', 'Jessica Brown', 'Kevin Martinez'],
    'Design': ['Amanda Davis', 'Chris Taylor', 'Samantha Lee'],
    'Operations': ['Robert Anderson', 'Nicole Thomas', 'Steven Clark']
  };

  // Helper function to determine task status based on isFirst/isLast properties
  const getTaskStatusType = (task: Task): 'pending' | 'inProgress' | 'completed' => {
    // Get the current team configuration
    const currentTeamConfig = teamStatuses[selectedTeam] || teamStatuses[selectedTeamForStatus] || teamStatuses['Video Production'];
    
    // Find the sub-status that matches this task
    const subStatus = currentTeamConfig?.mainStatuses
      .flatMap(ms => ms.subStatuses)
      .find(ss => ss.name === task.subStatus);
    
    if (subStatus) {
      if (subStatus.isFirst) return 'pending';
      if (subStatus.isLast) return 'completed';
      return 'inProgress';
    }
    
    // Fallback to progress percentage if no status configuration found
    if (task.progress === 0) return 'pending';
    if (task.progress === 100) return 'completed';
    return 'inProgress';
  };

  // Get filtered assignees based on selected team
  const getFilteredAssignees = () => {
    if (selectedTeamForTasks === 'All Teams') {
      return assignees;
    }
    return teamAssigneeMapping[selectedTeamForTasks as keyof typeof teamAssigneeMapping] || assignees;
  };

  // Get filtered assignees for team performance
  const getFilteredAssigneesForPerformance = () => {
    if (selectedTeamForPerformance === 'All Teams') {
      return assignees.filter(assignee => assignee !== 'All Assignees');
    }
    return teamAssigneeMapping[selectedTeamForPerformance as keyof typeof teamAssigneeMapping] || assignees.filter(assignee => assignee !== 'All Assignees');
  };

  // Reset assignee selection when team changes
  const handleTeamChange = (newTeam: string) => {
    setSelectedTeamForTasks(newTeam);
    const filteredAssignees = newTeam === 'All Teams' ? assignees : (teamAssigneeMapping[newTeam as keyof typeof teamAssigneeMapping] || assignees);
    if (!filteredAssignees.includes(selectedEmployeeForTasks)) {
      setSelectedEmployeeForTasks('All Assignees');
    }
  };

  // Date filtering helper functions for employee modal
  const getDateFilteredTasks = (employeeTasks: Task[], filter: 'today' | 'week' | 'month' | '3months' | '6months' | 'year') => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return employeeTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      const createdDate = new Date(task.createdDate);
      
      switch (filter) {
        case 'today':
          return (taskDate >= today && taskDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)) ||
                 (createdDate >= today && createdDate < new Date(today.getTime() + 24 * 60 * 60 * 1000));
        case 'week':
          const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          return (taskDate >= weekStart && taskDate < weekEnd) ||
                 (createdDate >= weekStart && createdDate < weekEnd);
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return (taskDate >= monthStart && taskDate <= monthEnd) ||
                 (createdDate >= monthStart && createdDate <= monthEnd);
        case '3months':
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          return (taskDate >= threeMonthsAgo && taskDate <= now) ||
                 (createdDate >= threeMonthsAgo && createdDate <= now);
        case '6months':
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
          return (taskDate >= sixMonthsAgo && taskDate <= now) ||
                 (createdDate >= sixMonthsAgo && createdDate <= now);
        case 'year':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          const yearEnd = new Date(now.getFullYear(), 11, 31);
          return (taskDate >= yearStart && taskDate <= yearEnd) ||
                 (createdDate >= yearStart && createdDate <= yearEnd);
        default:
          return true;
      }
    });
  };

  // Download report functionality
  // Initialize team statuses from defaults
  useEffect(() => {
    if (Object.keys(teamStatuses).length === 0) {
      const initialStatuses: { [teamName: string]: TeamStatusConfig } = {};
      Object.entries(defaultStatusConfigs).forEach(([teamName, config]) => {
        initialStatuses[teamName] = {
          mainStatuses: config.mainStatuses || [],
          lastUpdated: new Date().toISOString(),
          version: 1
        };
      });
      setTeamStatuses(initialStatuses);
    }
  }, [teamStatuses]);

  // Get current team's status configuration
  const getCurrentTeamStatuses = () => {
    return teamStatuses[selectedTeamForStatus]?.mainStatuses || [];
  };

  // Handle drag and drop for statuses
  const handleDragStart = (e: React.DragEvent, item: MainStatus | SubStatus, type: 'main' | 'sub') => {
    setDraggedItem({ ...item, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: MainStatus | SubStatus, targetType: 'main' | 'sub') => {
    e.preventDefault();
    if (!draggedItem) return;

    const updatedStatuses = { ...teamStatuses };
    const teamConfig = updatedStatuses[selectedTeamForStatus];
    
    if (draggedItem.type === 'main' && targetType === 'main') {
      // Reorder main statuses
      const mainStatuses = [...teamConfig.mainStatuses];
      const draggedIndex = mainStatuses.findIndex(s => s.id === draggedItem.id);
      const targetIndex = mainStatuses.findIndex(s => s.id === targetItem.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedStatus] = mainStatuses.splice(draggedIndex, 1);
        mainStatuses.splice(targetIndex, 0, draggedStatus);
        
        // Update order numbers
        mainStatuses.forEach((status, index) => {
          status.order = index + 1;
        });
        
        teamConfig.mainStatuses = mainStatuses;
        setTeamStatuses(updatedStatuses);
      }
    } else if (draggedItem.type === 'sub' && targetType === 'sub') {
      // Reorder sub statuses within the same main status
      const mainStatus = teamConfig.mainStatuses.find(ms => ms.id === draggedItem.mainStatusId);
      const targetMainStatus = teamConfig.mainStatuses.find(ms => ms.subStatuses.some(ss => ss.id === targetItem.id));
      
      if (mainStatus && targetMainStatus && mainStatus.id === targetMainStatus.id) {
        const subStatuses = [...mainStatus.subStatuses];
        const draggedIndex = subStatuses.findIndex(s => s.id === draggedItem.id);
        const targetIndex = subStatuses.findIndex(s => s.id === targetItem.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedSubStatus] = subStatuses.splice(draggedIndex, 1);
          subStatuses.splice(targetIndex, 0, draggedSubStatus);
          
          // Update order numbers
          subStatuses.forEach((subStatus, index) => {
            subStatus.order = index + 1;
          });
          
          mainStatus.subStatuses = subStatuses;
          setTeamStatuses(updatedStatuses);
        }
      }
    }
    
    setDraggedItem(null);
  };

  // Add new main status
  const addMainStatus = (name: string, color: string) => {
    const newMainStatus: MainStatus = {
      id: `ms-${Date.now()}`,
      name,
      color,
      order: getCurrentTeamStatuses().length + 1,
      subStatuses: [],
      teamId: selectedTeamForStatus.toLowerCase().replace(/\s+/g, '-')
    };

    const updatedStatuses = { ...teamStatuses };
    if (!updatedStatuses[selectedTeamForStatus]) {
      updatedStatuses[selectedTeamForStatus] = {
        mainStatuses: [],
        lastUpdated: new Date().toISOString(),
        version: 1
      };
    }
    
    updatedStatuses[selectedTeamForStatus].mainStatuses.push(newMainStatus);
    setTeamStatuses(updatedStatuses);
    setShowAddMainStatus(false);
  };

  // Add new sub status
  const addSubStatus = (mainStatusId: string, name: string, color: string, isFirst = false, isLast = false) => {
    const updatedStatuses = { ...teamStatuses };
    const teamConfig = updatedStatuses[selectedTeamForStatus];
    const mainStatus = teamConfig.mainStatuses.find(ms => ms.id === mainStatusId);
    
    if (mainStatus) {
      const newSubStatus: SubStatus = {
        id: `ss-${Date.now()}`,
        name,
        color,
        order: mainStatus.subStatuses.length + 1,
        mainStatusId,
        isFirst,
        isLast
      };
      
      mainStatus.subStatuses.push(newSubStatus);
      setTeamStatuses(updatedStatuses);
    }
    
    setShowAddSubStatus(null);
  };

  // Delete status
  const deleteMainStatus = (mainStatusId: string) => {
    const updatedStatuses = { ...teamStatuses };
    const teamConfig = updatedStatuses[selectedTeamForStatus];
    teamConfig.mainStatuses = teamConfig.mainStatuses.filter(ms => ms.id !== mainStatusId);
    setTeamStatuses(updatedStatuses);
  };

  const deleteSubStatus = (mainStatusId: string, subStatusId: string) => {
    const updatedStatuses = { ...teamStatuses };
    const teamConfig = updatedStatuses[selectedTeamForStatus];
    const mainStatus = teamConfig.mainStatuses.find(ms => ms.id === mainStatusId);
    
    if (mainStatus) {
      mainStatus.subStatuses = mainStatus.subStatuses.filter(ss => ss.id !== subStatusId);
      setTeamStatuses(updatedStatuses);
    }
  };

  // Navigate to teams page
  const navigateToTeamsPage = () => {
    // Navigate to Settings → Teams page by triggering the parent navigation callback
    if (onTabChange) {
      onTabChange('settings-teams');
    }
  };

  // Render the settings tab with status management
  const renderSettingsTab = () => {
    if (!isAdmin && !isManager) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
          <Lock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600 font-poppins">Only Admins and Managers can access Taskboard Settings</p>
        </div>
      );
    }

    const currentTeamStatuses = getCurrentTeamStatuses();

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Settings size={24} className="text-blue-600" />
              <h2 className="text-xl font-poppins font-semibold text-gray-900">Status Management</h2>
            </div>
            <button
              onClick={navigateToTeamsPage}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-poppins font-medium transition-colors duration-200"
            >
              <ExternalLink size={16} />
              Manage Teams
            </button>
          </div>
          
          {/* Team Selection */}
          <div className="flex items-center gap-4">
            <label className="font-poppins font-medium text-gray-700">Configure statuses for:</label>
            <select
              value={selectedTeamForStatus}
              onChange={(e) => setSelectedTeamForStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
            >
              {Object.keys(defaultStatusConfigs).map((teamName) => (
                <option key={teamName} value={teamName}>{teamName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">Workflow Statuses</h3>
            <button
              onClick={() => setShowAddMainStatus(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-poppins font-medium transition-colors duration-200"
            >
              <Plus size={16} />
              Add Main Status
            </button>
          </div>

          {/* Status List with Drag & Drop */}
          <div className="space-y-4">
            {currentTeamStatuses.sort((a, b) => a.order - b.order).map((mainStatus) => (
              <div
                key={mainStatus.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                draggable
                onDragStart={(e) => handleDragStart(e, mainStatus, 'main')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, mainStatus, 'main')}
              >
                {/* Main Status Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-gray-400 cursor-move" />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: mainStatus.color }}
                    />
                    <span className="font-poppins font-semibold text-gray-900">{mainStatus.name}</span>
                    <span className="text-sm text-gray-500 font-poppins">({mainStatus.subStatuses.length} sub-statuses)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddSubStatus(mainStatus.id)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => setEditingMainStatus(mainStatus)}
                      className="p-2 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteMainStatus(mainStatus.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sub Statuses */}
                <div className="ml-6 space-y-2">
                  {mainStatus.subStatuses.sort((a, b) => a.order - b.order).map((subStatus) => (
                    <div
                      key={subStatus.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                      draggable
                      onDragStart={(e) => handleDragStart(e, subStatus, 'sub')}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, subStatus, 'sub')}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical size={14} className="text-gray-400 cursor-move" />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subStatus.color }}
                        />
                        <span className="font-poppins text-gray-900">{subStatus.name}</span>
                        {subStatus.isFirst && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-poppins font-medium rounded">
                            Start
                          </span>
                        )}
                        {subStatus.isLast && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-poppins font-medium rounded">
                            End
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingSubStatus(subStatus)}
                          className="p-1 hover:bg-gray-100 text-gray-600 rounded transition-colors duration-200"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteSubStatus(mainStatus.id, subStatus.id)}
                          className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Sub Status Button */}
                  {showAddSubStatus === mainStatus.id && (
                    <AddSubStatusForm
                      onSubmit={(name, color, isFirst, isLast) => addSubStatus(mainStatus.id, name, color, isFirst, isLast)}
                      onCancel={() => setShowAddSubStatus(null)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Main Status Form */}
          {showAddMainStatus && (
            <AddMainStatusForm
              onSubmit={addMainStatus}
              onCancel={() => setShowAddMainStatus(false)}
            />
          )}
        </div>

        {/* Status Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
          <h3 className="font-poppins font-semibold text-gray-900 mb-3">Workflow Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-blue-600">{currentTeamStatuses.length}</div>
              <div className="text-sm font-poppins text-gray-600">Main Statuses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-green-600">
                {currentTeamStatuses.reduce((sum, ms) => sum + ms.subStatuses.length, 0)}
              </div>
              <div className="text-sm font-poppins text-gray-600">Sub Statuses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-purple-600">
                {currentTeamStatuses.reduce((sum, ms) => sum + ms.subStatuses.filter(ss => ss.isFirst).length, 0)}
              </div>
              <div className="text-sm font-poppins text-gray-600">Start Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-poppins font-bold text-orange-600">
                {currentTeamStatuses.reduce((sum, ms) => sum + ms.subStatuses.filter(ss => ss.isLast).length, 0)}
              </div>
              <div className="text-sm font-poppins text-gray-600">End Points</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const downloadEmployeeReport = (employee: string, dateFilter: 'today' | 'week' | 'month' | '3months' | '6months' | 'year') => {
    const employeeTasks = tasks.filter(task => task.assignee === employee);
    const filteredTasks = getDateFilteredTasks(employeeTasks, dateFilter);
    
    const reportData = {
      employee,
      dateFilter,
      generatedAt: new Date().toISOString(),
      summary: {
        total: filteredTasks.length,
        completed: filteredTasks.filter(task => getTaskStatusType(task) === 'completed').length,
        inProgress: filteredTasks.filter(task => getTaskStatusType(task) === 'inProgress').length,
        pending: filteredTasks.filter(task => getTaskStatusType(task) === 'pending').length,
        overdue: filteredTasks.filter(task => isOverdue(task.dueDate, task.progress)).length,
        avgProgress: filteredTasks.length > 0 ? Math.round(filteredTasks.reduce((sum, task) => sum + task.progress, 0) / filteredTasks.length) : 0
      },
      tasks: filteredTasks.map(task => ({
        title: task.title,
        client: task.client,
        dueDate: task.dueDate,
        status: task.subStatus,
        progress: task.progress,
        priority: task.priority
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee}-${dateFilter}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const tasksForDay = getTasksForDate(date);
      const isToday = isCurrentMonth && day === today.getDate();

      days.push(
        <div key={day} className={`h-32 border border-gray-200 p-2 ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
          <div className={`text-sm font-poppins font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-20">
            {tasksForDay.slice(0, 2).map(task => (
              <div
                key={task.id}
                onClick={() => handleEditTask(task)}
                className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity duration-200 ${getPriorityColor(task.priority)} border-0`}
              >
                <div className="font-poppins font-medium truncate">{task.title}</div>
                <div className="font-poppins text-xs opacity-75">{task.client}</div>
              </div>
            ))}
            {tasksForDay.length > 2 && (
              <div className="text-xs text-gray-500 font-poppins">
                +{tasksForDay.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Role Indicator */}
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-blue-600" />
              <span className="text-sm font-poppins font-medium text-blue-600">
                {userRole === 'employee' ? 'Employee Access' : userRole === 'manager' ? 'Manager Access' : 'Admin Access'}
              </span>
            </div>

            {/* Team Filter - Only for Admin/Manager */}
            {(userRole === 'admin' || userRole === 'manager') && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-600" />
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                                     <option value="All Teams">All Teams</option>
                   <option value="UI/UX Team">UI/UX Team</option>
                   <option value="Development Team">Development Team</option>
                   <option value="Performance Marketing">Performance Marketing</option>
                   <option value="Video Production">Video Production</option>
                   <option value="Social Media">Social Media</option>
                   <option value="Testing / QA">Testing / QA</option>
                </select>
              </div>
            )}

                         {/* Status Filter */}
             <div className="flex items-center gap-2">
               <AlertCircle size={16} className="text-gray-600" />
               <select
                 value={selectedMainStatus}
                 onChange={(e) => setSelectedMainStatus(e.target.value)}
                 className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="All Statuses">All Status</option>
                 {Object.entries(statusCounts)
                   .filter(([status]) => status !== 'All Tasks' && status !== 'Finished' && status !== 'Overdue')
                   .map(([status]) => (
                     <option key={status} value={status}>{status}</option>
                   ))}
               </select>
             </div>

             {/* Search */}
             <div className="flex items-center gap-2 flex-1 min-w-0">
               <Search size={16} className="text-gray-600" />
               <input
                 type="text"
                 placeholder="Search tasks..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0"
               />
             </div>

            {/* Assignee Filter */}
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-600" />
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className={`border border-gray-300 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  userRole === 'employee' ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={userRole === 'employee'}
              >
                <option value="All">
                  {userRole === 'employee' ? 'Althameem (Locked)' : 'All Assignees'}
                </option>
                {userRole !== 'employee' && getFilteredAssignees().map((assignee: string) => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Flag size={16} className="text-gray-600" />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

                         {/* Date Range Filter */}
             <div className="flex items-center gap-2">
               <DateRangePicker
                 value={dateRange}
                 onChange={setDateRange}
               />
             </div>

            {/* Overdue Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverdue(!showOverdue)}
                className={`px-3 py-2 rounded-lg text-sm font-poppins font-medium transition-colors duration-200 flex items-center gap-2 ${
                  showOverdue 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <AlertTriangle size={16} />
                Overdue Only
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {/* Calendar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-poppins font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronDown size={16} className="rotate-90 text-gray-600" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-poppins font-medium hover:bg-blue-200 transition-colors duration-200"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronDown size={16} className="-rotate-90 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 font-poppins">
              {displayTasks.length} tasks this month
            </div>
          </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: string) => (
              <div key={day} className="p-2 text-center text-sm font-poppins font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {days}
          </div>
        </div>
        </div>
      </div>
    );
  };

  // If individual report is being shown, render only that
  if (showIndividualReport) {
    return (
      <IndividualEmployeeReport
        employee={selectedEmployeeForReport}
        onBack={() => setShowIndividualReport(false)}
        allTasks={tasks}
      />
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Compact Single-Row Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          {/* Left - Page Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">Task Board</h1>
          </div>

          {/* Center - Task Status Counts (Only for tasks and my-tasks) */}
          {(activeTab === 'tasks' || activeTab === 'my-tasks') && (
            <div className="flex items-center gap-4 mx-8">
              {/* Total Tasks */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <LayoutGrid size={12} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-poppins font-semibold text-gray-900 text-sm">
                    {displayTasks.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activeTab === 'my-tasks' ? 'My Tasks' : 'Total'}
                  </div>
                </div>
              </div>

              {/* Dynamic Status Counts - Compact Version */}
              {Object.entries(statusCounts).slice(0, 3).map(([status, count]: [string, number]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    status === 'Pending Tasks' ? 'bg-yellow-100' :
                    status === 'Completed Tasks' ? 'bg-green-100' :
                    status === 'Overdue' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {status === 'Pending Tasks' ? (
                      <Clock size={12} className="text-yellow-600" />
                    ) : status === 'Completed Tasks' ? (
                      <CheckCircle size={12} className="text-green-600" />
                    ) : status === 'Overdue' ? (
                      <XCircle size={12} className="text-red-600" />
                    ) : (
                      <Minus size={12} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-gray-900 text-sm">
                      {count}
                    </div>
                    <div className="text-xs text-gray-500">
                      {status.replace(' Tasks', '')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Right - Tab Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-2 font-poppins font-medium text-sm rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'tasks' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid size={14} />
              All Tasks
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-2 font-poppins font-medium text-sm rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'notes' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <StickyNote size={14} />
              Notes
            </button>
            <button
              onClick={() => setActiveTab('my-tasks')}
              className={`px-3 py-2 font-poppins font-medium text-sm rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'my-tasks' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User size={14} />
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-2 font-poppins font-medium text-sm rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'calendar' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CalendarIcon size={14} />
              Calendar
            </button>
            {/* Reports tab - Role Restricted */}
            {(isAdmin || isManager) && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 font-poppins font-medium text-sm rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeTab === 'reports' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 size={14} />
                Reports
              </button>
            )}
            {/* Settings tab - Admin Only */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 font-poppins font-medium text-sm rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeTab === 'settings' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Target size={14} />
                Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar - Show for tasks and my-tasks */}
      {(activeTab === 'tasks' || activeTab === 'my-tasks') && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Left side filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Team Dropdown - Role Restricted */}
              {(isAdmin || isManager) && (
                <div className="relative">
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-36"
                  >
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              )}

              {/* Main Status Dropdown */}
              <div className="relative">
                <select
                  value={selectedMainStatus}
                  onChange={(e) => setSelectedMainStatus(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-36"
                >
                  {mainStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Assignee Dropdown */}
              <div className="relative">
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className={`px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-36 ${
                    isEmployee ? 'bg-gray-50' : ''
                  }`}
                  disabled={isEmployee}
                                 >
                   {availableAssignees.map((assignee: string) => (
                     <option key={assignee} value={assignee}>
                       {assignee === currentUserName && isEmployee ? `${assignee} (Locked)` : assignee}
                     </option>
                   ))}
                </select>
                {isEmployee && <Lock size={14} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400" />}
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-32"
                >
                  <option value="All Priorities">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
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
                  placeholder="Search tasks, clients, descriptions..."
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
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'kanban' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Kanban View"
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
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'calendar' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Calendar View"
                >
                  <Calendar size={16} />
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

              {/* New Task Button - Role Restricted */}
              {(isAdmin || isManager) && (
                <button 
                  onClick={handleCreateTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-poppins font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105 whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">New Task</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}
              {isEmployee && (
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2">
                  <Lock size={12} />
                  View Only
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'tasks' && (
        <>
          {/* Content based on view mode */}
          {viewMode === 'kanban' && renderKanbanView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'calendar' && renderCalendarView()}
        </>
      )}
      
      {activeTab === 'notes' && <NotePad />}
      
      {activeTab === 'my-tasks' && (
        <>
          {/* Content based on view mode - same as All Tasks but filtered */}
          {viewMode === 'kanban' && renderKanbanView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'calendar' && renderCalendarView()}
        </>
      )}
      
      {activeTab === 'calendar' && (
        <>
          {renderCalendarView()}
        </>
      )}
      
      {activeTab === 'reports' && !showIndividualReport && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-1">Performance Analytics</h2>
              <p className="text-gray-600 font-poppins">Team member performance insights and metrics</p>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-2xl font-poppins font-bold">{filteredTasks.length}</div>
              <div className="text-sm font-poppins opacity-90">Total Tasks</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="text-2xl font-poppins font-bold">
                {filteredTasks.filter(task => getTaskStatusType(task) === 'completed').length}
              </div>
              <div className="text-sm font-poppins opacity-90">Completed</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="text-2xl font-poppins font-bold">
                {filteredTasks.filter(task => getTaskStatusType(task) === 'inProgress').length}
              </div>
              <div className="text-sm font-poppins opacity-90">In Progress</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
              <div className="text-2xl font-poppins font-bold">
                {filteredTasks.filter(task => isOverdue(task.dueDate, task.progress)).length}
              </div>
              <div className="text-sm font-poppins opacity-90">Overdue</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={reportsSearchQuery}
                    onChange={(e) => setReportsSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins text-sm"
                  />
                </div>

                {/* Team Filter */}
                <div className="relative">
                  <select
                    value={reportsTeamFilter}
                    onChange={(e) => setReportsTeamFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none min-w-40"
                  >
                    <option value="All Teams">All Teams</option>
                    <option value="Video Production">Video Production</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Operations">Operations</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setReportsViewMode('cards')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-poppins font-medium transition-all duration-200 ${
                    reportsViewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <LayoutGrid size={16} />
                  Cards
                </button>
                <button
                  onClick={() => setReportsViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-poppins font-medium transition-all duration-200 ${
                    reportsViewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List size={16} />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          {reportsViewMode === 'cards' ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-poppins font-semibold text-gray-900">Team Performance</h3>
                    <p className="text-sm text-gray-600 font-poppins">
                      {getFilteredReportsAssignees().length} team member{getFilteredReportsAssignees().length !== 1 ? 's' : ''} • {reportsTeamFilter}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {getFilteredReportsAssignees().length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {getFilteredReportsAssignees().map(assignee => {
                      const assigneeTasks = filteredTasks.filter(task => task.assignee === assignee);
                      const pending = assigneeTasks.filter(task => getTaskStatusType(task) === 'pending').length;
                      const ongoing = assigneeTasks.filter(task => getTaskStatusType(task) === 'inProgress').length;
                      const overdue = assigneeTasks.filter(task => isOverdue(task.dueDate, task.progress)).length;
                      const completed = assigneeTasks.filter(task => getTaskStatusType(task) === 'completed').length;
                      const completionRate = assigneeTasks.length > 0 ? Math.round((completed / assigneeTasks.length) * 100) : 0;
                      
                      return (
                        <div 
                          key={assignee}
                          onClick={() => {
                            setSelectedEmployeeForReport(assignee);
                            setShowIndividualReport(true);
                          }}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                        >
                          {/* Employee Header */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-poppins font-bold group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                              {assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-poppins font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                                {assignee}
                              </h4>
                              <p className="text-sm text-gray-600 font-poppins">{assigneeTasks.length} tasks assigned</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-poppins font-bold text-green-600">{completionRate}%</div>
                              <div className="text-xs text-gray-500 font-poppins">Completion</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Task Metrics Grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-poppins font-bold text-gray-700">{pending}</div>
                              <div className="text-xs text-gray-500 font-poppins">Pending</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-poppins font-bold text-blue-600">{ongoing}</div>
                              <div className="text-xs text-gray-500 font-poppins">In Progress</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-poppins font-bold text-green-600">{completed}</div>
                              <div className="text-xs text-gray-500 font-poppins">Completed</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-poppins font-bold text-red-600">{overdue}</div>
                              <div className="text-xs text-gray-500 font-poppins">Overdue</div>
                            </div>
                          </div>

                          {/* View Details Action */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                              <Eye size={16} className="mr-2" />
                              <span className="font-poppins text-sm font-medium">View Detailed Report</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <User size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">No team members found</h3>
                    <p className="text-gray-600 font-poppins">Try adjusting your search or team filter</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <List size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-poppins font-semibold text-gray-900">Performance List</h3>
                    <p className="text-sm text-gray-600 font-poppins">
                      {getFilteredReportsAssignees().length} team member{getFilteredReportsAssignees().length !== 1 ? 's' : ''} • {reportsTeamFilter}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-poppins font-semibold text-gray-900">Team Member</th>
                      <th className="text-center px-6 py-4 text-sm font-poppins font-semibold text-gray-900">Total Tasks</th>
                      <th className="text-center px-6 py-4 text-sm font-poppins font-semibold text-gray-900">Pending</th>
                      <th className="text-center px-6 py-4 text-sm font-poppins font-semibold text-gray-900">In Progress</th>
                      <th className="text-center px-6 py-4 text-sm font-poppins font-semibold text-gray-900">Completed</th>
                      <th className="text-center px-6 py-4 text-sm font-poppins font-semibold text-gray-900">Overdue</th>
                      <th className="text-center px-6 py-4 text-sm font-poppins font-semibold text-gray-900">Completion Rate</th>
                      <th className="text-center px-6 py-4 text-sm font-poppins font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getFilteredReportsAssignees().length > 0 ? (
                      getFilteredReportsAssignees().map(assignee => {
                        const assigneeTasks = filteredTasks.filter(task => task.assignee === assignee);
                        const pending = assigneeTasks.filter(task => getTaskStatusType(task) === 'pending').length;
                        const ongoing = assigneeTasks.filter(task => getTaskStatusType(task) === 'inProgress').length;
                        const overdue = assigneeTasks.filter(task => isOverdue(task.dueDate, task.progress)).length;
                        const completed = assigneeTasks.filter(task => getTaskStatusType(task) === 'completed').length;
                        const completionRate = assigneeTasks.length > 0 ? Math.round((completed / assigneeTasks.length) * 100) : 0;
                        
                        return (
                          <tr key={assignee} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-poppins font-bold">
                                  {assignee.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-poppins font-semibold text-gray-900">{assignee}</div>
                                  <div className="text-sm text-gray-600 font-poppins">Team Member</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-lg font-poppins font-bold text-gray-900">{assigneeTasks.length}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded-full text-sm font-poppins font-bold">
                                {pending}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-poppins font-bold">
                                {ongoing}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-sm font-poppins font-bold">
                                {completed}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full text-sm font-poppins font-bold">
                                {overdue}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                    style={{ width: `${completionRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-poppins font-bold text-green-600 min-w-[3rem]">{completionRate}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => {
                                  setSelectedEmployeeForReport(assignee);
                                  setShowIndividualReport(true);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-poppins font-medium hover:bg-blue-700 transition-colors duration-200 mx-auto"
                              >
                                <Eye size={14} />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <User size={24} className="text-gray-400" />
                          </div>
                          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">No team members found</h3>
                          <p className="text-gray-600 font-poppins">Try adjusting your search or team filter</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Individual Employee Report */}
      {activeTab === 'reports' && showIndividualReport && selectedEmployeeForReport && (
        <div className="space-y-6">
          {/* Header with Back Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setShowIndividualReport(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <ArrowDown className="rotate-90" size={16} />
              <span className="font-poppins text-sm font-medium text-gray-700">Back to Reports</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-poppins font-bold">
                {selectedEmployeeForReport.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-poppins font-bold text-gray-900">{selectedEmployeeForReport}</h2>
                <p className="text-gray-600 font-poppins">Individual Performance Report</p>
              </div>
            </div>
          </div>

          {(() => {
            const employeeTasks = filteredTasks.filter(task => task.assignee === selectedEmployeeForReport);
            const pending = employeeTasks.filter(task => getTaskStatusType(task) === 'pending');
            const ongoing = employeeTasks.filter(task => getTaskStatusType(task) === 'inProgress');
            const overdue = employeeTasks.filter(task => isOverdue(task.dueDate, task.progress));
            const completed = employeeTasks.filter(task => getTaskStatusType(task) === 'completed');
            const completionRate = employeeTasks.length > 0 ? Math.round((completed.length / employeeTasks.length) * 100) : 0;
            
            return (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                    <div className="text-2xl font-poppins font-bold">{employeeTasks.length}</div>
                    <div className="text-sm font-poppins opacity-90">Total Tasks</div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-4 text-white">
                    <div className="text-2xl font-poppins font-bold">{pending.length}</div>
                    <div className="text-sm font-poppins opacity-90">Pending</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                    <div className="text-2xl font-poppins font-bold">{ongoing.length}</div>
                    <div className="text-sm font-poppins opacity-90">In Progress</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="text-2xl font-poppins font-bold">{completed.length}</div>
                    <div className="text-sm font-poppins opacity-90">Completed</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
                    <div className="text-2xl font-poppins font-bold">{overdue.length}</div>
                    <div className="text-sm font-poppins opacity-90">Overdue</div>
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-poppins font-semibold text-gray-900">Performance Overview</h3>
                    <div className="text-right">
                      <div className="text-2xl font-poppins font-bold text-green-600">{completionRate}%</div>
                      <div className="text-sm text-gray-500 font-poppins">Completion Rate</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-poppins font-bold text-gray-700">{pending.length}</div>
                      <div className="text-sm text-gray-500 font-poppins">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-poppins font-bold text-orange-600">{ongoing.length}</div>
                      <div className="text-sm text-gray-500 font-poppins">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-poppins font-bold text-green-600">{completed.length}</div>
                      <div className="text-sm text-gray-500 font-poppins">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-poppins font-bold text-red-600">{overdue.length}</div>
                      <div className="text-sm text-gray-500 font-poppins">Overdue</div>
                    </div>
                  </div>
                </div>

                {/* Task Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Pending Tasks */}
                  <div className="bg-white border border-gray-200 rounded-xl">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-poppins font-semibold text-gray-900">Pending Tasks ({pending.length})</h3>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                      {pending.length > 0 ? (
                        <div className="space-y-3">
                          {pending.map(task => (
                            <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <div className="font-poppins font-medium text-gray-900 text-sm mb-1 truncate">{task.title}</div>
                              <div className="text-xs text-gray-600 font-poppins mb-1">{task.client}</div>
                              <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs font-poppins ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <div className="text-xs text-gray-500 font-poppins">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 font-poppins text-sm">No pending tasks</div>
                      )}
                    </div>
                  </div>

                  {/* In Progress Tasks */}
                  <div className="bg-white border border-gray-200 rounded-xl">
                    <div className="p-4 border-b border-gray-200 bg-orange-50">
                      <h3 className="font-poppins font-semibold text-gray-900">In Progress Tasks ({ongoing.length})</h3>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                      {ongoing.length > 0 ? (
                        <div className="space-y-3">
                          {ongoing.map(task => (
                            <div key={task.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                              <div className="font-poppins font-medium text-gray-900 text-sm mb-1 truncate">{task.title}</div>
                              <div className="text-xs text-gray-600 font-poppins mb-2">{task.client}</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                <div 
                                  className="bg-orange-500 h-1.5 rounded-full"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-orange-600 font-poppins font-medium">{task.progress}% complete</span>
                                <div className="text-xs text-gray-500 font-poppins">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 font-poppins text-sm">No tasks in progress</div>
                      )}
                    </div>
                  </div>

                  {/* Completed Tasks */}
                  <div className="bg-white border border-gray-200 rounded-xl">
                    <div className="p-4 border-b border-gray-200 bg-green-50">
                      <h3 className="font-poppins font-semibold text-gray-900">Completed Tasks ({completed.length})</h3>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                      {completed.length > 0 ? (
                        <div className="space-y-3">
                          {completed.map(task => (
                            <div key={task.id} className="p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors duration-200">
                              <div className="font-poppins font-medium text-gray-900 text-sm mb-1 truncate">{task.title}</div>
                              <div className="text-xs text-gray-600 font-poppins mb-1">{task.client}</div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-green-600 font-poppins font-medium">✓ Completed</span>
                                <div className="text-xs text-gray-500 font-poppins">{task.subStatus}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 font-poppins text-sm">No completed tasks</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overdue Tasks Section */}
                {overdue.length > 0 && (
                  <div className="bg-white border border-red-200 rounded-xl">
                    <div className="p-4 border-b border-red-200 bg-red-50">
                      <div className="flex items-center gap-3">
                        <AlertTriangle size={20} className="text-red-600" />
                        <h3 className="font-poppins font-semibold text-red-900">Overdue Tasks ({overdue.length})</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {overdue.map(task => {
                          const daysOverdue = Math.ceil((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <div key={task.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <div className="font-poppins font-medium text-gray-900 mb-1 truncate">{task.title}</div>
                              <div className="text-sm text-gray-600 font-poppins mb-2">{task.client}</div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-red-600 font-poppins font-medium">
                                  {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                                </span>
                                <span className="text-sm text-gray-500 font-poppins">{task.progress}% complete</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
      
      {activeTab === 'settings' && renderSettingsTab()}

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        mainStatuses={mainStatuses}
        subStatusesByMain={subStatusesByMain}
        assignees={assignees}
        prefilledMainStatus={prefilledMainStatus}
        prefilledSubStatus={prefilledSubStatus}
      />
    </div>
  );
};

export default TaskboardPage;