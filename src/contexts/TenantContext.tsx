import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Tenant, TenantUser, TenantConfig, TenantContext } from '../types/tenant';
import { api, authApi, configApi } from '../services/api';

// Mock data for development (will be replaced with API calls)
const mockTenants: Tenant[] = [
  {
    id: 'tenant_1',
    companyName: 'Marketlube',
    subdomain: 'marketlube',
    contactEmail: 'althameem@marketlube.com',
    contactPhone: '+91 98765 43210',
    industry: 'Digital Marketing',
    employeeCount: 12,
    subscription: {
      plan: 'professional',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      maxUsers: 25,
      currentUsers: 12
    },
    settings: {
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      language: 'en',
      theme: 'light'
    },
    customization: {
      primaryColor: '#6366F1',
      secondaryColor: '#EC4899',
      companyAddress: 'Bangalore, Karnataka, India',
      companyWebsite: 'https://marketlube.com'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
    isActive: true
  },
  {
    id: 'tenant_2',
    companyName: 'Creative Solutions Ltd',
    subdomain: 'creative-solutions',
    contactEmail: 'admin@creativesolutions.com',
    contactPhone: '+91 87654 32109',
    industry: 'Creative Agency',
    employeeCount: 15,
    subscription: {
      plan: 'starter',
      status: 'trial',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      maxUsers: 25,
      currentUsers: 15
    },
    settings: {
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      language: 'en',
      theme: 'light'
    },
    customization: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#F59E0B',
      companyAddress: 'Bangalore, Karnataka, India'
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
    isActive: true
  }
];

const mockUsers: TenantUser[] = [
  {
    id: 'user_1',
    tenantId: 'tenant_1',
    email: 'althameem@marketlube.com',
    firstName: 'Althameem',
    lastName: 'Khan',
    role: 'super_admin',
    permissions: ['*'],
    department: 'Management',
    position: 'Founder & CEO',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'user_2',
    tenantId: 'tenant_1',
    email: 'sarah.johnson@marketlube.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'admin',
    permissions: ['sales', 'hr', 'reports'],
    department: 'Operations',
    position: 'Operations Manager',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'user_3',
    tenantId: 'tenant_1',
    email: 'mike.chen@marketlube.com',
    firstName: 'Mike',
    lastName: 'Chen',
    role: 'manager',
    permissions: ['sales', 'reports'],
    department: 'Sales',
    position: 'Sales Manager',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'user_4',
    tenantId: 'tenant_1',
    email: 'emily.rodriguez@marketlube.com',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'manager',
    permissions: ['hr', 'reports'],
    department: 'HR',
    position: 'HR Manager',
    isActive: true,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'user_5',
    tenantId: 'tenant_1',
    email: 'david.wilson@marketlube.com',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'employee',
    permissions: ['sales'],
    department: 'Sales',
    position: 'Sales Executive',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 'user_6',
    tenantId: 'tenant_1',
    email: 'lisa.thompson@marketlube.com',
    firstName: 'Lisa',
    lastName: 'Thompson',
    role: 'employee',
    permissions: ['hr'],
    department: 'HR',
    position: 'HR Executive',
    isActive: true,
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  }
];

const mockConfigs: TenantConfig[] = [
  {
    id: 'config_1',
    tenantId: 'tenant_1',
    module: 'sales',
    customStatuses: {
      main: ['New Lead', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
      sub: {
        'New Lead': ['Cold', 'Warm', 'Hot'],
        'Qualified': ['Interested', 'Budget Confirmed', 'Decision Maker Identified'],
        'Proposal Sent': ['Under Review', 'Follow-up Required'],
        'Negotiation': ['Price Discussion', 'Terms Discussion', 'Final Review'],
        'Won': ['Contract Signed', 'Payment Received'],
        'Lost': ['Budget Issues', 'Competitor', 'Timing Issues', 'No Response']
      }
    },
    customFields: [
      {
        id: 'field_1',
        name: 'Lead Source',
        type: 'select',
        options: ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call'],
        required: true,
        order: 1
      },
      {
        id: 'field_2',
        name: 'Budget Range',
        type: 'select',
        options: ['< ₹1L', '₹1L - ₹5L', '₹5L - ₹10L', '₹10L+'],
        required: false,
        order: 2
      }
    ],
    workflows: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  }
];

// Enhanced tenant reducer with database integration
type TenantAction = 
  | { type: 'SET_TENANT'; payload: Tenant }
  | { type: 'SET_USER'; payload: TenantUser }
  | { type: 'SET_CONFIG'; payload: TenantConfig[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_CONFIG'; payload: Partial<TenantConfig> }
  | { type: 'CLEAR_TENANT_DATA' };

interface TenantState {
  tenant: Tenant | null;
  user: TenantUser | null;
  config: TenantConfig[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenant: null,
  user: null,
  config: [],
  isLoading: false,
  error: null
};

function tenantReducer(state: TenantState, action: TenantAction): TenantState {
  switch (action.type) {
    case 'SET_TENANT':
      return { ...state, tenant: action.payload, error: null };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: state.config.map(c => 
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        )
      };
    case 'CLEAR_TENANT_DATA':
      return { ...initialState };
    default:
      return state;
  }
}

const TenantContextProvider = createContext<TenantContext | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tenantReducer, initialState);

  // Enhanced tenant detection with database validation
  const getCurrentTenantFromURL = (): string | null => {
    // In production, parse the subdomain or path
    // For development, use default tenant
    const hostname = window.location.hostname;
    
    if (hostname.includes('.')) {
      // Extract subdomain from hostname (e.g., 'marketlube.digitalerp.com')
      const subdomain = hostname.split('.')[0];
      return subdomain !== 'www' && subdomain !== 'digitalerp' ? subdomain : null;
    }
    
    // Fallback for development (localhost)
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || 'marketlube'; // Default for development
  };

  // Enhanced tenant switching with database context
  const switchTenant = async (tenantId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // In development, use mock data
      if (import.meta.env.DEV) {
        const tenant = mockTenants.find(t => t.id === tenantId || t.subdomain === tenantId);
        if (tenant) {
          // Set tenant context in API service for database isolation
          api.setTenantContext(tenant.id);
          
          dispatch({ type: 'SET_TENANT', payload: tenant });
          
          // Load user for this tenant
          const user = mockUsers.find(u => u.tenantId === tenant.id);
          if (user) {
            dispatch({ type: 'SET_USER', payload: user });
          }

          // Load config for this tenant
          const config = mockConfigs.filter(c => c.tenantId === tenant.id);
          dispatch({ type: 'SET_CONFIG', payload: config });
          
          console.log(`Tenant context set: ${tenant.companyName} (${tenant.id})`);
        } else {
          throw new Error('Tenant not found');
        }
      } else {
        // Production: Validate tenant with backend
        const response = await authApi.validateTenant(tenantId);
        
        if (response.success && response.data) {
          const tenant = response.data as Tenant;
          
          // Set tenant context in API service for database isolation
          api.setTenantContext(tenant.id);
          
          dispatch({ type: 'SET_TENANT', payload: tenant });
          
          // Load additional tenant data
          await loadTenantData(tenant.id);
        } else {
          throw new Error(response.error || 'Tenant validation failed');
        }
      }
    } catch (error) {
      console.error('Tenant switch error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load tenant data' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load tenant-specific data from API
  const loadTenantData = async (tenantId: string) => {
    try {
      // Load user data
      const userResponse = await authApi.getCurrentUser();
      if (userResponse.success && userResponse.data) {
        dispatch({ type: 'SET_USER', payload: userResponse.data as TenantUser });
      }

      // Load tenant configuration
      const configResponse = await configApi.get();
      if (configResponse.success && configResponse.data) {
        dispatch({ type: 'SET_CONFIG', payload: configResponse.data as TenantConfig[] });
      }
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    }
  };

  // Enhanced config update with API persistence
  const updateTenantConfig = async (configUpdate: Partial<TenantConfig>) => {
    try {
      dispatch({ type: 'UPDATE_CONFIG', payload: configUpdate });
      
      // Persist to backend (in production)
      if (!import.meta.env.DEV) {
        const response = await configApi.update(configUpdate);
        if (!response.success) {
          throw new Error(response.error);
        }
      }
      
      console.log('Tenant config updated:', configUpdate);
    } catch (error) {
      console.error('Failed to update tenant config:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update configuration' 
      });
    }
  };

  // Clear tenant context (for logout)
  const clearTenantContext = () => {
    dispatch({ type: 'CLEAR_TENANT_DATA' });
    // Clear API context as well
    api.setTenantContext('');
    console.log('Tenant context cleared');
  };

  // Initialize tenant on mount with validation
  useEffect(() => {
    const initializeTenant = async () => {
      const subdomain = getCurrentTenantFromURL();
      if (subdomain) {
        await switchTenant(subdomain);
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'No tenant specified' });
      }
    };

    initializeTenant();
  }, []);

  // Monitor tenant changes (for subdomain routing)
  useEffect(() => {
    const handleLocationChange = () => {
      const newSubdomain = getCurrentTenantFromURL();
      if (newSubdomain && newSubdomain !== state.tenant?.subdomain) {
        switchTenant(newSubdomain);
      }
    };

    // Listen for navigation changes
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [state.tenant?.subdomain]);

  // Debug logging for development
  useEffect(() => {
    if (import.meta.env.DEV && state.tenant) {
      console.log('Current Tenant:', {
        name: state.tenant.companyName,
        subdomain: state.tenant.subdomain,
        plan: state.tenant.subscription.plan,
        users: `${state.tenant.subscription.currentUsers}/${state.tenant.subscription.maxUsers}`
      });
    }
  }, [state.tenant]);

  const value: TenantContext = {
    tenant: state.tenant,
    user: state.user,
    config: state.config,
    switchTenant,
    updateTenantConfig,
    isLoading: state.isLoading,
    error: state.error,
    // Additional methods for enhanced functionality
    clearTenantContext,
    loadTenantData: () => state.tenant ? loadTenantData(state.tenant.id) : Promise.resolve(),
  };

  return (
    <TenantContextProvider.Provider value={value}>
      {children}
    </TenantContextProvider.Provider>
  );
};

export const useTenant = (): TenantContext => {
  const context = useContext(TenantContextProvider);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}; 