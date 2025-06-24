import React, { useState } from 'react';
import { 
  User, Settings, LogOut, Shield, Crown, Bell, Users, Building, 
  CreditCard, Key, Eye, EyeOff, Save, X, Edit3, Mail, Phone, 
  MapPin, Calendar, Briefcase, Award, Activity, Database,
  Globe, Lock, Smartphone, Wifi, BarChart3, Download, Upload,
  FileText, Camera, Star, Heart, Zap, Target, TrendingUp
} from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';

interface SuperAdminProfileProps {
  onLogout?: () => void;
}

const SuperAdminProfile: React.FC<SuperAdminProfileProps> = ({ onLogout }) => {
  const { tenant, user } = useTenant();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences' | 'admin' | 'system'>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Althameem',
    lastName: user?.lastName || 'Khan',
    email: user?.email || 'althameem@digitalerp.com',
    phone: '+971 50 123 4567',
    location: 'Dubai, UAE',
    birthday: '1990-05-15',
    department: 'Executive',
    position: 'Super Administrator',
    bio: 'Super Administrator with full system access and oversight capabilities.',
    avatar: '',
    timezone: 'Asia/Dubai',
    language: 'English (US)',
    theme: 'light'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  const [adminStats] = useState({
    totalUsers: 245,
    activeUsers: 189,
    totalTeams: 12,
    systemUptime: '99.9%',
    storageUsed: '67%',
    monthlyRevenue: '$24,500',
    supportTickets: 8,
    pendingApprovals: 3
  });

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log('Saving profile:', profileData);
    setShowProfileModal(false);
  };

  const handleSecuritySave = () => {
    // Save security settings logic here
    console.log('Saving security settings:', securityData);
  };

  const PersonalTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-600">Upload a new avatar for your profile</p>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              <Upload className="w-4 h-4 inline mr-1" />
              Upload
            </button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={profileData.birthday}
              onChange={(e) => setProfileData({...profileData, birthday: e.target.value})}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={profileData.department}
              onChange={(e) => setProfileData({...profileData, department: e.target.value})}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <div className="relative">
            <Award className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={profileData.position}
              onChange={(e) => setProfileData({...profileData, position: e.target.value})}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-800">Change Password</h3>
        </div>
        <p className="text-sm text-yellow-700 mb-4">Ensure your account stays secure with a strong password.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            onClick={handleSecuritySave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Two-Factor Authentication</h3>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={securityData.twoFactorEnabled}
              onChange={(e) => setSecurityData({...securityData, twoFactorEnabled: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-green-700">
              {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        <p className="text-sm text-green-700">Add an extra layer of security to your account.</p>
      </div>

      {/* Security Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Security Preferences</h3>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h4 className="font-medium text-gray-900">Login Notifications</h4>
            <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
          </div>
          <input
            type="checkbox"
            checked={securityData.loginNotifications}
            onChange={(e) => setSecurityData({...securityData, loginNotifications: e.target.checked})}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="font-medium text-gray-900">Session Timeout</h4>
            <p className="text-sm text-gray-600">Automatically log out after period of inactivity</p>
          </div>
          <select
            value={securityData.sessionTimeout}
            onChange={(e) => setSecurityData({...securityData, sessionTimeout: e.target.value})}
            className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <div className="relative">
            <Globe className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={profileData.timezone}
              onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={profileData.language}
            onChange={(e) => setProfileData({...profileData, language: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="English (US)">English (US)</option>
            <option value="English (UK)">English (UK)</option>
            <option value="Arabic">العربية</option>
            <option value="French">Français</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
        <div className="flex gap-4">
          <button
            onClick={() => setProfileData({...profileData, theme: 'light'})}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg ${
              profileData.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            Light
          </button>
          <button
            onClick={() => setProfileData({...profileData, theme: 'dark'})}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg ${
              profileData.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="w-4 h-4 bg-gray-800 rounded"></div>
            Dark
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
        
        {[
          { id: 'email_notifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
          { id: 'push_notifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
          { id: 'task_reminders', label: 'Task Reminders', desc: 'Get reminded about upcoming tasks' },
          { id: 'team_updates', label: 'Team Updates', desc: 'Notifications about team activities' },
          { id: 'system_alerts', label: 'System Alerts', desc: 'Important system notifications' }
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const AdminTab = () => (
    <div className="space-y-6">
      {/* Admin Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Users</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{adminStats.totalUsers}</div>
          <div className="text-sm text-blue-600">{adminStats.activeUsers} active</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">System Uptime</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{adminStats.systemUptime}</div>
          <div className="text-sm text-green-600">Last 30 days</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Revenue</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{adminStats.monthlyRevenue}</div>
          <div className="text-sm text-purple-600">This month</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Pending</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{adminStats.pendingApprovals}</div>
          <div className="text-sm text-red-600">Need attention</div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Quick Admin Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Manage Users</div>
              <div className="text-sm text-gray-600">Add, edit, or remove users</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Building className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">Team Management</div>
              <div className="text-sm text-gray-600">Configure teams and roles</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <Database className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-gray-900">System Backup</div>
              <div className="text-sm text-gray-600">Backup and restore data</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-600">View system analytics</div>
            </div>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">System Health</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Storage Usage</span>
            <span className="text-sm text-gray-600">{adminStats.storageUsed}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: adminStats.storageUsed}}></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active Sessions</span>
            <span className="text-sm text-gray-600">{adminStats.activeUsers} users</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{width: '77%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const SystemTab = () => (
    <div className="space-y-6">
      {/* System Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Version:</span>
            <span className="ml-2 font-medium">v2.1.3</span>
          </div>
          <div>
            <span className="text-gray-600">Environment:</span>
            <span className="ml-2 font-medium">Production</span>
          </div>
          <div>
            <span className="text-gray-600">Database:</span>
            <span className="ml-2 font-medium">PostgreSQL 13.4</span>
          </div>
          <div>
            <span className="text-gray-600">Server:</span>
            <span className="ml-2 font-medium">AWS us-east-1</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          {[
            { icon: Users, text: 'New user registration: jane.doe@company.com', time: '2 minutes ago', color: 'text-blue-600' },
            { icon: Shield, text: 'Security scan completed successfully', time: '15 minutes ago', color: 'text-green-600' },
            { icon: Database, text: 'Automated backup completed', time: '1 hour ago', color: 'text-purple-600' },
            { icon: Wifi, text: 'Server maintenance completed', time: '3 hours ago', color: 'text-orange-600' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
              <div className="flex-1">
                <div className="text-sm text-gray-900">{activity.text}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
        <button className="flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>
    </div>
  );

  if (!user || !tenant) {
    return (
      <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
    );
  }

  return (
    <>
      {/* Profile Button */}
      <button
        onClick={() => setShowProfileModal(true)}
        className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-all duration-200 group relative"
      >
        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        
        {/* Admin Badge */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
          <Crown className="w-2.5 h-2.5 text-yellow-800" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Super Admin Profile
        </div>
      </button>

      {/* Profile Modal - Comprehensive Admin Interface */}
      {showProfileModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
          style={{ 
            backdropFilter: 'blur(12px) saturate(150%)', 
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            background: 'rgba(0, 0, 0, 0.7)'
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Super Admin Profile</h2>
                    <p className="text-blue-100">{user.firstName} {user.lastName} • {tenant?.companyName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex h-[600px]">
              {/* Sidebar Navigation */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <nav className="p-4 space-y-1 flex-1">
                  {[
                    { id: 'personal', label: 'Personal Info', icon: User },
                    { id: 'security', label: 'Security', icon: Shield },
                    { id: 'preferences', label: 'Preferences', icon: Settings },
                    { id: 'admin', label: 'Admin Panel', icon: Crown },
                    { id: 'system', label: 'System', icon: Database }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'personal' && <PersonalTab />}
                {activeTab === 'security' && <SecurityTab />}
                {activeTab === 'preferences' && <PreferencesTab />}
                {activeTab === 'admin' && <AdminTab />}
                {activeTab === 'system' && <SystemTab />}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminProfile; 