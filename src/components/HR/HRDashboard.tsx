import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, TrendingUp, Clock, UserPlus, Award, CheckCircle, 
  Target, DollarSign, Briefcase, UserX, Building, BarChart3, 
  Activity, Download, Eye, ArrowUp, ArrowDown, Star, Heart,
  Coffee, AlertTriangle, BookOpen, Plus, Layout, UserCheck,
  FileText, Settings, PieChart, Search, Filter, Grid3X3, List,
  Edit2, Trash2, Phone, Mail, MapPin, Copy, X, Share2, Building2,
  CalendarDays, CreditCard, Calculator, Banknote, ShieldCheck, 
  TrendingDown, Zap, ChevronRight, ChevronLeft, CheckSquare, AlertCircle
} from 'lucide-react';
import DateRangePicker, { DateRange } from '../Common/DateRangePicker';

// Employee interface
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
  employeeId: string;
  manager: string;
  lastActive: string;
  teams: string[];
  moduleAccess: string[];
}

// Mock employees data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Althameem Khan',
    position: 'Super Admin',
    department: 'Management',
    email: 'althameem@marketlube.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    workType: 'Full-time',
    status: 'Active',
    joinDate: '2023-01-15',
    salary: 120000,
    avatar: '',
    employeeId: 'EMP001',
    manager: 'CEO',
    lastActive: '2024-01-20',
    teams: ['Performance Marketing', 'Social Media'],
    moduleAccess: ['Task Board', 'HR Module', 'Sales Module', 'Reports Module']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Senior Developer',
    department: 'Engineering',
    email: 'sarah.johnson@marketlube.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    workType: 'Full-time',
    status: 'Active',
    joinDate: '2023-03-22',
    salary: 95000,
    avatar: '',
    employeeId: 'EMP002',
    manager: 'Althameem Khan',
    lastActive: '2024-01-20',
    teams: ['Development Team'],
    moduleAccess: ['Task Board', 'Reports Module']
  },
  {
    id: '3',
    name: 'Mike Chen',
    position: 'Sales Manager',
    department: 'Sales',
    email: 'mike.chen@marketlube.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL',
    workType: 'Full-time',
    status: 'Active',
    joinDate: '2023-02-10',
    salary: 85000,
    avatar: '',
    employeeId: 'EMP003',
    manager: 'Althameem Khan',
    lastActive: '2024-01-19',
    teams: ['Development Team'],
    moduleAccess: ['Sales Module', 'Reports Module']
  },
  {
    id: '4',
    name: 'Emily Davis',
    position: 'Marketing Specialist',
    department: 'Marketing',
    email: 'emily.davis@marketlube.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    workType: 'Full-time',
    status: 'Active',
    joinDate: '2023-04-15',
    salary: 70000,
    avatar: '',
    employeeId: 'EMP004',
    manager: 'Mike Chen',
    lastActive: '2024-01-20',
    teams: ['Performance Marketing'],
    moduleAccess: ['Task Board', 'Sales Module']
  },
  {
    id: '5',
    name: 'David Kim',
    position: 'UX Designer',
    department: 'Design',
    email: 'david.kim@marketlube.com',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, WA',
    workType: 'Full-time',
    status: 'On Leave',
    joinDate: '2023-05-20',
    salary: 80000,
    avatar: '',
    employeeId: 'EMP005',
    manager: 'Sarah Johnson',
    lastActive: '2024-01-18',
    teams: ['UI/UX Team'],
    moduleAccess: ['Task Board']
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    position: 'Video Editor',
    department: 'Media',
    email: 'lisa.thompson@marketlube.com',
    phone: '+1 (555) 678-9012',
    location: 'Los Angeles, CA',
    workType: 'Part-time',
    status: 'Active',
    joinDate: '2023-06-10',
    salary: 65000,
    avatar: '',
    employeeId: 'EMP006',
    manager: 'Emily Davis',
    lastActive: '2024-01-19',
    teams: ['Video Production'],
    moduleAccess: ['Task Board']
  },
  {
    id: '7',
    name: 'Alex Rodriguez',
    position: 'QA Engineer',
    department: 'Quality Assurance',
    email: 'alex.rodriguez@marketlube.com',
    phone: '+1 (555) 789-0123',
    location: 'Miami, FL',
    workType: 'Full-time',
    status: 'Active',
    joinDate: '2023-07-05',
    salary: 75000,
    avatar: '',
    employeeId: 'EMP007',
    manager: 'Sarah Johnson',
    lastActive: '2024-01-20',
    teams: ['Testing / QA'],
    moduleAccess: ['Task Board', 'Reports Module']
  },
  {
    id: '8',
    name: 'Jennifer Wu',
    position: 'HR Specialist',
    department: 'HR',
    email: 'jennifer.wu@marketlube.com',
    phone: '+1 (555) 890-1234',
    location: 'Boston, MA',
    workType: 'Full-time',
    status: 'Active',
    joinDate: '2023-08-12',
    salary: 68000,
    avatar: '',
    employeeId: 'EMP008',
    manager: 'Althameem Khan',
    lastActive: '2024-01-20',
    teams: ['Performance Marketing'],
    moduleAccess: ['HR Module', 'Reports Module']
  }
];

// Mock data for comprehensive HR analytics
const mockHRData = {
  overview: {
    totalEmployees: 247,
    activeEmployees: 235,
    newHires: 12,
    pendingHires: 8,
    departments: 8,
    avgSalary: 78500,
    turnoverRate: 4.2,
    satisfactionScore: 4.3
  },
  departments: [
    { name: 'Engineering', employees: 85, budget: 2400000, growth: 12, satisfaction: 4.5 },
    { name: 'Sales', employees: 42, budget: 1680000, growth: 8, satisfaction: 4.2 },
    { name: 'Marketing', employees: 28, budget: 1120000, growth: 15, satisfaction: 4.4 },
    { name: 'HR', employees: 15, budget: 600000, growth: 5, satisfaction: 4.6 },
    { name: 'Finance', employees: 22, budget: 880000, growth: -2, satisfaction: 4.1 },
    { name: 'Operations', employees: 35, budget: 1400000, growth: 10, satisfaction: 4.3 },
    { name: 'Design', employees: 18, budget: 720000, growth: 20, satisfaction: 4.7 },
    { name: 'Legal', employees: 2, budget: 240000, growth: 0, satisfaction: 4.0 }
  ],
  recentHires: [
    { name: 'Sarah Chen', position: 'Senior Developer', department: 'Engineering', startDate: '2024-01-15', photo: 'SC' },
    { name: 'Marcus Johnson', position: 'Sales Manager', department: 'Sales', startDate: '2024-01-10', photo: 'MJ' },
    { name: 'Elena Rodriguez', position: 'Marketing Specialist', department: 'Marketing', startDate: '2024-01-08', photo: 'ER' },
    { name: 'David Kim', position: 'UX Designer', department: 'Design', startDate: '2024-01-05', photo: 'DK' }
  ],
  attendanceToday: {
    present: 223,
    late: 8,
    absent: 4,
    wfh: 12,
    onLeave: 3
  },
  performance: {
    excellent: 45,
    good: 142,
    average: 38,
    needsImprovement: 10
  },
  recruitment: {
    openPositions: 15,
    applicants: 342,
    interviews: 28,
    offers: 8,
    stages: [
      { name: 'Application Review', count: 89 },
      { name: 'Phone Screening', count: 42 },
      { name: 'Technical Interview', count: 28 },
      { name: 'Final Interview', count: 15 },
      { name: 'Offer Extended', count: 8 }
    ]
  },
  leaveRequests: [
    { name: 'Alice Wilson', type: 'Vacation', days: 5, status: 'Pending', startDate: '2024-01-20' },
    { name: 'Bob Martinez', type: 'Sick Leave', days: 2, status: 'Approved', startDate: '2024-01-18' },
    { name: 'Carol Thompson', type: 'Personal', days: 1, status: 'Pending', startDate: '2024-01-22' }
  ],
  topPerformers: [
    { name: 'Sarah Johnson', department: 'Engineering', score: 97, improvement: 5 },
    { name: 'Michael Chen', department: 'Sales', score: 94, improvement: 12 },
    { name: 'Jessica Lee', department: 'Marketing', score: 92, improvement: 8 },
    { name: 'Robert Kim', department: 'Design', score: 90, improvement: 3 }
  ],
  upcomingEvents: [
    { title: 'Team Building Workshop', date: '2024-01-25', participants: 45, type: 'training' },
    { title: 'Q1 Performance Reviews', date: '2024-02-01', participants: 235, type: 'review' },
    { title: 'New Employee Orientation', date: '2024-01-30', participants: 12, type: 'orientation' },
    { title: 'Leadership Training', date: '2024-02-05', participants: 25, type: 'training' }
  ]
};

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: number;
}

