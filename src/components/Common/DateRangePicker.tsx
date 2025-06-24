import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, CalendarDays } from 'lucide-react';

export interface DateRange {
  startDate: string;
  endDate: string;
  preset: 'today' | 'week' | 'month' | 'year' | 'custom' | 'all';
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  showAllOption?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  value, 
  onChange, 
  className = "",
  showAllOption = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Get date calculations
  const getDateRange = (preset: DateRange['preset']): { startDate: string; endDate: string } => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (preset) {
      case 'today':
        return { startDate: todayStr, endDate: todayStr };
      
      case 'week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return {
          startDate: startOfWeek.toISOString().split('T')[0],
          endDate: endOfWeek.toISOString().split('T')[0]
        };
      }
      
      case 'month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0]
        };
      }
      
      case 'year': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);
        return {
          startDate: startOfYear.toISOString().split('T')[0],
          endDate: endOfYear.toISOString().split('T')[0]
        };
      }
      
      case 'all':
        return { startDate: '2020-01-01', endDate: '2030-12-31' };
      
      default:
        return { startDate: todayStr, endDate: todayStr };
    }
  };

  // Initialize custom dates from value
  useEffect(() => {
    if (value.preset === 'custom') {
      setCustomStartDate(value.startDate);
      setCustomEndDate(value.endDate);
    }
  }, [value]);

  const handlePresetChange = (preset: DateRange['preset']) => {
    if (preset === 'custom') {
      const today = new Date().toISOString().split('T')[0];
      setCustomStartDate(today);
      setCustomEndDate(today);
      onChange({
        preset: 'custom',
        startDate: today,
        endDate: today
      });
      // Keep dropdown open for custom range selection
      return;
    } else {
      const range = getDateRange(preset);
      onChange({
        preset,
        ...range
      });
    }
    setIsOpen(false);
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      onChange({
        preset: 'custom',
        startDate: customStartDate,
        endDate: customEndDate
      });
    }
  };

  const getDisplayText = () => {
    switch (value.preset) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      case 'all':
        return 'All Time';
      case 'custom':
        return `${value.startDate} to ${value.endDate}`;
      default:
        return 'Select Date Range';
    }
  };

  const presets = [
    ...(showAllOption ? [{ key: 'all' as const, label: 'All Time' }] : []),
    { key: 'today' as const, label: 'Today' },
    { key: 'week' as const, label: 'This Week' },
    { key: 'month' as const, label: 'This Month' },
    { key: 'year' as const, label: 'This Year' },
    { key: 'custom' as const, label: 'Custom Range' }
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-xs bg-white hover:bg-gray-50 transition-colors min-w-32"
      >
        <Calendar size={14} className="text-gray-400" />
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown size={14} className="text-gray-400 ml-auto" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-64 p-2">
            <div className="space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handlePresetChange(preset.key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-poppins transition-colors ${
                    value.preset === preset.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {value.preset === 'custom' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => {
                        setCustomStartDate(e.target.value);
                        if (e.target.value && customEndDate) {
                          onChange({
                            preset: 'custom',
                            startDate: e.target.value,
                            endDate: customEndDate
                          });
                        }
                      }}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm font-poppins focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => {
                        setCustomEndDate(e.target.value);
                        if (customStartDate && e.target.value) {
                          onChange({
                            preset: 'custom',
                            startDate: customStartDate,
                            endDate: e.target.value
                          });
                        }
                      }}
                      min={customStartDate}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm font-poppins focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;