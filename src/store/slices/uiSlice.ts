import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from './taskSlice';

// UI State Interface
interface UIState {
  // Modal states
  showEditModal: boolean;
  selectedTask: Task | null;
  prefilledMainStatus: string;
  prefilledSubStatus: string;
  showEmployeeModal: boolean;
  showIndividualReport: boolean;
  
  // Dropdown states
  showTeamDropdown: boolean;
  showStatusDropdown: boolean;
  showAssigneeDropdown: boolean;
  showPriorityDropdown: boolean;
  
  // View and filter states
  activeTab: 'tasks' | 'notes' | 'my-tasks' | 'calendar' | 'reports' | 'settings';
  viewMode: 'kanban' | 'list' | 'calendar';
  searchQuery: string;
  selectedTeam: string;
  selectedMainStatus: string;
  selectedAssignee: string;
  selectedTimeframe: string;
  selectedPriority: string;
  selectedProgress: string;
  showOverdue: boolean;
  
  // Employee and reports states
  selectedEmployee: string;
  selectedEmployeeForTasks: string;
  selectedTeamForTasks: string;
  selectedTeamForPerformance: string;
  selectedEmployeeForReport: string;
  reportsSearchQuery: string;
  reportsTeamFilter: string;
  reportsViewMode: 'cards' | 'list';
  employeeModalDateFilter: 'today' | 'week' | 'month' | '3months' | '6months' | 'year';
  
  // Reports sub-navigation state
  reportsActiveTab: 'individual' | 'team' | 'task';
  
  // Status management states
  selectedTeamForStatus: string;
  showAddMainStatus: boolean;
  showAddSubStatus: string | null;
  
  // Date range state
  dateRange: {
    preset: 'today' | 'week' | 'month' | 'year' | 'custom' | 'all';
    startDate: string;
    endDate: string;
  };
}

