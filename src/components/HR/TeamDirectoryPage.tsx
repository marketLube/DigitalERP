import React, { useState } from 'react';
import { Search, Filter, Plus, Users, Mail, Phone, MapPin, Calendar, Award, Star, Eye, Edit3, Trash2, X, User, Briefcase, GraduationCap, Heart, FileText, BarChart3, Target, TrendingUp, Download, Upload } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  workType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
  salary: number;
  avatar: string;
  skills: string[];
  languages: string[];
  certifications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  performance: {
    rating: number;
    lastReview: string;
    goals: number;
    achievements: string[];
  };
  employeeId: string;
  manager: string;
  birthday: string;
  address: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, employee, onClose, onSave, onDelete }) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'work' | 'contact' | 'performance' | 'documents'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (employee) {
      setEditedEmployee({ ...employee });
    }
  }, [employee]);

  if (!isOpen || !editedEmployee) return null;

  const handleSave = () => {
    if (editedEmployee) {
      onSave(editedEmployee);
      setIsEditing(false);
      onClose();
    }
  };

  const handleDelete = () => {
    if (editedEmployee && window.confirm('Are you sure you want to delete this employee?')) {
      onDelete(editedEmployee.id);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Leave': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-slideUp">
        {/* Modal Header - Compact */}
        <div className="bg-indigo-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold text-sm">
                {editedEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-poppins font-semibold">{editedEmployee.name}</h2>
                <p className="text-indigo-100 font-poppins text-sm">{editedEmployee.position}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getStatusColor(editedEmployee.status)}`}>
                {editedEmployee.status}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Compact */}
        <div className="border-b border-gray-200 px-4">
          <nav className="flex space-x-6">
            {[
              { id: 'personal', label: 'Personal', icon: User },
              { id: 'work', label: 'Work', icon: Briefcase },
              { id: 'contact', label: 'Contact', icon: Phone },
              { id: 'performance', label: 'Performance', icon: BarChart3 },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-poppins font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent size={14} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content - Compact */}
        <div className="p-4 overflow-y-auto max-h-80">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editedEmployee.name}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, name: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={editedEmployee.employeeId}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-poppins text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    value={editedEmployee.birthday}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, birthday: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={editedEmployee.address}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, address: e.target.value } : null)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm resize-none disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex flex-wrap gap-1">
                    {editedEmployee.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-poppins">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={editedEmployee.position}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, position: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={editedEmployee.department}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, department: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm bg-white disabled:bg-gray-50"
                  >
                    <option value="Development Team">Development Team</option>
                    <option value="Performance Marketing">Performance Marketing</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Video Production">Video Production</option>
                    <option value="UI/UX Team">UI/UX Team</option>
                    <option value="Testing / QA">Testing / QA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Work Type</label>
                  <select
                    value={editedEmployee.workType}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, workType: e.target.value as any } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm bg-white disabled:bg-gray-50"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Manager</label>
                  <input
                    type="text"
                    value={editedEmployee.manager}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, manager: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={editedEmployee.joinDate}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-poppins text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    value={editedEmployee.salary}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, salary: Number(e.target.value) } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-poppins font-semibold text-gray-900 text-sm">Primary Contact</h4>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedEmployee.email}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, email: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editedEmployee.phone}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editedEmployee.location}
                    onChange={(e) => setEditedEmployee(prev => prev ? { ...prev, location: e.target.value } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-poppins font-semibold text-gray-900 text-sm">Emergency Contact</h4>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editedEmployee.emergencyContact.name}
                    onChange={(e) => setEditedEmployee(prev => prev ? { 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                    } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={editedEmployee.emergencyContact.relationship}
                    onChange={(e) => setEditedEmployee(prev => prev ? { 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                    } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editedEmployee.emergencyContact.phone}
                    onChange={(e) => setEditedEmployee(prev => prev ? { 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                    } : null)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={16} className="text-blue-600" />
                    <span className="font-poppins font-medium text-blue-900 text-sm">Performance Rating</span>
                  </div>
                  <div className="text-2xl font-poppins font-bold text-blue-600">
                    {editedEmployee.performance.rating}/5
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-green-600" />
                    <span className="font-poppins font-medium text-green-900 text-sm">Goals Completed</span>
                  </div>
                  <div className="text-2xl font-poppins font-bold text-green-600">
                    {editedEmployee.performance.goals}/10
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={16} className="text-purple-600" />
                    <span className="font-poppins font-medium text-purple-900 text-sm">Achievements</span>
                  </div>
                  <div className="text-2xl font-poppins font-bold text-purple-600">
                    {editedEmployee.performance.achievements.length}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-poppins font-semibold text-gray-900 mb-2 text-sm">Recent Achievements</h4>
                <div className="space-y-2">
                  {editedEmployee.performance.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Award size={14} className="text-yellow-500" />
                      <span className="font-poppins text-sm text-gray-900">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-poppins font-semibold text-gray-900 text-sm">Employee Documents</h4>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-poppins text-sm hover:bg-indigo-700 transition-colors duration-200">
                  <Upload size={14} />
                  Upload
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'Employment Contract', type: 'PDF', size: '2.4 MB', date: '2023-01-15' },
                  { name: 'ID Copy', type: 'PDF', size: '1.2 MB', date: '2023-01-15' },
                  { name: 'Resume', type: 'PDF', size: '856 KB', date: '2023-01-10' },
                  { name: 'Certifications', type: 'PDF', size: '3.1 MB', date: '2023-02-01' }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText size={14} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-poppins font-medium text-gray-900 text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500 font-poppins">{doc.type} • {doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Compact */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`mailto:${editedEmployee.email}`, '_blank')}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-poppins text-sm hover:bg-blue-700 transition-colors duration-200"
            >
              <Mail size={14} />
              Email
            </button>
            <button
              onClick={() => window.open(`tel:${editedEmployee.phone}`, '_blank')}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg font-poppins text-sm hover:bg-green-700 transition-colors duration-200"
            >
              <Phone size={14} />
              Call
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 font-poppins text-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-poppins text-sm hover:bg-indigo-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-poppins text-sm transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-poppins text-sm hover:bg-indigo-700 transition-colors duration-200"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamDirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedWorkType, setSelectedWorkType] = useState('All Work Types');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock employee data - Compact and realistic
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Alex Kumar',
      position: 'Data Analyst',
      department: 'Development Team',
      email: 'alex.kumar@company.com',
      phone: '+1 (555) 678-9012',
      location: 'Remote',
      workType: 'Full-time',
      status: 'Active',
      joinDate: '2023-01-09',
      salary: 85000,
      avatar: 'AK',
      skills: ['Python', 'SQL', 'Tableau'],
      languages: ['English', 'Hindi'],
      certifications: ['AWS Certified', 'Google Analytics'],
      emergencyContact: {
        name: 'Priya Kumar',
        relationship: 'Spouse',
        phone: '+1 (555) 678-9013'
      },
      performance: {
        rating: 4.5,
        lastReview: '2024-01-15',
        goals: 8,
        achievements: ['Q4 Performance Award', 'Data Innovation Project Lead']
      },
      employeeId: 'ENG002',
      manager: 'Sarah Chen',
      birthday: '1990-03-15',
      address: '123 Tech Street, San Francisco, CA 94105'
    },
    {
      id: '2',
      name: 'Emily Rodriguez',
      position: 'Marketing Manager',
      department: 'Performance Marketing',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      workType: 'Full-time',
      status: 'On Leave',
      joinDate: '2022-08-10',
      salary: 92000,
      avatar: 'ER',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
      languages: ['English', 'Spanish'],
      certifications: ['Google Ads', 'HubSpot'],
      emergencyContact: {
        name: 'Carlos Rodriguez',
        relationship: 'Brother',
        phone: '+1 (555) 345-6790'
      },
      performance: {
        rating: 4.8,
        lastReview: '2024-01-10',
        goals: 9,
        achievements: ['Campaign Excellence Award', 'Team Leadership Recognition']
      },
      employeeId: 'MKT001',
      manager: 'David Kim',
      birthday: '1988-07-22',
      address: '456 Marketing Ave, Austin, TX 78701'
    },
    {
      id: '3',
      name: 'James Wilson',
      position: 'Social Media Specialist',
      department: 'Social Media',
      email: 'james.wilson@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      workType: 'Full-time',
      status: 'Active',
      joinDate: '2023-06-01',
      salary: 78000,
      avatar: 'JW',
      skills: ['Content Creation', 'Social Strategy', 'Analytics'],
      languages: ['English'],
      certifications: ['Facebook Blueprint', 'Google Analytics'],
      emergencyContact: {
        name: 'Lisa Wilson',
        relationship: 'Wife',
        phone: '+1 (555) 456-7891'
      },
      performance: {
        rating: 4.2,
        lastReview: '2024-01-05',
        goals: 7,
        achievements: ['Top Performer Q3', 'Client Satisfaction Award']
      },
      employeeId: 'SM001',
      manager: 'Jennifer Lee',
      birthday: '1985-11-08',
      address: '789 Social Media Blvd, Chicago, IL 60601'
    },
    {
      id: '4',
      name: 'Lisa Thompson',
      position: 'Video Producer',
      department: 'Video Production',
      email: 'lisa.thompson@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Seattle, WA',
      workType: 'Full-time',
      status: 'Active',
      joinDate: '2022-11-15',
      salary: 72000,
      avatar: 'LT',
      skills: ['Video Editing', 'Motion Graphics', 'Adobe Creative Suite'],
      languages: ['English', 'French'],
      certifications: ['Adobe Certified Expert', 'Video Production'],
      emergencyContact: {
        name: 'Mark Thompson',
        relationship: 'Husband',
        phone: '+1 (555) 567-8902'
      },
      performance: {
        rating: 4.6,
        lastReview: '2024-01-12',
        goals: 8,
        achievements: ['Creative Excellence Award', 'Process Improvement Initiative']
      },
      employeeId: 'VID001',
      manager: 'Robert Davis',
      birthday: '1987-05-30',
      address: '321 Video Lane, Seattle, WA 98101'
    },
    {
      id: '5',
      name: 'Michael Chen',
      position: 'Software Engineer',
      department: 'Development Team',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      workType: 'Full-time',
      status: 'Active',
      joinDate: '2023-03-20',
      salary: 110000,
      avatar: 'MC',
      skills: ['React', 'Node.js', 'TypeScript'],
      languages: ['English', 'Mandarin'],
      certifications: ['AWS Solutions Architect', 'React Certified'],
      emergencyContact: {
        name: 'Anna Chen',
        relationship: 'Sister',
        phone: '+1 (555) 234-5679'
      },
      performance: {
        rating: 4.7,
        lastReview: '2024-01-08',
        goals: 9,
        achievements: ['Technical Innovation Award', 'Code Quality Champion']
      },
      employeeId: 'ENG001',
      manager: 'Sarah Chen',
      birthday: '1991-09-12',
      address: '654 Code Street, San Francisco, CA 94107'
    },
    {
      id: '6',
      name: 'Sarah Johnson',
      position: 'UX Designer',
      department: 'UI/UX Team',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 789-0123',
      location: 'New York, NY',
      workType: 'Part-time',
      status: 'Active',
      joinDate: '2023-09-05',
      salary: 65000,
      avatar: 'SJ',
      skills: ['Figma', 'User Research', 'Prototyping'],
      languages: ['English'],
      certifications: ['UX Design Certificate', 'Design Thinking'],
      emergencyContact: {
        name: 'Tom Johnson',
        relationship: 'Father',
        phone: '+1 (555) 789-0124'
      },
      performance: {
        rating: 4.3,
        lastReview: '2024-01-03',
        goals: 6,
        achievements: ['Design Excellence', 'User Experience Innovation']
      },
      employeeId: 'UX001',
      manager: 'Patricia Wong',
      birthday: '1993-12-18',
      address: '987 Design Plaza, New York, NY 10001'
    },
    {
      id: '7',
      name: 'David Wilson',
      position: 'QA Tester',
      department: 'Testing / QA',
      email: 'david.wilson@company.com',
      phone: '+1 (555) 890-1234',
      location: 'Portland, OR',
      workType: 'Contract',
      status: 'Active',
      joinDate: '2023-07-18',
      salary: 62000,
      avatar: 'DW',
      skills: ['Manual Testing', 'Automation', 'Bug Tracking'],
      languages: ['English'],
      certifications: ['ISTQB Certified', 'Selenium'],
      emergencyContact: {
        name: 'Jennifer Wilson',
        relationship: 'Sister',
        phone: '+1 (555) 890-1235'
      },
      performance: {
        rating: 4.1,
        lastReview: '2024-01-14',
        goals: 6,
        achievements: ['Quality Assurance Award', 'Bug Detection Excellence']
      },
      employeeId: 'QA001',
      manager: 'Andrew Thompson',
      birthday: '1992-02-14',
      address: '444 Quality Ave, Portland, OR 97201'
    },
    {
      id: '8',
      name: 'Althameem',
      position: 'CEO & Founder',
      department: 'Performance Marketing',
      email: 'althameem@marketlube.com',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      workType: 'Full-time',
      status: 'Active',
      joinDate: '2022-01-01',
      salary: 150000,
      avatar: 'A',
      skills: ['Leadership', 'Strategy', 'Digital Marketing'],
      languages: ['English', 'Hindi', 'Kannada'],
      certifications: ['MBA', 'Digital Marketing Expert'],
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Family',
        phone: '+91 98765 43211'
      },
      performance: {
        rating: 5.0,
        lastReview: '2024-01-01',
        goals: 10,
        achievements: ['Company Foundation', 'Leadership Excellence', 'Strategic Vision']
      },
      employeeId: 'CEO001',
      manager: 'Board of Directors',
      birthday: '1985-06-15',
      address: 'Bangalore, Karnataka, India'
    }
  ]);

  const departments = ['All Departments', 'UI/UX Team', 'Development Team', 'Performance Marketing', 'Video Production', 'Social Media', 'Testing / QA'];
  const statuses = ['All Status', 'Active', 'On Leave', 'Inactive'];
  const workTypes = ['All Work Types', 'Full-time', 'Part-time', 'Contract', 'Intern'];

  // Filter and sort employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === 'All Departments' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All Status' || employee.status === selectedStatus;
    const matchesWorkType = selectedWorkType === 'All Work Types' || employee.workType === selectedWorkType;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesWorkType;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'department':
        return a.department.localeCompare(b.department);
      case 'position':
        return a.position.localeCompare(b.position);
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case 'salary':
        return b.salary - a.salary;
      default:
        return 0;
    }
  });

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleSaveEmployee = (employee: Employee) => {
    console.log('Save employee:', employee);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    console.log('Delete employee:', employeeId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Leave': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'Active').length,
    onLeave: employees.filter(emp => emp.status === 'On Leave').length,
    newHires: employees.filter(emp => {
      const joinDate = new Date(emp.joinDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return joinDate >= thirtyDaysAgo;
    }).length
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-900">Team Directory</h1>
              <p className="text-gray-600 font-poppins">Manage your team members and their information</p>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600 font-poppins">Total Employees</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-600 font-poppins">Active</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900">{[...new Set(employees.map(e => e.department))].length}</p>
                <p className="text-sm text-gray-600 font-poppins">Departments</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase size={20} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900">
                  {Math.round(employees.reduce((acc, emp) => acc + emp.performance.rating, 0) / employees.length * 10) / 10}
                </p>
                <p className="text-sm text-gray-600 font-poppins">Avg Rating</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins bg-white shadow-sm hover:shadow-md transition-all duration-200 min-w-80"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins bg-white shadow-sm hover:shadow-md transition-all duration-200 min-w-40"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins bg-white shadow-sm hover:shadow-md transition-all duration-200 min-w-28"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins bg-white shadow-sm hover:shadow-md transition-all duration-200 min-w-32"
            >
              {workTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins bg-white shadow-sm hover:shadow-md transition-all duration-200 min-w-36"
            >
              <option value="name">Sort by Name</option>
              <option value="department">Sort by Department</option>
              <option value="position">Sort by Position</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="salary">Sort by Salary</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg font-poppins font-medium transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-indigo-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg font-poppins font-medium transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-indigo-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>

            <div className="text-sm text-gray-600 font-poppins font-medium bg-gray-100 px-3 py-2 rounded-lg">
              {sortedEmployees.length} employees
            </div>
          </div>
        </div>
      </div>

      {/* Employee Display */}
      <div className="px-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {sortedEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer shadow-md"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleViewEmployee(employee)}
              >
                {/* Employee Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-poppins font-bold shadow-lg">
                      {employee.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      employee.status === 'Active' ? 'bg-green-500' :
                      employee.status === 'On Leave' ? 'bg-yellow-500' : 'bg-red-500'
                    } shadow-sm`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">{employee.name}</h3>
                    <p className="text-sm text-gray-600 font-poppins truncate">{employee.position}</p>
                  </div>
                </div>

                {/* Department & Work Type */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-xl text-xs font-poppins font-medium">
                    {employee.department}
                  </span>
                  <span className="text-xs text-gray-500 font-poppins font-medium bg-gray-100 px-2 py-1 rounded-lg">{employee.workType}</span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail size={12} />
                    <span className="font-poppins truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={12} />
                    <span className="font-poppins">{employee.location}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {employee.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-poppins font-medium">
                      {skill}
                    </span>
                  ))}
                  {employee.skills.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-poppins font-medium">
                      +{employee.skills.length - 2}
                    </span>
                  )}
                </div>

                {/* Performance Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={`${
                          i < employee.performance.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 font-poppins">{employee.performance.rating}/5</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 font-poppins pt-2 border-t border-gray-100">
                  <span className="font-medium">ID: {employee.employeeId}</span>
                  <span>Joined {new Date(employee.joinDate).toLocaleDateString('en-GB')}</span>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewEmployee(employee);
                    }}
                    className="p-2 bg-white shadow-lg rounded-xl text-indigo-600 hover:bg-gray-50 hover:text-indigo-700 transition-all duration-200"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-3 py-2 font-poppins font-semibold text-gray-900 text-xs">Employee</th>
                  <th className="text-left px-3 py-2 font-poppins font-semibold text-gray-900 text-xs">Position</th>
                  <th className="text-left px-3 py-2 font-poppins font-semibold text-gray-900 text-xs">Department</th>
                  <th className="text-left px-3 py-2 font-poppins font-semibold text-gray-900 text-xs">Status</th>
                  <th className="text-left px-3 py-2 font-poppins font-semibold text-gray-900 text-xs">Location</th>
                  <th className="text-left px-3 py-2 font-poppins font-semibold text-gray-900 text-xs">Join Date</th>
                  <th className="text-right px-3 py-2 font-poppins font-semibold text-gray-900 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-xs">
                          {employee.avatar}
                        </div>
                        <div>
                          <div className="font-poppins font-medium text-gray-900 text-sm">{employee.name}</div>
                          <div className="text-xs text-gray-500 font-poppins">{employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-poppins text-sm text-gray-900">{employee.position}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-poppins">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-poppins text-sm text-gray-900">{employee.location}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-poppins text-sm text-gray-600">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
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
      </div>

      {/* Empty State */}
      {sortedEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-gray-600" />
          </div>
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No employees found
          </h3>
          <p className="text-gray-600 font-poppins mb-6">
            {searchQuery || selectedDepartment !== 'All Departments' || selectedStatus !== 'All Status' || selectedWorkType !== 'All Work Types'
              ? 'Try adjusting your search criteria or filters.'
              : 'Add your first employee to get started.'
            }
          </p>
          {!searchQuery && selectedDepartment === 'All Departments' && selectedStatus === 'All Status' && selectedWorkType === 'All Work Types' && (
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center gap-2 mx-auto">
              <Plus size={20} />
              Add First Employee
            </button>
          )}
        </div>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={showModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowModal(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSaveEmployee}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
};

export default TeamDirectoryPage;
