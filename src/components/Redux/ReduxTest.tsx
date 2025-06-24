import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAllTasks, selectTasksLoading, selectTasksError } from '../../store/selectors';
import type { Task } from '../../store/slices/taskSlice';
// Phase 4 imports
import { selectDragState, selectIsRealTimeEnabled, selectLastSync } from '../../store/selectors';
import RealTimeIndicator from '../Common/RealTimeIndicator';

const ReduxTest: React.FC = () => {
  const tasks = useAppSelector(selectAllTasks);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  
  // Phase 4: Drag and Drop state
  const dragState = useAppSelector(selectDragState);
  const isRealTimeEnabled = useAppSelector(selectIsRealTimeEnabled);
  const lastSync = useAppSelector(selectLastSync);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Redux Implementation Status</h2>
      
      {/* Phase Progress */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-green-700">Phase 1:</span>
          <span className="text-gray-700">Foundation Setup - ✅ COMPLETE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-green-700">Phase 2:</span>
          <span className="text-gray-700">Core Task State Migration - ✅ COMPLETE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-green-700">Phase 3:</span>
          <span className="text-gray-700">UI State Management - ✅ COMPLETE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-blue-700">Phase 4:</span>
          <span className="text-gray-700">Advanced Features (Drag-Drop, Real-Time) - 🔄 IN PROGRESS</span>
        </div>
      </div>

      {/* Phase 4: Real-Time Status */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2 text-blue-900">Phase 4: Real-Time Sync Status</h3>
        <RealTimeIndicator size="sm" />
      </div>

      {/* Phase 4: Drag State */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2 text-gray-900">Phase 4: Drag & Drop State</h3>
        <div className="text-sm space-y-1">
          <div>Active ID: <span className="font-mono">{dragState.activeId || 'None'}</span></div>
          <div>Dragged Task: <span className="font-mono">{dragState.draggedTask?.title || 'None'}</span></div>
          <div>Optimistic Update: <span className="font-mono">{dragState.isOptimisticUpdate ? 'Yes' : 'No'}</span></div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
          <div className="text-sm text-blue-800">Total Tasks</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter((task: Task) => task.progress === 100).length}
          </div>
          <div className="text-sm text-green-800">Completed</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {tasks.filter((task: Task) => task.progress > 0 && task.progress < 100).length}
          </div>
          <div className="text-sm text-yellow-800">In Progress</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {tasks.filter((task: Task) => task.progress === 0).length}
          </div>
          <div className="text-sm text-gray-800">Not Started</div>
        </div>
      </div>

      {/* Task Sample */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Sample Tasks from Redux Store:</h3>
        {loading && <p className="text-blue-600">Loading tasks...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {tasks.slice(0, 3).map((task: Task) => (
          <div key={task.id} className="mb-2 p-2 bg-white rounded border">
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-gray-600">
              {task.assignee} • {task.client} • {task.subStatus} • {task.progress}%
            </div>
          </div>
        ))}
        {tasks.length > 3 && (
          <p className="text-gray-500 text-sm mt-2">
            ... and {tasks.length - 3} more tasks
          </p>
        )}
      </div>

      {/* Phase 4 Implementation Notes */}
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
        <h4 className="font-semibold text-yellow-800 mb-1">Phase 4 Implementation Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Drag & Drop state now managed by Redux with local fallback</li>
          <li>• Real-time sync system with status indicators implemented</li>
          <li>• Optimistic updates for better user experience</li>
          <li>• Dual-state management ensures no functionality loss</li>
          <li>• Ready for Phase 5: Performance Optimization</li>
        </ul>
      </div>
    </div>
  );
};

export default ReduxTest; 