// Initial state matching current TaskboardPage defaults
const initialState: UIState = {
  // Modal states
  showEditModal: false,
  selectedTask: null,
  prefilledMainStatus: '',
  prefilledSubStatus: '',
  showEmployeeModal: false,
  showIndividualReport: false,
  
  // Dropdown states
  showTeamDropdown: false,
  showStatusDropdown: false,
  showAssigneeDropdown: false,
  showPriorityDropdown: false,
  
  // View and filter states
  activeTab: 'tasks',
  viewMode: 'kanban',
  searchQuery: '',
  selectedTeam: 'Video Production',
  selectedMainStatus: 'Pre-Production',
  selectedAssignee: 'All Assignees',
  selectedTimeframe: 'All Time',
  selectedPriority: 'All Priorities',
  selectedProgress: 'All Progress',
  showOverdue: false,
  
  // Employee and reports states
  selectedEmployee: '',
  selectedEmployeeForTasks: 'All Assignees',
  selectedTeamForTasks: 'All Teams',
  selectedTeamForPerformance: 'All Teams',
  selectedEmployeeForReport: '',
  reportsSearchQuery: '',
  reportsTeamFilter: 'All Teams',
  reportsViewMode: 'cards',
  employeeModalDateFilter: 'month',
  
  // Reports sub-navigation initial state
  reportsActiveTab: 'team',
  
  // Status management states
  selectedTeamForStatus: 'Video Production',
  showAddMainStatus: false,
  showAddSubStatus: null,
  
  // Date range state
  dateRange: {
    preset: 'all',
    startDate: '2020-01-01',
    endDate: '2030-12-31'
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    setShowEditModal: (state, action: PayloadAction<boolean>) => {
      state.showEditModal = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setPrefilledMainStatus: (state, action: PayloadAction<string>) => {
      state.prefilledMainStatus = action.payload;
    },
    setPrefilledSubStatus: (state, action: PayloadAction<string>) => {
      state.prefilledSubStatus = action.payload;
    },
    setShowEmployeeModal: (state, action: PayloadAction<boolean>) => {
      state.showEmployeeModal = action.payload;
    },
    setShowIndividualReport: (state, action: PayloadAction<boolean>) => {
      state.showIndividualReport = action.payload;
    },
    
    // Dropdown actions
    setShowTeamDropdown: (state, action: PayloadAction<boolean>) => {
      state.showTeamDropdown = action.payload;
    },
    setShowStatusDropdown: (state, action: PayloadAction<boolean>) => {
      state.showStatusDropdown = action.payload;
    },
    setShowAssigneeDropdown: (state, action: PayloadAction<boolean>) => {
      state.showAssigneeDropdown = action.payload;
    },
    setShowPriorityDropdown: (state, action: PayloadAction<boolean>) => {
      state.showPriorityDropdown = action.payload;
    },
    
    // View and filter actions
    setActiveTab: (state, action: PayloadAction<'tasks' | 'notes' | 'my-tasks' | 'calendar' | 'reports' | 'settings'>) => {
      state.activeTab = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'kanban' | 'list' | 'calendar'>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedTeam: (state, action: PayloadAction<string>) => {
      state.selectedTeam = action.payload;
    },
    setSelectedMainStatus: (state, action: PayloadAction<string>) => {
      state.selectedMainStatus = action.payload;
    },
    setSelectedAssignee: (state, action: PayloadAction<string>) => {
      state.selectedAssignee = action.payload;
    },
    setSelectedTimeframe: (state, action: PayloadAction<string>) => {
      state.selectedTimeframe = action.payload;
    },
    setSelectedPriority: (state, action: PayloadAction<string>) => {
      state.selectedPriority = action.payload;
    },
    setSelectedProgress: (state, action: PayloadAction<string>) => {
      state.selectedProgress = action.payload;
    },
    setShowOverdue: (state, action: PayloadAction<boolean>) => {
      state.showOverdue = action.payload;
    },
    
    // Employee and reports actions
    setSelectedEmployee: (state, action: PayloadAction<string>) => {
      state.selectedEmployee = action.payload;
    },
    setSelectedEmployeeForTasks: (state, action: PayloadAction<string>) => {
      state.selectedEmployeeForTasks = action.payload;
    },
    setSelectedTeamForTasks: (state, action: PayloadAction<string>) => {
      state.selectedTeamForTasks = action.payload;
    },
    setSelectedTeamForPerformance: (state, action: PayloadAction<string>) => {
      state.selectedTeamForPerformance = action.payload;
    },
    setSelectedEmployeeForReport: (state, action: PayloadAction<string>) => {
      state.selectedEmployeeForReport = action.payload;
    },
    setReportsSearchQuery: (state, action: PayloadAction<string>) => {
      state.reportsSearchQuery = action.payload;
    },
    setReportsTeamFilter: (state, action: PayloadAction<string>) => {
      state.reportsTeamFilter = action.payload;
    },
    setReportsViewMode: (state, action: PayloadAction<'cards' | 'list'>) => {
      state.reportsViewMode = action.payload;
    },
    setEmployeeModalDateFilter: (state, action: PayloadAction<'today' | 'week' | 'month' | '3months' | '6months' | 'year'>) => {
      state.employeeModalDateFilter = action.payload;
    },
    setReportsActiveTab: (state, action: PayloadAction<'individual' | 'team' | 'task'>) => {
      state.reportsActiveTab = action.payload;
    },
    
    // Status management actions
    setSelectedTeamForStatus: (state, action: PayloadAction<string>) => {
      state.selectedTeamForStatus = action.payload;
    },
    setShowAddMainStatus: (state, action: PayloadAction<boolean>) => {
      state.showAddMainStatus = action.payload;
    },
    setShowAddSubStatus: (state, action: PayloadAction<string | null>) => {
      state.showAddSubStatus = action.payload;
    },
    
    // Date range action
    setDateRange: (state, action: PayloadAction<{ preset: 'today' | 'week' | 'month' | 'year' | 'custom' | 'all'; startDate: string; endDate: string }>) => {
      state.dateRange = action.payload;
    },
    
    // Compound actions for common UI operations
    openEditModal: (state, action: PayloadAction<{ task?: Task | null; mainStatus?: string; subStatus?: string }>) => {
      const { task = null, mainStatus = '', subStatus = '' } = action.payload;
      state.showEditModal = true;
      state.selectedTask = task;
      state.prefilledMainStatus = mainStatus;
      state.prefilledSubStatus = subStatus;
    },
    closeEditModal: (state) => {
      state.showEditModal = false;
      state.selectedTask = null;
      state.prefilledMainStatus = '';
      state.prefilledSubStatus = '';
    },
    
    // Close all dropdowns
    closeAllDropdowns: (state) => {
      state.showTeamDropdown = false;
      state.showStatusDropdown = false;
      state.showAssigneeDropdown = false;
      state.showPriorityDropdown = false;
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedMainStatus = 'All Statuses';
      state.selectedAssignee = 'All Assignees';
      state.selectedPriority = 'All Priorities';
      state.selectedProgress = 'All Progress';
      state.showOverdue = false;
      state.dateRange = {
        preset: 'all',
        startDate: '2020-01-01',
        endDate: '2030-12-31'
      };
    }
  },
});

// Export actions
export const {
  // Modal actions
  setShowEditModal,
  setSelectedTask,
  setPrefilledMainStatus,
  setPrefilledSubStatus,
  setShowEmployeeModal,
  setShowIndividualReport,
  
  // Dropdown actions
  setShowTeamDropdown,
  setShowStatusDropdown,
  setShowAssigneeDropdown,
  setShowPriorityDropdown,
  
  // View and filter actions
  setActiveTab,
  setViewMode,
  setSearchQuery,
  setSelectedTeam,
  setSelectedMainStatus,
  setSelectedAssignee,
  setSelectedTimeframe,
  setSelectedPriority,
  setSelectedProgress,
  setShowOverdue,
  
  // Employee and reports actions
  setSelectedEmployee,
  setSelectedEmployeeForTasks,
  setSelectedTeamForTasks,
  setSelectedTeamForPerformance,
  setSelectedEmployeeForReport,
  setReportsSearchQuery,
  setReportsTeamFilter,
  setReportsViewMode,
  setEmployeeModalDateFilter,
  setReportsActiveTab,
  
  // Status management actions
  setSelectedTeamForStatus,
  setShowAddMainStatus,
  setShowAddSubStatus,
  
  // Date range action
  setDateRange,
  
  // Compound actions
  openEditModal,
  closeEditModal,
  closeAllDropdowns,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer; 