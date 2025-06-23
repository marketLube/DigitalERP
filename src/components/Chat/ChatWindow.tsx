import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Smile, Paperclip, MoreVertical, Settings, 
  Users, Volume2, VolumeX, Search, Hash, Lock,
  Reply, Edit3, Trash2, Clock, Shield, X, CheckCheck
} from 'lucide-react';
import { ChatChannel, ChatUser, ChatMessage } from '../../types/chat';
import EmojiPicker from './EmojiPicker';

interface ChatWindowProps {
  channel: ChatChannel;
  currentUser: ChatUser;
  onUpdateChannel: (channel: ChatChannel) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ channel, currentUser, onUpdateChannel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [highlightedMessages, setHighlightedMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        channelId: channel.id,
        senderId: 'user-1',
        senderName: 'Alice Smith',
        content: channel.type === 'announcement' 
          ? '🎉 Welcome to the new announcement channel! This is where we\'ll share important company updates.'
          : `Welcome to the ${channel.name} channel! Let's collaborate and get things done.`,
        type: 'text',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isEdited: false,
        reactions: [
          { emoji: '👍', users: ['user-2', 'user-3'], count: 2 },
          { emoji: '🎉', users: ['user-4'], count: 1 }
        ]
      },
      {
        id: '2',
        channelId: channel.id,
        senderId: 'user-2',
        senderName: 'Bob Johnson',
        content: 'Great! Looking forward to working together on this.',
        type: 'text',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isEdited: false,
        reactions: []
      },
      {
        id: '3',
        channelId: channel.id,
        senderId: 'user-3',
        senderName: 'Carol Williams',
        content: 'Has anyone reviewed the latest project timeline? We need to discuss the upcoming milestones.',
        type: 'text',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isEdited: false,
        reactions: []
      }
    ];

    // Add specific messages for announcement channel
    if (channel.type === 'announcement') {
      mockMessages.push({
        id: '4',
        channelId: channel.id,
        senderId: 'admin-1',
        senderName: 'Admin',
        content: '📢 Reminder: All team meetings will be held virtually this week. Please check your calendars for updated meeting links.',
        type: 'text',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isEdited: false,
        reactions: [
          { emoji: '✅', users: ['user-1', 'user-2', 'user-3', 'user-4'], count: 4 }
        ]
      });
    }

    setMessages(mockMessages);
  }, [channel.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    // Check if user can send messages in announcement channel
    if (channel.type === 'announcement' && currentUser.role !== 'admin') {
      alert('Only administrators can post in announcement channels.');
      return;
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: channel.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date(),
      isEdited: false,
      reactions: []
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // Update channel's last activity
    onUpdateChannel({
      ...channel,
      lastActivity: new Date(),
      unreadCount: 0
    });
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const matches = messages
        .filter(msg => msg.content.toLowerCase().includes(query.toLowerCase()))
        .map(msg => msg.id);
      setHighlightedMessages(matches);
    } else {
      setHighlightedMessages([]);
    }
  };

  // Emoji handling
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes(currentUser.id)) {
            // Remove reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { 
                      ...r, 
                      users: r.users.filter(u => u !== currentUser.id),
                      count: r.count - 1
                    }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { 
                      ...r, 
                      users: [...r.users, currentUser.id],
                      count: r.count + 1
                    }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...msg,
            reactions: [...msg.reactions, {
              emoji,
              users: [currentUser.id],
              count: 1
            }]
          };
        }
      }
      return msg;
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getChannelIcon = () => {
    if (channel.type === 'announcement') {
      return <Volume2 size={20} className="text-red-500" />;
    }
    if (channel.isPrivate) {
      return <Lock size={20} className="text-gray-500" />;
    }
    return <Hash size={20} className="text-gray-500" />;
  };

  const canSendMessage = channel.type !== 'announcement' || currentUser.role === 'admin';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
            {channel.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {getChannelIcon()}
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                {channel.name}
              </h2>
              {channel.type === 'announcement' && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  Announcements Only
                </span>
              )}
            </div>
            {channel.description && (
              <p className="text-sm text-gray-600 font-poppins">
                {channel.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-colors ${
              showSearch ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Search size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Users size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setHighlightedMessages([]);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {highlightedMessages.length > 0 && (
            <p className="text-sm text-gray-600 mt-2 font-poppins">
              {highlightedMessages.length} message{highlightedMessages.length !== 1 ? 's' : ''} found
            </p>
          )}
                 </div>
       )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];
          const isFromCurrentUser = message.senderId === currentUser.id;
          const showDate = !prevMessage || 
            formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
          const showAvatar = !prevMessage || 
            prevMessage.senderId !== message.senderId ||
            message.timestamp.getTime() - prevMessage.timestamp.getTime() > 5 * 60 * 1000;
          const isLastInGroup = !nextMessage || 
            nextMessage.senderId !== message.senderId ||
            nextMessage.timestamp.getTime() - message.timestamp.getTime() > 5 * 60 * 1000;
          const isHighlighted = highlightedMessages.includes(message.id);

          return (
            <div key={message.id}>
              {/* Date Separator */}
              {showDate && (
                <div className="flex items-center justify-center py-4">
                  <div className="bg-white text-gray-600 text-sm px-4 py-2 rounded-full font-poppins shadow-sm border">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className={`flex gap-3 ${isFromCurrentUser ? 'justify-end' : 'justify-start'} group ${
                isHighlighted ? 'bg-yellow-100 -mx-4 px-4 py-2 rounded-lg' : ''
              }`}>
                {/* Avatar (left side for others) */}
                {!isFromCurrentUser && (
                  <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {message.senderName.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`max-w-xs lg:max-w-md ${isFromCurrentUser ? 'ml-auto' : ''}`}>
                  {/* Sender name and time (for others) */}
                  {!isFromCurrentUser && showAvatar && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                      <span className="font-semibold text-gray-900 font-poppins text-sm">
                        {message.senderName}
                      </span>
                      {message.senderId.includes('admin') && (
                        <Shield size={12} className="text-blue-500" />
                      )}
                      <span className="text-xs text-gray-500 font-poppins">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  {/* Message Bubble */}
                  <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                    isFromCurrentUser 
                      ? 'bg-blue-500 text-white ml-auto' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  } ${
                    showAvatar && isLastInGroup
                      ? isFromCurrentUser 
                        ? 'rounded-br-lg' 
                        : 'rounded-bl-lg'
                      : showAvatar
                      ? isFromCurrentUser 
                        ? 'rounded-br-2xl' 
                        : 'rounded-bl-2xl'
                      : isLastInGroup
                      ? isFromCurrentUser 
                        ? 'rounded-br-lg' 
        : 'rounded-bl-lg'
                      : ''
                  }`}>
                    {/* Message content */}
                    <div className={`font-poppins text-sm leading-relaxed ${
                      isFromCurrentUser ? 'text-white' : 'text-gray-900'
                    }`}>
                      {message.content}
                    </div>
                    
                    {/* Time and status for current user messages */}
                    {isFromCurrentUser && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-blue-100 font-poppins">
                          {formatTime(message.timestamp)}
                        </span>
                        <CheckCheck size={12} className="text-blue-200" />
                      </div>
                    )}
                    
                    {message.isEdited && (
                      <span className={`text-xs font-poppins italic ${
                        isFromCurrentUser ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        edited
                      </span>
                    )}
                  </div>

                  {/* Reactions */}
                  {message.reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      {message.reactions.map((reaction) => (
                        <button
                          key={reaction.emoji}
                          onClick={() => handleReaction(message.id, reaction.emoji)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all shadow-sm ${
                            reaction.users.includes(currentUser.id)
                              ? 'bg-blue-100 text-blue-800 border border-blue-200 scale-110'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <span>{reaction.emoji}</span>
                          <span className="font-medium">{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1 pt-1 ${
                  isFromCurrentUser ? 'order-first mr-2' : 'ml-2'
                }`}>
                  <button 
                    onClick={() => handleReaction(message.id, '👍')}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full bg-white shadow-sm border border-gray-200 hover:border-gray-300 transition-all"
                    title="Add reaction"
                  >
                    <Smile size={14} />
                  </button>
                  {message.senderId === currentUser.id && (
                    <>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full bg-white shadow-sm border border-gray-200 hover:border-gray-300 transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded-full bg-white shadow-sm border border-gray-200 hover:border-red-300 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>

                {/* Avatar (right side for current user) */}
                {isFromCurrentUser && (
                  <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-gray-500 text-sm font-poppins">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {canSendMessage ? (
        <div className="p-4 border-t border-gray-200 bg-white relative">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={`Message ${channel.name}...`}
                  className="w-full p-3 pr-20 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins resize-none min-h-[52px] max-h-32"
                  disabled={!canSendMessage}
                  rows={1}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`transition-colors p-1 rounded-full hover:bg-gray-100 ${
                      showEmojiPicker ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Add emoji"
                  >
                    <Smile size={18} />
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-none"
            >
              <Send size={18} />
            </button>
          </form>
          
          {/* Emoji Picker */}
          <EmojiPicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={handleEmojiSelect}
            position={{ bottom: 80, right: 80 }}
          />
        </div>
      ) : (
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 text-center">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Volume2 size={20} className="text-red-500 mr-2" />
              <span className="text-red-600 font-semibold font-poppins">Announcement Channel</span>
            </div>
            <p className="text-gray-600 font-poppins text-sm">
              Only administrators can post messages in this channel. All team members can view and react to announcements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow; 