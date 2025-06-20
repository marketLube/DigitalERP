export interface Tenant {
  id: string;
  companyName: string;
  subdomain: string; // e.g., 'acme-corp' for digitalerp.com/acme-corp
  contactEmail: string;
  contactPhone: string;
  industry: string;
  employeeCount: number;
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'trial' | 'suspended' | 'cancelled';
    startDate: string;
    endDate: string;
    maxUsers: number;
    currentUsers: number;
  };
  settings: {
    timezone: string;
    currency: string;
    dateFormat: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  customization: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    companyAddress: string;
    companyWebsite?: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'employee';
  permissions: string[];
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantConfig {
  id: string;
  tenantId: string;
  module: 'sales' | 'hr' | 'accounting' | 'projects' | 'reports';
  customStatuses: {
    main: string[];
    sub: { [key: string]: string[] };
  };
  customFields: Array<{
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
    options?: string[];
    required: boolean;
    order: number;
  }>;
  workflows: Array<{
    id: string;
    name: string;
    triggers: string[];
    actions: string[];
    isActive: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TenantContext {
  tenant: Tenant | null;
  user: TenantUser | null;
  config: TenantConfig[];
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenantConfig: (config: Partial<TenantConfig>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
} 