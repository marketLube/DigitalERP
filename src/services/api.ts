// API Service Layer - Enhanced for Shared Database Multi-Tenancy
// This layer handles tenant isolation at the database level

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
  dbPool?: any; // Database connection pool
}

class ApiService {
  private config: ApiConfig;

  constructor(baseURL: string = '/api/v1') {
    this.config = { baseURL };
  }

  // Enhanced tenant context with database session management
  setTenantContext(tenantId: string, authToken?: string) {
    this.config.tenantId = tenantId;
    this.config.authToken = authToken;
    
    // Set tenant context in database session for RLS
    if (this.config.dbPool) {
      this.config.dbPool.query(
        `SELECT set_config('app.current_tenant', $1, true)`,
        [tenantId]
      );
    }
  }

  // Enhanced request method with tenant validation
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Validate tenant context is set
      if (!this.config.tenantId && !endpoint.includes('/auth/') && !endpoint.includes('/owner/')) {
        throw new Error('Tenant context not set');
      }

      const url = `${this.config.baseURL}${endpoint}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Add tenant isolation headers
      if (this.config.tenantId) {
        headers['X-Tenant-ID'] = this.config.tenantId;
        headers['X-Tenant-Isolation'] = 'enabled';
      }

      if (this.config.authToken) {
        headers['Authorization'] = `Bearer ${this.config.authToken}`;
      }

      // Merge existing headers
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Enhanced error handling with tenant context
      if (!response.ok) {
        const errorMessage = data.message || 'API request failed';
        console.error(`API Error [${this.config.tenantId}]:`, {
          endpoint,
          status: response.status,
          error: errorMessage,
          tenantId: this.config.tenantId
        });
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error(`API Error [${this.config.tenantId}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // GET request with tenant context
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  // POST request with tenant context
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request with tenant context
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request with tenant context
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Batch operations for multi-tenant scenarios
  async batchRequest<T>(requests: Array<{
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
  }>): Promise<ApiResponse<T[]>> {
    try {
      const responses = await Promise.all(
        requests.map(req => {
          switch (req.method) {
            case 'GET': return this.get(req.endpoint);
            case 'POST': return this.post(req.endpoint, req.data);
            case 'PUT': return this.put(req.endpoint, req.data);
            case 'DELETE': return this.delete(req.endpoint);
          }
        })
      );

      return {
        success: responses.every(r => r.success),
        data: responses.map(r => r.data) as T[],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Batch request failed',
      };
    }
  }
}

// Tenant-isolated API instance
const api = new ApiService();

// Enhanced tenant-specific API methods with proper isolation
export const tenantApi = {
  // Accounting module with tenant isolation
  accounting: {
    transactions: {
      getAll: (params?: any) => api.get('/accounting/transactions', params),
      getById: (id: string) => api.get(`/accounting/transactions/${id}`),
      create: (data: any) => api.post('/accounting/transactions', data),
      update: (id: string, data: any) => api.put(`/accounting/transactions/${id}`, data),
      delete: (id: string) => api.delete(`/accounting/transactions/${id}`),
      getDayBook: (date?: string) => api.get('/accounting/daybook', { date }),
      getTrialBalance: () => api.get('/accounting/trial-balance'),
    },
    invoices: {
      getAll: (params?: any) => api.get('/accounting/invoices', params),
      create: (data: any) => api.post('/accounting/invoices', data),
      update: (id: string, data: any) => api.put(`/accounting/invoices/${id}`, data),
    }
  },

  // HR module
  hr: {
    employees: {
      getAll: (params?: any) => api.get('/hr/employees', params),
      getById: (id: string) => api.get(`/hr/employees/${id}`),
      create: (data: any) => api.post('/hr/employees', data),
      update: (id: string, data: any) => api.put(`/hr/employees/${id}`, data),
    },
    attendance: {
      getAll: (params?: any) => api.get('/hr/attendance', params),
      markAttendance: (data: any) => api.post('/hr/attendance', data),
    }
  },

  // Sales & CRM
  sales: {
    leads: {
      getAll: (params?: any) => api.get('/sales/leads', params),
      getById: (id: string) => api.get(`/sales/leads/${id}`),
      create: (data: any) => api.post('/sales/leads', data),
      update: (id: string, data: any) => api.put(`/sales/leads/${id}`, data),
      delete: (id: string) => api.delete(`/sales/leads/${id}`),
    },
    proposals: {
      getAll: (params?: any) => api.get('/sales/proposals', params),
      create: (data: any) => api.post('/sales/proposals', data),
      update: (id: string, data: any) => api.put(`/sales/proposals/${id}`, data),
    }
  },

  // Reports with tenant-specific data
  reports: {
    getSalesReport: (params: any) => api.get('/reports/sales', params),
    getFinancialReport: (params: any) => api.get('/reports/financial', params),
    getHRReport: (params: any) => api.get('/reports/hr', params),
    getCustomReport: (reportId: string, params: any) => api.get(`/reports/custom/${reportId}`, params),
  },

  // Tenant configuration
  config: {
    get: () => api.get('/config'),
    update: (data: any) => api.put('/config', data),
    getStatuses: (module: string) => api.get(`/config/statuses/${module}`),
    updateStatuses: (module: string, data: any) => api.put(`/config/statuses/${module}`, data),
  },

  // Authentication with tenant validation
  auth: {
    login: (credentials: any) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout', {}),
    refreshToken: () => api.post('/auth/refresh', {}),
    validateTenant: (subdomain: string) => api.get(`/auth/validate-tenant/${subdomain}`),
    getCurrentUser: () => api.get('/auth/me'),
  },
};

// Owner-level API for platform management (no tenant isolation)
export const ownerApi = {
  tenants: {
    getAll: (params?: any) => api.get('/owner/tenants', params),
    getById: (id: string) => api.get(`/owner/tenants/${id}`),
    create: (data: any) => api.post('/owner/tenants', data),
    update: (id: string, data: any) => api.put(`/owner/tenants/${id}`, data),
    suspend: (id: string) => api.put(`/owner/tenants/${id}/suspend`, {}),
    activate: (id: string) => api.put(`/owner/tenants/${id}/activate`, {}),
    getUsage: (id: string) => api.get(`/owner/tenants/${id}/usage`),
  },
  
  analytics: {
    getPlatformStats: () => api.get('/owner/analytics/platform'),
    getRevenueAnalytics: (params?: any) => api.get('/owner/analytics/revenue', params),
    getUserAnalytics: (params?: any) => api.get('/owner/analytics/users', params),
    getSystemHealth: () => api.get('/owner/analytics/system-health'),
  },

  billing: {
    getAllInvoices: (params?: any) => api.get('/owner/billing/invoices', params),
    getRevenue: (params?: any) => api.get('/owner/billing/revenue', params),
    processPayment: (data: any) => api.post('/owner/billing/payments', data),
  },

  system: {
    getSystemStatus: () => api.get('/owner/system/status'),
    getAuditLogs: (params?: any) => api.get('/owner/system/audit-logs', params),
    performMaintenance: (data: any) => api.post('/owner/system/maintenance', data),
  }
};

// Export the API service instance
export { api };

// Export individual API methods for convenience
export const {
  accounting: accountingApi,
  hr: hrApi,
  sales: salesApi,
  reports: reportsApi,
  config: configApi,
  auth: authApi,
} = tenantApi; 