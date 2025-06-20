import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Users, TrendingUp, Filter, Search, Download, Plus, ChevronLeft, ChevronRight, MapPin, Wifi, Smartphone, CheckCircle, XCircle, AlertCircle, Eye, Edit3, MoreHorizontal, User, Building, Home, Coffee, Plane, ArrowLeft, FileText, Activity } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  totalHours: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave' | 'Work From Home';
  location: 'Office' | 'Remote' | 'Field';
  checkInMethod: 'Manual' | 'Biometric' | 'Mobile App' | 'Web Portal';
  notes: string;
  overtime: number;
  isHoliday: boolean;
  leaveType?: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  email: string;
  workSchedule: {
    startTime: string;
    endTime: string;
    workingDays: string[];
  };
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  date: string;
  record?: AttendanceRecord | null;
  onSave: (record: Partial<AttendanceRecord>) => void;
}

interface CheckInButtonProps {
  onClick: () => void;
  isCheckedIn: boolean;
}

interface StatusPageProps {
  status: AttendanceRecord['status'];
  records: AttendanceRecord[];
  employees: Employee[];
  onBack: () => void;
  onEditRecord: (record: AttendanceRecord) => void;
  currentDate: Date;
}

interface DailyReportPageProps {
  records: AttendanceRecord[];
  employees: Employee[];
  onBack: () => void;
  currentDate: Date;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ onClick, isCheckedIn }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
        text-white px-6 py-3 rounded-xl font-poppins font-semibold transition-all duration-300 
        flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105
        ${isAnimating ? 'animate-pulse' : ''}
      `}
    >
      {/* Animated Background */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 transition-opacity duration-500
        ${isAnimating ? 'opacity-100' : ''}
      `} />
      
      {/* Ripple Effect */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-ping opacity-75" />
        </div>
      )}
      
      {/* Icon with Animation */}
      <div className={`
        relative z-10 transition-transform duration-300
        ${isAnimating ? 'scale-110 rotate-12' : ''}
      `}>
        {isCheckedIn ? (
          <XCircle size={20} className="text-white" />
        ) : (
          <CheckCircle size={20} className="text-white" />
        )}
      </div>
      
      {/* Text */}
      <span className="relative z-10 text-sm">
        {isCheckedIn ? 'Check Out' : 'Check In'}
      </span>
      
      {/* Shine Effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 
        transform -skew-x-12 transition-all duration-700
        ${isAnimating ? 'opacity-20 translate-x-full' : '-translate-x-full'}
      `} />
    </button>
  );
};

const StatusPage: React.FC<StatusPageProps> = ({ status, records, employees, onBack, onEditRecord, currentDate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || record.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = ['All Departments', ...Array.from(new Set(records.map(r => r.department)))];

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present': return 'from-green-500 to-green-600';
      case 'Absent': return 'from-red-500 to-red-600';
      case 'Late': return 'from-yellow-500 to-yellow-600';
      case 'Half Day': return 'from-blue-500 to-blue-600';
      case 'On Leave': return 'from-purple-500 to-purple-600';
      case 'Work From Home': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present': return CheckCircle;
      case 'Absent': return XCircle;
      case 'Late': return AlertCircle;
      case 'Half Day': return Clock;
      case 'On Leave': return Plane;
      case 'Work From Home': return Home;
      default: return User;
    }
  };

  const StatusIcon = getStatusIcon(status);

  return (
    <div className="p-4 animate-fadeIn min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(status)} rounded-xl flex items-center justify-center shadow-lg`}>
            <StatusIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-poppins font-semibold text-gray-900">
              {status} Employees
            </h1>
            <p className="text-gray-600 font-poppins text-sm">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor(status)} rounded-lg flex items-center justify-center`}>
                <StatusIcon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900">{filteredRecords.length}</p>
                <p className="text-sm text-gray-600 font-poppins">{status} Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900">
                  {filteredRecords.reduce((sum, r) => sum + r.totalHours, 0).toFixed(1)}h
                </p>
                <p className="text-sm text-gray-600 font-poppins">Total Hours</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-poppins font-bold text-gray-900">
                  {Array.from(new Set(filteredRecords.map(r => r.department))).length}
                </p>
                <p className="text-sm text-gray-600 font-poppins">Departments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
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

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRecords.map((record, index) => {
          const employee = employees.find(emp => emp.id === record.employeeId);
          const LocationIcon = record.location === 'Office' ? Building : record.location === 'Remote' ? Home : MapPin;
          
          return (
            <div
              key={record.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-sm">
                  {employee?.avatar || record.employeeName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-gray-900 text-sm">{record.employeeName}</h3>
                  <p className="text-xs text-gray-500 font-poppins">{record.department}</p>
                </div>
                <button
                  onClick={() => onEditRecord(record)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit3 size={14} />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                {record.checkIn && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-poppins">Check In:</span>
                    <span className="font-poppins font-medium text-gray-900">{record.checkIn}</span>
                  </div>
                )}
                {record.checkOut && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-poppins">Check Out:</span>
                    <span className="font-poppins font-medium text-gray-900">{record.checkOut}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-poppins">Hours:</span>
                  <span className="font-poppins font-medium text-gray-900">{record.totalHours.toFixed(1)}h</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <LocationIcon size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-600 font-poppins">{record.location}</span>
                </div>
                {record.overtime > 0 && (
                  <span className="text-xs text-orange-600 font-poppins font-medium">
                    +{record.overtime}h OT
                  </span>
                )}
              </div>

              {record.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-poppins">{record.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 bg-gradient-to-r ${getStatusColor(status)} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <StatusIcon size={32} className="text-white" />
          </div>
          <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
            No {status.toLowerCase()} employees found
          </h3>
          <p className="text-gray-600 font-poppins text-sm">
            {searchQuery || selectedDepartment !== 'All Departments'
              ? 'Try adjusting your search criteria.'
              : `No employees are marked as ${status.toLowerCase()} for this date.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

const DailyReportPage: React.FC<DailyReportPageProps> = ({ records, employees, onBack, currentDate }) => {
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const present = records.filter(r => r.status === 'Present' || r.status === 'Late' || r.status === 'Half Day' || r.status === 'Work From Home').length;
    const absent = records.filter(r => r.status === 'Absent' || r.status === 'On Leave').length;
    const late = records.filter(r => r.status === 'Late').length;
    const totalHours = records.reduce((sum, r) => sum + r.totalHours, 0);
    const avgHours = records.length > 0 ? totalHours / records.length : 0;
    const overtime = records.reduce((sum, r) => sum + r.overtime, 0);

    const departmentStats = employees.reduce((acc, emp) => {
      const record = records.find(r => r.employeeId === emp.id);
      if (!acc[emp.department]) {
        acc[emp.department] = { total: 0, present: 0, absent: 0, hours: 0 };
      }
      acc[emp.department].total++;
      if (record) {
        if (['Present', 'Late', 'Half Day', 'Work From Home'].includes(record.status)) {
          acc[emp.department].present++;
        } else {
          acc[emp.department].absent++;
        }
        acc[emp.department].hours += record.totalHours;
      } else {
        acc[emp.department].absent++;
      }
      return acc;
    }, {} as Record<string, { total: number; present: number; absent: number; hours: number }>);

    return { totalEmployees, present, absent, late, totalHours, avgHours, overtime, departmentStats };
  }, [records, employees]);

  return (
    <div className="p-4 animate-fadeIn min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-poppins font-semibold text-gray-900">
              Daily Attendance Report
            </h1>
            <p className="text-gray-600 font-poppins text-sm">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-poppins font-bold text-gray-900">{stats.totalEmployees}</p>
              <p className="text-sm text-gray-600 font-poppins">Total Employees</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-poppins">
            Present: {stats.present} • Absent: {stats.absent}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-poppins font-bold text-green-600">{((stats.present / stats.totalEmployees) * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600 font-poppins">Attendance Rate</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-poppins">
            {stats.present} out of {stats.totalEmployees} present
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-poppins font-bold text-purple-600">{stats.totalHours.toFixed(1)}h</p>
              <p className="text-sm text-gray-600 font-poppins">Total Hours</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-poppins">
            Avg: {stats.avgHours.toFixed(1)}h per employee
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-poppins font-bold text-orange-600">{stats.overtime.toFixed(1)}h</p>
              <p className="text-sm text-gray-600 font-poppins">Overtime</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-poppins">
            Late arrivals: {stats.late}
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-poppins font-semibold text-gray-900">Department Breakdown</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.departmentStats).map(([dept, data]) => (
              <div key={dept} className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-poppins font-semibold text-gray-900 mb-3">{dept}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-poppins">Total:</span>
                    <span className="font-poppins font-medium">{data.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-poppins">Present:</span>
                    <span className="font-poppins font-medium text-green-600">{data.present}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-poppins">Absent:</span>
                    <span className="font-poppins font-medium text-red-600">{data.absent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-poppins">Hours:</span>
                    <span className="font-poppins font-medium">{data.hours.toFixed(1)}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.present / data.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-poppins text-center">
                    {((data.present / data.total) * 100).toFixed(1)}% attendance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-poppins font-semibold text-gray-900">Detailed Records</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-poppins font-medium transition-colors duration-200 text-sm">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-poppins font-semibold text-gray-900 text-xs">Employee</th>
                <th className="text-left px-6 py-3 font-poppins font-semibold text-gray-900 text-xs">Department</th>
                <th className="text-left px-6 py-3 font-poppins font-semibold text-gray-900 text-xs">Status</th>
                <th className="text-left px-6 py-3 font-poppins font-semibold text-gray-900 text-xs">Check In</th>
                <th className="text-left px-6 py-3 font-poppins font-semibold text-gray-900 text-xs">Check Out</th>
                <th className="text-left px-6 py-3 font-poppins font-semibold text-gray-900 text-xs">Hours</th>
                <th className="text-left px-6 py-3 font-poppins font-semibold text-gray-900 text-xs">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => {
                const record = records.find(r => r.employeeId === employee.id);
                const getStatusColor = (status?: AttendanceRecord['status']) => {
                  if (!status) return 'bg-gray-100 text-gray-700 border-gray-200';
                  switch (status) {
                    case 'Present': return 'bg-green-100 text-green-700 border-green-200';
                    case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
                    case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                    case 'Half Day': return 'bg-blue-100 text-blue-700 border-blue-200';
                    case 'On Leave': return 'bg-purple-100 text-purple-700 border-purple-200';
                    case 'Work From Home': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
                    default: return 'bg-gray-100 text-gray-700 border-gray-200';
                  }
                };

                return (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-xs">
                          {employee.avatar}
                        </div>
                        <span className="font-poppins font-medium text-gray-900 text-sm">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-poppins text-sm text-gray-900">{employee.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getStatusColor(record?.status)}`}>
                        {record?.status || 'No Record'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-poppins text-sm text-gray-900">{record?.checkIn || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-poppins text-sm text-gray-900">{record?.checkOut || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-poppins text-sm text-gray-900">
                        {record ? `${record.totalHours.toFixed(1)}h` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-poppins text-sm text-gray-600">{record?.location || '-'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose, employee, date, record, onSave }) => {
  const [formData, setFormData] = useState({
    checkIn: record?.checkIn || '',
    checkOut: record?.checkOut || '',
    breakStart: record?.breakStart || '',
    breakEnd: record?.breakEnd || '',
    status: record?.status || 'Present' as AttendanceRecord['status'],
    location: record?.location || 'Office' as AttendanceRecord['location'],
    notes: record?.notes || '',
    overtime: record?.overtime || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    const totalHours = formData.checkIn && formData.checkOut 
      ? calculateHours(formData.checkIn, formData.checkOut, formData.breakStart, formData.breakEnd)
      : 0;

    onSave({
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      date,
      ...formData,
      totalHours
    });
    onClose();
  };

  const calculateHours = (checkIn: string, checkOut: string, breakStart?: string, breakEnd?: string) => {
    const start = new Date(`2000-01-01T${checkIn}`);
    const end = new Date(`2000-01-01T${checkOut}`);
    let totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    if (breakStart && breakEnd) {
      const breakStartTime = new Date(`2000-01-01T${breakStart}`);
      const breakEndTime = new Date(`2000-01-01T${breakEnd}`);
      const breakMinutes = (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60);
      totalMinutes -= breakMinutes;
    }
    
    return Math.max(0, totalMinutes / 60);
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-poppins font-semibold">Attendance Record</h3>
              <p className="text-blue-100 font-poppins text-sm">
                {employee.name} • {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200">
              <XCircle size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-poppins font-medium text-gray-700 mb-2">Check In Time</label>
              <input
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-poppins font-medium text-gray-700 mb-2">Check Out Time</label>
              <input
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-poppins font-medium text-gray-700 mb-2">Break Start</label>
              <input
                type="time"
                value={formData.breakStart}
                onChange={(e) => setFormData(prev => ({ ...prev, breakStart: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-poppins font-medium text-gray-700 mb-2">Break End</label>
              <input
                type="time"
                value={formData.breakEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, breakEnd: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-poppins font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AttendanceRecord['status'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
                <option value="On Leave">On Leave</option>
                <option value="Work From Home">Work From Home</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-poppins font-medium text-gray-700 mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value as AttendanceRecord['location'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
              >
                <option value="Office">Office</option>
                <option value="Remote">Remote</option>
                <option value="Field">Field</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-poppins font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm resize-none"
              placeholder="Add any notes about this attendance record..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-poppins font-medium transition-colors duration-200"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AttendancePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'dashboard' | 'status' | 'report'>('dashboard');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceRecord['status']>('Present');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Mock data
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Alex Kumar',
      department: 'Engineering',
      position: 'Senior Developer',
      avatar: 'AK',
      email: 'alex.kumar@company.com',
      workSchedule: { startTime: '09:00', endTime: '18:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    },
    {
      id: 'EMP002',
      name: 'Emily Rodriguez',
      department: 'Marketing',
      position: 'Marketing Manager',
      avatar: 'ER',
      email: 'emily.rodriguez@company.com',
      workSchedule: { startTime: '09:00', endTime: '17:30', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    },
    {
      id: 'EMP003',
      name: 'James Wilson',
      department: 'Sales',
      position: 'Sales Representative',
      avatar: 'JW',
      email: 'james.wilson@company.com',
      workSchedule: { startTime: '08:30', endTime: '17:30', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    },
    {
      id: 'EMP004',
      name: 'Lisa Thompson',
      department: 'HR',
      position: 'HR Specialist',
      avatar: 'LT',
      email: 'lisa.thompson@company.com',
      workSchedule: { startTime: '09:00', endTime: '18:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    },
    {
      id: 'EMP005',
      name: 'David Chen',
      department: 'Engineering',
      position: 'Frontend Developer',
      avatar: 'DC',
      email: 'david.chen@company.com',
      workSchedule: { startTime: '10:00', endTime: '19:00', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    },
    {
      id: 'EMP006',
      name: 'Sarah Johnson',
      department: 'Design',
      position: 'UI/UX Designer',
      avatar: 'SJ',
      email: 'sarah.johnson@company.com',
      workSchedule: { startTime: '09:30', endTime: '18:30', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
    }
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'ATT001',
      employeeId: 'EMP001',
      employeeName: 'Alex Kumar',
      department: 'Engineering',
      date: '2024-02-15',
      checkIn: '09:15',
      checkOut: '18:30',
      breakStart: '13:00',
      breakEnd: '14:00',
      totalHours: 8.25,
      status: 'Present',
      location: 'Office',
      checkInMethod: 'Biometric',
      notes: '',
      overtime: 0.5,
      isHoliday: false
    },
    {
      id: 'ATT002',
      employeeId: 'EMP002',
      employeeName: 'Emily Rodriguez',
      department: 'Marketing',
      date: '2024-02-15',
      checkIn: '09:00',
      checkOut: '17:30',
      breakStart: '12:30',
      breakEnd: '13:30',
      totalHours: 7.5,
      status: 'Present',
      location: 'Remote',
      checkInMethod: 'Mobile App',
      notes: 'Working from home today',
      overtime: 0,
      isHoliday: false
    },
    {
      id: 'ATT003',
      employeeId: 'EMP003',
      employeeName: 'James Wilson',
      department: 'Sales',
      date: '2024-02-15',
      checkIn: '08:45',
      checkOut: '17:45',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8,
      status: 'Present',
      location: 'Field',
      checkInMethod: 'Mobile App',
      notes: 'Client meetings',
      overtime: 0.25,
      isHoliday: false
    },
    {
      id: 'ATT004',
      employeeId: 'EMP004',
      employeeName: 'Lisa Thompson',
      department: 'HR',
      date: '2024-02-15',
      checkIn: null,
      checkOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 0,
      status: 'On Leave',
      location: 'Office',
      checkInMethod: 'Manual',
      notes: 'Sick leave',
      overtime: 0,
      isHoliday: false,
      leaveType: 'Sick Leave'
    },
    {
      id: 'ATT005',
      employeeId: 'EMP005',
      employeeName: 'David Chen',
      department: 'Engineering',
      date: '2024-02-15',
      checkIn: '10:30',
      checkOut: '19:15',
      breakStart: '13:30',
      breakEnd: '14:30',
      totalHours: 7.75,
      status: 'Late',
      location: 'Office',
      checkInMethod: 'Web Portal',
      notes: 'Traffic delay',
      overtime: 0.25,
      isHoliday: false
    },
    {
      id: 'ATT006',
      employeeId: 'EMP006',
      employeeName: 'Sarah Johnson',
      department: 'Design',
      date: '2024-02-15',
      checkIn: '09:30',
      checkOut: '14:00',
      breakStart: '12:00',
      breakEnd: '12:30',
      totalHours: 4,
      status: 'Half Day',
      location: 'Office',
      checkInMethod: 'Biometric',
      notes: 'Personal appointment',
      overtime: 0,
      isHoliday: false
    }
  ]);

  const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
  const statuses = ['All Status', 'Present', 'Absent', 'Late', 'Half Day', 'On Leave', 'Work From Home'];

  // Filter records for current date
  const todayRecords = attendanceRecords.filter(record => record.date === currentDate.toISOString().split('T')[0]);

  // Filter records based on filters
  const filteredRecords = useMemo(() => {
    return todayRecords.filter(record => {
      const matchesDepartment = selectedDepartment === 'All Departments' || record.department === selectedDepartment;
      const matchesStatus = selectedStatusFilter === 'All Status' || record.status === selectedStatusFilter;
      const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDepartment && matchesStatus && matchesSearch;
    });
  }, [todayRecords, selectedDepartment, selectedStatusFilter, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const present = todayRecords.filter(r => r.status === 'Present' || r.status === 'Late' || r.status === 'Half Day' || r.status === 'Work From Home').length;
    const absent = todayRecords.filter(r => r.status === 'Absent' || r.status === 'On Leave').length;
    const late = todayRecords.filter(r => r.status === 'Late').length;
    const avgHours = todayRecords.length > 0 ? todayRecords.reduce((sum, r) => sum + r.totalHours, 0) / todayRecords.length : 0;

    return { totalEmployees, present, absent, late, avgHours };
  }, [todayRecords, employees]);

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700 border-green-200';
      case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Half Day': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'On Leave': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Work From Home': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLocationIcon = (location: AttendanceRecord['location']) => {
    switch (location) {
      case 'Office': return Building;
      case 'Remote': return Home;
      case 'Field': return MapPin;
      default: return Building;
    }
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    const employee = employees.find(emp => emp.id === record.employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setSelectedRecord(record);
      setShowModal(true);
    }
  };

  const handleAddRecord = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedRecord(null);
    setShowModal(true);
  };

  const handleSaveRecord = (recordData: Partial<AttendanceRecord>) => {
    if (selectedRecord) {
      // Update existing record
      setAttendanceRecords(prev => prev.map(record => 
        record.id === selectedRecord.id 
          ? { ...record, ...recordData }
          : record
      ));
    } else {
      // Add new record
      const newRecord: AttendanceRecord = {
        id: `ATT${Date.now()}`,
        checkInMethod: 'Manual',
        notes: '',
        overtime: 0,
        isHoliday: false,
        ...recordData
      } as AttendanceRecord;
      setAttendanceRecords(prev => [...prev, newRecord]);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleStatusClick = (status: AttendanceRecord['status']) => {
    const statusRecords = todayRecords.filter(r => r.status === status);
    if (statusRecords.length > 0) {
      setSelectedStatus(status);
      setViewMode('status');
    }
  };

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
    // Here you would implement actual check-in logic
  };

  // Render based on view mode
  if (viewMode === 'status') {
    const statusRecords = todayRecords.filter(r => r.status === selectedStatus);
    return (
      <StatusPage
        status={selectedStatus}
        records={statusRecords}
        employees={employees}
        onBack={() => setViewMode('dashboard')}
        onEditRecord={handleEditRecord}
        currentDate={currentDate}
      />
    );
  }

  if (viewMode === 'report') {
    return (
      <DailyReportPage
        records={todayRecords}
        employees={employees}
        onBack={() => setViewMode('dashboard')}
        currentDate={currentDate}
      />
    );
  }

  return (
    <div className="p-4 animate-fadeIn min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-poppins font-semibold text-gray-900 mb-2">
              Attendance Management
            </h1>
            <p className="text-gray-600 font-poppins text-sm">
              Track and manage employee attendance, working hours, and time-off
            </p>
          </div>
          
          {/* Check-in Button */}
          <CheckInButton onClick={handleCheckIn} isCheckedIn={isCheckedIn} />
        </div>
      </div>

      {/* Stats Dashboard - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <span className="font-poppins font-medium text-gray-900 text-sm">Total</span>
          </div>
          <p className="text-xl font-poppins font-semibold text-gray-900">{stats.totalEmployees}</p>
        </div>

        <div 
          onClick={() => handleStatusClick('Present')}
          className="bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="font-poppins font-medium text-gray-900 text-sm">Present</span>
          </div>
          <p className="text-xl font-poppins font-semibold text-green-600">{stats.present}</p>
        </div>

        <div 
          onClick={() => handleStatusClick('Absent')}
          className="bg-white p-4 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
        >
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={16} className="text-red-600" />
            <span className="font-poppins font-medium text-gray-900 text-sm">Absent</span>
          </div>
          <p className="text-xl font-poppins font-semibold text-red-600">{stats.absent}</p>
        </div>

        <div 
          onClick={() => handleStatusClick('Late')}
          className="bg-white p-4 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-yellow-600" />
            <span className="font-poppins font-medium text-gray-900 text-sm">Late</span>
          </div>
          <p className="text-xl font-poppins font-semibold text-yellow-600">{stats.late}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-purple-600" />
            <span className="font-poppins font-medium text-gray-900 text-sm">Avg Hours</span>
          </div>
          <p className="text-xl font-poppins font-semibold text-purple-600">{stats.avgHours.toFixed(1)}h</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Date Navigation and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Date Navigation */}
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
              <button
                onClick={() => navigateDate('prev')}
                className="p-1 hover:bg-white rounded transition-colors duration-200"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <span className="font-poppins font-medium text-gray-900 text-sm min-w-32 text-center">
                {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={() => navigateDate('next')}
                className="p-1 hover:bg-white rounded transition-colors duration-200"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-36"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white min-w-28"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500 font-poppins">
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
            </div>
            
            <button 
              onClick={() => setViewMode('report')}
              className="flex items-center gap-2 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="View Report"
            >
              <FileText size={16} />
            </button>

            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <Download size={16} />
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2 text-sm">
              <Plus size={14} />
              Mark Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-semibold text-gray-900 text-sm">Daily Attendance</h3>
            <button 
              onClick={() => setViewMode('report')}
              className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-poppins"
            >
              <Eye size={14} />
              View Report
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-xs">Employee</th>
                <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-xs">Check In</th>
                <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-xs">Check Out</th>
                <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-xs">Hours</th>
                <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-xs">Status</th>
                <th className="text-left px-4 py-3 font-poppins font-semibold text-gray-900 text-xs">Location</th>
                <th className="text-right px-4 py-3 font-poppins font-semibold text-gray-900 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const employee = employees.find(emp => emp.id === record.employeeId);
                const LocationIcon = getLocationIcon(record.location);
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-xs">
                          {employee?.avatar || record.employeeName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-poppins font-medium text-gray-900 text-sm">{record.employeeName}</div>
                          <div className="text-xs text-gray-500 font-poppins">{record.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-poppins text-sm text-gray-900">
                        {record.checkIn || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-poppins text-sm text-gray-900">
                        {record.checkOut || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-poppins text-sm text-gray-900">
                          {record.totalHours.toFixed(1)}h
                        </span>
                        {record.overtime > 0 && (
                          <span className="text-xs text-orange-600 font-poppins">
                            (+{record.overtime}h)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-poppins font-medium border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <LocationIcon size={12} className="text-gray-400" />
                        <span className="font-poppins text-sm text-gray-600">{record.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit Record"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Clock size={32} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-poppins font-medium text-gray-900 mb-2">
              No attendance records found
            </h3>
            <p className="text-gray-600 font-poppins text-xs mb-4">
              {searchQuery || selectedDepartment !== 'All Departments' || selectedStatusFilter !== 'All Status'
                ? 'Try adjusting your search criteria or filters.'
                : 'No attendance has been marked for this date.'
              }
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2 mx-auto text-sm">
              <Plus size={14} />
              Mark Attendance
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions for Missing Records */}
      {employees.filter(emp => !filteredRecords.find(record => record.employeeId === emp.id)).length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-yellow-600" />
            <h4 className="font-poppins font-semibold text-yellow-900 text-sm">Missing Attendance Records</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {employees
              .filter(emp => !filteredRecords.find(record => record.employeeId === emp.id))
              .map(employee => (
                <div key={employee.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-poppins font-bold text-xs">
                      {employee.avatar}
                    </div>
                    <div>
                      <div className="font-poppins font-medium text-gray-900 text-xs">{employee.name}</div>
                      <div className="text-xs text-gray-500 font-poppins">{employee.department}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddRecord(employee)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                    title="Add Record"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEmployee(null);
          setSelectedRecord(null);
        }}
        employee={selectedEmployee}
        date={currentDate.toISOString().split('T')[0]}
        record={selectedRecord}
        onSave={handleSaveRecord}
      />
    </div>
  );
};

export default AttendancePage;