interface HRDashboardProps {
  defaultTab?: 'dashboard' | 'directory' | 'attendance' | 'leave' | 'recruitment' | 'performance' | 'payroll' | 'documents' | 'reports' | 'employee-hub' | 'settings';
}

const HRDashboard: React.FC<HRDashboardProps> = ({ defaultTab = 'dashboard' }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Date filtering state
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: 'all',
    startDate: '2020-01-01',
    endDate: '2030-12-31'
  });
  
  // View mode and filtering for Directory and Attendance
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Recruitment-related state
  const [recruitmentView, setRecruitmentView] = useState<'positions' | 'applications' | 'resume-bank'>('positions');
  const [showCreatePosition, setShowCreatePosition] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);

  // Leave management state
  const [leaveView, setLeaveView] = useState<'all' | 'pending' | 'approved' | 'calendar'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date(2024, 1)); // February 2024
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Comprehensive leave data for calendar
  const leaveData: { [key: string]: Array<{ name: string; department: string; type: string; status: string; reason: string }> } = {
    // February 2024 data
    '2024-02-01': [],
    '2024-02-02': [],
    '2024-02-03': [],
    '2024-02-04': [],
    '2024-02-05': [
      { name: 'Alice Martin', department: 'Marketing', type: 'Annual Leave', status: 'Approved', reason: 'Long weekend getaway' }
    ],
    '2024-02-06': [
      { name: 'Alice Martin', department: 'Marketing', type: 'Annual Leave', status: 'Approved', reason: 'Long weekend getaway' }
    ],
    '2024-02-07': [],
    '2024-02-08': [
      { name: 'Robert Chen', department: 'Design', type: 'Sick Leave', status: 'Approved', reason: 'Doctor appointment' }
    ],
    '2024-02-09': [
      { name: 'Robert Chen', department: 'Design', type: 'Sick Leave', status: 'Approved', reason: 'Recovery day' }
    ],
    '2024-02-10': [
      { name: 'Mike Chen', department: 'Sales', type: 'Sick Leave', status: 'Approved', reason: 'Medical appointment' }
    ],
    '2024-02-11': [
      { name: 'Mike Chen', department: 'Sales', type: 'Sick Leave', status: 'Approved', reason: 'Medical follow-up' }
    ],
    '2024-02-12': [
      { name: 'Jennifer Wu', department: 'Engineering', type: 'Personal Leave', status: 'Pending', reason: 'Family matters' }
    ],
    '2024-02-13': [],
    '2024-02-14': [
      { name: 'David Park', department: 'Operations', type: 'Annual Leave', status: 'Pending', reason: 'Valentine\'s Day celebration' }
    ],
    '2024-02-15': [
      { name: 'Sarah Johnson', department: 'Engineering', type: 'Annual Leave', status: 'Pending', reason: 'Family vacation' }
    ],
    '2024-02-16': [
      { name: 'Sarah Johnson', department: 'Engineering', type: 'Annual Leave', status: 'Pending', reason: 'Family vacation' }
    ],
    '2024-02-17': [
      { name: 'Sarah Johnson', department: 'Engineering', type: 'Annual Leave', status: 'Pending', reason: 'Family vacation' }
    ],
    '2024-02-18': [
      { name: 'Sarah Johnson', department: 'Engineering', type: 'Annual Leave', status: 'Pending', reason: 'Family vacation' }
    ],
    '2024-02-19': [
      { name: 'Sarah Johnson', department: 'Engineering', type: 'Annual Leave', status: 'Pending', reason: 'Family vacation' },
      { name: 'Laura White', department: 'Marketing', type: 'Personal Leave', status: 'Approved', reason: 'Moving to new apartment' }
    ],
    '2024-02-20': [
      { name: 'Emily Davis', department: 'Marketing', type: 'Personal Leave', status: 'Pending', reason: 'Personal matters' }
    ],
    '2024-02-21': [
      { name: 'Tom Wilson', department: 'Sales', type: 'Annual Leave', status: 'Approved', reason: 'Ski trip' }
    ],
    '2024-02-22': [
      { name: 'Tom Wilson', department: 'Sales', type: 'Annual Leave', status: 'Approved', reason: 'Ski trip' },
      { name: 'Maria Garcia', department: 'Design', type: 'Sick Leave', status: 'Pending', reason: 'Flu symptoms' }
    ],
    '2024-02-23': [
      { name: 'Tom Wilson', department: 'Sales', type: 'Annual Leave', status: 'Approved', reason: 'Ski trip' }
    ],
    '2024-02-24': [],
    '2024-02-25': [],
    '2024-02-26': [
      { name: 'Kevin Lee', department: 'Engineering', type: 'Personal Leave', status: 'Approved', reason: 'Home renovation' }
    ],
    '2024-02-27': [
      { name: 'Kevin Lee', department: 'Engineering', type: 'Personal Leave', status: 'Approved', reason: 'Home renovation' }
    ],
    '2024-02-28': [
      { name: 'Sophie Turner', department: 'Operations', type: 'Annual Leave', status: 'Pending', reason: 'Birthday celebration' }
    ],
    '2024-02-29': [
      { name: 'Alex Rodriguez', department: 'Operations', type: 'Annual Leave', status: 'Approved', reason: 'Leap day celebration' }
    ]
  };

  // Helper function to get leave data for a specific date
  const getLeaveDataForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaveData[dateStr] || [];
  };

  // Helper function to get day's leave status
  const getDayLeaveStatus = (leaves: any[]) => {
    if (leaves.length === 0) return 'none';
    const hasApproved = leaves.some(leave => leave.status === 'Approved');
    const hasPending = leaves.some(leave => leave.status === 'Pending');
    if (hasApproved && hasPending) return 'mixed';
    if (hasApproved) return 'approved';
    if (hasPending) return 'pending';
    return 'none';
  };

  // Sync activeTab with defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Filter employees based on search and filters
  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter;
    
    // Date filtering based on joinDate
    const employeeJoinDate = new Date(employee.joinDate);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const matchesDateRange = employeeJoinDate >= startDate && employeeJoinDate <= endDate;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDateRange;
  });

  // Get unique departments and statuses for filters
  const uniqueDepartments = ['All', ...Array.from(new Set(mockEmployees.map(emp => emp.department)))];
  const uniqueStatuses = ['All', ...Array.from(new Set(mockEmployees.map(emp => emp.status)))];

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Leave': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getWorkTypeColor = (workType: string) => {
    switch (workType) {
      case 'Full-time': return 'bg-blue-100 text-blue-700';
      case 'Part-time': return 'bg-purple-100 text-purple-700';
      case 'Contract': return 'bg-orange-100 text-orange-700';
      case 'Intern': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const timeRanges = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    ...mockHRData.departments.map(dept => ({ value: dept.name.toLowerCase(), label: dept.name }))
  ];

  // KPI Cards Component
  const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 text-${color}-600`} />
            <h3 className="font-poppins font-medium text-gray-700 text-sm">{title}</h3>
          </div>
          <div className="text-2xl font-poppins font-bold text-gray-900">{value}</div>
          <div className="text-sm font-poppins text-gray-500 mt-1">{subtitle}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-poppins font-medium ${
            trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );

  // Department Card Component
  const DepartmentCard = ({ department }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-poppins font-semibold text-gray-900">{department.name}</h4>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-poppins text-gray-600">{department.satisfaction}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-poppins text-gray-600">Employees</span>
          <span className="font-poppins font-medium text-gray-900">{department.employees}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-poppins text-gray-600">Budget</span>
          <span className="font-poppins font-medium text-gray-900">${(department.budget / 1000000).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-poppins text-gray-600">Growth</span>
          <span className={`font-poppins font-medium ${department.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {department.growth >= 0 ? '+' : ''}{department.growth}%
          </span>
        </div>
      </div>
    </div>
  );

  const getTabTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'HR Dashboard';
      case 'directory': return 'Team Directory';
      case 'attendance': return 'Attendance';
      case 'leave': return 'Leave Management';
      case 'recruitment': return 'Recruitment';
      case 'performance': return 'Performance';
      case 'payroll': return 'Payroll';
      case 'documents': return 'Documents';
      case 'reports': return 'HR Reports';
      case 'employee-hub': return 'Employee Hub';
      case 'settings': return 'HR Settings';
      default: return 'HR Dashboard';
    }
  };

  const getTabDescription = () => {
    switch(activeTab) {
      case 'dashboard': return 'Comprehensive human resources analytics and insights';
      case 'directory': return 'Manage team members and organizational structure';
      case 'attendance': return 'Track and manage employee attendance';
      case 'leave': return 'Manage leave requests and approvals';
      case 'recruitment': return 'Handle recruitment pipeline and hiring process';
      case 'performance': return 'Monitor and evaluate employee performance';
      case 'payroll': return 'Manage payroll and compensation';
      case 'documents': return 'Handle HR documents and policies';
      case 'reports': return 'Generate HR analytics and reports';
      case 'employee-hub': return 'Employee self-service portal';
      case 'settings': return 'Configure HR module settings';
      default: return 'Comprehensive human resources analytics and insights';
    }
  };

  const renderRecruitmentTab = () => {

    // Mock positions data with shareable links
    const positions = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 'Development',
        location: 'Remote',
        type: 'Full-time',
        experience: '5-7 years',
        salary: '$80K - $120K',
        status: 'Active',
        applications: 24,
        postedDate: '2024-01-15',
        shareableLink: 'https://careers.marketlube.com/apply/senior-frontend-dev-001',
        description: 'Join our dynamic development team and work on cutting-edge web applications.',
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills']
      },
      {
        id: 2,
        title: 'Product Marketing Manager',
        department: 'Marketing',
        location: 'New York, NY',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '$70K - $95K',
        status: 'Active',
        applications: 18,
        postedDate: '2024-01-10',
        shareableLink: 'https://careers.marketlube.com/apply/product-marketing-mgr-002',
        description: 'Drive product marketing strategies and go-to-market initiatives.',
        requirements: ['Product marketing experience', 'Campaign management', 'Analytics skills']
      },
      {
        id: 3,
        title: 'UX/UI Designer',
        department: 'Design',
        location: 'San Francisco, CA',
        type: 'Contract',
        experience: '2-4 years',
        salary: '$60K - $85K',
        status: 'Active',
        applications: 31,
        postedDate: '2024-01-12',
        shareableLink: 'https://careers.marketlube.com/apply/ux-ui-designer-003',
        description: 'Create beautiful and intuitive user experiences for our products.',
        requirements: ['Figma proficiency', 'User research experience', 'Portfolio required']
      }
    ];

    // Mock applications data
    const applications = [
      {
        id: 1,
        candidateName: 'Alex Thompson',
        email: 'alex@email.com',
        positionTitle: 'Senior Frontend Developer',
        appliedDate: '2024-01-18',
        status: 'Under Review',
        rating: 4.5,
        experience: '6 years',
        location: 'Seattle, WA',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL']
      },
      {
        id: 2,
        candidateName: 'Sarah Martinez',
        email: 'sarah@email.com',
        positionTitle: 'Product Marketing Manager',
        appliedDate: '2024-01-16',
        status: 'Shortlisted',
        rating: 4.2,
        experience: '4 years',
        location: 'New York, NY',
        skills: ['Product Marketing', 'Analytics', 'Campaign Management']
      },
      {
        id: 3,
        candidateName: 'Michael Chen',
        email: 'michael@email.com',
        positionTitle: 'UX/UI Designer',
        appliedDate: '2024-01-15',
        status: 'Interview Scheduled',
        rating: 4.7,
        experience: '5 years',
        location: 'Los Angeles, CA',
        skills: ['Figma', 'User Research', 'Prototyping']
      }
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Under Review': return 'bg-blue-100 text-blue-800';
        case 'Shortlisted': return 'bg-purple-100 text-purple-800';
        case 'Interview Scheduled': return 'bg-orange-100 text-orange-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    return (
      <div className="space-y-6">
        {/* View Toggle and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setRecruitmentView('positions')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                recruitmentView === 'positions'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Open Positions
            </button>
            <button
              onClick={() => setRecruitmentView('applications')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                recruitmentView === 'applications'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setRecruitmentView('resume-bank')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                recruitmentView === 'resume-bank'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resume Bank
            </button>
          </div>
          
          <button
            onClick={() => setShowCreatePosition(true)}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              recruitmentView === 'positions'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={recruitmentView !== 'positions'}
          >
            Create Position
          </button>
        </div>

        {/* Open Positions View */}
        {recruitmentView === 'positions' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Positions</p>
                    <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Positions</p>
                    <p className="text-2xl font-bold text-green-600">{positions.filter(p => p.status === 'Active').length}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-purple-600">{positions.reduce((sum, p) => sum + p.applications, 0)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Applications</p>
                    <p className="text-2xl font-bold text-orange-600">{Math.round(positions.reduce((sum, p) => sum + p.applications, 0) / positions.length)}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Positions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {positions.map((position) => (
                <div key={position.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{position.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {position.department}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {position.location}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{position.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(position.status)}`}>
                        {position.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <span className="ml-1 text-gray-600">{position.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Experience:</span>
                        <span className="ml-1 text-gray-600">{position.experience}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Salary:</span>
                        <span className="ml-1 text-gray-600">{position.salary}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Applications:</span>
                        <span className="ml-1 text-blue-600 font-medium">{position.applications}</span>
                      </div>
                    </div>

                    {/* Shareable Link */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700 mb-1">Shareable Application Link</p>
                          <p className="text-sm text-gray-600 truncate">{position.shareableLink}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(position.shareableLink)}
                          className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                          title="Copy link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPosition(position)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications View */}
        {recruitmentView === 'applications' && (
          <div className="space-y-6">
            {/* Applications List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                              {application.candidateName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{application.candidateName}</div>
                              <div className="text-xs text-gray-500">{application.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{application.positionTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">{application.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            <button className="text-green-600 hover:text-green-900">Interview</button>
                            <button className="text-red-600 hover:text-red-900">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Resume Bank View */}
        {recruitmentView === 'resume-bank' && (
          <div className="space-y-6">
            {/* Resume Bank Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Resume Bank</h3>
                  <p className="text-sm text-gray-500">Comprehensive database of all candidates and resumes with advanced filtering</p>
                </div>
                <div className="text-sm text-gray-600">
                  Total Candidates: <span className="font-semibold text-gray-900">{applications.length}</span>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Python"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>All Levels</option>
                      <option>0-2 years</option>
                      <option>3-5 years</option>
                      <option>6-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="City, State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applied For</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>All Positions</option>
                      {positions.map(pos => (
                        <option key={pos.id} value={pos.id}>{pos.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search resumes..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {applications.map((candidate) => (
                <div key={candidate.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                        {candidate.candidateName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-gray-900">{candidate.candidateName}</h4>
                        <p className="text-xs text-gray-500">{candidate.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{candidate.rating}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Applied for: <span className="font-medium">{candidate.positionTitle}</span></p>
                    <p className="text-sm text-gray-600 mb-2">Experience: <span className="font-medium">{candidate.experience}</span></p>
                    <p className="text-xs text-gray-500">Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{candidate.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Download Resume">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="View Profile">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="Send Email">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
              <div className="flex items-center text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{applications.length}</span> of{' '}
                <span className="font-medium">{applications.length}</span> candidates
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Position Modal */}
        {showCreatePosition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Position</h3>
                  <button
                    onClick={() => setShowCreatePosition(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Development</option>
                        <option>Design</option>
                        <option>Marketing</option>
                        <option>Sales</option>
                        <option>Operations</option>
                        <option>HR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Remote, New York, NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCreatePosition(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Create Position & Generate Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}



        {/* Position Details Modal */}
        {selectedPosition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedPosition.title}</h3>
                    <p className="text-sm text-gray-500">{selectedPosition.department} • {selectedPosition.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPosition(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Job Description</h4>
                      <p className="text-sm text-gray-700">{selectedPosition.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {selectedPosition.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Shareable Application Link</h4>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          value={selectedPosition.shareableLink}
                          readOnly
                          className="flex-1 bg-transparent text-sm text-gray-700"
                        />
                        <button
                          onClick={() => copyToClipboard(selectedPosition.shareableLink)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Position Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{selectedPosition.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{selectedPosition.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Salary:</span>
                          <span className="font-medium">{selectedPosition.salary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPosition.status)}`}>
                            {selectedPosition.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Applications</h4>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedPosition.applications}</div>
                        <div className="text-sm text-gray-600">Total Applications</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Header - Same design as Sales module */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {getTabTitle()}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {getTabDescription()}
            </p>
          </div>
          
          {/* Tab Navigation - Same style as Sales */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'dashboard' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layout size={16} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('directory')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'directory' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={16} />
                Directory
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'attendance' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserCheck size={16} />
                Attendance
              </button>
              <button
                onClick={() => setActiveTab('recruitment')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'recruitment' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserPlus size={16} />
                Recruitment
              </button>
              <button
                onClick={() => setActiveTab('leave')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'leave' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CalendarDays size={16} />
                Leave
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'performance' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp size={16} />
                Performance
              </button>
              <button
                onClick={() => setActiveTab('payroll')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'payroll' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard size={16} />
                Payroll
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'reports' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 size={16} />
                Reports
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'settings' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Filters moved within tab content */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
                <select 
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-poppins text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Employees"
              value={mockHRData.overview.totalEmployees}
              subtitle={`${mockHRData.overview.activeEmployees} active`}
              icon={Users}
              color="blue"
              trend={5.2}
            />
            <KPICard
              title="New Hires"
              value={mockHRData.overview.newHires}
              subtitle="This month"
              icon={UserPlus}
              color="green"
              trend={12.5}
            />
            <KPICard
              title="Avg Salary"
              value={`$${(mockHRData.overview.avgSalary / 1000).toFixed(0)}K`}
              subtitle="Annual compensation"
              icon={DollarSign}
              color="purple"
              trend={3.8}
            />
            <KPICard
              title="Satisfaction"
              value={mockHRData.overview.satisfactionScore}
              subtitle="Out of 5.0"
              icon={Heart}
              color="pink"
              trend={2.1}
            />
          </div>

          {/* Department Overview & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Departments Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-poppins font-semibold text-gray-900">Department Overview</h2>
                  <button className="text-blue-600 font-poppins text-sm hover:text-blue-700 transition-colors duration-200">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockHRData.departments.slice(0, 4).map((dept, index) => (
                    <DepartmentCard key={index} department={dept} />
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Hires */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-poppins font-semibold text-gray-900">Recent Hires</h2>
                <button className="text-blue-600 font-poppins text-sm hover:text-blue-700 transition-colors duration-200">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {mockHRData.recentHires.map((hire, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-poppins font-medium text-sm">
                      {hire.photo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-poppins font-medium text-gray-900 text-sm truncate">{hire.name}</div>
                      <div className="font-poppins text-gray-600 text-xs">{hire.position}</div>
                      <div className="font-poppins text-gray-500 text-xs">{hire.department}</div>
                    </div>
                    <div className="text-xs font-poppins text-gray-500">
                      {new Date(hire.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Overview & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Attendance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-poppins font-semibold text-gray-900 mb-6">Today's Attendance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-poppins font-bold text-green-600">{mockHRData.attendanceToday.present}</div>
                  <div className="text-sm font-poppins text-green-700">Present</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="text-2xl font-poppins font-bold text-yellow-600">{mockHRData.attendanceToday.late}</div>
                  <div className="text-sm font-poppins text-yellow-700">Late</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-2xl font-poppins font-bold text-red-600">{mockHRData.attendanceToday.absent}</div>
                  <div className="text-sm font-poppins text-red-700">Absent</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-poppins font-bold text-blue-600">{mockHRData.attendanceToday.wfh}</div>
                  <div className="text-sm font-poppins text-blue-700">WFH</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-poppins font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left">
                  <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-poppins font-medium text-gray-900 text-sm">Add Employee</div>
                  <div className="font-poppins text-gray-600 text-xs">Onboard new team member</div>
                </button>
                <button className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left">
                  <Calendar className="w-6 h-6 text-green-600 mb-2" />
                  <div className="font-poppins font-medium text-gray-900 text-sm">Schedule Review</div>
                  <div className="font-poppins text-gray-600 text-xs">Performance evaluation</div>
                </button>
                <button className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
                  <Award className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="font-poppins font-medium text-gray-900 text-sm">Recognition</div>
                  <div className="font-poppins text-gray-600 text-xs">Employee rewards</div>
                </button>
                <button className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left">
                  <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="font-poppins font-medium text-gray-900 text-sm">Generate Report</div>
                  <div className="font-poppins text-gray-600 text-xs">Analytics & insights</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                  />
                </div>

                {/* Date Range Filter */}
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  className="min-w-48"
                />

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
                >
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'All Status' : status}
                    </option>
                  ))}
                </select>

                {/* Department Filter */}
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
                >
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'All' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'card' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Card View"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
                  <Plus size={16} />
                  Add Employee
                </button>
              </div>
            </div>
          </div>

          {/* Employee Directory Content */}
          {viewMode === 'card' ? (
            /* Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-poppins font-bold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-poppins font-semibold text-gray-900 truncate">{employee.name}</h3>
                      <p className="text-sm text-gray-600 font-poppins truncate">{employee.position}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span className="font-poppins text-gray-600 truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span className="font-poppins text-gray-600">{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="font-poppins text-gray-600 truncate">{employee.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${getWorkTypeColor(employee.workType)}`}>
                      {employee.workType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs text-gray-500 font-poppins">
                      ID: {employee.employeeId}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200" title="View Details">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200" title="Edit">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Employee</th>
                      <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Department</th>
                      <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Contact</th>
                      <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                      <th className="text-left px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Work Type</th>
                      <th className="text-right px-6 py-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-poppins font-bold text-sm">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-poppins font-medium text-gray-900 text-sm truncate">{employee.name}</div>
                              <div className="text-sm text-gray-500 font-poppins truncate">{employee.position}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-poppins text-gray-900">{employee.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-poppins text-gray-900">{employee.email}</div>
                            <div className="text-sm font-poppins text-gray-500">{employee.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${getWorkTypeColor(employee.workType)}`}>
                            {employee.workType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="View Details">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200" title="Edit">
                              <Edit2 size={16} />
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
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
                No employees found
              </h3>
              <p className="text-gray-600 font-poppins mb-6">
                {searchQuery || statusFilter !== 'All' || departmentFilter !== 'All'
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'Get started by adding your first employee.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Attendance Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard
              title="Present Today"
              value={mockHRData.attendanceToday.present}
              subtitle={`${((mockHRData.attendanceToday.present / mockHRData.overview.totalEmployees) * 100).toFixed(1)}% attendance rate`}
              icon={CheckCircle}
              color="green"
              trend={2.1}
            />
            <KPICard
              title="Late Arrivals"
              value={mockHRData.attendanceToday.late}
              subtitle="Improvement needed"
              icon={Clock}
              color="yellow"
              trend={-5.2}
            />
            <KPICard
              title="Work From Home"
              value={mockHRData.attendanceToday.wfh}
              subtitle="Remote workers"
              icon={Building}
              color="blue"
              trend={15.3}
            />
            <KPICard
              title="On Leave"
              value={mockHRData.attendanceToday.onLeave}
              subtitle="Approved leaves"
              icon={Coffee}
              color="purple"
              trend={0}
            />
          </div>

          {/* Employee Attendance List with View Toggle */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-semibold text-gray-900">Employee Attendance</h2>
                  <p className="text-sm text-gray-600 font-poppins mt-1">Today's attendance overview</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('card')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === 'card' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Card View"
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="List View"
                    >
                      <List size={16} />
                    </button>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-poppins text-sm hover:bg-blue-700 transition-colors duration-200">
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Employee Attendance Content */}
            <div className="p-6">
              {viewMode === 'card' ? (
                /* Card View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredEmployees.map((employee) => {
                    // Simulate attendance status
                    const attendanceStatus = Math.random() > 0.2 ? 'Present' : 
                                           Math.random() > 0.5 ? 'Late' : 
                                           Math.random() > 0.7 ? 'WFH' : 'Absent';
                    const checkInTime = attendanceStatus === 'Present' ? '09:15 AM' :
                                       attendanceStatus === 'Late' ? '09:45 AM' :
                                       attendanceStatus === 'WFH' ? '09:00 AM' : '-';
                    
                    return (
                      <div key={employee.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-poppins font-bold text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-poppins font-medium text-gray-900 text-sm truncate">{employee.name}</h4>
                            <p className="text-xs text-gray-500 font-poppins truncate">{employee.department}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-poppins text-gray-600">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${
                              attendanceStatus === 'Present' ? 'bg-green-100 text-green-700' :
                              attendanceStatus === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                              attendanceStatus === 'WFH' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {attendanceStatus}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-poppins text-gray-600">Check-in</span>
                            <span className="text-xs font-poppins text-gray-900">{checkInTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List View */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Employee</th>
                        <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Department</th>
                        <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                        <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Check-in Time</th>
                        <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Location</th>
                        <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => {
                        // Simulate attendance status
                        const attendanceStatus = Math.random() > 0.2 ? 'Present' : 
                                               Math.random() > 0.5 ? 'Late' : 
                                               Math.random() > 0.7 ? 'WFH' : 'Absent';
                        const checkInTime = attendanceStatus === 'Present' ? '09:15 AM' :
                                           attendanceStatus === 'Late' ? '09:45 AM' :
                                           attendanceStatus === 'WFH' ? '09:00 AM' : '-';
                        
                        return (
                          <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-poppins font-bold text-xs">
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-poppins font-medium text-gray-900 text-sm">{employee.name}</div>
                                  <div className="text-xs text-gray-500 font-poppins">{employee.position}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-poppins text-gray-900 text-sm">{employee.department}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${
                                attendanceStatus === 'Present' ? 'bg-green-100 text-green-700' :
                                attendanceStatus === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                                attendanceStatus === 'WFH' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {attendanceStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-poppins text-gray-900 text-sm">{checkInTime}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-poppins text-gray-600 text-sm">{employee.location}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200" title="View Details">
                                  <Eye size={14} />
                                </button>
                                <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200" title="Edit">
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-poppins font-semibold text-gray-900">Pending Leave Requests</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-poppins text-sm hover:bg-blue-700 transition-colors duration-200">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Employee</th>
                    <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Duration</th>
                    <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Start Date</th>
                    <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-poppins font-semibold text-gray-900 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHRData.leaveRequests.map((request, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-poppins text-gray-900 text-sm">{request.name}</td>
                      <td className="py-3 px-4 font-poppins text-gray-700 text-sm">{request.type}</td>
                      <td className="py-3 px-4 font-poppins text-gray-700 text-sm">{request.days} days</td>
                      <td className="py-3 px-4 font-poppins text-gray-700 text-sm">{new Date(request.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                            <UserX className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        renderRecruitmentTab()
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Management Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-600 shadow-sm">
                  Overview
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Reviews
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Goals
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Development
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Design</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Plus size={16} />
                Start Review
              </button>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard
              title="Excellent"
              value={mockHRData.performance.excellent}
              subtitle="Top performers"
              icon={Star}
              color="green"
              trend={8.2}
            />
            <KPICard
              title="Good"
              value={mockHRData.performance.good}
              subtitle="Above average"
              icon={TrendingUp}
              color="blue"
              trend={3.1}
            />
            <KPICard
              title="Average"
              value={mockHRData.performance.average}
              subtitle="Meeting expectations"
              icon={Target}
              color="yellow"
              trend={-2.5}
            />
            <KPICard
              title="Needs Improvement"
              value={mockHRData.performance.needsImprovement}
              subtitle="Action required"
              icon={AlertTriangle}
              color="red"
              trend={-15.3}
            />
          </div>

          {/* Performance Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Trends */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
                <div className="flex items-center gap-2">
                  <select className="text-sm border border-gray-200 rounded-md px-2 py-1">
                    <option>Last 6 months</option>
                    <option>Last 12 months</option>
                    <option>This year</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { month: 'Aug 2023', excellent: 45, good: 68, average: 42, needsImprovement: 12 },
                  { month: 'Sep 2023', excellent: 48, good: 72, average: 38, needsImprovement: 10 },
                  { month: 'Oct 2023', excellent: 52, good: 75, average: 35, needsImprovement: 8 },
                  { month: 'Nov 2023', excellent: 55, good: 78, average: 32, needsImprovement: 7 },
                  { month: 'Dec 2023', excellent: 58, good: 82, average: 28, needsImprovement: 5 },
                  { month: 'Jan 2024', excellent: 62, good: 85, average: 25, needsImprovement: 4 }
                ].map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">{data.month}</div>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div className="h-full flex">
                          <div className="bg-green-500 h-full" style={{ width: `${(data.excellent / 200) * 100}%` }}></div>
                          <div className="bg-blue-500 h-full" style={{ width: `${(data.good / 200) * 100}%` }}></div>
                          <div className="bg-yellow-500 h-full" style={{ width: `${(data.average / 200) * 100}%` }}></div>
                          <div className="bg-red-500 h-full" style={{ width: `${(data.needsImprovement / 200) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-medium">{data.excellent}</span>
                      <span className="text-blue-600 font-medium">{data.good}</span>
                      <span className="text-yellow-600 font-medium">{data.average}</span>
                      <span className="text-red-600 font-medium">{data.needsImprovement}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Needs Improvement</span>
                </div>
              </div>
            </div>

            {/* Review Schedule */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Review Schedule</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Althameem Khan', department: 'Management', type: 'Annual Review', date: '2024-02-28', status: 'Scheduled' },
                  { name: 'Sarah Johnson', department: 'Engineering', type: 'Mid-Year Review', date: '2024-03-05', status: 'In Progress' },
                  { name: 'Mike Chen', department: 'Sales', type: 'Quarterly Review', date: '2024-03-10', status: 'Pending' },
                  { name: 'Emily Davis', department: 'Marketing', type: 'Probation Review', date: '2024-03-15', status: 'Overdue' }
                ].map((review, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{review.name}</div>
                          <div className="text-xs text-gray-500">{review.department}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{review.type}</div>
                        <div className="text-xs font-medium text-gray-900">{new Date(review.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                        review.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        review.status === 'Pending' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {review.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers & Goals Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
                <button className="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {mockHRData.topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{performer.name}</div>
                        <div className="text-gray-600 text-sm">{performer.department}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{performer.score}</div>
                        <div className="text-xs text-gray-600">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">+{performer.improvement}</div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Goals Progress</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage Goals
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { category: 'Team Performance', target: 85, current: 78, employees: 24 },
                  { category: 'Individual Growth', target: 90, current: 82, employees: 18 },
                  { category: 'Leadership Development', target: 75, current: 88, employees: 12 },
                  { category: 'Customer Satisfaction', target: 95, current: 92, employees: 32 }
                ].map((goal, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">{goal.category}</div>
                        <div className="text-sm text-gray-600">{goal.employees} employees</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{goal.current}%</div>
                        <div className="text-sm text-gray-600">of {goal.target}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          goal.current >= goal.target ? 'bg-green-500' : 
                          goal.current >= goal.target * 0.8 ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training & Development */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Training & Development</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Schedule Training
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockHRData.upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.type === 'training' ? 'bg-blue-100 text-blue-600' :
                      event.type === 'review' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {event.type === 'training' ? <BookOpen className="w-5 h-5" /> :
                       event.type === 'review' ? <Award className="w-5 h-5" /> :
                       <Users className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{event.title}</div>
                      <div className="text-gray-600 text-xs">{event.participants} participants</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      event.type === 'training' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'review' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">HR Reports</h3>
            <p className="text-gray-600 font-poppins mb-4">Advanced reporting and analytics coming soon</p>
            <p className="text-sm text-gray-500 font-poppins">Comprehensive HR reports and insights will be available here</p>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-6">
          {/* Leave Management Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setLeaveView('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    leaveView === 'all' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Requests
                </button>
                <button 
                  onClick={() => setLeaveView('pending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    leaveView === 'pending' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => setLeaveView('approved')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    leaveView === 'approved' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Approved
                </button>
                <button 
                  onClick={() => setLeaveView('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    leaveView === 'calendar' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Calendar View
                </button>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Plus size={16} />
              New Leave Request
            </button>
          </div>

          {/* Leave Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">18</p>
                  <p className="text-sm text-gray-500">Requires action</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">198</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Days/Month</p>
                  <p className="text-2xl font-bold text-purple-600">2.3</p>
                  <p className="text-sm text-gray-500">Per employee</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Based on Leave View */}
          {leaveView === 'calendar' ? (
            // Advanced Interactive Calendar View
            <div className="bg-white rounded-xl border border-gray-200 p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Interactive Leave Calendar</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <select 
                    value={`${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-');
                      setSelectedMonth(new Date(parseInt(year), parseInt(month)));
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024-0">January 2024</option>
                    <option value="2024-1">February 2024</option>
                    <option value="2024-2">March 2024</option>
                    <option value="2024-3">April 2024</option>
                    <option value="2024-4">May 2024</option>
                    <option value="2024-5">June 2024</option>
                  </select>
                  <button 
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {(() => {
                  const year = selectedMonth.getFullYear();
                  const month = selectedMonth.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - firstDay.getDay());
                  
                  const days = [];
                  for (let i = 0; i < 42; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + i);
                    
                    const isCurrentMonth = currentDate.getMonth() === month;
                    const dateNum = currentDate.getDate();
                    const leaves = getLeaveDataForDate(currentDate);
                    const leaveStatus = getDayLeaveStatus(leaves);
                    const isToday = currentDate.toDateString() === new Date().toDateString();
                    
                    days.push(
                      <div 
                        key={i}
                        className={`
                          relative p-3 text-center text-sm h-20 border rounded-lg transition-all duration-200 cursor-pointer
                          ${isCurrentMonth 
                            ? leaveStatus === 'approved' 
                              ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100 hover:border-green-300' 
                              : leaveStatus === 'pending'
                              ? 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100 hover:border-yellow-300'
                              : leaveStatus === 'mixed'
                              ? 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100 hover:border-orange-300'
                              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            : 'bg-gray-50 text-gray-400 border-gray-100'
                          }
                          ${isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                        `}
                        onMouseEnter={(e) => {
                          if (isCurrentMonth && leaves.length > 0) {
                            setHoveredDate(dateNum);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredDate(null)}
                      >
                        {isCurrentMonth && (
                          <>
                            <div className={`font-medium ${isToday ? 'font-bold' : ''}`}>
                              {dateNum}
                            </div>
                            {leaves.length > 0 && (
                              <div className="mt-1 space-y-1">
                                {leaves.slice(0, 2).map((leave, idx) => (
                                  <div 
                                    key={idx}
                                    className={`text-xs px-1 py-0.5 rounded truncate ${
                                      leave.status === 'Approved' ? 'bg-green-600 text-white' :
                                      leave.status === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                                    }`}
                                  >
                                    {leave.name.split(' ')[0]}
                                  </div>
                                ))}
                                {leaves.length > 2 && (
                                  <div className="text-xs text-gray-600 font-medium">
                                    +{leaves.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}
                            {isToday && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>
              
              {/* Enhanced Calendar Legend */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Approved Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">Pending Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-gray-600">Mixed Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span className="text-gray-600">No Leave</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Hover over days to see detailed leave information
                </div>
              </div>
              
              {/* Advanced Hover Tooltip */}
              {hoveredDate && (
                <div 
                  className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm"
                  style={{ 
                    left: tooltipPosition.x - 150, 
                    top: tooltipPosition.y - 10,
                    transform: 'translateY(-100%)'
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-gray-900">
                        {selectedMonth.toLocaleString('default', { month: 'long' })} {hoveredDate}, {selectedMonth.getFullYear()}
                      </span>
                    </div>
                    
                    {(() => {
                      const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), hoveredDate);
                      const leaves = getLeaveDataForDate(currentDate);
                      
                      if (leaves.length === 0) {
                        return (
                          <div className="text-gray-500 text-sm">No leave requests for this day</div>
                        );
                      }
                      
                      const approvedLeaves = leaves.filter(leave => leave.status === 'Approved');
                      const pendingLeaves = leaves.filter(leave => leave.status === 'Pending');
                      
                      return (
                        <div className="space-y-3">
                          {approvedLeaves.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                  Approved Leaves ({approvedLeaves.length})
                                </span>
                              </div>
                              <div className="space-y-2">
                                {approvedLeaves.map((leave, idx) => (
                                  <div key={idx} className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                                    <div className="font-medium text-green-800">{leave.name}</div>
                                    <div className="text-xs text-green-600">{leave.department} • {leave.type}</div>
                                    <div className="text-xs text-green-700 mt-1">{leave.reason}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {pendingLeaves.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-700">
                                  Pending Approvals ({pendingLeaves.length})
                                </span>
                              </div>
                              <div className="space-y-2">
                                {pendingLeaves.map((leave, idx) => (
                                  <div key={idx} className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                                    <div className="font-medium text-yellow-800">{leave.name}</div>
                                    <div className="text-xs text-yellow-600">{leave.department} • {leave.type}</div>
                                    <div className="text-xs text-yellow-700 mt-1">{leave.reason}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Table View for All, Pending, and Approved
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {leaveView === 'all' ? 'All Leave Requests' : 
                     leaveView === 'pending' ? 'Pending Leave Requests' : 
                     'Approved Leave Requests'}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search requests..."
                        className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Types</option>
                      <option>Annual Leave</option>
                      <option>Sick Leave</option>
                      <option>Personal Leave</option>
                      <option>Maternity Leave</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Employee</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Leave Type</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Duration</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Start Date</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">End Date</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const allRequests = [
                        {
                          name: 'Sarah Johnson',
                          department: 'Engineering',
                          type: 'Annual Leave',
                          duration: '5 days',
                          startDate: '2024-02-15',
                          endDate: '2024-02-19',
                          status: 'Pending',
                          reason: 'Family vacation'
                        },
                        {
                          name: 'Mike Chen',
                          department: 'Sales',
                          type: 'Sick Leave',
                          duration: '2 days',
                          startDate: '2024-02-10',
                          endDate: '2024-02-11',
                          status: 'Approved',
                          reason: 'Medical appointment'
                        },
                        {
                          name: 'Emily Davis',
                          department: 'Marketing',
                          type: 'Personal Leave',
                          duration: '1 day',
                          startDate: '2024-02-20',
                          endDate: '2024-02-20',
                          status: 'Pending',
                          reason: 'Personal matters'
                        },
                        {
                          name: 'David Kim',
                          department: 'Design',
                          type: 'Annual Leave',
                          duration: '7 days',
                          startDate: '2024-03-01',
                          endDate: '2024-03-07',
                          status: 'Approved',
                          reason: 'Spring break'
                        },
                        {
                          name: 'Lisa Thompson',
                          department: 'Media',
                          type: 'Maternity Leave',
                          duration: '90 days',
                          startDate: '2024-03-15',
                          endDate: '2024-06-15',
                          status: 'Approved',
                          reason: 'Maternity leave'
                        },
                        {
                          name: 'Alex Rodriguez',
                          department: 'Operations',
                          type: 'Personal Leave',
                          duration: '3 days',
                          startDate: '2024-03-20',
                          endDate: '2024-03-22',
                          status: 'Pending',
                          reason: 'Family emergency'
                        },
                        {
                          name: 'Jennifer Wu',
                          department: 'Engineering',
                          type: 'Annual Leave',
                          duration: '8 days',
                          startDate: '2024-04-05',
                          endDate: '2024-04-12',
                          status: 'Approved',
                          reason: 'Vacation'
                        }
                      ];
                      
                      const filteredRequests = leaveView === 'all' ? allRequests :
                                             leaveView === 'pending' ? allRequests.filter(req => req.status === 'Pending') :
                                             allRequests.filter(req => req.status === 'Approved');
                      
                      return filteredRequests.map((request, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {request.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{request.name}</div>
                                <div className="text-sm text-gray-500">{request.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-900">{request.type}</td>
                          <td className="py-4 px-6 text-gray-900">{request.duration}</td>
                          <td className="py-4 px-6 text-gray-900">{new Date(request.startDate).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-gray-900">{new Date(request.endDate).toLocaleDateString()}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {request.status === 'Pending' && (
                                <>
                                  <button className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leave Balance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance by Department</h3>
              <div className="space-y-4">
                {[
                  { dept: 'Engineering', total: 120, used: 45, remaining: 75 },
                  { dept: 'Sales', total: 90, used: 38, remaining: 52 },
                  { dept: 'Marketing', total: 85, used: 42, remaining: 43 },
                  { dept: 'Design', total: 70, used: 28, remaining: 42 },
                  { dept: 'Media', total: 60, used: 25, remaining: 35 }
                ].map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{dept.dept}</span>
                        <span className="text-sm text-gray-600">{dept.remaining}/{dept.total} days</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(dept.remaining / dept.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Leave Schedule</h3>
              <div className="space-y-3">
                {[
                  { name: 'David Kim', dates: 'Mar 1-7', type: 'Annual', days: 7 },
                  { name: 'Lisa Thompson', dates: 'Mar 15-Jun 15', type: 'Maternity', days: 90 },
                  { name: 'Alex Rodriguez', dates: 'Mar 20-22', type: 'Personal', days: 3 },
                  { name: 'Jennifer Wu', dates: 'Apr 5-12', type: 'Annual', days: 8 }
                ].map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {leave.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{leave.name}</div>
                        <div className="text-sm text-gray-600">{leave.dates}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{leave.days} days</div>
                      <div className="text-xs text-gray-500">{leave.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button className="px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-600 shadow-sm">
                  Current Period
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Payroll History
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Tax Reports
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Benefits
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Calculator size={16} />
                Run Payroll
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Download size={16} />
                Export Reports
              </button>
            </div>
          </div>

          {/* Payroll Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold text-gray-900">$487,250</p>
                  <p className="text-sm text-gray-500">Current month</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Employees Paid</p>
                  <p className="text-2xl font-bold text-blue-600">235</p>
                  <p className="text-sm text-gray-500">Out of 247</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tax Deductions</p>
                  <p className="text-2xl font-bold text-yellow-600">$126,890</p>
                  <p className="text-sm text-gray-500">Federal & State</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Pay</p>
                  <p className="text-2xl font-bold text-purple-600">$360,360</p>
                  <p className="text-sm text-gray-500">After deductions</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Banknote className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Processing Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Payroll Cycle - February 2024</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Time Sheets Approved</div>
                    <div className="text-sm text-gray-600">All departments completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Payroll Calculated</div>
                    <div className="text-sm text-gray-600">Ready for review</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-900">Pending Approval</div>
                    <div className="text-sm text-gray-600">Awaiting manager sign-off</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center p-6 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900 mb-2">Feb 28, 2024</div>
                  <div className="text-sm text-gray-600 mb-4">Scheduled Pay Date</div>
                  <div className="text-xs text-gray-500">Direct deposits will be processed</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Payroll Summary</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gross Pay:</span>
                      <span className="font-medium">$487,250</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Federal Tax:</span>
                      <span className="font-medium">$76,420</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>State Tax:</span>
                      <span className="font-medium">$28,350</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>FICA/Medicare:</span>
                      <span className="font-medium">$22,120</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Net Pay:</span>
                      <span>$360,360</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Payroll Details */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Employee Payroll Details</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Design</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Employee</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Base Salary</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Overtime</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Bonus</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Gross Pay</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Deductions</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Net Pay</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: 'Althameem Khan',
                      department: 'Management',
                      baseSalary: 10000,
                      overtime: 0,
                      bonus: 2000,
                      grossPay: 12000,
                      deductions: 3420,
                      netPay: 8580,
                      status: 'Processed'
                    },
                    {
                      name: 'Sarah Johnson',
                      department: 'Engineering',
                      baseSalary: 7917,
                      overtime: 480,
                      bonus: 0,
                      grossPay: 8397,
                      deductions: 2383,
                      netPay: 6014,
                      status: 'Processed'
                    },
                    {
                      name: 'Mike Chen',
                      department: 'Sales',
                      baseSalary: 7083,
                      overtime: 0,
                      bonus: 1500,
                      grossPay: 8583,
                      deductions: 2435,
                      netPay: 6148,
                      status: 'Processed'
                    },
                    {
                      name: 'Emily Davis',
                      department: 'Marketing',
                      baseSalary: 5833,
                      overtime: 120,
                      bonus: 500,
                      grossPay: 6453,
                      deductions: 1831,
                      netPay: 4622,
                      status: 'Pending'
                    },
                    {
                      name: 'David Kim',
                      department: 'Design',
                      baseSalary: 6667,
                      overtime: 0,
                      bonus: 0,
                      grossPay: 6667,
                      deductions: 1892,
                      netPay: 4775,
                      status: 'On Hold'
                    }
                  ].map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">${employee.baseSalary.toLocaleString()}</td>
                      <td className="py-4 px-6 text-gray-900">${employee.overtime.toLocaleString()}</td>
                      <td className="py-4 px-6 text-gray-900">${employee.bonus.toLocaleString()}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">${employee.grossPay.toLocaleString()}</td>
                      <td className="py-4 px-6 text-gray-900">${employee.deductions.toLocaleString()}</td>
                      <td className="py-4 px-6 font-medium text-green-600">${employee.netPay.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'Processed' ? 'bg-green-100 text-green-700' :
                          employee.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payroll Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Trends</h3>
              <div className="space-y-4">
                {[
                  { month: 'December 2023', amount: 465200, change: 2.3 },
                  { month: 'January 2024', amount: 472800, change: 1.6 },
                  { month: 'February 2024', amount: 487250, change: 3.1 }
                ].map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">{data.month}</div>
                      <div className="text-2xl font-bold text-gray-900">${data.amount.toLocaleString()}</div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      data.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {data.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(data.change)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payroll Tasks</h3>
              <div className="space-y-3">
                {[
                  { task: 'Review overtime approvals', due: 'Feb 26', priority: 'High', dept: 'All' },
                  { task: 'Process bonus payments', due: 'Feb 28', priority: 'Medium', dept: 'Sales' },
                  { task: 'Tax filing preparation', due: 'Mar 5', priority: 'High', dept: 'Finance' },
                  { task: 'Benefits enrollment review', due: 'Mar 10', priority: 'Low', dept: 'HR' }
                ].map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'High' ? 'bg-red-500' :
                        task.priority === 'Medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{task.task}</div>
                        <div className="text-sm text-gray-600">{task.dept} • Due {task.due}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">Document Management</h3>
            <p className="text-gray-600 font-poppins mb-4">HR document management system coming soon</p>
            <p className="text-sm text-gray-500 font-poppins">Store and manage HR documents, policies, and forms</p>
          </div>
        </div>
      )}

      {activeTab === 'employee-hub' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">Employee Hub</h3>
            <p className="text-gray-600 font-poppins mb-4">Employee self-service portal coming soon</p>
            <p className="text-sm text-gray-500 font-poppins">Employee dashboard with personal information and tools</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">HR Settings</h3>
            <p className="text-gray-600 font-poppins mb-4">HR module configuration and settings</p>
            <p className="text-sm text-gray-500 font-poppins">Configure HR policies, workflows, and system settings</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard; 