import React, { useState } from 'react';
import { Calendar, User, Clock, AlertCircle, Plus, Filter, Search, Play, CheckCircle2, Circle, Pause, ArrowRight, Star } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  client?: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  progress?: number;
  tags?: string[];
  type?: string;
}

const mockTasks: Task[] = [
  // To Do
  { id: '1', title: 'Landing Page Design', assignee: 'Sarah', client: 'TechCorp', dueDate: '2024-01-15', priority: 'High', progress: 0, tags: ['design', 'ui'], type: 'todo' },
  { id: '2', title: 'API Integration', assignee: 'Mike', client: 'StartupXYZ', dueDate: '2024-01-18', priority: 'Medium', progress: 0, tags: ['backend'], type: 'todo' },
  { id: '3', title: 'User Testing', assignee: 'Emma', client: 'BigCorp', dueDate: '2024-01-20', priority: 'Low', progress: 0, tags: ['research'], type: 'todo' },
  
  // In Progress
  { id: '4', title: 'Mobile App Redesign', assignee: 'Alex', client: 'MobileTech', dueDate: '2024-01-12', priority: 'High', progress: 65, tags: ['mobile', 'design'], type: 'progress' },
  { id: '5', title: 'Database Optimization', assignee: 'John', client: 'DataCorp', dueDate: '2024-01-16', priority: 'Medium', progress: 45, tags: ['database'], type: 'progress' },
  
  // Review
  { id: '6', title: 'E-commerce Platform', assignee: 'Lisa', client: 'ShopNow', dueDate: '2024-01-10', priority: 'High', progress: 90, tags: ['frontend', 'react'], type: 'review' },
  { id: '7', title: 'Payment Gateway', assignee: 'David', client: 'PayTech', dueDate: '2024-01-14', priority: 'Medium', progress: 85, tags: ['payment'], type: 'review' },
  
  // Done
  { id: '8', title: 'Brand Identity', assignee: 'Sarah', client: 'BrandCo', dueDate: '2024-01-08', priority: 'Medium', progress: 100, tags: ['branding'], type: 'done' },
  { id: '9', title: 'Security Audit', assignee: 'Tom', client: 'SecureTech', dueDate: '2024-01-05', priority: 'High', progress: 100, tags: ['security'], type: 'done' },
];

const TestDesigns: React.FC = () => {
  const [activeDesign, setActiveDesign] = useState<'compact' | 'minimal' | 'animated'>('compact');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTasksByType = (type: string) => mockTasks.filter(task => task.type === type);
  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date() && !mockTasks.find(t => t.dueDate === dueDate && t.progress === 100);

  // Compact Design - Full features in small cards
  const CompactDesign = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Compact Kanban View</h1>
          <p className="text-gray-600">Full-featured compact cards with all information</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6">
          {[
            { title: 'To Do', type: 'todo', color: 'bg-blue-50 border-blue-200' },
            { title: 'In Progress', type: 'progress', color: 'bg-orange-50 border-orange-200' },
            { title: 'Review', type: 'review', color: 'bg-purple-50 border-purple-200' },
            { title: 'Done', type: 'done', color: 'bg-green-50 border-green-200' }
          ].map(column => (
            <div key={column.type} className="flex-shrink-0 w-72">
              <div className={`${column.color} border rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                    {getTasksByType(column.type).length}
                  </span>
                </div>
                <button className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm">
                  <Plus size={16} className="mx-auto" />
                </button>
              </div>
              
              <div className="space-y-3">
                {getTasksByType(column.type).map(task => (
                  <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                      {isOverdue(task.dueDate) && <AlertCircle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{task.assignee?.[0]}</span>
                      </div>
                      <span className="text-xs text-gray-600">{task.assignee}</span>
                    </div>
                    
                    {task.progress !== undefined && (
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div className="bg-blue-500 h-1 rounded-full transition-all" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{task.progress}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={10} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {task.tags && (
                      <div className="flex gap-1 mt-2">
                        {task.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                            +{task.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Minimal Design - Clean and simple
  const MinimalDesign = () => (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Minimal Kanban View</h1>
          <p className="text-gray-600">Clean, distraction-free design focusing on essentials</p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6">
          {[
            { title: 'To Do', type: 'todo', icon: Circle },
            { title: 'In Progress', type: 'progress', icon: Play },
            { title: 'Review', type: 'review', icon: Pause },
            { title: 'Done', type: 'done', icon: CheckCircle2 }
          ].map(column => {
            const Icon = column.icon;
            return (
              <div key={column.type} className="flex-shrink-0 w-64">
                <div className="border-b-2 border-gray-200 pb-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-gray-500" />
                    <h3 className="font-medium text-gray-900">{column.title}</h3>
                    <span className="text-sm text-gray-500">({getTasksByType(column.type).length})</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {getTasksByType(column.type).map(task => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border-l-3 border-blue-400">
                      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{task.assignee}</span>
                        <span className={`font-medium ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      {task.progress !== undefined && task.progress > 0 && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors">
                    Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Animated Design - Enhanced with animations and modern effects
  const AnimatedDesign = () => (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Animated Kanban View
          </h1>
          <p className="text-gray-600">Modern design with smooth animations and visual effects</p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6">
          {[
            { title: 'To Do', type: 'todo', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10' },
            { title: 'In Progress', type: 'progress', gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10' },
            { title: 'Review', type: 'review', gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
            { title: 'Done', type: 'done', gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' }
          ].map(column => (
            <div key={column.type} className="flex-shrink-0 w-80">
              <div className={`${column.bg} backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold text-lg bg-gradient-to-r ${column.gradient} bg-clip-text text-transparent`}>
                    {column.title}
                  </h3>
                  <div className={`bg-gradient-to-r ${column.gradient} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                    {getTasksByType(column.type).length}
                  </div>
                </div>
                
                <button className="group w-full p-3 border-2 border-dashed border-white/30 rounded-xl text-gray-600 hover:border-white/60 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-medium">Add New Task</span>
                  </div>
                </button>
              </div>
              
              <div className="space-y-4">
                {getTasksByType(column.type).map((task, index) => (
                  <div 
                    key={task.id} 
                    className="group bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {task.priority === 'High' && <Star size={14} className="text-red-500" />}
                        {isOverdue(task.dueDate) && (
                          <div className="animate-pulse">
                            <AlertCircle size={14} className="text-red-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-white shadow-lg">
                          <span className="text-xs font-bold text-white">{task.assignee?.[0]}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{task.assignee}</span>
                        <div className="text-xs text-gray-500">{task.client}</div>
                      </div>
                    </div>
                    
                    {task.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(task.priority)} group-hover:scale-105 transition-transform`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Clock size={10} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {task.tags && (
                      <div className="flex gap-1 mt-3 flex-wrap">
                        {task.tags.map(tag => (
                          <span key={tag} className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium hover:from-blue-100 hover:to-purple-100 hover:text-blue-700 transition-all cursor-pointer">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        <ArrowRight size={12} />
                        View Details
                      </button>
                      <div className="text-xs text-gray-400">
                        ID: {task.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Design Selector */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Kanban Design Tests</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'compact', label: 'Compact' },
                { key: 'minimal', label: 'Minimal' },
                { key: 'animated', label: 'Animated' }
              ].map(design => (
                <button
                  key={design.key}
                  onClick={() => setActiveDesign(design.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeDesign === design.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {design.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render Selected Design */}
      {activeDesign === 'compact' && <CompactDesign />}
      {activeDesign === 'minimal' && <MinimalDesign />}
      {activeDesign === 'animated' && <AnimatedDesign />}
    </div>
  );
};

export default TestDesigns; 