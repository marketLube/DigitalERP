import React from 'react';
import { Wifi, WifiOff, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useRealTimeSync } from '../../hooks/useRealTimeSync';

interface RealTimeIndicatorProps {
  showToggle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({ 
  showToggle = true, 
  size = 'md' 
}) => {
  const { isRealTimeEnabled, lastSync, toggleRealTime, getSyncStatus } = useRealTimeSync();

  const getStatusIcon = () => {
    if (!isRealTimeEnabled) return <WifiOff size={16} />;
    
    switch (getSyncStatus) {
      case 'just-now':
        return <CheckCircle size={16} />;
      case 'recent':
        return <Wifi size={16} />;
      case 'stale':
        return <Clock size={16} />;
      case 'very-stale':
        return <AlertCircle size={16} />;
      default:
        return <Wifi size={16} />;
    }
  };

  const getStatusColor = () => {
    if (!isRealTimeEnabled) return 'text-gray-400';
    
    switch (getSyncStatus) {
      case 'just-now':
        return 'text-green-500';
      case 'recent':
        return 'text-green-400';
      case 'stale':
        return 'text-yellow-500';
      case 'very-stale':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    if (!isRealTimeEnabled) return 'Real-time disabled';
    
    switch (getSyncStatus) {
      case 'just-now':
        return 'Synced just now';
      case 'recent':
        return 'Recently synced';
      case 'stale':
        return 'Sync outdated';
      case 'very-stale':
        return 'Sync very old';
      case 'never':
        return 'Never synced';
      default:
        return 'Unknown status';
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      {/* Status Icon and Text */}
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-poppins font-medium">
          {getStatusText()}
        </span>
      </div>

      {/* Last Sync Time */}
      {lastSync && (
        <span className="text-gray-500 text-xs">
          • Last: {formatLastSync()}
        </span>
      )}

      {/* Toggle Button */}
      {showToggle && (
        <button
          onClick={toggleRealTime}
          className={`ml-2 p-1 rounded transition-colors ${
            isRealTimeEnabled 
              ? 'text-blue-600 hover:bg-blue-50' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
          title={isRealTimeEnabled ? 'Disable real-time sync' : 'Enable real-time sync'}
        >
          <Zap size={14} />
        </button>
      )}
    </div>
  );
};

export default RealTimeIndicator; 