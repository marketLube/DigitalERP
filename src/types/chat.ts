export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'team' | 'announcement' | 'direct';
  color: string;
  avatar: string;
  isPrivate: boolean;
  allowedUsers: string[]; // User IDs who can access this channel
  admins: string[]; // User IDs who can manage this channel
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  unreadCount: number;
  isArchived: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  timestamp: Date;
  isEdited: boolean;
  editedAt?: Date;
  replyTo?: string; // Message ID this is replying to
  reactions: ChatReaction[];
  attachments?: ChatAttachment[];
}

export interface ChatReaction {
  emoji: string;
  users: string[]; // User IDs who reacted
  count: number;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ChatTyping {
  channelId: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface ChatNotification {
  id: string;
  type: 'mention' | 'message' | 'channel_invite';
  channelId: string;
  channelName: string;
  messageId?: string;
  content: string;
  isRead: boolean;
  timestamp: Date;
}

export const predefinedChannels: Omit<ChatChannel, 'id' | 'createdAt' | 'lastActivity' | 'unreadCount'>[] = [
  {
    name: 'Announcements',
    description: 'Company-wide announcements and updates',
    type: 'announcement',
    color: 'bg-red-500',
    avatar: '📢',
    isPrivate: false,
    allowedUsers: [], // All users can see
    admins: [], // Only admins can post
    createdBy: 'system',
    isArchived: false
  },
  {
    name: 'Video Production Team',
    description: 'Collaboration space for video production projects',
    type: 'team',
    color: 'bg-blue-500',
    avatar: 'VP',
    isPrivate: false,
    allowedUsers: [],
    admins: [],
    createdBy: 'system',
    isArchived: false
  },
  {
    name: 'UI/UX Design',
    description: 'Design discussions and feedback',
    type: 'team',
    color: 'bg-purple-500',
    avatar: 'UX',
    isPrivate: false,
    allowedUsers: [],
    admins: [],
    createdBy: 'system',
    isArchived: false
  },
  {
    name: 'Development',
    description: 'Technical discussions and code reviews',
    type: 'team',
    color: 'bg-green-500',
    avatar: 'DEV',
    isPrivate: false,
    allowedUsers: [],
    admins: [],
    createdBy: 'system',
    isArchived: false
  },
  {
    name: 'Marketing',
    description: 'Marketing campaigns and strategies',
    type: 'team',
    color: 'bg-orange-500',
    avatar: 'MKT',
    isPrivate: false,
    allowedUsers: [],
    admins: [],
    createdBy: 'system',
    isArchived: false
  },
  {
    name: 'Sales',
    description: 'Sales team coordination and updates',
    type: 'team',
    color: 'bg-indigo-500',
    avatar: 'SALES',
    isPrivate: false,
    allowedUsers: [],
    admins: [],
    createdBy: 'system',
    isArchived: false
  }
]; 