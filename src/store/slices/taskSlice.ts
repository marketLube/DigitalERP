import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';

// Define the Task interface (matching existing types)
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  client: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdDate: string;
  progress: number;
  mainStatus: string;
  subStatus: string;
  tags: string[];
  count?: number;
}

// Phase 4: Advanced Features - Drag and Drop Actions
interface DragState {
  activeId: string | null;
  draggedTask: Task | null;
  isOptimisticUpdate: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  // Phase 4: Drag and drop state
  dragState: DragState;
  // Phase 4: Real-time updates
  lastSync: string | null;
  isRealTimeEnabled: boolean;
}

// Helper function for date generation
const getCurrentMonthDate = (day: number) => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Initial state with existing tasks from TaskboardPage
const initialState: TaskState = {
  tasks: [
    // VIDEO PRODUCTION TEAM TASKS - Sample data from existing TaskboardPage
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
      id: 'vp5',
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
      id: 'vp6',
      title: 'Product Launch Commercial',
      description: 'High-impact commercial for new product launch campaign',
      assignee: 'Mike Chen',
      client: 'Innovation Inc.',
      dueDate: getCurrentMonthDate(18),
      createdDate: '2024-01-08',
      mainStatus: 'Post-Production',
      subStatus: 'Visual Effects',
      progress: 35,
      priority: 'High',
      tags: ['commercial', 'launch'],
      count: 6
    },
    {
      id: 'vp7',
      title: 'Event Highlight Reel',
      description: 'Create compelling highlight reel from company annual event',
      assignee: 'James Park',
      client: 'EventCorp',
      dueDate: getCurrentMonthDate(22),
      createdDate: '2024-01-09',
      mainStatus: 'Post-Production',
      subStatus: 'Revisions',
      progress: 75,
      priority: 'Medium',
      tags: ['event', 'highlights'],
      count: 3
    },
    {
      id: 'vp8',
      title: 'Brand Story Video',
      description: 'Develop authentic brand storytelling video for website',
      assignee: 'Sarah Johnson',
      client: 'BrandCorp',
      dueDate: getCurrentMonthDate(28),
      createdDate: '2024-01-10',
      mainStatus: 'Post-Production',
      subStatus: 'Final Approval',
      progress: 95,
      priority: 'Medium',
      tags: ['brand', 'story'],
      count: 2
    }
  ],
  loading: false,
  error: null,
  // Phase 4: Initialize drag state
  dragState: {
    activeId: null,
    draggedTask: null,
    isOptimisticUpdate: false,
  },
  // Phase 4: Real-time updates
  lastSync: null,
  isRealTimeEnabled: true,
};

// Async thunks for API operations (placeholder for now)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    // This will be replaced with actual API call
    return initialState.tasks;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, 'id' | 'createdDate'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
    };
    // This will be replaced with actual API call
    return newTask;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: Task) => {
    // This will be replaced with actual API call
    return task;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    // This will be replaced with actual API call
    return taskId;
  }
);

// Phase 4: Drag and Drop Actions
export const startDrag = createAction<{ taskId: string; task: Task }>('tasks/startDrag');
export const endDrag = createAction('tasks/endDrag');
export const updateTaskStatus = createAction<{ taskId: string; newStatus: string; optimistic?: boolean }>('tasks/updateTaskStatus');
export const moveTask = createAction<{ taskId: string; newStatus: string; newPosition?: number }>('tasks/moveTask');

// Phase 4: Real-time Update Actions
export const enableRealTime = createAction('tasks/enableRealTime');
export const disableRealTime = createAction('tasks/disableRealTime');
export const syncTasks = createAction<{ tasks: Task[]; timestamp: string }>('tasks/syncTasks');
export const optimisticUpdate = createAction<{ taskId: string; updates: Partial<Task> }>('tasks/optimisticUpdate');

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Synchronous actions
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      })
      // Phase 4: Drag and Drop Actions
      .addCase(startDrag, (state, action) => {
        state.dragState.activeId = action.payload.taskId;
        state.dragState.draggedTask = action.payload.task;
      })
      .addCase(endDrag, (state) => {
        state.dragState.activeId = null;
        state.dragState.draggedTask = null;
        state.dragState.isOptimisticUpdate = false;
      })
      .addCase(updateTaskStatus, (state, action) => {
        const { taskId, newStatus, optimistic = false } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          task.subStatus = newStatus;
          if (optimistic) {
            state.dragState.isOptimisticUpdate = true;
          }
        }
      })
      .addCase(moveTask, (state, action) => {
        const { taskId, newStatus, newPosition } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          task.subStatus = newStatus;
          // If position is specified, we could implement reordering logic here
          if (newPosition !== undefined) {
            // Remove task from current position
            const taskIndex = state.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              const [movedTask] = state.tasks.splice(taskIndex, 1);
              // Insert at new position
              state.tasks.splice(newPosition, 0, movedTask);
            }
          }
        }
      })
      // Phase 4: Real-time Update Actions
      .addCase(enableRealTime, (state) => {
        state.isRealTimeEnabled = true;
      })
      .addCase(disableRealTime, (state) => {
        state.isRealTimeEnabled = false;
      })
      .addCase(syncTasks, (state, action) => {
        const { tasks, timestamp } = action.payload;
        // Only sync if we don't have pending optimistic updates
        if (!state.dragState.isOptimisticUpdate) {
          state.tasks = tasks;
          state.lastSync = timestamp;
        }
      })
      .addCase(optimisticUpdate, (state, action) => {
        const { taskId, updates } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          Object.assign(task, updates);
          state.dragState.isOptimisticUpdate = true;
        }
      });
  },
});

export const {
  addTask,
  removeTask,
  editTask,
  setTasks,
  clearError,
} = taskSlice.actions;

export default taskSlice.reducer; 