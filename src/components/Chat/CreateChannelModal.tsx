import React, { useState } from 'react';
import { X, Hash, Lock, Volume2, Check } from 'lucide-react';
import { ChatChannel, ChatUser } from '../../types/chat';

interface CreateChannelModalProps {
  onClose: () => void;
  onSubmit: (channelData: Omit<ChatChannel, 'id' | 'createdAt' | 'lastActivity' | 'unreadCount'>) => void;
  currentUser: ChatUser;
  existingUsers: ChatUser[];
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  onClose,
  onSubmit,
  currentUser,
  existingUsers
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'team' as 'team' | 'announcement',
    isPrivate: false,
    color: 'bg-blue-500',
    avatar: ''
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue', color: '#3B82F6' },
    { value: 'bg-green-500', label: 'Green', color: '#10B981' },
    { value: 'bg-purple-500', label: 'Purple', color: '#8B5CF6' },
    { value: 'bg-red-500', label: 'Red', color: '#EF4444' },
    { value: 'bg-orange-500', label: 'Orange', color: '#F97316' },
    { value: 'bg-indigo-500', label: 'Indigo', color: '#6366F1' },
    { value: 'bg-pink-500', label: 'Pink', color: '#EC4899' },
    { value: 'bg-gray-500', label: 'Gray', color: '#6B7280' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Channel name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Channel name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Channel name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    if (!formData.avatar.trim()) {
      newErrors.avatar = 'Channel avatar/initials are required';
    } else if (formData.avatar.length > 5) {
      newErrors.avatar = 'Avatar must be 5 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const channelData: Omit<ChatChannel, 'id' | 'createdAt' | 'lastActivity' | 'unreadCount'> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      color: formData.color,
      avatar: formData.avatar.trim().toUpperCase(),
      isPrivate: formData.isPrivate,
      allowedUsers: formData.isPrivate ? selectedUsers : [],
      admins: [currentUser.id],
      createdBy: currentUser.id,
      isArchived: false
    };

    onSubmit(channelData);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const generateAvatar = () => {
    const name = formData.name.trim();
    if (name.length === 0) return '';
    
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    } else {
      return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
    }
  };

  React.useEffect(() => {
    if (!formData.avatar) {
      setFormData(prev => ({ ...prev, avatar: generateAvatar() }));
    }
  }, [formData.name]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-poppins">
            Create New Channel
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-poppins mb-3">
              Channel Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="team"
                  checked={formData.type === 'team'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'team' }))}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg transition-all ${
                  formData.type === 'team' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <Hash className="text-gray-600" size={20} />
                    <div>
                      <div className="font-medium text-gray-900 font-poppins">Team Channel</div>
                      <div className="text-sm text-gray-600 font-poppins">Regular team collaboration</div>
                    </div>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="announcement"
                  checked={formData.type === 'announcement'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'announcement' }))}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg transition-all ${
                  formData.type === 'announcement' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <Volume2 className="text-red-600" size={20} />
                    <div>
                      <div className="font-medium text-gray-900 font-poppins">Announcement</div>
                      <div className="text-sm text-gray-600 font-poppins">Admin broadcast only</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-poppins mb-2">
              Channel Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value, avatar: generateAvatar() }))}
              placeholder="e.g., Development Team, Marketing Updates"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-poppins">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Channel Avatar *
              </label>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${formData.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
                  {formData.avatar || '?'}
                </div>
                <input
                  type="text"
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="DEV"
                  maxLength={5}
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins ${
                    errors.avatar ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-600 font-poppins">{errors.avatar}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                Channel Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === option.value 
                        ? 'border-gray-900 scale-110' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: option.color }}
                    title={option.label}
                  >
                    {formData.color === option.value && (
                      <Check className="text-white mx-auto" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700 font-poppins flex items-center gap-2">
                <Lock size={16} />
                Make this channel private
              </label>
            </div>
          </div>

          {formData.isPrivate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 font-poppins mb-3">
                Add Members ({selectedUsers.length} selected)
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {existingUsers.filter(user => user.id !== currentUser.id).map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 font-poppins text-sm">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-600 font-poppins">
                        {user.email}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-poppins font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-poppins font-medium transition-colors"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal; 