import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { syncTasks, enableRealTime, disableRealTime } from '../store/slices/taskSlice';
import { selectIsRealTimeEnabled, selectLastSync } from '../store/selectors';

interface UseRealTimeSyncOptions {
  syncInterval?: number; // in milliseconds
  enableOnMount?: boolean;
}

export const useRealTimeSync = (options: UseRealTimeSyncOptions = {}) => {
  const {
    syncInterval = 30000, // 30 seconds default
    enableOnMount = true
  } = options;

  const dispatch = useAppDispatch();
  const isRealTimeEnabled = useAppSelector(selectIsRealTimeEnabled);
  const lastSync = useAppSelector(selectLastSync);

  // Enable real-time on mount if requested
  useEffect(() => {
    if (enableOnMount && !isRealTimeEnabled) {
      dispatch(enableRealTime());
    }
  }, [enableOnMount, isRealTimeEnabled, dispatch]);

  // Real-time synchronization effect
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const syncData = async () => {
      try {
        // In a real app, this would be an API call to fetch latest tasks
        // For now, we'll simulate it
        const timestamp = new Date().toISOString();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // For demo purposes, we'll just update the sync timestamp
        // In reality, you'd fetch actual tasks from the server
        console.log('Real-time sync completed at:', timestamp);
        
        // Uncomment when you have real API:
        // const response = await api.getTasks();
        // dispatch(syncTasks({ tasks: response.data, timestamp }));
        
      } catch (error) {
        console.error('Real-time sync failed:', error);
      }
    };

    // Initial sync
    syncData();

    // Set up interval for periodic sync
    const intervalId = setInterval(syncData, syncInterval);

    return () => clearInterval(intervalId);
  }, [isRealTimeEnabled, syncInterval, dispatch]);

  const toggleRealTime = () => {
    if (isRealTimeEnabled) {
      dispatch(disableRealTime());
    } else {
      dispatch(enableRealTime());
    }
  };

  const getSyncStatus = () => {
    if (!lastSync) return 'never';
    
    const lastSyncTime = new Date(lastSync).getTime();
    const now = Date.now();
    const diffMinutes = (now - lastSyncTime) / (1000 * 60);
    
    if (diffMinutes < 1) return 'just-now';
    if (diffMinutes < 5) return 'recent';
    if (diffMinutes < 30) return 'stale';
    return 'very-stale';
  };

  return {
    isRealTimeEnabled,
    lastSync,
    toggleRealTime,
    getSyncStatus: getSyncStatus(),
  };
}; 