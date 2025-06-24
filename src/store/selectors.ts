import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Task } from './slices/taskSlice';

// Base selectors
export const selectTasksState = (state: RootState) => state.tasks;
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;

// Memoized selectors
export const selectTaskById = createSelector(
  [selectAllTasks, (state: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find(task => task.id === taskId)
);

export const selectTasksByClient = createSelector(
  [selectAllTasks, (state: RootState, client: string) => client],
  (tasks, client) => {
    if (client === 'All Clients') return tasks;
    return tasks.filter(task => task.client === client);
  }
);

export const selectTasksByStatus = createSelector(
  [selectAllTasks, (state: RootState, mainStatus: string, subStatus?: string) => ({ mainStatus, subStatus })],
  (tasks, { mainStatus, subStatus }) => {
    return tasks.filter(task => {
      if (mainStatus === 'All Statuses') return true;
      if (subStatus) {
        return task.mainStatus === mainStatus && task.subStatus === subStatus;
      }
      return task.mainStatus === mainStatus;
    });
  }
);

export const selectTasksByAssignee = createSelector(
  [selectAllTasks, (state: RootState, assignee: string) => assignee],
  (tasks, assignee) => {
    if (assignee === 'All Assignees') return tasks;
    return tasks.filter(task => task.assignee === assignee);
  }
);

export const selectOverdueTasks = createSelector(
  [selectAllTasks],
  (tasks) => {
    const now = new Date();
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.progress < 100;
    });
  }
);

export const selectTasksByPriority = createSelector(
  [selectAllTasks, (state: RootState, priority: string) => priority],
  (tasks, priority) => {
    if (priority === 'All Priorities') return tasks;
    return tasks.filter(task => task.priority === priority);
  }
);

export const selectTasksWithSearch = createSelector(
  [selectAllTasks, (state: RootState, searchTerm: string) => searchTerm],
  (tasks, searchTerm) => {
    if (!searchTerm.trim()) return tasks;
    const lowercaseSearch = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseSearch) ||
      task.description.toLowerCase().includes(lowercaseSearch) ||
      task.client.toLowerCase().includes(lowercaseSearch) ||
      task.assignee.toLowerCase().includes(lowercaseSearch)
    );
  }
);

// Complex filtered selector combining multiple filters
export const selectFilteredTasks = createSelector(
  [
    selectAllTasks,
    (state: RootState, filters: {
      client?: string;
      mainStatus?: string;
      subStatus?: string;
      assignee?: string;
      priority?: string;
      searchTerm?: string;
      showOverdue?: boolean;
    }) => filters
  ],
  (tasks, filters) => {
    let filteredTasks = tasks;

    // Apply client filter
    if (filters.client && filters.client !== 'All Clients') {
      filteredTasks = filteredTasks.filter(task => task.client === filters.client);
    }

    // Apply status filter
    if (filters.mainStatus && filters.mainStatus !== 'All Statuses') {
      filteredTasks = filteredTasks.filter(task => task.mainStatus === filters.mainStatus);
      
      if (filters.subStatus && filters.subStatus !== 'All Sub-Statuses') {
        filteredTasks = filteredTasks.filter(task => task.subStatus === filters.subStatus);
      }
    }

    // Apply assignee filter
    if (filters.assignee && filters.assignee !== 'All Assignees') {
      filteredTasks = filteredTasks.filter(task => task.assignee === filters.assignee);
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== 'All Priorities') {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    // Apply search filter
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const lowercaseSearch = filters.searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(lowercaseSearch) ||
        task.description.toLowerCase().includes(lowercaseSearch) ||
        task.client.toLowerCase().includes(lowercaseSearch) ||
        task.assignee.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Apply overdue filter
    if (filters.showOverdue) {
      const now = new Date();
      filteredTasks = filteredTasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate < now && task.progress < 100;
      });
    }

    return filteredTasks;
  }
);

// Statistics selectors
export const selectTaskStats = createSelector(
  [selectAllTasks],
  (tasks) => ({
    total: tasks.length,
    completed: tasks.filter(task => task.progress === 100).length,
    inProgress: tasks.filter(task => task.progress > 0 && task.progress < 100).length,
    notStarted: tasks.filter(task => task.progress === 0).length,
    overdue: tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date() && task.progress < 100;
    }).length,
  })
);

// UI State Selectors for Phase 3 migration
// Modal states
export const selectShowEditModal = (state: RootState) => state.ui.showEditModal;
export const selectSelectedTask = (state: RootState) => state.ui.selectedTask;
export const selectPrefilledMainStatus = (state: RootState) => state.ui.prefilledMainStatus;
export const selectPrefilledSubStatus = (state: RootState) => state.ui.prefilledSubStatus;
export const selectShowEmployeeModal = (state: RootState) => state.ui.showEmployeeModal;
export const selectShowIndividualReport = (state: RootState) => state.ui.showIndividualReport;

