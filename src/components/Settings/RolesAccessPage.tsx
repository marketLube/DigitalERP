import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Users, Shield, Settings, Eye, Edit2, Trash2, X, Save, Upload, Key, ToggleLeft, ToggleRight, ChevronDown, User, Mail, Phone, Camera, Filter, Check, ClipboardList, TrendingUp, Calculator, BarChart3 } from 'lucide-react';
import { User as UserType, Role, Module } from '../../types/roles';

interface RolesAccessPageProps {
  onBack?: () => void;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSave: (user: UserType) => void;
  teams: string[];
  mainStatuses: string[];
  modules: Module[];
}

interface TeamFilterDropdownProps {
  selectedTeam: string;
  onTeamSelect: (team: string) => void;
  teams: string[];
}

const TeamFilterDropdown: React.FC<TeamFilterDropdownProps> = ({ selectedTeam, onTeamSelect, teams }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allTeams = ['All Teams', ...teams];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-56 shadow-sm hover:shadow-md"
      >
        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Filter size={12} className="text-white" />
        </div>
        <span className="font-poppins font-medium text-gray-900 flex-1 text-left">
          {selectedTeam}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
            <h4 className="font-poppins font-semibold text-gray-900 text-sm">Filter by Team</h4>
            <p className="text-xs text-gray-600 font-poppins mt-1">Select a team to filter users</p>
          </div>

          {/* Options */}
          <div className="max-h-64 overflow-y-auto">
            {allTeams.map((team, index) => (
              <button
                key={team}
                onClick={() => {
                  onTeamSelect(team);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 group ${
                  selectedTeam === team ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                {/* Team Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  selectedTeam === team 
                    ? 'bg-blue-100' 
                    : index === 0 
                      ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
                      : 'bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300'
                }`}>
                  {index === 0 ? (
                    <Users size={14} className={selectedTeam === team ? 'text-blue-600' : 'text-gray-600'} />
                  ) : (
                    <div className={`w-3 h-3 rounded-full ${
                      selectedTeam === team ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-poppins font-medium transition-colors duration-200 ${
                      selectedTeam === team ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {team}
                    </span>
                    {selectedTeam === team && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  {index === 0 ? (
                    <p className="text-xs text-gray-500 font-poppins">Show all team members</p>
                  ) : (
                    <p className="text-xs text-gray-500 font-poppins">
                      {Math.floor(Math.random() * 8) + 2} members
                    </p>
                  )}
                </div>

                {/* Hover indicator */}
                <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  selectedTeam === team 
                    ? 'bg-blue-500' 
                    : 'bg-transparent group-hover:bg-gray-300'
                }`}></div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-poppins">
                {allTeams.length} teams available
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-blue-600 hover:text-blue-700 font-poppins font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave, teams, mainStatuses, modules }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<UserType>(
    user || {
      id: '',
      name: '',
      email: '',
      phone: '',
      role: 'User',
      teams: [],
      mainStatuses: [],
      subStatuses: [],
      moduleAccess: {},
      avatar: '',
      createdDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
  );

  // Team-specific main statuses mapping
  const teamMainStatuses: Record<string, string[]> = {
    'UI/UX Team': ['Wireframing', 'Design'],
    'Development Team': ['Frontend Development', 'Backend Development'],
    'Performance Marketing': ['Campaign Setup', 'Campaign Monitoring'],
    'Video Production': ['Pre-Production', 'Post-Production'],
    'Social Media': ['Content Creation', 'Publishing'],
    'Testing / QA': ['Test Execution', 'Final QA']
  };

  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  const toggleTeamExpansion = (teamName: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamName)) {
      newExpanded.delete(teamName);
    } else {
      newExpanded.add(teamName);
    }
    setExpandedTeams(newExpanded);
  };

  const handleTeamSelection = (teamName: string, isSelected: boolean) => {
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        teams: [...prev.teams, teamName]
      }));
    } else {
      // Remove team and all its main statuses
      const teamStatuses = teamMainStatuses[teamName] || [];
      setFormData(prev => ({
        ...prev,
        teams: prev.teams.filter(t => t !== teamName),
        mainStatuses: prev.mainStatuses.filter(status => !teamStatuses.includes(status))
      }));
    }
  };

  const handleMainStatusSelection = (statusName: string, isSelected: boolean) => {
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        mainStatuses: [...prev.mainStatuses, statusName]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        mainStatuses: prev.mainStatuses.filter(s => s !== statusName)
      }));
    }
  };

  const clearAllTeamsAndStatuses = () => {
    setFormData(prev => ({
      ...prev,
      teams: [],
      mainStatuses: []
    }));
    setExpandedTeams(new Set());
  };

  const getSelectedStatusCount = (teamName: string) => {
    const teamStatuses = teamMainStatuses[teamName] || [];
    return teamStatuses.filter(status => formData.mainStatuses.includes(status)).length;
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const toggleModuleAccess = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      moduleAccess: {
        ...prev.moduleAccess,
        [moduleId]: !prev.moduleAccess[moduleId]
      }
    }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'teams', label: 'Team & Status', icon: Users },
    { id: 'modules', label: 'Module Access', icon: Shield },
    { id: 'password', label: 'Password', icon: Key }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-poppins font-semibold text-gray-900">
                {user ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="text-gray-600 font-poppins text-sm mt-1">
                Manage user information, permissions, and access levels
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Tab Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-poppins font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <IconComponent size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-poppins font-bold shadow-lg">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        formData.name.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                      <Camera size={14} className="text-gray-600" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 font-poppins mt-2">Click to upload profile picture</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Role }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white appearance-none"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="User">User</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-poppins font-medium text-blue-900 text-sm mb-2">Role Permissions</h4>
                  <div className="text-xs text-blue-800 font-poppins space-y-1">
                    {formData.role === 'Super Admin' && <p>• Full system access and user management</p>}
                    {formData.role === 'Admin' && <p>• Team management and most system features</p>}
                    {formData.role === 'Manager' && <p>• Team oversight and project management</p>}
                    {formData.role === 'User' && <p>• Basic access to assigned tasks and teams</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-poppins font-semibold text-gray-900">Team & Status Assignment</h3>
                    <p className="text-gray-600 font-poppins text-sm mt-1">Select teams and their respective main statuses</p>
                  </div>
                  <button
                    onClick={clearAllTeamsAndStatuses}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-poppins font-medium transition-colors duration-200"
                  >
                    <X size={16} />
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {teams.map(team => {
                    const isTeamSelected = formData.teams.includes(team);
                    const isExpanded = expandedTeams.has(team);
                    const teamStatuses = teamMainStatuses[team] || [];
                    const selectedCount = getSelectedStatusCount(team);

                    return (
                      <div key={team} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Team Header */}
                        <div 
                          className={`p-4 cursor-pointer transition-all duration-200 ${
                            isTeamSelected 
                              ? 'bg-blue-50 border-b border-blue-100' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div 
                              className="flex items-center gap-3 flex-1"
                              onClick={() => toggleTeamExpansion(team)}
                            >
                              <ChevronDown 
                                size={16} 
                                className={`text-gray-400 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-0' : '-rotate-90'
                                }`} 
                              />
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-poppins font-medium text-gray-900">{team}</span>
                                  {isTeamSelected && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-poppins font-medium">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 font-poppins">
                                  {teamStatuses.length} available statuses
                                  {selectedCount > 0 && ` • ${selectedCount} selected`}
                                </p>
                              </div>
                            </div>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isTeamSelected}
                                onChange={(e) => handleTeamSelection(team, e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Team Statuses */}
                        {isExpanded && (
                          <div className="p-4 bg-gray-50 border-t border-gray-100">
                            {!isTeamSelected && (
                              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800 font-poppins">
                                  ⚠️ Select the team first to enable status selection
                                </p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3">
                              {teamStatuses.map(status => (
                                <label 
                                  key={status} 
                                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                    isTeamSelected 
                                      ? 'border-gray-200 hover:bg-white hover:shadow-sm' 
                                      : 'border-gray-100 bg-gray-100 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.mainStatuses.includes(status)}
                                    onChange={(e) => handleMainStatusSelection(status, e.target.checked)}
                                    disabled={!isTeamSelected}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                  />
                                  <span className={`font-poppins text-sm ${
                                    isTeamSelected ? 'text-gray-900' : 'text-gray-500'
                                  }`}>
                                    {status}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-poppins font-medium text-green-900 text-sm mb-2">Team & Status Guidelines</h4>
                  <ul className="text-xs text-green-800 font-poppins space-y-1">
                    <li>• <strong>Step 1:</strong> Click on any team to expand and see their main statuses</li>
                    <li>• <strong>Step 2:</strong> Check the team checkbox to select the team</li>
                    <li>• <strong>Step 3:</strong> Choose specific main statuses the user can access</li>
                    <li>• <strong>Result:</strong> User sees only tasks from selected teams and statuses</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">Module Access Control</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map(module => {
                      const getIconComponent = (iconName: string) => {
                        const iconMap: Record<string, React.ComponentType<any>> = {
                          ClipboardList,
                          Users,
                          TrendingUp,
                          Calculator,
                          BarChart3,
                          Settings
                        };
                        return iconMap[iconName] || ClipboardList;
                      };
                      
                      const IconComponent = getIconComponent(module.icon);
                      const hasAccess = formData.moduleAccess[module.id] || false;
                      
                      return (
                        <div key={module.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasAccess ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <IconComponent size={20} className={hasAccess ? 'text-blue-600' : 'text-gray-400'} />
                              </div>
                              <div>
                                <h4 className="font-poppins font-medium text-gray-900">{module.name}</h4>
                                <p className="text-xs text-gray-500 font-poppins">{module.description}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleModuleAccess(module.id)}
                              className="flex-shrink-0"
                            >
                              {hasAccess ? (
                                <ToggleRight size={24} className="text-blue-600" />
                              ) : (
                                <ToggleLeft size={24} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div className="text-xs text-gray-600 font-poppins">
                            Status: <span className={`font-medium ${hasAccess ? 'text-green-600' : 'text-red-600'}`}>
                              {hasAccess ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-poppins font-medium text-purple-900 text-sm mb-2">Module Access Notes</h4>
                  <ul className="text-xs text-purple-800 font-poppins space-y-1">
                    <li>• Super Admins have access to all modules by default</li>
                    <li>• Module access can be customized per user regardless of role</li>
                    <li>• Disabled modules won't appear in the user's navigation</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Key size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-2">Password Management</h3>
                  <p className="text-gray-600 font-poppins text-sm">Manage user authentication and password settings</p>
                </div>

                {user && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-poppins font-medium text-gray-900">Current Password</h4>
                        <p className="text-sm text-gray-600 font-poppins">••••••••••••</p>
                      </div>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200">
                        Reset Password
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-poppins font-medium text-yellow-900 text-sm mb-2">Password Requirements</h4>
                  <ul className="text-xs text-yellow-800 font-poppins space-y-1">
                    <li>• Minimum 8 characters long</li>
                    <li>• At least one uppercase letter</li>
                    <li>• At least one lowercase letter</li>
                    <li>• At least one number or special character</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const RolesAccessPage: React.FC<RolesAccessPageProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All Teams');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock data
  const teams = ['UI/UX Team', 'Development Team', 'Performance Marketing', 'Video Production', 'Social Media', 'Testing / QA'];
  const mainStatuses = ['Wireframing', 'Design', 'Frontend Development', 'Backend Development', 'Campaign Setup', 'Campaign Monitoring'];
  
  const modules: Module[] = [
    { id: 'tasks', name: 'Task Board', description: 'Manage tasks and workflows', icon: 'ClipboardList' },
    { id: 'hr', name: 'HR Module', description: 'Human resources management', icon: 'Users' },
    { id: 'sales', name: 'Sales Module', description: 'Sales pipeline and CRM', icon: 'TrendingUp' },
    { id: 'accounting', name: 'Accounting Module', description: 'Financial management', icon: 'Calculator' },
    { id: 'reports', name: 'Reports Module', description: 'Analytics and reporting', icon: 'BarChart3' },
    { id: 'settings', name: 'Settings Module', description: 'System configuration', icon: 'Settings' }
  ];

  const [users, setUsers] = useState<UserType[]>([
    {
      id: '1',
      name: 'Althameem',
      email: 'althameem@marketlube.com',
      phone: '+91 98765 43210',
      role: 'Super Admin',
      teams: ['Performance Marketing', 'Social Media'],
      mainStatuses: ['Campaign Setup', 'Campaign Monitoring'],
      subStatuses: [],
      moduleAccess: { tasks: true, hr: true, sales: true, accounting: true, reports: true, settings: true },
      avatar: '',
      createdDate: '2024-01-01',
      lastActive: '2024-02-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@marketlube.com',
      phone: '+91 98765 43211',
      role: 'Admin',
      teams: ['UI/UX Team', 'Development Team'],
      mainStatuses: ['Wireframing', 'Design', 'Frontend Development'],
      subStatuses: [],
      moduleAccess: { tasks: true, hr: true, sales: false, accounting: false, reports: true, settings: true },
      avatar: '',
      createdDate: '2024-01-15',
      lastActive: '2024-02-14'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@marketlube.com',
      phone: '+91 98765 43212',
      role: 'Manager',
      teams: ['Development Team'],
      mainStatuses: ['Backend Development'],
      subStatuses: [],
      moduleAccess: { tasks: true, hr: false, sales: true, accounting: false, reports: true, settings: false },
      avatar: '',
      createdDate: '2024-01-20',
      lastActive: '2024-02-13'
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@marketlube.com',
      phone: '+91 98765 43213',
      role: 'Manager',
      teams: ['Performance Marketing'],
      mainStatuses: ['Campaign Setup', 'Campaign Monitoring'],
      subStatuses: [],
      moduleAccess: { tasks: true, hr: true, sales: true, accounting: false, reports: true, settings: false },
      avatar: '',
      createdDate: '2024-01-25',
      lastActive: '2024-02-12'
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@marketlube.com',
      phone: '+91 98765 43214',
      role: 'User',
      teams: ['Testing / QA'],
      mainStatuses: [],
      subStatuses: [],
      moduleAccess: { tasks: true, hr: false, sales: false, accounting: false, reports: false, settings: false },
      avatar: '',
      createdDate: '2024-02-01',
      lastActive: '2024-02-11'
    },
    {
      id: '6',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@marketlube.com',
      phone: '+91 98765 43215',
      role: 'User',
      teams: ['Video Production'],
      mainStatuses: [],
      subStatuses: [],
      moduleAccess: { tasks: true, hr: false, sales: false, accounting: false, reports: false, settings: false },
      avatar: '',
      createdDate: '2024-02-05',
      lastActive: '2024-02-10'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTeam = selectedTeamFilter === 'All Teams' || 
      user.teams.some(team => team === selectedTeamFilter);

    return matchesSearch && matchesTeam;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'role':
        return a.role.localeCompare(b.role);
      case 'team':
        return (a.teams[0] || '').localeCompare(b.teams[0] || '');
      default:
        return 0;
    }
  });

  const usersByRole = useMemo(() => {
    const grouped = sortedUsers.reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = [];
      }
      acc[user.role].push(user);
      return acc;
    }, {} as Record<Role, UserType[]>);
    return grouped;
  }, [sortedUsers]);

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleSaveUser = (userData: UserType) => {
    if (userData.id) {
      // Edit existing user
      setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
    } else {
      // Add new user
      const newUser = { ...userData, id: Date.now().toString() };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const getRoleColor = (role: Role) => {
    const colors = {
      'Super Admin': 'bg-red-100 text-red-700 border-red-200',
      'Admin': 'bg-blue-100 text-blue-700 border-blue-200',
      'Manager': 'bg-green-100 text-green-700 border-green-200',
      'User': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[role];
  };

  const getModuleBadges = (moduleAccess: Record<string, boolean>) => {
    const enabledModules = Object.entries(moduleAccess)
      .filter(([_, enabled]) => enabled)
      .map(([moduleId]) => modules.find(m => m.id === moduleId)?.name)
      .filter(Boolean);
    
    return enabledModules.slice(0, 3);
  };

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
          Roles & Access Management
        </h1>
        <p className="text-gray-600 font-poppins">
          Manage user roles, permissions, team assignments, and module access across your organization.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Search, Sort, Team Filter, and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm transition-all duration-200"
              />
            </div>

            {/* Team Filter Dropdown */}
            <TeamFilterDropdown
              selectedTeam={selectedTeamFilter}
              onTeamSelect={setSelectedTeamFilter}
              teams={teams}
            />

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm bg-white min-w-44 transition-all duration-200"
            >
              <option value="name">Sort by: A–Z</option>
              <option value="role">Sort by: Role</option>
              <option value="team">Sort by: Team</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-poppins font-medium transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 rounded-md text-sm font-poppins font-medium transition-all duration-200 ${
                  viewMode === 'kanban' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kanban View
              </button>
            </div>
          </div>

          {/* Right side - Add User Button */}
          <button 
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-poppins font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <Plus size={16} />
            Add New User
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">User</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Role</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Teams</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Module Access</th>
                  <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Last Active</th>
                  <th className="text-right px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-sm">
                          {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-poppins font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 font-poppins">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.teams.slice(0, 2).map(team => (
                          <span key={team} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-poppins">
                            {team}
                          </span>
                        ))}
                        {user.teams.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-poppins">
                            +{user.teams.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {getModuleBadges(user.moduleAccess).map(module => (
                          <span key={module} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-poppins">
                            {module}
                          </span>
                        ))}
                        {Object.values(user.moduleAccess).filter(Boolean).length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-poppins">
                            +{Object.values(user.moduleAccess).filter(Boolean).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-poppins">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete User"
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
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['Super Admin', 'Admin', 'Manager', 'User'] as Role[]).map(role => (
            <div key={role} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-semibold text-gray-900">{role}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${getRoleColor(role)}`}>
                  {usersByRole[role]?.length || 0}
                </span>
              </div>
              
              <div className="space-y-3">
                {(usersByRole[role] || []).map(user => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-xs">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-poppins font-medium text-gray-900 text-sm truncate">{user.name}</h4>
                        <p className="text-xs text-gray-500 font-poppins truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {user.teams.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {user.teams.slice(0, 2).map(team => (
                            <span key={team} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-poppins">
                              {team.length > 10 ? team.substring(0, 10) + '...' : team}
                            </span>
                          ))}
                          {user.teams.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-poppins">
                              +{user.teams.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {getModuleBadges(user.moduleAccess).slice(0, 2).map(module => (
                          <span key={module} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-poppins">
                            {module}
                          </span>
                        ))}
                        {Object.values(user.moduleAccess).filter(Boolean).length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-poppins">
                            +{Object.values(user.moduleAccess).filter(Boolean).length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs text-gray-500 font-poppins">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="Edit User"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedUsers.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600 font-poppins mb-6">
            {searchQuery || selectedTeamFilter !== 'All Teams'
              ? 'Try adjusting your search criteria or filters.' 
              : 'Get started by adding your first user.'
            }
          </p>
          {!searchQuery && selectedTeamFilter === 'All Teams' && (
            <button 
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center gap-2 mx-auto hover:scale-105"
            >
              <Plus size={20} />
              Add First User
            </button>
          )}
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
        teams={teams}
        mainStatuses={mainStatuses}
        modules={modules}
      />
    </div>
  );
};

export default RolesAccessPage;