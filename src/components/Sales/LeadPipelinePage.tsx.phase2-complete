import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, Plus, Calendar, Users, Flag, Clock, CheckCircle, BarChart3, Eye, Edit3, Trash2, MoreHorizontal, MessageCircle, Mail, Phone, User, FileText, Settings, TrendingUp, ChevronLeft, ChevronRight, MapPin, LayoutGrid, List, Palette, Minus, Target } from 'lucide-react';
import ProposalsPage from './ProposalsPage';
import DateRangePicker, { DateRange } from '../Common/DateRangePicker';

interface Lead {
  id: string;
  title: string;
  description: string;
  contactPerson: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  currency: string;
  source: string;
  assignee: string;
  createdDate: string;
  followUpDate: string;
  lastContactDate: string;
  mainStatus: string;
  subStatus: string;
  priority: 'Hot' | 'Warm' | 'Cold';
  tags: string[];
  notes: string;
  probability: number;
  expectedCloseDate: string;
  lastActivity: string;
}

interface Appointment {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  assignee: string;
  date: string;
  time: string;
  duration: number; // in minutes
  location: string;
  meetingType: 'In-Person' | 'Video Call' | 'Phone Call';
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  priority: 'High' | 'Medium' | 'Low';
  leadId?: string;
  notes: string;
  agenda: string[];
  reminders: string[];
  createdDate: string;
  lastModified: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
  compact?: boolean;
}

interface AppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onStatusChange: (leadId: string, newStatus: string) => void;
  compact?: boolean;
}

interface LeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, lead, onClose, onSave, onDelete }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(lead || {} as Lead);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (lead) {
      onDelete(lead.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-poppins font-semibold text-gray-900">
            {lead ? 'Edit Lead' : 'New Lead'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Lead Title
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contactPerson || ''}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Value ($)
            </label>
            <input
              type="number"
              value={formData.value || ''}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority || 'Warm'}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Hot' | 'Warm' | 'Cold' })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              value={formData.assignee || ''}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Mike Chen">Mike Chen</option>
              <option value="Emily Davis">Emily Davis</option>
              <option value="Alex Rodriguez">Alex Rodriguez</option>
              <option value="John Smith">John Smith</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors"
            >
              Save Lead
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-poppins font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
          {lead && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, appointment, onClose, onSave, onDelete }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(appointment || {} as Appointment);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (appointment) {
      onDelete(appointment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-poppins font-semibold text-gray-900">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Appointment Title
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter appointment title"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientName || ''}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Client name"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <input
              type="email"
              value={formData.clientEmail || ''}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="client@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Client Phone
            </label>
            <input
              type="tel"
              value={formData.clientPhone || ''}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              value={formData.assignee || ''}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select assignee</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Mike Chen">Mike Chen</option>
              <option value="Emily Davis">Emily Davis</option>
              <option value="Alex Rodriguez">Alex Rodriguez</option>
              <option value="John Smith">John Smith</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={formData.time || ''}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Meeting Type
            </label>
            <select
              value={formData.meetingType || 'Video Call'}
              onChange={(e) => setFormData({ ...formData, meetingType: e.target.value as 'In-Person' | 'Video Call' | 'Phone Call' })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Video Call">Video Call</option>
              <option value="In-Person">In-Person</option>
              <option value="Phone Call">Phone Call</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status || 'Scheduled'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority || 'Medium'}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Meeting location or video link"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Appointment description"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Internal notes..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            {appointment && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-poppins font-medium transition-colors duration-200"
              >
                Delete Appointment
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-poppins font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-poppins font-medium transition-colors duration-200"
            >
              {appointment ? 'Update' : 'Create'} Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onStatusChange, compact = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Hot': return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statuses = ['New Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-poppins font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
            {lead.title}
          </h4>
          <p className="text-xs text-gray-600 font-poppins mb-2">{lead.company}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal size={16} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => {
                  onEdit(lead);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(lead.id);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <User size={12} />
          <span className="truncate">{lead.contactPerson}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail size={12} />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone size={12} />
          <span>{lead.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-poppins font-semibold text-green-600">
          ${lead.value.toLocaleString()}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full border font-poppins font-medium ${getPriorityColor(lead.priority)}`}>
          {lead.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(lead.createdDate).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {lead.assignee.split(' ')[0]}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Probability</span>
          <span className="text-xs font-poppins font-medium text-gray-900">{lead.probability}%</span>
        </div>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${lead.probability}%` }}
          />
        </div>
      </div>

      {lead.tags && lead.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {lead.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-poppins"
            >
              {tag}
            </span>
          ))}
          {lead.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{lead.tags.length - 2}</span>
          )}
        </div>
      )}
    </div>
  );
};

interface LeadPipelinePageProps {
  defaultTab?: 'pipeline' | 'appointments' | 'proposals' | 'analytics' | 'settings';
}

