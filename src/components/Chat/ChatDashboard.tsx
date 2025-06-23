import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Plus, Settings, Search, Users, Hash, 
  Lock, Volume2, VolumeX, MoreVertical, Edit3, Trash2,
  Shield, UserPlus, Eye, EyeOff, Archive
} from 'lucide-react';
import { ChatChannel, ChatUser, ChatMessage, predefinedChannels } from '../../types/chat';
import ChatWindow from './ChatWindow';
import CreateChannelModal from './CreateChannelModal';

const ChatDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<ChatUser>({
    id: 'current-user',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'admin', // Change to 'member' to test user experience
    status: 'online'
  });

  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(true);
  const [activeUsers] = useState<ChatUser[]>([
    { id: '1', name: 'Alice Smith', email: 'alice@company.com', role: 'member', status: 'online' },
    { id: '2', name: 'Bob Johnson', email: 'bob@company.com', role: 'member', status: 'away' },
    { id: '3', name: 'Carol Williams', email: 'carol@company.com', role: 'admin', status: 'online' },
    { id: '4', name: 'David Brown', email: 'david@company.com', role: 'member', status: 'offline' }
  ]);

  // Initialize channels on component mount
  useEffect(() => {
    const initialChannels: ChatChannel[] = predefinedChannels.map((channel, index) => ({
      ...channel,
      id: `channel-${index + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      unreadCount: Math.floor(Math.random() * 10)
    }));
    setChannels(initialChannels);
    setSelectedChannel(initialChannels[0]);
  }, []);

  // Filter channels based on user role and permissions
  const getVisibleChannels = () => {
    if (currentUser.role === 'admin') {
      return channels; // Admins see all channels
    }
    
    return channels.filter(channel => {
      if (channel.type === 'announcement') return true; // Everyone sees announcements
      if (channel.allowedUsers.length === 0) return true; // Public channels
      return channel.allowedUsers.includes(currentUser.id); // User-specific channels
    });
  };

  const filteredChannels = getVisibleChannels().filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (channel.description && channel.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateChannel = (channelData: Omit<ChatChannel, 'id' | 'createdAt' | 'lastActivity' | 'unreadCount'>) => {
    const newChannel: ChatChannel = {
      ...channelData,
      id: `channel-${Date.now()}`,
      createdAt: new Date(),
      lastActivity: new Date(),
      unreadCount: 0
    };
    setChannels([...channels, newChannel]);
    setShowCreateModal(false);
  };

  const handleDeleteChannel = (channelId: string) => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      setChannels(channels.filter(c => c.id !== channelId));
      if (selectedChannel?.id === channelId) {
        setSelectedChannel(filteredChannels[0] || null);
      }
    }
  };

  const handleArchiveChannel = (channelId: string) => {
    setChannels(channels.map(c => 
      c.id === channelId ? { ...c, isArchived: !c.isArchived } : c
    ));
  };

  const getChannelIcon = (channel: ChatChannel) => {
    if (channel.type === 'announcement') {
      return <Volume2 size={16} className="text-red-500" />;
    }
    if (channel.isPrivate) {
      return <Lock size={16} className="text-gray-500" />;
    }
    return <Hash size={16} className="text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar - Channels List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900 font-poppins flex items-center gap-2">
              <MessageSquare className="text-blue-600" size={24} />
              Team Chats
            </h1>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Create new channel"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedChannel?.id === channel.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 shadow-md transform scale-[1.02]'
                    : 'hover:bg-gray-50 border-2 border-transparent hover:shadow-sm hover:transform hover:scale-[1.01]'
                }`}
                onClick={() => setSelectedChannel(channel)}
              >
                <div className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                  {channel.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getChannelIcon(channel)}
                    <h3 className="font-medium text-gray-900 font-poppins text-sm truncate">
                      {channel.name}
                    </h3>
                    {channel.isArchived && (
                      <Archive size={14} className="text-gray-400" />
                    )}
                  </div>
                  {channel.description && (
                    <p className="text-xs text-gray-600 font-poppins truncate">
                      {channel.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {channel.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {channel.unreadCount > 9 ? '9+' : channel.unreadCount}
                    </span>
                  )}
                  
                  {/* Admin Actions */}
                  {currentUser.role === 'admin' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveChannel(channel.id);
                          }}
                          className="p-1 text-gray-400 hover:text-orange-600 rounded transition-colors"
                          title={channel.isArchived ? "Unarchive" : "Archive"}
                        >
                          <Archive size={14} />
                        </button>
                        {channel.createdBy !== 'system' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChannel(channel.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title="Delete channel"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Users */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 font-poppins text-sm">
              Online Users ({activeUsers.filter(u => u.status === 'online').length})
            </h3>
            <button
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showOnlineUsers ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          {showOnlineUsers && (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {activeUsers.filter(u => u.status !== 'offline').map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
                      {user.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                  </div>
                  <span className="text-sm text-gray-700 font-poppins truncate">
                    {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <Shield size={12} className="text-blue-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <ChatWindow 
            channel={selectedChannel} 
            currentUser={currentUser}
            onUpdateChannel={(updatedChannel: ChatChannel) => {
              setChannels(channels.map(c => 
                c.id === updatedChannel.id ? updatedChannel : c
              ));
              setSelectedChannel(updatedChannel);
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 font-poppins mb-2">
                Select a channel to start chatting
              </h3>
              <p className="text-gray-600 font-poppins">
                Choose a channel from the sidebar to view messages and participate in discussions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <CreateChannelModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateChannel}
          currentUser={currentUser}
          existingUsers={activeUsers}
        />
      )}
    </div>
  );
};

export default ChatDashboard; 