// Dropdown states
export const selectShowTeamDropdown = (state: RootState) => state.ui.showTeamDropdown;
export const selectShowStatusDropdown = (state: RootState) => state.ui.showStatusDropdown;
export const selectShowAssigneeDropdown = (state: RootState) => state.ui.showAssigneeDropdown;
export const selectShowPriorityDropdown = (state: RootState) => state.ui.showPriorityDropdown;

// View and filter states
export const selectActiveTab = (state: RootState) => state.ui.activeTab;
export const selectViewMode = (state: RootState) => state.ui.viewMode;
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;
export const selectSelectedTeam = (state: RootState) => state.ui.selectedTeam;
export const selectSelectedMainStatus = (state: RootState) => state.ui.selectedMainStatus;
export const selectSelectedAssignee = (state: RootState) => state.ui.selectedAssignee;
export const selectSelectedTimeframe = (state: RootState) => state.ui.selectedTimeframe;
export const selectSelectedPriority = (state: RootState) => state.ui.selectedPriority;
export const selectSelectedProgress = (state: RootState) => state.ui.selectedProgress;
export const selectShowOverdue = (state: RootState) => state.ui.showOverdue;
export const selectDateRange = (state: RootState) => state.ui.dateRange;

// Employee and reports states
export const selectSelectedEmployee = (state: RootState) => state.ui.selectedEmployee;
export const selectSelectedEmployeeForTasks = (state: RootState) => state.ui.selectedEmployeeForTasks;
export const selectSelectedTeamForTasks = (state: RootState) => state.ui.selectedTeamForTasks;
export const selectSelectedTeamForPerformance = (state: RootState) => state.ui.selectedTeamForPerformance;
export const selectSelectedEmployeeForReport = (state: RootState) => state.ui.selectedEmployeeForReport;
export const selectReportsSearchQuery = (state: RootState) => state.ui.reportsSearchQuery;
export const selectReportsTeamFilter = (state: RootState) => state.ui.reportsTeamFilter;
export const selectReportsViewMode = (state: RootState) => state.ui.reportsViewMode;
export const selectEmployeeModalDateFilter = (state: RootState) => state.ui.employeeModalDateFilter;
export const selectReportsActiveTab = (state: RootState) => state.ui.reportsActiveTab;

// Status management states
export const selectSelectedTeamForStatus = (state: RootState) => state.ui.selectedTeamForStatus;
export const selectShowAddMainStatus = (state: RootState) => state.ui.showAddMainStatus;
export const selectShowAddSubStatus = (state: RootState) => state.ui.showAddSubStatus;

// Phase 4: Drag and Drop Selectors
export const selectDragState = (state: RootState) => state.tasks.dragState;
export const selectActiveId = (state: RootState) => state.tasks.dragState.activeId;
export const selectDraggedTask = (state: RootState) => state.tasks.dragState.draggedTask;
export const selectIsOptimisticUpdate = (state: RootState) => state.tasks.dragState.isOptimisticUpdate;

// Phase 4: Real-time Update Selectors
export const selectIsRealTimeEnabled = (state: RootState) => state.tasks.isRealTimeEnabled;
export const selectLastSync = (state: RootState) => state.tasks.lastSync;

// Phase 4: Enhanced Task Selectors with Drag Optimization
export const selectTasksForDragDrop = createSelector(
  [selectAllTasks, selectActiveId],
  (tasks: Task[], activeId: string | null) => {
    // Return tasks optimized for drag and drop operations
    return tasks.map((task: Task) => ({
      ...task,
      isDragging: task.id === activeId
    }));
  }
);

// Phase 4: Task Status Groups for Drag Columns
export const selectTasksGroupedBySubStatus = createSelector(
  [selectAllTasks],
  (tasks) => {
    const tasksByStatus: { [status: string]: Task[] } = {};
    tasks.forEach((task: Task) => {
      if (!tasksByStatus[task.subStatus]) {
        tasksByStatus[task.subStatus] = [];
      }
      tasksByStatus[task.subStatus].push(task);
    });
    return tasksByStatus;
  }
);

// Phase 4: Real-time Status Indicator
export const selectSyncStatus = createSelector(
  [selectLastSync, selectIsRealTimeEnabled, selectTasksLoading],
  (lastSync, isRealTimeEnabled, isLoading) => {
    if (isLoading) return 'syncing';
    if (!isRealTimeEnabled) return 'offline';
    if (!lastSync) return 'never';
    
    const lastSyncTime = new Date(lastSync).getTime();
    const now = Date.now();
    const diffMinutes = (now - lastSyncTime) / (1000 * 60);
    
    if (diffMinutes < 1) return 'just-now';
    if (diffMinutes < 5) return 'recent';
    if (diffMinutes < 30) return 'stale';
    return 'very-stale';
  }
); 