const LeadPipelinePage: React.FC<LeadPipelinePageProps> = ({ defaultTab = 'pipeline' }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'appointments' | 'proposals' | 'analytics' | 'settings'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [selectedModal, setSelectedModal] = useState<Lead | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cardMode, setCardMode] = useState<'colorful' | 'minimal'>('colorful');
  const [minProbability, setMinProbability] = useState<number>(0);
  const [maxProbability, setMaxProbability] = useState<number>(100);
  const kanbanContainerRef = useRef<HTMLDivElement>(null);

  // Date filtering state
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: 'all',
    startDate: '2020-01-01',
    endDate: '2030-12-31'
  });

  // Appointments-specific state
  const [appointmentSearchQuery, setAppointmentSearchQuery] = useState('');
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState('All');
  const [selectedAppointmentAssignee, setSelectedAppointmentAssignee] = useState('All');
  const [appointmentViewMode, setAppointmentViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [selectedAppointmentModal, setSelectedAppointmentModal] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const appointmentKanbanRef = useRef<HTMLDivElement>(null);

  // Appointments date filtering
  const [appointmentDateRange, setAppointmentDateRange] = useState<DateRange>({
    preset: 'all',
    startDate: '2020-01-01',
    endDate: '2030-12-31'
  });

  // Sync activeTab with defaultTab prop changes (sidebar navigation)
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Ultra-fast, native-feeling horizontal scrolling
  useEffect(() => {
    if (activeTab === 'pipeline' && kanbanContainerRef.current) {
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
  }, [activeTab]);

  // Mock data
  const mockLeads: Lead[] = [
    // NEW LEADS
    {
      id: '1',
      title: 'Enterprise Software Solution for TechCorp',
      description: 'Complete ERP implementation for large enterprise',
      contactPerson: 'John Smith',
      company: 'TechCorp Industries',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      value: 150000,
      currency: 'USD',
      source: 'Website',
      assignee: 'Sarah Johnson',
      createdDate: '2024-01-15',
      followUpDate: '2024-01-20',
      lastContactDate: '2024-01-18',
      mainStatus: 'New Leads',
      subStatus: 'Initial Contact',
      priority: 'Hot',
      tags: ['Enterprise', 'ERP', 'High Value'],
      notes: 'Very interested in our enterprise solution. Decision maker confirmed.',
      probability: 85,
      expectedCloseDate: '2024-02-15',
      lastActivity: 'Demo scheduled for next week'
    },
    {
      id: '6',
      title: 'E-commerce Platform for Fashion Boutique',
      description: 'Custom e-commerce solution with inventory management',
      contactPerson: 'Lisa Chang',
      company: 'Fashion Forward',
      email: 'lisa@fashionforward.com',
      phone: '+1 (555) 789-0123',
      value: 35000,
      currency: 'USD',
      source: 'Social Media',
      assignee: 'Mike Chen',
      createdDate: '2024-01-22',
      followUpDate: '2024-01-25',
      lastContactDate: '2024-01-22',
      mainStatus: 'New Leads',
      subStatus: 'Initial Contact',
      priority: 'Warm',
      tags: ['E-commerce', 'Fashion', 'Inventory'],
      notes: 'Small boutique looking to expand online. Budget is limited but growth potential.',
      probability: 40,
      expectedCloseDate: '2024-03-15',
      lastActivity: 'Initial inquiry received'
    },
    {
      id: '7',
      title: 'Healthcare Management System',
      description: 'Patient management and scheduling system for clinic',
      contactPerson: 'Dr. Robert Chen',
      company: 'MedCare Clinic',
      email: 'robert.chen@medcare.com',
      phone: '+1 (555) 890-1234',
      value: 85000,
      currency: 'USD',
      source: 'Referral',
      assignee: 'Emily Davis',
      createdDate: '2024-01-24',
      followUpDate: '2024-01-26',
      lastContactDate: '2024-01-24',
      mainStatus: 'New Leads',
      subStatus: 'Information Sent',
      priority: 'Hot',
      tags: ['Healthcare', 'Management', 'Compliance'],
      notes: 'Urgent need due to compliance requirements. Decision by end of February.',
      probability: 75,
      expectedCloseDate: '2024-02-28',
      lastActivity: 'Product brochure sent'
    },
    {
      id: '8',
      title: 'Restaurant Chain POS System',
      description: 'Point-of-sale system for 5-location restaurant chain',
      contactPerson: 'Maria Gonzalez',
      company: 'Tasty Bites Chain',
      email: 'maria@tastybites.com',
      phone: '+1 (555) 901-2345',
      value: 65000,
      currency: 'USD',
      source: 'Cold Outreach',
      assignee: 'Alex Rodriguez',
      createdDate: '2024-01-21',
      followUpDate: '2024-01-28',
      lastContactDate: '2024-01-23',
      mainStatus: 'New Leads',
      subStatus: 'Follow-up Scheduled',
      priority: 'Warm',
      tags: ['POS', 'Restaurant', 'Multi-location'],
      notes: 'Expanding rapidly, needs scalable solution. Price-sensitive.',
      probability: 50,
      expectedCloseDate: '2024-03-30',
      lastActivity: 'Follow-up call scheduled'
    },
    {
      id: '9',
      title: 'Educational Platform for University',
      description: 'Learning management system for online courses',
      contactPerson: 'Prof. James Wilson',
      company: 'Metropolitan University',
      email: 'james.wilson@metrou.edu',
      phone: '+1 (555) 012-3456',
      value: 125000,
      currency: 'USD',
      source: 'Trade Show',
      assignee: 'Sarah Johnson',
      createdDate: '2024-01-20',
      followUpDate: '2024-01-27',
      lastContactDate: '2024-01-21',
      mainStatus: 'New Leads',
      subStatus: 'Demo Requested',
      priority: 'Hot',
      tags: ['Education', 'LMS', 'University'],
      notes: 'Major university looking to modernize. Budget cycle starts in March.',
      probability: 65,
      expectedCloseDate: '2024-04-15',
      lastActivity: 'Demo request received'
    },

    // QUALIFIED LEADS
    {
      id: '2',
      title: 'CRM System for StartupXYZ',
      description: 'Custom CRM solution for growing startup',
      contactPerson: 'Emily Davis',
      company: 'StartupXYZ',
      email: 'emily@startupxyz.com',
      phone: '+1 (555) 234-5678',
      value: 45000,
      currency: 'USD',
      source: 'Referral',
      assignee: 'Mike Chen',
      createdDate: '2024-01-10',
      followUpDate: '2024-01-25',
      lastContactDate: '2024-01-16',
      mainStatus: 'Qualified',
      subStatus: 'Needs Analysis',
      priority: 'Warm',
      tags: ['CRM', 'Startup', 'Custom'],
      notes: 'Budget approved, working on technical requirements.',
      probability: 70,
      expectedCloseDate: '2024-02-28',
      lastActivity: 'Requirements gathering session completed'
    },
    {
      id: '10',
      title: 'Inventory Management for Warehouse',
      description: 'Advanced inventory tracking and management system',
      contactPerson: 'David Kim',
      company: 'LogiFlow Warehousing',
      email: 'david@logiflow.com',
      phone: '+1 (555) 123-9876',
      value: 95000,
      currency: 'USD',
      source: 'Partner Referral',
      assignee: 'John Smith',
      createdDate: '2024-01-12',
      followUpDate: '2024-01-26',
      lastContactDate: '2024-01-19',
      mainStatus: 'Qualified',
      subStatus: 'Technical Evaluation',
      priority: 'Hot',
      tags: ['Inventory', 'Warehouse', 'Logistics'],
      notes: 'Technical team is evaluating our solution. Very positive feedback.',
      probability: 80,
      expectedCloseDate: '2024-02-20',
      lastActivity: 'Technical demo completed'
    },
    {
      id: '11',
      title: 'Financial Planning Software',
      description: 'Comprehensive financial planning and reporting solution',
      contactPerson: 'Amanda Foster',
      company: 'WealthWise Advisors',
      email: 'amanda@wealthwise.com',
      phone: '+1 (555) 234-8765',
      value: 55000,
      currency: 'USD',
      source: 'Website',
      assignee: 'Emily Davis',
      createdDate: '2024-01-18',
      followUpDate: '2024-01-29',
      lastContactDate: '2024-01-22',
      mainStatus: 'Qualified',
      subStatus: 'Budget Confirmation',
      priority: 'Warm',
      tags: ['Finance', 'Planning', 'Advisory'],
      notes: 'Waiting for budget approval from partners. Strong interest shown.',
      probability: 60,
      expectedCloseDate: '2024-03-10',
      lastActivity: 'Budget discussion with stakeholders'
    },
    {
      id: '12',
      title: 'HR Management Platform',
      description: 'Complete HR solution with payroll and benefits management',
      contactPerson: 'Jennifer Lee',
      company: 'TalentFirst Corp',
      email: 'jennifer@talentfirst.com',
      phone: '+1 (555) 345-7654',
      value: 70000,
      currency: 'USD',
      source: 'Cold Outreach',
      assignee: 'Alex Rodriguez',
      createdDate: '2024-01-16',
      followUpDate: '2024-01-30',
      lastContactDate: '2024-01-24',
      mainStatus: 'Qualified',
      subStatus: 'Stakeholder Review',
      priority: 'Hot',
      tags: ['HR', 'Payroll', 'Benefits'],
      notes: 'HR director is champion. Presenting to C-suite next week.',
      probability: 75,
      expectedCloseDate: '2024-02-25',
      lastActivity: 'Stakeholder presentation scheduled'
    },

    // PROPOSAL STAGE
    {
      id: '3',
      title: 'Marketing Automation Platform',
      description: 'Marketing automation solution for retail company',
      contactPerson: 'Alex Rodriguez',
      company: 'RetailPlus',
      email: 'alex@retailplus.com',
      phone: '+1 (555) 345-6789',
      value: 75000,
      currency: 'USD',
      source: 'Cold Outreach',
      assignee: 'Emily Davis',
      createdDate: '2024-01-12',
      followUpDate: '2024-01-22',
      lastContactDate: '2024-01-17',
      mainStatus: 'Proposal',
      subStatus: 'Proposal Sent',
      priority: 'Hot',
      tags: ['Marketing', 'Automation', 'Retail'],
      notes: 'Proposal sent, waiting for feedback from their marketing team.',
      probability: 60,
      expectedCloseDate: '2024-03-10',
      lastActivity: 'Proposal presentation delivered'
    },
    {
      id: '13',
      title: 'Supply Chain Management System',
      description: 'End-to-end supply chain visibility and optimization',
      contactPerson: 'Richard Taylor',
      company: 'GlobalSupply Inc',
      email: 'richard@globalsupply.com',
      phone: '+1 (555) 456-3210',
      value: 180000,
      currency: 'USD',
      source: 'Trade Show',
      assignee: 'Sarah Johnson',
      createdDate: '2024-01-05',
      followUpDate: '2024-01-25',
      lastContactDate: '2024-01-20',
      mainStatus: 'Proposal',
      subStatus: 'Proposal Review',
      priority: 'Hot',
      tags: ['Supply Chain', 'Logistics', 'Enterprise'],
      notes: 'Large enterprise deal. Proposal under review by procurement team.',
      probability: 70,
      expectedCloseDate: '2024-03-01',
      lastActivity: 'Proposal follow-up meeting held'
    },
    {
      id: '14',
      title: 'Real Estate CRM',
      description: 'Specialized CRM for real estate agency network',
      contactPerson: 'Sophie Martinez',
      company: 'Prime Properties Network',
      email: 'sophie@primeproperties.com',
      phone: '+1 (555) 567-2109',
      value: 42000,
      currency: 'USD',
      source: 'Referral',
      assignee: 'Mike Chen',
      createdDate: '2024-01-14',
      followUpDate: '2024-01-28',
      lastContactDate: '2024-01-21',
      mainStatus: 'Proposal',
      subStatus: 'Pricing Discussion',
      priority: 'Warm',
      tags: ['CRM', 'Real Estate', 'Network'],
      notes: 'Proposal delivered. Discussing pricing options and implementation timeline.',
      probability: 55,
      expectedCloseDate: '2024-03-15',
      lastActivity: 'Pricing negotiation in progress'
    },

    // NEGOTIATION STAGE
    {
      id: '4',
      title: 'Data Analytics Solution',
      description: 'Business intelligence and analytics platform',
      contactPerson: 'Sarah Wilson',
      company: 'DataDriven Co',
      email: 'sarah@datadriven.com',
      phone: '+1 (555) 456-7890',
      value: 95000,
      currency: 'USD',
      source: 'Trade Show',
      assignee: 'Alex Rodriguez',
      createdDate: '2024-01-08',
      followUpDate: '2024-01-28',
      lastContactDate: '2024-01-19',
      mainStatus: 'Negotiation',
      subStatus: 'Contract Review',
      priority: 'Warm',
      tags: ['Analytics', 'BI', 'Data'],
      notes: 'In final negotiations, contract terms being reviewed.',
      probability: 90,
      expectedCloseDate: '2024-02-05',
      lastActivity: 'Contract terms discussion'
    },
    {
      id: '15',
      title: 'Manufacturing ERP System',
      description: 'Complete ERP solution for manufacturing operations',
      contactPerson: 'Thomas Anderson',
      company: 'PrecisionTech Manufacturing',
      email: 'thomas@precisiontech.com',
      phone: '+1 (555) 678-1098',
      value: 220000,
      currency: 'USD',
      source: 'Partner Referral',
      assignee: 'John Smith',
      createdDate: '2024-01-01',
      followUpDate: '2024-01-26',
      lastContactDate: '2024-01-23',
      mainStatus: 'Negotiation',
      subStatus: 'Legal Review',
      priority: 'Hot',
      tags: ['ERP', 'Manufacturing', 'Enterprise'],
      notes: 'Contract in legal review. Largest deal this quarter!',
      probability: 95,
      expectedCloseDate: '2024-02-10',
      lastActivity: 'Legal team reviewing contract'
    },
    {
      id: '16',
      title: 'Customer Service Platform',
      description: 'Omnichannel customer service and support platform',
      contactPerson: 'Rachel Green',
      company: 'ServiceExcellence Ltd',
      email: 'rachel@serviceexcellence.com',
      phone: '+1 (555) 789-0987',
      value: 68000,
      currency: 'USD',
      source: 'Website',
      assignee: 'Emily Davis',
      createdDate: '2024-01-11',
      followUpDate: '2024-01-27',
      lastContactDate: '2024-01-24',
      mainStatus: 'Negotiation',
      subStatus: 'Final Terms',
      priority: 'Hot',
      tags: ['Customer Service', 'Support', 'Omnichannel'],
      notes: 'Negotiating final pricing and implementation timeline.',
      probability: 85,
      expectedCloseDate: '2024-02-08',
      lastActivity: 'Final terms negotiation'
    },

    // CLOSED WON
    {
      id: '5',
      title: 'Cloud Infrastructure Setup',
      description: 'Complete cloud migration and setup',
      contactPerson: 'Michael Brown',
      company: 'CloudFirst LLC',
      email: 'michael@cloudfirst.com',
      phone: '+1 (555) 567-8901',
      value: 120000,
      currency: 'USD',
      source: 'Partner Referral',
      assignee: 'John Smith',
      createdDate: '2024-01-14',
      followUpDate: '2024-01-30',
      lastContactDate: '2024-01-20',
      mainStatus: 'Closed Won',
      subStatus: 'Implementation',
      priority: 'Hot',
      tags: ['Cloud', 'Infrastructure', 'Migration'],
      notes: 'Deal closed! Starting implementation phase.',
      probability: 100,
      expectedCloseDate: '2024-01-30',
      lastActivity: 'Contract signed and payment received'
    },
    {
      id: '17',
      title: 'Accounting Software for SMB',
      description: 'Small business accounting and bookkeeping solution',
      contactPerson: 'Kevin O\'Brien',
      company: 'O\'Brien Consulting',
      email: 'kevin@obrienconsulting.com',
      phone: '+1 (555) 890-8765',
      value: 28000,
      currency: 'USD',
      source: 'Referral',
      assignee: 'Mike Chen',
      createdDate: '2024-01-03',
      followUpDate: '2024-01-31',
      lastContactDate: '2024-01-25',
      mainStatus: 'Closed Won',
      subStatus: 'Onboarding',
      priority: 'Warm',
      tags: ['Accounting', 'SMB', 'Bookkeeping'],
      notes: 'Successfully closed! Client is very satisfied with the solution.',
      probability: 100,
      expectedCloseDate: '2024-01-25',
      lastActivity: 'Onboarding session completed'
    },
    {
      id: '18',
      title: 'Event Management Platform',
      description: 'Comprehensive event planning and management software',
      contactPerson: 'Isabella Rodriguez',
      company: 'Elite Events Co',
      email: 'isabella@eliteevents.com',
      phone: '+1 (555) 901-7654',
      value: 52000,
      currency: 'USD',
      source: 'Social Media',
      assignee: 'Sarah Johnson',
      createdDate: '2024-01-07',
      followUpDate: '2024-02-01',
      lastContactDate: '2024-01-26',
      mainStatus: 'Closed Won',
      subStatus: 'Training',
      priority: 'Warm',
      tags: ['Events', 'Planning', 'Management'],
      notes: 'Deal closed after successful pilot. Training in progress.',
      probability: 100,
      expectedCloseDate: '2024-01-26',
      lastActivity: 'User training sessions ongoing'
    },
    {
      id: '19',
      title: 'Fleet Management System',
      description: 'Vehicle tracking and fleet optimization solution',
      contactPerson: 'Carlos Mendez',
      company: 'TransLogistics Pro',
      email: 'carlos@translogistics.com',
      phone: '+1 (555) 012-6543',
      value: 89000,
      currency: 'USD',
      source: 'Trade Show',
      assignee: 'Alex Rodriguez',
      createdDate: '2024-01-09',
      followUpDate: '2024-02-02',
      lastContactDate: '2024-01-27',
      mainStatus: 'Closed Won',
      subStatus: 'Deployment',
      priority: 'Hot',
      tags: ['Fleet', 'Logistics', 'Tracking'],
      notes: 'Excellent closure! Referral potential for other logistics companies.',
      probability: 100,
      expectedCloseDate: '2024-01-27',
      lastActivity: 'System deployment in progress'
    },
    {
      id: '20',
      title: 'Digital Banking Platform',
      description: 'Core banking system for community bank',
      contactPerson: 'Patricia Davis',
      company: 'Community First Bank',
      email: 'patricia@communityfirst.bank',
      phone: '+1 (555) 123-5432',
      value: 165000,
      currency: 'USD',
      source: 'Partner Referral',
      assignee: 'John Smith',
      createdDate: '2024-01-02',
      followUpDate: '2024-02-05',
      lastContactDate: '2024-01-28',
      mainStatus: 'Closed Won',
      subStatus: 'Go-Live',
      priority: 'Hot',
      tags: ['Banking', 'Financial', 'Core System'],
      notes: 'Major win! System going live next week. High visibility project.',
      probability: 100,
      expectedCloseDate: '2024-01-28',
      lastActivity: 'Final testing and go-live preparation'
    }
  ];

  // Mock appointment data
  const mockAppointments: Appointment[] = [
    // CONFIRMED APPOINTMENTS
    {
      id: 'apt-1',
      title: 'Product Demo - TechCorp',
      description: 'Comprehensive product demonstration for TechCorp enterprise solution',
      clientName: 'John Smith',
      clientEmail: 'john.smith@techcorp.com',
      clientPhone: '+1 (555) 123-4567',
      assignee: 'Sarah Johnson',
      date: '2024-01-25',
      time: '14:00',
      duration: 90,
      location: 'TechCorp Headquarters, Meeting Room A',
      meetingType: 'In-Person',
      status: 'Confirmed',
      priority: 'High',
      leadId: '1',
      notes: 'Key decision makers will be present. Prepare enterprise pricing sheet.',
      agenda: ['Product overview', 'Enterprise features', 'Integration capabilities', 'Pricing discussion'],
      reminders: ['1 day before', '2 hours before'],
      createdDate: '2024-01-20',
      lastModified: '2024-01-22'
    },
    {
      id: 'apt-7',
      title: 'Healthcare Demo - MedCare Clinic',
      description: 'Specialized healthcare system demonstration',
      clientName: 'Dr. Robert Chen',
      clientEmail: 'robert.chen@medcare.com',
      clientPhone: '+1 (555) 890-1234',
      assignee: 'Emily Davis',
      date: '2024-01-27',
      time: '11:00',
      duration: 120,
      location: 'MedCare Clinic Conference Room',
      meetingType: 'In-Person',
      status: 'Confirmed',
      priority: 'High',
      leadId: '7',
      notes: 'Focus on compliance features and patient data security.',
      agenda: ['HIPAA compliance overview', 'Patient management features', 'Scheduling system', 'Integration capabilities'],
      reminders: ['1 day before', '2 hours before'],
      createdDate: '2024-01-24',
      lastModified: '2024-01-25'
    },
    {
      id: 'apt-8',
      title: 'University LMS Presentation',
      description: 'Learning management system presentation to university committee',
      clientName: 'Prof. James Wilson',
      clientEmail: 'james.wilson@metrou.edu',
      clientPhone: '+1 (555) 012-3456',
      assignee: 'Sarah Johnson',
      date: '2024-01-29',
      time: '10:00',
      duration: 150,
      location: 'Metropolitan University, Board Room',
      meetingType: 'In-Person',
      status: 'Confirmed',
      priority: 'High',
      leadId: '9',
      notes: 'Committee includes IT director, academic dean, and budget committee.',
      agenda: ['LMS features overview', 'Student engagement tools', 'Analytics and reporting', 'Implementation timeline', 'Budget discussion'],
      reminders: ['2 days before', '1 day before', '2 hours before'],
      createdDate: '2024-01-21',
      lastModified: '2024-01-23'
    },

    // SCHEDULED APPOINTMENTS
    {
      id: 'apt-2',
      title: 'Requirements Gathering - StartupXYZ',
      description: 'Detailed requirements gathering session for CRM implementation',
      clientName: 'Emily Davis',
      clientEmail: 'emily@startupxyz.com',
      clientPhone: '+1 (555) 234-5678',
      assignee: 'Mike Chen',
      date: '2024-01-26',
      time: '10:30',
      duration: 60,
      location: 'Virtual Meeting',
      meetingType: 'Video Call',
      status: 'Scheduled',
      priority: 'Medium',
      leadId: '2',
      notes: 'Focus on their current workflow and pain points.',
      agenda: ['Current process review', 'Pain points identification', 'Feature requirements', 'Timeline discussion'],
      reminders: ['1 day before', '30 minutes before'],
      createdDate: '2024-01-18',
      lastModified: '2024-01-19'
    },
    {
      id: 'apt-4',
      title: 'Contract Review Meeting',
      description: 'Final contract review and signing ceremony',
      clientName: 'Sarah Wilson',
      clientEmail: 'sarah@datadriven.com',
      clientPhone: '+1 (555) 456-7890',
      assignee: 'Alex Rodriguez',
      date: '2024-01-30',
      time: '11:00',
      duration: 120,
      location: 'DataDriven Co Office',
      meetingType: 'In-Person',
      status: 'Scheduled',
      priority: 'High',
      leadId: '4',
      notes: 'Bring contract copies and implementation timeline.',
      agenda: ['Contract review', 'Implementation planning', 'Contract signing', 'Kick-off discussion'],
      reminders: ['2 days before', '1 day before', '2 hours before'],
      createdDate: '2024-01-15',
      lastModified: '2024-01-20'
    },
    {
      id: 'apt-9',
      title: 'Fashion E-commerce Consultation',
      description: 'Initial consultation for e-commerce platform requirements',
      clientName: 'Lisa Chang',
      clientEmail: 'lisa@fashionforward.com',
      clientPhone: '+1 (555) 789-0123',
      assignee: 'Mike Chen',
      date: '2024-01-31',
      time: '15:00',
      duration: 60,
      location: 'Fashion Forward Boutique',
      meetingType: 'In-Person',
      status: 'Scheduled',
      priority: 'Medium',
      leadId: '6',
      notes: 'Small boutique, focus on cost-effective solutions.',
      agenda: ['Current sales process', 'Online presence needs', 'Inventory management', 'Budget discussion'],
      reminders: ['1 day before', '1 hour before'],
      createdDate: '2024-01-22',
      lastModified: '2024-01-23'
    },
    {
      id: 'apt-10',
      title: 'Warehouse System Deep Dive',
      description: 'Technical deep dive session for inventory management system',
      clientName: 'David Kim',
      clientEmail: 'david@logiflow.com',
      clientPhone: '+1 (555) 123-9876',
      assignee: 'John Smith',
      date: '2024-02-01',
      time: '09:30',
      duration: 180,
      location: 'LogiFlow Warehouse Facility',
      meetingType: 'In-Person',
      status: 'Scheduled',
      priority: 'High',
      leadId: '10',
      notes: 'Technical team evaluation. Bring system architect.',
      agenda: ['Current warehouse operations tour', 'System integration points', 'Performance requirements', 'Implementation planning'],
      reminders: ['2 days before', '1 day before', '2 hours before'],
      createdDate: '2024-01-19',
      lastModified: '2024-01-21'
    },

    // IN PROGRESS APPOINTMENTS
    {
      id: 'apt-3',
      title: 'Follow-up Call - RetailPlus',
      description: 'Follow-up call to discuss proposal feedback',
      clientName: 'Alex Rodriguez',
      clientEmail: 'alex@retailplus.com',
      clientPhone: '+1 (555) 345-6789',
      assignee: 'Emily Davis',
      date: '2024-01-24',
      time: '15:30',
      duration: 30,
      location: 'Phone Call',
      meetingType: 'Phone Call',
      status: 'In Progress',
      priority: 'High',
      leadId: '3',
      notes: 'Discuss pricing adjustments and contract terms.',
      agenda: ['Proposal feedback', 'Pricing discussion', 'Next steps'],
      reminders: ['15 minutes before'],
      createdDate: '2024-01-22',
      lastModified: '2024-01-24'
    },
    {
      id: 'apt-11',
      title: 'Restaurant POS Demo',
      description: 'Live POS system demonstration at restaurant location',
      clientName: 'Maria Gonzalez',
      clientEmail: 'maria@tastybites.com',
      clientPhone: '+1 (555) 901-2345',
      assignee: 'Alex Rodriguez',
      date: '2024-01-24',
      time: '18:00',
      duration: 90,
      location: 'Tasty Bites Main Location',
      meetingType: 'In-Person',
      status: 'In Progress',
      priority: 'Medium',
      leadId: '8',
      notes: 'Demo during actual dinner service for realistic testing.',
      agenda: ['Live POS demonstration', 'Staff training overview', 'Integration with existing systems', 'Pricing discussion'],
      reminders: [],
      createdDate: '2024-01-21',
      lastModified: '2024-01-24'
    },

    // COMPLETED APPOINTMENTS
    {
      id: 'apt-5',
      title: 'Quarterly Business Review',
      description: 'Quarterly review with existing client',
      clientName: 'Michael Brown',
      clientEmail: 'michael@cloudfirst.com',
      clientPhone: '+1 (555) 567-8901',
      assignee: 'John Smith',
      date: '2024-01-28',
      time: '09:00',
      duration: 60,
      location: 'Virtual Meeting',
      meetingType: 'Video Call',
      status: 'Completed',
      priority: 'Medium',
      leadId: '5',
      notes: 'Discuss implementation progress and additional requirements.',
      agenda: ['Implementation review', 'Performance metrics', 'Additional requirements', 'Renewal discussion'],
      reminders: [],
      createdDate: '2024-01-10',
      lastModified: '2024-01-28'
    },
    {
      id: 'apt-12',
      title: 'Manufacturing ERP Final Presentation',
      description: 'Final executive presentation before contract signing',
      clientName: 'Thomas Anderson',
      clientEmail: 'thomas@precisiontech.com',
      clientPhone: '+1 (555) 678-1098',
      assignee: 'John Smith',
      date: '2024-01-23',
      time: '14:00',
      duration: 120,
      location: 'PrecisionTech Headquarters',
      meetingType: 'In-Person',
      status: 'Completed',
      priority: 'High',
      leadId: '15',
      notes: 'Successful presentation! Moving to contract finalization.',
      agenda: ['Executive summary', 'ROI presentation', 'Implementation roadmap', 'Contract terms overview'],
      reminders: [],
      createdDate: '2024-01-18',
      lastModified: '2024-01-23'
    },
    {
      id: 'apt-13',
      title: 'Financial Planning Software Demo',
      description: 'Product demonstration for wealth management team',
      clientName: 'Amanda Foster',
      clientEmail: 'amanda@wealthwise.com',
      clientPhone: '+1 (555) 234-8765',
      assignee: 'Emily Davis',
      date: '2024-01-22',
      time: '16:00',
      duration: 75,
      location: 'WealthWise Advisors Office',
      meetingType: 'In-Person',
      status: 'Completed',
      priority: 'Medium',
      leadId: '11',
      notes: 'Great reception from the team. Follow-up meeting scheduled.',
      agenda: ['Product walkthrough', 'Client portfolio management', 'Reporting capabilities', 'Integration options'],
      reminders: [],
      createdDate: '2024-01-18',
      lastModified: '2024-01-22'
    },

    // CANCELLED APPOINTMENTS
    {
      id: 'apt-6',
      title: 'Discovery Call - NewClient Corp',
      description: 'Initial discovery call with potential new client',
      clientName: 'Jennifer Wilson',
      clientEmail: 'jennifer@newclient.com',
      clientPhone: '+1 (555) 678-9012',
      assignee: 'Sarah Johnson',
      date: '2024-01-29',
      time: '16:00',
      duration: 45,
      location: 'Phone Call',
      meetingType: 'Phone Call',
      status: 'Cancelled',
      priority: 'Low',
      notes: 'Client requested to reschedule due to emergency.',
      agenda: ['Company overview', 'Current challenges', 'Solution fit assessment'],
      reminders: [],
      createdDate: '2024-01-25',
      lastModified: '2024-01-28'
    },
    {
      id: 'apt-14',
      title: 'Supply Chain System Workshop',
      description: 'Workshop to map current supply chain processes',
      clientName: 'Richard Taylor',
      clientEmail: 'richard@globalsupply.com',
      clientPhone: '+1 (555) 456-3210',
      assignee: 'Sarah Johnson',
      date: '2024-01-26',
      time: '13:00',
      duration: 240,
      location: 'GlobalSupply Inc Headquarters',
      meetingType: 'In-Person',
      status: 'Cancelled',
      priority: 'Medium',
      leadId: '13',
      notes: 'Cancelled due to client travel conflict. Rescheduling for next week.',
      agenda: ['Current process mapping', 'Pain points identification', 'Solution design workshop', 'Implementation planning'],
      reminders: [],
      createdDate: '2024-01-20',
      lastModified: '2024-01-26'
    },

    // RESCHEDULED APPOINTMENTS
    {
      id: 'apt-15',
      title: 'HR Platform Stakeholder Meeting',
      description: 'Meeting with HR leadership team for platform evaluation',
      clientName: 'Jennifer Lee',
      clientEmail: 'jennifer@talentfirst.com',
      clientPhone: '+1 (555) 345-7654',
      assignee: 'Alex Rodriguez',
      date: '2024-02-02',
      time: '10:00',
      duration: 90,
      location: 'TalentFirst Corp Conference Room',
      meetingType: 'In-Person',
      status: 'Rescheduled',
      priority: 'High',
      leadId: '12',
      notes: 'Rescheduled from Jan 25 due to CEO travel. New date confirmed.',
      agenda: ['Platform overview', 'HR workflow automation', 'Payroll integration', 'Implementation timeline'],
      reminders: ['1 day before', '2 hours before'],
      createdDate: '2024-01-16',
      lastModified: '2024-01-25'
    },
    {
      id: 'apt-16',
      title: 'Real Estate CRM Walkthrough',
      description: 'Detailed CRM system walkthrough for real estate team',
      clientName: 'Sophie Martinez',
      clientEmail: 'sophie@primeproperties.com',
      clientPhone: '+1 (555) 567-2109',
      assignee: 'Mike Chen',
      date: '2024-02-05',
      time: '14:30',
      duration: 120,
      location: 'Prime Properties Network Office',
      meetingType: 'In-Person',
      status: 'Rescheduled',
      priority: 'Medium',
      leadId: '14',
      notes: 'Moved from original date to accommodate all key stakeholders.',
      agenda: ['Lead management features', 'Property listing integration', 'Client communication tools', 'Mobile app capabilities'],
      reminders: ['1 day before', '1 hour before'],
      createdDate: '2024-01-14',
      lastModified: '2024-01-28'
    }
  ];

  const statuses = ['New Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
  const priorities = ['All', 'Hot', 'Warm', 'Cold'];
  const assignees = ['All', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'John Smith'];

  // Appointment-specific constants
  const appointmentStatuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'];
  const appointmentPriorities = ['All', 'High', 'Medium', 'Low'];
  const appointmentAssignees = ['All', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'John Smith'];

  const filteredLeads = useMemo(() => {
    return mockLeads.filter(lead => {
      const matchesSearch = lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = selectedPriority === 'All' || lead.priority === selectedPriority;
      const matchesAssignee = selectedAssignee === 'All' || lead.assignee === selectedAssignee;
      const matchesProbability = lead.probability >= minProbability && lead.probability <= maxProbability;
      
      // Date filtering based on createdDate
      const leadDate = new Date(lead.createdDate);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const matchesDateRange = leadDate >= startDate && leadDate <= endDate;
      
      return matchesSearch && matchesPriority && matchesAssignee && matchesProbability && matchesDateRange;
    });
  }, [mockLeads, searchQuery, selectedPriority, selectedAssignee, minProbability, maxProbability, dateRange]);

  const leadsByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = filteredLeads.filter(lead => lead.mainStatus === status);
      return acc;
    }, {} as Record<string, Lead[]>);
  }, [filteredLeads, statuses]);

  // Appointment filtering
  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(appointment => {
      const matchesSearch = appointment.title.toLowerCase().includes(appointmentSearchQuery.toLowerCase()) ||
                          appointment.clientName.toLowerCase().includes(appointmentSearchQuery.toLowerCase()) ||
                          appointment.description.toLowerCase().includes(appointmentSearchQuery.toLowerCase());
      const matchesStatus = selectedAppointmentStatus === 'All' || appointment.status === selectedAppointmentStatus;
      const matchesAssignee = selectedAppointmentAssignee === 'All' || appointment.assignee === selectedAppointmentAssignee;
      
      // Date filtering based on appointment date
      const appointmentDate = new Date(appointment.date);
      const startDate = new Date(appointmentDateRange.startDate);
      const endDate = new Date(appointmentDateRange.endDate);
      const matchesDateRange = appointmentDate >= startDate && appointmentDate <= endDate;
      
      return matchesSearch && matchesStatus && matchesAssignee && matchesDateRange;
    });
  }, [mockAppointments, appointmentSearchQuery, selectedAppointmentStatus, selectedAppointmentAssignee, appointmentDateRange]);

  const appointmentsByStatus = useMemo(() => {
    return appointmentStatuses.reduce((acc, status) => {
      acc[status] = filteredAppointments.filter(appointment => appointment.status === status);
      return acc;
    }, {} as Record<string, Appointment[]>);
  }, [filteredAppointments, appointmentStatuses]);

  const handleEditLead = (lead: Lead) => {
    setSelectedModal(lead);
    setShowModal(true);
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      console.log('Delete lead:', leadId);
    }
  };

  const handleSaveLead = (lead: Lead) => {
    console.log('Save lead:', lead);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    console.log('Change status:', leadId, newStatus);
  };

  // Appointment handlers
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointmentModal(appointment);
    setShowAppointmentModal(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      console.log('Delete appointment:', appointmentId);
    }
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    console.log('Save appointment:', appointment);
  };

  const handleAppointmentStatusChange = (appointmentId: string, newStatus: string) => {
    console.log('Appointment status change:', appointmentId, newStatus);
  };

  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  const avgProbability = filteredLeads.length > 0 
    ? Math.round(filteredLeads.reduce((sum, lead) => sum + lead.probability, 0) / filteredLeads.length)
    : 0;

  return (
    <div className="p-3 min-h-screen bg-white">
      {/* Enhanced Compact Header - 40% Space Reduction */}
      <div className="mb-4">
        {/* Row 1: Title + Card Mode Toggle + Statistics */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-poppins font-bold text-gray-900">
            {activeTab === 'pipeline' ? 'Lead Pipeline' : 
             activeTab === 'appointments' ? 'Appointments' :
             activeTab === 'proposals' ? 'Proposals' :
             activeTab === 'analytics' ? 'Analytics' : 'Settings'}
          </h1>
          
          {/* Card Mode Toggle - Icon-based */}
          {activeTab === 'pipeline' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setCardMode('colorful')}
                  className={`px-2 py-1 rounded-md text-xs font-poppins font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    cardMode === 'colorful'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Palette size={12} />
                  Colorful
                </button>
                <button
                  onClick={() => setCardMode('minimal')}
                  className={`px-2 py-1 rounded-md text-xs font-poppins font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    cardMode === 'minimal'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Minus size={12} />
                  Minimal
                </button>
              </div>

              {/* Compact Statistics Badges */}
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-poppins font-medium">
                  {filteredLeads.length} Leads
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-poppins font-medium">
                  ${totalValue.toLocaleString()}
                </div>
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-poppins font-medium">
                  {filteredLeads.filter(lead => lead.priority === 'Hot').length} Hot
                </div>
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-poppins font-medium">
                  {avgProbability}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Team Selection with Gradient Background */}
        {activeTab === 'pipeline' && (
          <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200 mb-3">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-blue-600" />
              <select className="bg-transparent text-sm font-poppins font-medium text-gray-900 focus:outline-none">
                <option>All Teams ({filteredLeads.length})</option>
                <option>Sales Team (24)</option>
                <option>Marketing Team (18)</option>
                <option>Development Team (12)</option>
              </select>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </div>
        )}

        {/* Row 3: Clean Tab Navigation */}
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
          {[
            { key: 'pipeline', label: 'Pipeline', icon: Target },
            { key: 'appointments', label: 'Appointments', icon: Calendar },
            { key: 'proposals', label: 'Proposals', icon: FileText },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-3 py-1.5 rounded-md text-sm font-poppins font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Tab Content */}
      {activeTab === 'pipeline' && (
        <>


          {/* Compact Filter Bar - Taskboard Style */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 mb-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                  />
                </div>

                {/* Compact Filters Row */}
                <div className="flex items-center gap-2">
                  {/* Date Range Filter */}
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    className="min-w-32"
                  />

                  {/* Priority Filter */}
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-28"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority === 'All' ? 'All' : priority}
                      </option>
                    ))}
                  </select>

                  {/* Assignee Filter */}
                  <select
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-32"
                  >
                    {assignees.map(assignee => (
                      <option key={assignee} value={assignee}>
                        {assignee === 'All' ? 'All' : assignee.split(' ')[0]}
                      </option>
                    ))}
                  </select>

                  {/* Probability Range Filter */}
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={minProbability}
                      onChange={(e) => setMinProbability(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-12 text-xs font-poppins text-center border-none focus:outline-none"
                      placeholder="0"
                    />
                    <span className="text-gray-400 text-xs">%</span>
                    <div className="w-16 h-1 bg-gray-200 rounded-full relative">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${maxProbability - minProbability}%`,
                          marginLeft: `${minProbability}%`
                        }}
                      />
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={maxProbability}
                      onChange={(e) => setMaxProbability(Math.min(100, Math.max(0, parseInt(e.target.value) || 100)))}
                      className="w-12 text-xs font-poppins text-center border-none focus:outline-none"
                      placeholder="100"
                    />
                    <span className="text-gray-400 text-xs">%</span>
                  </div>
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-1.5 text-sm">
                <Plus size={14} />
                Add Lead
              </button>
            </div>
          </div>

          {/* Kanban Board Container - Ultra-Fast Smooth Horizontal Scroll */}
          <div 
            ref={kanbanContainerRef}
            className="kanban-container overflow-x-hidden"
            style={{
              width: '100%',
              height: 'calc(100vh - 200px)',
              position: 'relative',
              cursor: 'grab'
            }}
          >
            <div 
              className="flex gap-6 pb-6"
              style={{ 
                width: `${statuses.length * 340}px`,
                height: '100%',
                minWidth: '100%',
                willChange: 'transform'
              }}
            >
            {statuses.map(status => (
              <div key={status} className="flex-shrink-0 w-80" style={{ minWidth: '320px', height: '100%' }}>
                <div 
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200" 
                  style={{ 
                    height: 'calc(100vh - 260px)',
                    minHeight: '70vh'
                  }}
                >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-poppins font-semibold text-gray-900 text-sm">{status}</h3>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-poppins">
                    {leadsByStatus[status]?.length || 0}
                  </span>
                </div>

                {/* Add Lead Button - Moved to top */}
                <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 font-poppins text-sm mb-4">
                  <Plus size={16} />
                  Add Lead
                </button>
                
                <div 
                  className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" 
                  style={{ 
                    minHeight: '50vh', 
                    maxHeight: 'calc(100vh - 380px)',
                    height: 'calc(100vh - 380px)'
                  }}
                >
                  {(leadsByStatus[status] || []).map((lead, index) => (
                    <div
                      key={lead.id}
                      className="animate-slideUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <LeadCard
                        lead={lead}
                        onEdit={handleEditLead}
                        onDelete={handleDeleteLead}
                        onStatusChange={handleStatusChange}
                        compact={true}
                      />
                    </div>
                  ))}
                </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </>
      )}

      {/* Appointments Tab Content */}
      {activeTab === 'appointments' && (
        <>
          {/* Stats Dashboard for Appointments */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-blue-600" />
                <span className="font-poppins font-medium text-gray-900 text-sm">Total Appointments</span>
              </div>
              <p className="text-xl font-poppins font-semibold text-gray-900">{filteredAppointments.length}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-poppins font-medium text-gray-900 text-sm">Confirmed</span>
              </div>
              <p className="text-xl font-poppins font-semibold text-green-600">
                {filteredAppointments.filter(apt => apt.status === 'Confirmed').length}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-orange-600" />
                <span className="font-poppins font-medium text-gray-900 text-sm">Today</span>
              </div>
              <p className="text-xl font-poppins font-semibold text-orange-600">
                {filteredAppointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Flag size={16} className="text-purple-600" />
                <span className="font-poppins font-medium text-gray-900 text-sm">High Priority</span>
              </div>
              <p className="text-xl font-poppins font-semibold text-purple-600">
                {filteredAppointments.filter(apt => apt.priority === 'High').length}
              </p>
            </div>
          </div>

          {/* Appointment Filters and View Toggle */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={appointmentSearchQuery}
                    onChange={(e) => setAppointmentSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                  />
                </div>

                {/* Date Range Filter */}
                <DateRangePicker
                  value={appointmentDateRange}
                  onChange={setAppointmentDateRange}
                  className="min-w-48"
                />

                {/* Status Filter */}
                <select
                  value={selectedAppointmentStatus}
                  onChange={(e) => setSelectedAppointmentStatus(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
                >
                  <option value="All">All Status</option>
                  {appointmentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {/* Assignee Filter */}
                <select
                  value={selectedAppointmentAssignee}
                  onChange={(e) => setSelectedAppointmentAssignee(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
                >
                  {appointmentAssignees.map(assignee => (
                    <option key={assignee} value={assignee}>
                      {assignee === 'All' ? 'All Assignees' : assignee}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setAppointmentViewMode('kanban')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      appointmentViewMode === 'kanban' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Kanban View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setAppointmentViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      appointmentViewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setAppointmentViewMode('calendar')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      appointmentViewMode === 'calendar' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Calendar View"
                  >
                    <Calendar size={16} />
                  </button>
                </div>
              </div>

              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
                onClick={() => setShowAppointmentModal(true)}
              >
                <Plus size={16} />
                New Appointment
              </button>
            </div>
          </div>

          {/* Appointment Views */}
          {appointmentViewMode === 'kanban' && (
            <div 
              ref={appointmentKanbanRef}
              className="kanban-container overflow-x-hidden"
              style={{
                width: '100%',
                height: 'calc(100vh - 200px)',
                position: 'relative',
                cursor: 'grab'
              }}
            >
              <div 
                className="flex gap-6 pb-6"
                style={{ 
                  width: `${appointmentStatuses.length * 340}px`,
                  height: '100%',
                  minWidth: '100%',
                  willChange: 'transform'
                }}
              >
                {appointmentStatuses.map(status => (
                  <div key={status} className="flex-shrink-0 w-80" style={{ minWidth: '320px', height: '100%' }}>
                    <div 
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200" 
                      style={{ 
                        height: 'calc(100vh - 260px)',
                        minHeight: '70vh'
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-poppins font-semibold text-gray-900 text-sm">{status}</h3>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-poppins">
                          {appointmentsByStatus[status]?.length || 0}
                        </span>
                      </div>

                      <button 
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 font-poppins text-sm mb-4"
                        onClick={() => setShowAppointmentModal(true)}
                      >
                        <Plus size={16} />
                        Add Appointment
                      </button>
                      
                      <div 
                        className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400" 
                        style={{ 
                          minHeight: '50vh', 
                          maxHeight: 'calc(100vh - 380px)',
                          height: 'calc(100vh - 380px)'
                        }}
                      >
                        {(appointmentsByStatus[status] || []).map((appointment, index) => (
                          <div
                            key={appointment.id}
                            className="animate-slideUp bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => handleEditAppointment(appointment)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-poppins font-semibold text-gray-900 text-sm truncate flex-1">
                                {appointment.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-poppins ${
                                appointment.priority === 'High' ? 'bg-red-100 text-red-700' :
                                appointment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {appointment.priority}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-xs text-gray-600 font-poppins">
                              <div className="flex items-center gap-2">
                                <User size={12} />
                                <span>{appointment.clientName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={12} />
                                <span>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={12} />
                                <span className="truncate">{appointment.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={12} />
                                <span>{appointment.duration} minutes</span>
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-poppins">
                                  Assigned to {appointment.assignee}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${
                                  appointment.meetingType === 'In-Person' ? 'bg-blue-500' :
                                  appointment.meetingType === 'Video Call' ? 'bg-green-500' :
                                  'bg-orange-500'
                                }`} title={appointment.meetingType}></span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {appointmentViewMode === 'list' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Appointment</th>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Client</th>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Date & Time</th>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Assignee</th>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Priority</th>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Type</th>
                      <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment, index) => (
                      <tr 
                        key={appointment.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-poppins font-medium text-gray-900 text-sm">{appointment.title}</div>
                            <div className="text-xs text-gray-500 font-poppins truncate max-w-xs">{appointment.description}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-poppins text-gray-900 text-sm">{appointment.clientName}</div>
                          <div className="text-xs text-gray-500 font-poppins">{appointment.clientEmail}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-poppins text-gray-900 text-sm">
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 font-poppins">{appointment.time} ({appointment.duration}m)</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-poppins text-gray-900 text-sm">{appointment.assignee}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-poppins ${
                            appointment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                            appointment.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                            appointment.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            appointment.status === 'Rescheduled' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-poppins ${
                            appointment.priority === 'High' ? 'bg-red-100 text-red-700' :
                            appointment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-poppins text-gray-900 text-sm">{appointment.meetingType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditAppointment(appointment)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-150"
                            >
                              <Trash2 size={14} />
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

          {appointmentViewMode === 'calendar' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-xl font-poppins font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-poppins font-medium hover:bg-blue-700 transition-colors"
                >
                  Today
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center font-poppins font-semibold text-gray-500 text-sm border-b">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {(() => {
                  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - firstDay.getDay());
                  
                  const days = [];
                  for (let d = new Date(startDate); d <= lastDay || days.length % 7 !== 0; d.setDate(d.getDate() + 1)) {
                    days.push(new Date(d));
                  }

                  return days.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dateStr = date.toISOString().split('T')[0];
                    const dayAppointments = filteredAppointments.filter(apt => apt.date === dateStr);

                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border border-gray-100 ${
                          isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <div className={`text-sm font-poppins ${
                          isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${isToday ? 'font-bold text-blue-600' : ''} mb-1`}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 3).map(appointment => (
                            <div
                              key={appointment.id}
                              className={`p-1 rounded text-xs font-poppins cursor-pointer hover:opacity-80 transition-opacity ${
                                appointment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                                appointment.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                                appointment.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                              onClick={() => handleEditAppointment(appointment)}
                              title={`${appointment.time} - ${appointment.title} (${appointment.clientName})`}
                            >
                              <div className="truncate">
                                {appointment.time} {appointment.title}
                              </div>
                            </div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-gray-500 font-poppins">
                              +{dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </>
      )}

      {/* Content for other tabs */}
      {activeTab === 'proposals' && (
        <div className="-m-6">
          <ProposalsPage />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600 font-poppins">View sales performance and analytics</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">Settings</h3>
          <p className="text-gray-600 font-poppins">Configure sales module settings</p>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        appointment={selectedAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedAppointmentModal(null);
        }}
        onSave={handleSaveAppointment}
        onDelete={handleDeleteAppointment}
      />

      {/* Lead Modal */}
      <LeadModal
        isOpen={showModal}
        lead={selectedModal}
        onClose={() => {
          setShowModal(false);
          setSelectedModal(null);
        }}
        onSave={handleSaveLead}
        onDelete={handleDeleteLead}
      />
    </div>
  );
};

export default LeadPipelinePage; 