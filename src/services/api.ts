// API Service Layer - Will be connected to MongoDB backend
// This layer abstracts all API calls and handles tenant context

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiConfig {
  baseURL: string;
  tenantId?: string;
  authToken?: string;
}

class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  // Update tenant context for all subsequent requests
  setTenantContext(tenantId: string, authToken?: string) {
    this.config.tenantId = tenantId;
    this.config.authToken = authToken;
  }

  // Generic request method with tenant headers
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.config.baseURL}${endpoint}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Merge existing headers if present
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      // Add tenant context to headers (for backend processing)
      if (this.config.tenantId) {
        headers['X-Tenant-ID'] = this.config.tenantId;
      }

      if (this.config.authToken) {
        headers['Authorization'] = `Bearer ${this.config.authToken}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'API request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // CRUD operations
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API instance (will use environment variables in production)
const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
};

export const api = new ApiService(apiConfig);

// Tenant-specific API methods
export const tenantApi = {
  // Proposals
  proposals: {
    getAll: () => api.get('/proposals'),
    getById: (id: string) => api.get(`/proposals/${id}`),
    create: (data: any) => api.post('/proposals', data),
    update: (id: string, data: any) => api.put(`/proposals/${id}`, data),
    delete: (id: string) => api.delete(`/proposals/${id}`),
  },

  // Leads
  leads: {
    getAll: () => api.get('/leads'),
    getById: (id: string) => api.get(`/leads/${id}`),
    create: (data: any) => api.post('/leads', data),
    update: (id: string, data: any) => api.put(`/leads/${id}`, data),
    delete: (id: string) => api.delete(`/leads/${id}`),
  },

  // Teams
  teams: {
    getAll: () => api.get('/teams'),
    getById: (id: string) => api.get(`/teams/${id}`),
    create: (data: any) => api.post('/teams', data),
    update: (id: string, data: any) => api.put(`/teams/${id}`, data),
    delete: (id: string) => api.delete(`/teams/${id}`),
  },

  // Users
  users: {
    getAll: () => api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
    create: (data: any) => api.post('/users', data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
    invite: (data: any) => api.post('/users/invite', data),
  },

  // Tenant Configuration
  config: {
    get: () => api.get('/config'),
    update: (data: any) => api.put('/config', data),
    getStatuses: (module: string) => api.get(`/config/statuses/${module}`),
    updateStatuses: (module: string, data: any) => api.put(`/config/statuses/${module}`, data),
  },

  // Reports
  reports: {
    getSalesReport: (params: any) => api.get(`/reports/sales?${new URLSearchParams(params)}`),
    getTeamReport: (params: any) => api.get(`/reports/team?${new URLSearchParams(params)}`),
    getTaskReport: (params: any) => api.get(`/reports/tasks?${new URLSearchParams(params)}`),
  },

  // Authentication
  auth: {
    login: (credentials: any) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout', {}),
    refreshToken: () => api.post('/auth/refresh', {}),
    validateTenant: (subdomain: string) => api.get(`/auth/validate-tenant/${subdomain}`),
  },
};

// Export individual API methods for convenience
export const {
  proposals: proposalsApi,
  leads: leadsApi,
  teams: teamsApi,
  users: usersApi,
  config: configApi,
  reports: reportsApi,
  auth: authApi,
} = tenantApi; 