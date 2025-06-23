import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Users, Bell } from 'lucide-react';

interface FloatingChatIconProps {
  onNavigateToChats: () => void;
}

const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({ onNavigateToChats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Mock unread messages
  const [recentChats, setRecentChats] = useState([
    {
      id: 1,
      name: 'Video Production Team',
      lastMessage: 'Hey team, the new project timeline is ready!',
      time: '2m ago',
      unread: 2,
      avatar: 'VP',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Announcements',
      lastMessage: 'New company policy updates available',
      time: '1h ago',
      unread: 1,
      avatar: '📢',
      color: 'bg-red-500'
    },
    {
      id: 3,
      name: 'UI/UX Design',
      lastMessage: 'Design review meeting at 3 PM',
      time: '3h ago',
      unread: 0,
      avatar: 'UX',
      color: 'bg-purple-500'
    }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenFullChats = () => {
    setIsOpen(false);
    onNavigateToChats();
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group transform hover:scale-110"
        >
          <MessageSquare size={26} className="group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-bounce shadow-md">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></div>
        </button>
      </div>

      {/* Quick Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <h3 className="font-semibold font-poppins">Team Chats</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenFullChats}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Open full chat"
              >
                <Users size={18} />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Recent Chats */}
          <div className="max-h-96 overflow-y-auto">
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                onClick={() => {
                  // Navigate to specific chat
                  handleOpenFullChats();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${chat.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 font-poppins text-sm truncate">
                        {chat.name}
                      </h4>
                      <span className="text-xs text-gray-500 font-poppins">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-poppins truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleOpenFullChats}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-poppins text-sm font-medium"
            >
              Open All Chats
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={toggleChat}
        />
      )}
    </>
  );
};

export default FloatingChatIcon; 