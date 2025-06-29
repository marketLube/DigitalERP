# Digital ERP - Shared Database Architecture Implementation

## 🏗️ Architecture Decision: Shared-Database, Shared-Schema

### Why This Choice is Perfect for Digital ERP

**Scale Match**: 247 tenants × 25 users = ~6,125 total users - ideal for shared infrastructure
**Revenue Efficiency**: ₹89,750 monthly revenue requires maximum cost optimization
**Operational Simplicity**: Reduces complexity shown in terminal logs (port conflicts, build issues)

## 🔄 Database Schema Design

### Core Tables with Tenant Isolation

```sql
-- 1. Tenants Table (Platform Level)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL DEFAULT 'basic',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  max_users INTEGER NOT NULL DEFAULT 25,
  current_users INTEGER NOT NULL DEFAULT 0,
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  database_name VARCHAR(100), -- For future sharding
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. All Business Data Tables Include tenant_id
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- 3. Accounting Module Tables
CREATE TABLE accounting_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  transaction_number VARCHAR(50) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'sale', 'purchase', 'payment', etc.
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  account_code VARCHAR(20),
  debit_account VARCHAR(100),
  credit_account VARCHAR(100),
  reference_number VARCHAR(100),
  transaction_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, transaction_number)
);

CREATE TABLE accounting_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  amount DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, invoice_number)
);

-- 4. HR Module Tables
CREATE TABLE hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  salary DECIMAL(12,2),
  hire_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id)
);

CREATE TABLE hr_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id),
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  hours_worked DECIMAL(4,2),
  status VARCHAR(50) DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, employee_id, date)
);

-- 5. Sales/CRM Module Tables
CREATE TABLE sales_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_number VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'new',
  value DECIMAL(12,2),
  source VARCHAR(100),
  assigned_to UUID REFERENCES users(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, lead_number)
);

CREATE TABLE sales_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  proposal_number VARCHAR(50) NOT NULL,
  lead_id UUID REFERENCES sales_leads(id),
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  valid_until DATE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, proposal_number)
);
```

### 🔒 Row-Level Security (RLS) Implementation

```sql
-- Enable RLS on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_proposals ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_transactions ON accounting_transactions
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_invoices ON accounting_invoices
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_employees ON hr_employees
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_attendance ON hr_attendance
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_leads ON sales_leads
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_proposals ON sales_proposals
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

### 📊 Performance Optimization Indexes

```sql
-- Primary tenant isolation indexes
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_accounting_transactions_tenant_id ON accounting_transactions(tenant_id);
CREATE INDEX idx_accounting_invoices_tenant_id ON accounting_invoices(tenant_id);
CREATE INDEX idx_hr_employees_tenant_id ON hr_employees(tenant_id);
CREATE INDEX idx_hr_attendance_tenant_id ON hr_attendance(tenant_id);
CREATE INDEX idx_sales_leads_tenant_id ON sales_leads(tenant_id);
CREATE INDEX idx_sales_proposals_tenant_id ON sales_proposals(tenant_id);

-- Performance indexes for common queries
CREATE INDEX idx_transactions_date_tenant ON accounting_transactions(tenant_id, transaction_date);
CREATE INDEX idx_attendance_date_tenant ON hr_attendance(tenant_id, date);
CREATE INDEX idx_leads_status_tenant ON sales_leads(tenant_id, status);
CREATE INDEX idx_invoices_status_tenant ON accounting_invoices(tenant_id, status);

-- Composite indexes for reporting
CREATE INDEX idx_transactions_type_date ON accounting_transactions(tenant_id, transaction_type, transaction_date);
CREATE INDEX idx_employees_department ON hr_employees(tenant_id, department, status);
```

## 🔧 Backend Implementation (Node.js/Express)

### Database Connection with Tenant Context

```javascript
// database/connection.js
const { Pool } = require('pg');

