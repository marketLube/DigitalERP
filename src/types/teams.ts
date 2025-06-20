export interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  members: string[];
  lead: string;
  department: string;
  // Status management
  statusConfig: TeamStatusConfig;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  createdDate: string;
  mainStatus: string;
  subStatus: string;
  progress: number;
  tags: string[];
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface MainStatus {
  id: string;
  name: string;
  color: string;
  order: number;
  subStatuses: SubStatus[];
  teamId: string;
}

export interface SubStatus {
  id: string;
  name: string;
  color: string;
  order: number;
  mainStatusId: string;
  isFirst?: boolean;  // Starting status for new tasks
  isLast?: boolean;   // Final/completed status
  description?: string;
}

export interface TeamStatusConfig {
  mainStatuses: MainStatus[];
  lastUpdated: string;
  version: number;
}

export interface StatusDragItem {
  id: string;
  type: 'main' | 'sub';
  name: string;
  order: number;
  parentId?: string; // For sub-statuses
}

// Default status configurations for teams
export const defaultStatusConfigs: { [teamName: string]: Partial<TeamStatusConfig> } = {
  'Video Production': {
    mainStatuses: [
      {
        id: 'vp-pre',
        name: 'Pre-Production',
        color: '#f59e0b',
        order: 1,
        teamId: 'video-production',
        subStatuses: [
          { id: 'vp-pre-script', name: 'Scripting', color: '#fbbf24', order: 1, mainStatusId: 'vp-pre', isFirst: true },
          { id: 'vp-pre-planning', name: 'Planning', color: '#f59e0b', order: 2, mainStatusId: 'vp-pre' },
          { id: 'vp-pre-approved', name: 'Approved', color: '#10b981', order: 3, mainStatusId: 'vp-pre' }
        ]
      },
      {
        id: 'vp-prod',
        name: 'Production',
        color: '#3b82f6',
        order: 2,
        teamId: 'video-production',
        subStatuses: [
          { id: 'vp-prod-scheduled', name: 'Shoot Scheduled', color: '#60a5fa', order: 1, mainStatusId: 'vp-prod' },
          { id: 'vp-prod-filming', name: 'Filming', color: '#3b82f6', order: 2, mainStatusId: 'vp-prod' },
          { id: 'vp-prod-review', name: 'Review', color: '#1d4ed8', order: 3, mainStatusId: 'vp-prod' }
        ]
      },
      {
        id: 'vp-post',
        name: 'Post-Production',
        color: '#8b5cf6',
        order: 3,
        teamId: 'video-production',
        subStatuses: [
          { id: 'vp-post-editing', name: 'Editing', color: '#a78bfa', order: 1, mainStatusId: 'vp-post' },
          { id: 'vp-post-final', name: 'Final Review', color: '#7c3aed', order: 2, mainStatusId: 'vp-post' },
          { id: 'vp-post-delivered', name: 'Delivered', color: '#10b981', order: 3, mainStatusId: 'vp-post', isLast: true }
        ]
      }
    ]
  },
  'UI/UX Team': {
    mainStatuses: [
      {
        id: 'ux-research',
        name: 'Research',
        color: '#6366f1',
        order: 1,
        teamId: 'uiux-team',
        subStatuses: [
          { id: 'ux-research-analysis', name: 'User Research', color: '#818cf8', order: 1, mainStatusId: 'ux-research', isFirst: true },
          { id: 'ux-research-personas', name: 'Personas', color: '#6366f1', order: 2, mainStatusId: 'ux-research' },
          { id: 'ux-research-wireframes', name: 'Wireframing', color: '#4f46e5', order: 3, mainStatusId: 'ux-research' }
        ]
      },
      {
        id: 'ux-design',
        name: 'Design',
        color: '#ec4899',
        order: 2,
        teamId: 'uiux-team',
        subStatuses: [
          { id: 'ux-design-prototype', name: 'Prototyping', color: '#f472b6', order: 1, mainStatusId: 'ux-design' },
          { id: 'ux-design-visual', name: 'Visual Design', color: '#ec4899', order: 2, mainStatusId: 'ux-design' },
          { id: 'ux-design-final', name: 'Final Design', color: '#be185d', order: 3, mainStatusId: 'ux-design', isLast: true }
        ]
      }
    ]
  },
  'Development Team': {
    mainStatuses: [
      {
        id: 'dev-planning',
        name: 'Planning',
        color: '#f59e0b',
        order: 1,
        teamId: 'development-team',
        subStatuses: [
          { id: 'dev-planning-analysis', name: 'Analysis', color: '#fbbf24', order: 1, mainStatusId: 'dev-planning', isFirst: true },
          { id: 'dev-planning-architecture', name: 'Architecture', color: '#f59e0b', order: 2, mainStatusId: 'dev-planning' },
          { id: 'dev-planning-approved', name: 'Ready to Start', color: '#10b981', order: 3, mainStatusId: 'dev-planning' }
        ]
      },
      {
        id: 'dev-development',
        name: 'Development',
        color: '#10b981',
        order: 2,
        teamId: 'development-team',
        subStatuses: [
          { id: 'dev-development-coding', name: 'Coding', color: '#34d399', order: 1, mainStatusId: 'dev-development' },
          { id: 'dev-development-review', name: 'Code Review', color: '#10b981', order: 2, mainStatusId: 'dev-development' },
          { id: 'dev-development-testing', name: 'Testing', color: '#059669', order: 3, mainStatusId: 'dev-development' }
        ]
      },
      {
        id: 'dev-deployment',
        name: 'Deployment',
        color: '#8b5cf6',
        order: 3,
        teamId: 'development-team',
        subStatuses: [
          { id: 'dev-deployment-staging', name: 'Staging', color: '#a78bfa', order: 1, mainStatusId: 'dev-deployment' },
          { id: 'dev-deployment-production', name: 'Production', color: '#8b5cf6', order: 2, mainStatusId: 'dev-deployment' },
          { id: 'dev-deployment-completed', name: 'Deployed', color: '#7c3aed', order: 3, mainStatusId: 'dev-deployment', isLast: true }
        ]
      }
    ]
  },
  'Performance Marketing': {
    mainStatuses: [
      {
        id: 'pm-analytics',
        name: 'Analytics',
        color: '#0ea5e9',
        order: 1,
        teamId: 'performance-marketing',
        subStatuses: [
          { id: 'pm-analytics-setup', name: 'Setup', color: '#38bdf8', order: 1, mainStatusId: 'pm-analytics', isFirst: true },
          { id: 'pm-analytics-tracking', name: 'Tracking', color: '#0ea5e9', order: 2, mainStatusId: 'pm-analytics' },
          { id: 'pm-analytics-analysis', name: 'Analysis', color: '#0284c7', order: 3, mainStatusId: 'pm-analytics' }
        ]
      },
      {
        id: 'pm-optimization',
        name: 'Optimization',
        color: '#10b981',
        order: 2,
        teamId: 'performance-marketing',
        subStatuses: [
          { id: 'pm-optimization-testing', name: 'A/B Testing', color: '#34d399', order: 1, mainStatusId: 'pm-optimization' },
          { id: 'pm-optimization-implementation', name: 'Implementation', color: '#10b981', order: 2, mainStatusId: 'pm-optimization' },
          { id: 'pm-optimization-completed', name: 'Optimized', color: '#059669', order: 3, mainStatusId: 'pm-optimization', isLast: true }
        ]
      }
    ]
  },
  'Social Media': {
    mainStatuses: [
      {
        id: 'sm-planning',
        name: 'Planning',
        color: '#f59e0b',
        order: 1,
        teamId: 'social-media',
        subStatuses: [
          { id: 'sm-planning-strategy', name: 'Strategy', color: '#fbbf24', order: 1, mainStatusId: 'sm-planning', isFirst: true },
          { id: 'sm-planning-content', name: 'Content Plan', color: '#f59e0b', order: 2, mainStatusId: 'sm-planning' },
          { id: 'sm-planning-approved', name: 'Approved', color: '#10b981', order: 3, mainStatusId: 'sm-planning' }
        ]
      },
      {
        id: 'sm-creation',
        name: 'Creation',
        color: '#ec4899',
        order: 2,
        teamId: 'social-media',
        subStatuses: [
          { id: 'sm-creation-design', name: 'Design', color: '#f472b6', order: 1, mainStatusId: 'sm-creation' },
          { id: 'sm-creation-copy', name: 'Copywriting', color: '#ec4899', order: 2, mainStatusId: 'sm-creation' },
          { id: 'sm-creation-review', name: 'Review', color: '#be185d', order: 3, mainStatusId: 'sm-creation' }
        ]
      },
      {
        id: 'sm-publishing',
        name: 'Publishing',
        color: '#10b981',
        order: 3,
        teamId: 'social-media',
        subStatuses: [
          { id: 'sm-publishing-scheduled', name: 'Scheduled', color: '#34d399', order: 1, mainStatusId: 'sm-publishing' },
          { id: 'sm-publishing-live', name: 'Published', color: '#10b981', order: 2, mainStatusId: 'sm-publishing', isLast: true }
        ]
      }
    ]
  },
  'Testing / QA': {
    mainStatuses: [
      {
        id: 'qa-planning',
        name: 'Test Planning',
        color: '#f59e0b',
        order: 1,
        teamId: 'testing-qa',
        subStatuses: [
          { id: 'qa-planning-requirements', name: 'Requirements Review', color: '#fbbf24', order: 1, mainStatusId: 'qa-planning', isFirst: true },
          { id: 'qa-planning-testcases', name: 'Test Cases', color: '#f59e0b', order: 2, mainStatusId: 'qa-planning' },
          { id: 'qa-planning-ready', name: 'Ready to Test', color: '#10b981', order: 3, mainStatusId: 'qa-planning' }
        ]
      },
      {
        id: 'qa-testing',
        name: 'Testing',
        color: '#3b82f6',
        order: 2,
        teamId: 'testing-qa',
        subStatuses: [
          { id: 'qa-testing-functional', name: 'Functional Testing', color: '#60a5fa', order: 1, mainStatusId: 'qa-testing' },
          { id: 'qa-testing-regression', name: 'Regression Testing', color: '#3b82f6', order: 2, mainStatusId: 'qa-testing' },
          { id: 'qa-testing-uat', name: 'User Acceptance', color: '#1d4ed8', order: 3, mainStatusId: 'qa-testing' }
        ]
      },
      {
        id: 'qa-completion',
        name: 'Completion',
        color: '#10b981',
        order: 3,
        teamId: 'testing-qa',
        subStatuses: [
          { id: 'qa-completion-passed', name: 'Passed', color: '#34d399', order: 1, mainStatusId: 'qa-completion' },
          { id: 'qa-completion-approved', name: 'QA Approved', color: '#10b981', order: 2, mainStatusId: 'qa-completion', isLast: true }
        ]
      }
    ]
  }
};

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}