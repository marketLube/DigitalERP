import React, { useState } from 'react';
import { Plus, Save, Share2, X, Check, Trash2, Edit3, Palette, Tag, Bold, Italic, Underline, List, CheckSquare, AlignLeft, AlignCenter, AlignRight, Type, Link, Image, Calendar, User, Hash, MoreHorizontal, Eye, Copy, Archive, Pin, Star } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  todos: TodoItem[];
  createdDate: string;
  lastModified: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  isPinned: boolean;
  isArchived: boolean;
  dueDate?: string;
  assignee?: string;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
}

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
}

interface NoteModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (note: Note) => void;
  onDelete: (noteId: string) => void;
  isNewNote?: boolean;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, note, onClose, onSave, onDelete, isNewNote = false }) => {
  const [editedNote, setEditedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(isNewNote);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTextStyle, setActiveTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });

  const noteColors = [
    { name: 'Yellow', value: 'bg-yellow-200', border: 'border-yellow-300', text: 'text-yellow-900' },
    { name: 'Pink', value: 'bg-pink-200', border: 'border-pink-300', text: 'text-pink-900' },
    { name: 'Blue', value: 'bg-blue-200', border: 'border-blue-300', text: 'text-blue-900' },
    { name: 'Green', value: 'bg-green-200', border: 'border-green-300', text: 'text-green-900' },
    { name: 'Purple', value: 'bg-purple-200', border: 'border-purple-300', text: 'text-purple-900' },
    { name: 'Orange', value: 'bg-orange-200', border: 'border-orange-300', text: 'text-orange-900' },
    { name: 'Gray', value: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-900' }
  ];

  const categories = ['Personal', 'Work', 'Ideas', 'Projects', 'Meetings', 'Reminders', 'Goals'];
  const priorities = ['Low', 'Medium', 'High'];

  React.useEffect(() => {
    if (note) {
      setEditedNote({ ...note });
    }
  }, [note]);

  if (!isOpen || !editedNote) return null;

  const currentColor = noteColors.find(c => c.value === editedNote.color) || noteColors[0];

  const handleSave = () => {
    if (editedNote) {
      onSave({
        ...editedNote,
        lastModified: new Date().toISOString()
      });
      setIsEditing(false);
      if (isNewNote) onClose();
    }
  };

  const handleDelete = () => {
    if (editedNote && window.confirm('Are you sure you want to delete this note?')) {
      onDelete(editedNote.id);
      onClose();
    }
  };

  const addTodo = () => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: '',
      completed: false,
      priority: 'Medium'
    };
    setEditedNote(prev => prev ? ({
      ...prev,
      todos: [...prev.todos, newTodo]
    }) : null);
  };

  const updateTodo = (todoId: string, updates: Partial<TodoItem>) => {
    setEditedNote(prev => prev ? ({
      ...prev,
      todos: prev.todos.map(todo => 
        todo.id === todoId ? { ...todo, ...updates } : todo
      )
    }) : null);
  };

  const deleteTodo = (todoId: string) => {
    setEditedNote(prev => prev ? ({
      ...prev,
      todos: prev.todos.filter(todo => todo.id !== todoId)
    }) : null);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !editedNote.tags.includes(tag.trim())) {
      setEditedNote(prev => prev ? ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }) : null);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedNote(prev => prev ? ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }) : null);
  };

  const applyTextStyle = (style: string) => {
    setActiveTextStyle(prev => ({
      ...prev,
      [style]: !prev[style as keyof typeof prev]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-slideUp">
        {/* Modal Header */}
        <div className={`${currentColor.value} ${currentColor.border} border-b-2 px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 ${currentColor.value} ${currentColor.border} border-2 rounded-full`}></div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedNote.title}
                    onChange={(e) => setEditedNote(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                    className={`text-xl font-poppins font-bold ${currentColor.text} bg-transparent border-none outline-none placeholder-opacity-60`}
                    placeholder="Note title..."
                    autoFocus
                  />
                ) : (
                  <h2 className={`text-xl font-poppins font-bold ${currentColor.text}`}>
                    {editedNote.title || 'Untitled Note'}
                  </h2>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${currentColor.text} opacity-70`}>
                    {new Date(editedNote.lastModified).toLocaleDateString()}
                  </span>
                  {editedNote.isPinned && <Pin size={12} className={currentColor.text} />}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`p-2 ${currentColor.text} hover:bg-white hover:bg-opacity-30 rounded-lg transition-colors duration-200`}
                    title="Edit Note"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => {}}
                    className={`p-2 ${currentColor.text} hover:bg-white hover:bg-opacity-30 rounded-lg transition-colors duration-200`}
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => {}}
                    className={`p-2 ${currentColor.text} hover:bg-white hover:bg-opacity-30 rounded-lg transition-colors duration-200`}
                    title="More Options"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </>
              )}
              
              <button
                onClick={onClose}
                className={`p-2 ${currentColor.text} hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6">
            {/* Text Formatting Toolbar - Only show when editing */}
            {isEditing && (
              <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                    <button
                      onClick={() => applyTextStyle('bold')}
                      className={`p-2 rounded transition-colors duration-200 ${
                        activeTextStyle.bold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      onClick={() => applyTextStyle('italic')}
                      className={`p-2 rounded transition-colors duration-200 ${
                        activeTextStyle.italic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Italic"
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      onClick={() => applyTextStyle('underline')}
                      className={`p-2 rounded transition-colors duration-200 ${
                        activeTextStyle.underline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Underline"
                    >
                      <Underline size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors duration-200" title="Align Left">
                      <AlignLeft size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors duration-200" title="Align Center">
                      <AlignCenter size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors duration-200" title="Align Right">
                      <AlignRight size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors duration-200" title="Bullet List">
                      <List size={16} />
                    </button>
                    <button 
                      onClick={addTodo}
                      className="p-2 hover:bg-gray-100 rounded transition-colors duration-200" 
                      title="Add Checklist"
                    >
                      <CheckSquare size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors duration-200" title="Add Link">
                      <Link size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors duration-200" title="Add Image">
                      <Image size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                    title="Change Color"
                  >
                    <Palette size={16} />
                  </button>
                </div>

                {/* Color Picker */}
                {showColorPicker && (
                  <div className="mt-3 bg-white rounded-xl p-3 border border-gray-200 shadow-lg">
                    <div className="grid grid-cols-7 gap-2">
                      {noteColors.map(color => (
                        <button
                          key={color.name}
                          onClick={() => {
                            setEditedNote(prev => prev ? ({ ...prev, color: color.value }) : null);
                            setShowColorPicker(false);
                          }}
                          className={`w-8 h-8 ${color.value} ${color.border} border-2 rounded-lg hover:scale-110 transition-transform duration-200 ${
                            editedNote.color === color.value ? 'ring-2 ring-blue-400' : ''
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Note Content */}
            <div className="mb-6">
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-3">
                Content
              </label>
              {isEditing ? (
                <textarea
                  value={editedNote.content}
                  onChange={(e) => setEditedNote(prev => prev ? ({ ...prev, content: e.target.value }) : null)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm resize-none"
                  placeholder="Write your note content here..."
                />
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 min-h-40">
                  <pre className="font-poppins text-sm text-gray-700 whitespace-pre-wrap">
                    {editedNote.content || 'No content added yet.'}
                  </pre>
                </div>
              )}
            </div>

            {/* Todos Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-poppins font-medium text-gray-700">
                  Tasks & Todos ({editedNote.todos.length})
                </label>
                {isEditing && (
                  <button
                    onClick={addTodo}
                    className="text-blue-600 hover:text-blue-700 text-sm font-poppins font-medium flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Task
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {editedNote.todos.map((todo, index) => (
                  <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
                    <button
                      onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {todo.completed && <Check size={14} className="text-white" />}
                    </button>
                    
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={todo.text}
                          onChange={(e) => updateTodo(todo.id, { text: e.target.value })}
                          className="flex-1 bg-transparent border-none outline-none font-poppins text-sm"
                          placeholder="Enter task..."
                        />
                        <select
                          value={todo.priority}
                          onChange={(e) => updateTodo(todo.id, { priority: e.target.value as any })}
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                        >
                          {priorities.map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className={`font-poppins text-sm ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-700'
                        }`}>
                          {todo.text}
                        </span>
                        {todo.priority !== 'Medium' && (
                          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                            todo.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {todo.priority}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {editedNote.todos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="font-poppins text-sm">No tasks added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags and Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editedNote.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-poppins flex items-center gap-1"
                    >
                      <Hash size={12} />
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={editedNote.category}
                        onChange={(e) => setEditedNote(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={editedNote.priority}
                        onChange={(e) => setEditedNote(prev => prev ? ({ ...prev, priority: e.target.value as any }) : null)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={editedNote.dueDate || ''}
                        onChange={(e) => setEditedNote(prev => prev ? ({ ...prev, dueDate: e.target.value }) : null)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-poppins">Category:</span>
                      <span className="text-sm text-gray-700 font-poppins font-medium">{editedNote.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-poppins">Priority:</span>
                      <span className={`text-sm font-poppins font-medium px-2 py-1 rounded-full ${
                        editedNote.priority === 'High' ? 'bg-red-100 text-red-700' :
                        editedNote.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {editedNote.priority}
                      </span>
                    </div>
                    {editedNote.dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-700 font-poppins">
                          Due: {new Date(editedNote.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 font-poppins">
              Created: {new Date(editedNote.createdDate).toLocaleDateString()} • 
              Modified: {new Date(editedNote.lastModified).toLocaleDateString()}
            </div>
            
            <div className="flex items-center gap-2">
              {!isNewNote && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              
              <button
                onClick={onClose}
                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200"
              >
                {isEditing ? 'Cancel' : 'Close'}
              </button>
              
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoteCard: React.FC<NoteCardProps> = ({ note, onView, onEdit, onDelete, onTogglePin }) => {
  const noteColors = [
    { name: 'Yellow', value: 'bg-yellow-200', border: 'border-yellow-300', text: 'text-yellow-900' },
    { name: 'Pink', value: 'bg-pink-200', border: 'border-pink-300', text: 'text-pink-900' },
    { name: 'Blue', value: 'bg-blue-200', border: 'border-blue-300', text: 'text-blue-900' },
    { name: 'Green', value: 'bg-green-200', border: 'border-green-300', text: 'text-green-900' },
    { name: 'Purple', value: 'bg-purple-200', border: 'border-purple-300', text: 'text-purple-900' },
    { name: 'Orange', value: 'bg-orange-200', border: 'border-orange-300', text: 'text-orange-900' },
    { name: 'Gray', value: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-900' }
  ];

  const currentColor = noteColors.find(c => c.value === note.color) || noteColors[0];
  const completedTodos = note.todos.filter(todo => todo.completed).length;
  const totalTodos = note.todos.length;

  return (
    <div 
      onClick={() => onView(note)}
      className={`${currentColor.value} ${currentColor.border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative min-h-80 flex flex-col animate-slideUp cursor-pointer`}
      style={{ 
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
        transform: 'rotate(-1deg)',
      }}
    >
      {/* Note Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {note.isPinned && <Pin size={14} className={`${currentColor.text} opacity-70`} />}
            <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 ${currentColor.text} font-poppins`}>
              {note.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              note.priority === 'High' ? 'bg-red-100 text-red-700' :
              note.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            } font-poppins`}>
              {note.priority}
            </span>
          </div>
          <h3 className={`font-poppins font-bold text-lg ${currentColor.text} line-clamp-2 mb-2`}>
            {note.title || 'Untitled Note'}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            className={`p-1.5 ${currentColor.text} hover:bg-white hover:bg-opacity-30 rounded-lg transition-colors duration-200`}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            <Pin size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className={`p-1.5 ${currentColor.text} hover:bg-white hover:bg-opacity-30 rounded-lg transition-colors duration-200`}
            title="Quick Edit"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className={`p-1.5 ${currentColor.text} hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200`}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Note Content Preview */}
      <div className="flex-1 mb-4">
        <p className={`${currentColor.text} opacity-80 text-sm font-poppins line-clamp-4 mb-3`}>
          {note.content || 'No content...'}
        </p>
        
        {/* Todos Progress */}
        {totalTodos > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs ${currentColor.text} font-poppins opacity-70`}>
                Tasks: {completedTodos}/{totalTodos}
              </span>
              <span className={`text-xs ${currentColor.text} font-poppins opacity-70`}>
                {Math.round((completedTodos / totalTodos) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white bg-opacity-70 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-40 ${currentColor.text} font-poppins`}
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-40 ${currentColor.text} font-poppins`}>
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Note Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-xs ${currentColor.text} opacity-60 font-poppins`}>
          {new Date(note.lastModified).toLocaleDateString()}
        </span>
        
        <div className="flex items-center gap-1">
          <Eye size={12} className={`${currentColor.text} opacity-60`} />
          <span className={`text-xs ${currentColor.text} opacity-60 font-poppins`}>
            Click to view
          </span>
        </div>
      </div>
      
      {/* Due Date Indicator */}
      {note.dueDate && (
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${
            new Date(note.dueDate) < new Date() ? 'bg-red-500' : 'bg-orange-500'
          }`}></div>
        </div>
      )}
    </div>
  );
};

const NotePad: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Ideas',
      content: 'Brainstorm new features for the dashboard:\n- Dark mode toggle\n- Advanced filtering\n- Export functionality',
      color: 'bg-yellow-200',
      tags: ['ideas', 'project'],
      todos: [
        { id: '1', text: 'Research user feedback', completed: true, priority: 'Medium' },
        { id: '2', text: 'Create wireframes', completed: false, priority: 'High' },
        { id: '3', text: 'Schedule team meeting', completed: false, priority: 'Low' }
      ],
      createdDate: '2024-02-01',
      lastModified: '2024-02-01',
      priority: 'High',
      category: 'Project',
      isPinned: false,
      isArchived: false,
      dueDate: '2024-03-01'
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: 'Weekly standup discussion points:\n- Sprint review feedback\n- Next quarter planning\n- Resource allocation',
      color: 'bg-blue-200',
      tags: ['meeting', 'standup'],
      todos: [
        { id: '4', text: 'Send meeting summary', completed: false, priority: 'High' },
        { id: '5', text: 'Update project timeline', completed: true, priority: 'Medium' }
      ],
      createdDate: '2024-02-02',
      lastModified: '2024-02-02',
      priority: 'Medium',
      category: 'Meeting',
      isPinned: false,
      isArchived: false,
      dueDate: '2024-02-15'
    },
    {
      id: '3',
      title: 'Quick Reminders',
      content: 'Don\'t forget to:\n- Review pull requests\n- Update documentation\n- Backup project files',
      color: 'bg-pink-200',
      tags: ['reminders', 'tasks'],
      todos: [
        { id: '6', text: 'Code review for feature X', completed: false, priority: 'High' },
        { id: '7', text: 'Update README file', completed: false, priority: 'Low' },
        { id: '8', text: 'Weekly backup', completed: true, priority: 'Medium' }
      ],
      createdDate: '2024-02-03',
      lastModified: '2024-02-03',
      priority: 'Low',
      category: 'Task',
      isPinned: false,
      isArchived: false,
      dueDate: '2024-02-05'
    },
    {
      id: '4',
      title: 'Design Inspiration',
      content: 'Color palette ideas:\n- Soft pastels for notes\n- High contrast for accessibility\n- Consistent brand colors',
      color: 'bg-purple-200',
      tags: ['design', 'colors'],
      todos: [],
      createdDate: '2024-02-04',
      lastModified: '2024-02-04',
      priority: 'Medium',
      category: 'Idea',
      isPinned: false,
      isArchived: false,
      dueDate: '2024-02-10'
    },
    {
      id: '5',
      title: 'Learning Goals',
      content: 'This month I want to learn:\n- Advanced React patterns\n- TypeScript best practices\n- Performance optimization',
      color: 'bg-green-200',
      tags: ['learning', 'goals'],
      todos: [
        { id: '9', text: 'Complete React course', completed: false, priority: 'High' },
        { id: '10', text: 'Read TypeScript handbook', completed: false, priority: 'Medium' }
      ],
      createdDate: '2024-02-05',
      lastModified: '2024-02-05',
      priority: 'High',
      category: 'Learning',
      isPinned: false,
      isArchived: false,
      dueDate: '2024-02-28'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNewNote, setIsNewNote] = useState(false);

  const noteColors = [
    { name: 'All', value: 'All', color: 'bg-gray-100' },
    { name: 'Yellow', value: 'bg-yellow-200', color: 'bg-yellow-200' },
    { name: 'Pink', value: 'bg-pink-200', color: 'bg-pink-200' },
    { name: 'Blue', value: 'bg-blue-200', color: 'bg-blue-200' },
    { name: 'Green', value: 'bg-green-200', color: 'bg-green-200' },
    { name: 'Purple', value: 'bg-purple-200', color: 'bg-purple-200' },
    { name: 'Orange', value: 'bg-orange-200', color: 'bg-orange-200' }
  ];

  const categories = ['All', 'Personal', 'Work', 'Ideas', 'Projects', 'Meetings', 'Reminders', 'Goals'];
  const priorities = ['All', 'Low', 'Medium', 'High'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesColor = selectedColor === 'All' || note.color === selectedColor;
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || note.priority === selectedPriority;
    return matchesSearch && matchesColor && matchesCategory && matchesPriority;
  });

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: 'bg-yellow-200',
      tags: [],
      todos: [],
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      priority: 'Medium',
      category: 'Personal',
      isPinned: false,
      isArchived: false,
      dueDate: ''
    };
    setSelectedNote(newNote);
    setIsNewNote(true);
    setShowModal(true);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsNewNote(false);
    setShowModal(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsNewNote(false);
    setShowModal(true);
  };

  const saveNote = (updatedNote: Note) => {
    if (isNewNote) {
      setNotes(prev => [updatedNote, ...prev]);
    } else {
      setNotes(prev => prev.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
    }
  };

  const deleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const togglePin = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  // Sort notes: pinned first, then by last modified
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  return (
    <div className="p-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search notes, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category} Category</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority} Priority</option>
              ))}
            </select>

            {/* Color Filter */}
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
              <Tag size={16} className="text-gray-400" />
              <div className="flex gap-1">
                {noteColors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 ${color.color} rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === color.value 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Stats and Actions */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 font-poppins">
              {sortedNotes.length} note{sortedNotes.length !== 1 ? 's' : ''}
            </div>
            
            <button
              onClick={() => {}}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              title="Share Notes"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={createNewNote}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus size={18} />
              New Note
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-max">
        {sortedNotes.map((note, index) => (
          <div
            key={note.id}
            className="animate-slideUp"
            style={{ 
              animationDelay: `${index * 100}ms`,
              transform: `rotate(${(index % 3 - 1) * 2}deg)`
            }}
          >
            <NoteCard
              note={note}
              onView={handleViewNote}
              onEdit={handleEditNote}
              onDelete={deleteNote}
              onTogglePin={togglePin}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedNotes.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-lg">
            <Edit3 size={32} className="text-yellow-800" />
          </div>
          <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-3">
            {searchQuery || selectedColor !== 'All' || selectedCategory !== 'All' || selectedPriority !== 'All' ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 font-poppins mb-8 max-w-md mx-auto">
            {searchQuery || selectedColor !== 'All' || selectedCategory !== 'All' || selectedPriority !== 'All'
              ? 'Try adjusting your search or filter criteria.' 
              : 'Create your first sticky note to capture ideas, reminders, and to-dos.'
            }
          </p>
          {!searchQuery && selectedColor === 'All' && selectedCategory === 'All' && selectedPriority === 'All' && (
            <button
              onClick={createNewNote}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-poppins font-medium transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} />
              Create Your First Note
            </button>
          )}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={showModal}
        note={selectedNote}
        onClose={() => {
          setShowModal(false);
          setSelectedNote(null);
          setIsNewNote(false);
        }}
        onSave={saveNote}
        onDelete={deleteNote}
        isNewNote={isNewNote}
      />
    </div>
  );
};

export default NotePad;