class TenantAwareDB {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      max: 20, // Maximum pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async query(text, params, tenantId = null) {
    const client = await this.pool.connect();
    try {
      // Set tenant context for RLS
      if (tenantId) {
        await client.query(`SELECT set_config('app.current_tenant', $1, true)`, [tenantId]);
      }
      
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async getClient() {
    return await this.pool.connect();
  }
}

module.exports = new TenantAwareDB();
```

### Tenant Isolation Middleware

```javascript
// middleware/tenantIsolation.js
const db = require('../database/connection');

const tenantIsolation = async (req, res, next) => {
  try {
    const tenantId = req.headers['x-tenant-id'];
    
    if (!tenantId && !req.path.includes('/owner/') && !req.path.includes('/auth/')) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    // Validate tenant exists and is active
    if (tenantId) {
      const result = await db.query(
        'SELECT id, status FROM tenants WHERE id = $1',
        [tenantId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      if (result.rows[0].status !== 'active') {
        return res.status(403).json({ error: 'Tenant account suspended' });
      }

      req.tenantId = tenantId;
    }

    next();
  } catch (error) {
    console.error('Tenant isolation error:', error);
    res.status(500).json({ error: 'Tenant validation failed' });
  }
};

module.exports = tenantIsolation;
```

### API Routes with Tenant Context

```javascript
// routes/accounting.js
const express = require('express');
const db = require('../database/connection');
const tenantIsolation = require('../middleware/tenantIsolation');

const router = express.Router();

// All routes use tenant isolation
router.use(tenantIsolation);

// Get all transactions (automatically filtered by RLS)
router.get('/transactions', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM accounting_transactions ORDER BY transaction_date DESC LIMIT 100',
      [],
      req.tenantId
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction (tenant_id automatically set)
router.post('/transactions', async (req, res) => {
  try {
    const { amount, description, transaction_type, account_code } = req.body;
    
    const result = await db.query(
      `INSERT INTO accounting_transactions 
       (tenant_id, amount, description, transaction_type, account_code, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [req.tenantId, amount, description, transaction_type, account_code, req.user.id],
      req.tenantId
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

module.exports = router;
```

## 🚀 Scaling Strategy

### 1. Immediate (0-500 tenants)
- Single PostgreSQL instance
- Connection pooling (20-50 connections)
- Basic read replicas for reports

### 2. Growth Phase (500-2000 tenants)
- Master-slave replication
- Redis caching layer
- Horizontal API scaling

### 3. Large Scale (2000+ tenants)
- Tenant-aware sharding by `tenant_id`
- Separate databases for heavy tenants
- Microservices architecture

```sql
-- Future sharding strategy
CREATE OR REPLACE FUNCTION get_tenant_shard(tenant_uuid UUID) 
RETURNS TEXT AS $$
BEGIN
  -- Simple hash-based sharding
  RETURN 'shard_' || (hashtext(tenant_uuid::text) % 4);
END;
$$ LANGUAGE plpgsql;
```

## 📈 Monitoring & Maintenance

### 1. Tenant Usage Monitoring
```sql
-- Track tenant resource usage
CREATE TABLE tenant_usage_stats (
  tenant_id UUID NOT NULL,
  date DATE NOT NULL,
  transaction_count INTEGER DEFAULT 0,
  user_count INTEGER DEFAULT 0,
  storage_used_mb DECIMAL(10,2) DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  PRIMARY KEY (tenant_id, date)
);
```

### 2. Performance Monitoring
- Monitor slow queries per tenant
- Track connection pool usage
- Alert on tenant isolation policy violations

### 3. Maintenance Tasks
```sql
-- Weekly cleanup of soft-deleted records
DELETE FROM accounting_transactions 
WHERE deleted_at < NOW() - INTERVAL '30 days';

-- Monthly tenant usage aggregation
INSERT INTO tenant_usage_stats (tenant_id, date, transaction_count)
SELECT tenant_id, CURRENT_DATE, COUNT(*)
FROM accounting_transactions 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
GROUP BY tenant_id;
```

## 🔐 Security Best Practices

### 1. Application Level
- Always validate tenant context before queries
- Implement audit logging for all tenant data access
- Use prepared statements to prevent SQL injection

### 2. Database Level
- Row-Level Security policies on all tenant tables
- Regular security audits of RLS policies
- Monitor for cross-tenant data access attempts

### 3. Backup Strategy
```bash
# Daily tenant-aware backups
pg_dump --schema-only digitalerp > schema_backup.sql
pg_dump --data-only --where="tenant_id='specific-tenant'" digitalerp > tenant_data.sql
```

## 💰 Cost Analysis

### Current Scale (247 tenants)
- **Single PostgreSQL**: ~$200/month (vs $2,470 for 247 instances)
- **Redis Cache**: ~$50/month
- **Total Infrastructure**: ~$250/month vs $25,000+

### Break-even Analysis
- Shared schema viable up to ~5,000 tenants
- Per-tenant databases justified only at enterprise scale (>100 users/tenant)

## 🎯 Migration Path

### Phase 1: Development (Current)
✅ Enhanced API service with tenant isolation
✅ TenantContext with database integration
✅ Owner dashboard for platform monitoring

### Phase 2: Production Setup
- [ ] PostgreSQL with RLS policies
- [ ] Connection pooling configuration
- [ ] Monitoring dashboard setup

### Phase 3: Optimization
- [ ] Read replicas for reporting
- [ ] Redis caching layer
- [ ] Performance monitoring

This architecture gives you **maximum efficiency** at your current scale while providing a **clear path to growth** without major rewrites. 