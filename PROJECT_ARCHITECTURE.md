# Digital ERP - Multi-Tenant Architecture Documentation

## 🎯 Project Overview
**Digital ERP** is a multi-tenant SaaS ERP platform designed specifically for Indian digital marketing companies. The platform allows each client company to have their own isolated workspace while sharing the same infrastructure.

## 🏗️ Architecture Philosophy

### Current Development Phase: CLIENT VIEW
- **Focus**: Building individual client company interfaces (e.g., digitalerp.com/marketlube)
- **Current Client**: Marketlube (Althameem Khan - Super Admin)
- **Future Phase**: Main owner view (digitalerp.com/admin) for platform administration

### Multi-Tenant Structure
```
digitalerp.com/
├── /marketlube          <- CLIENT VIEW (Current Focus)
├── /clientname2         <- Future client views
├── /clientname3         <- Future client views
└── /admin              <- MAIN OWNER VIEW (Future Phase)
```

## 🏢 Current Client Setup - Marketlube

### Company Details
- **Company**: Marketlube
- **Industry**: Digital Marketing
- **Location**: Bangalore, Karnataka, India
- **URL**: digitalerp.com/marketlube
- **Employees**: 12/25 users
- **Plan**: Professional (Active)

### Super Admin
- **Name**: Althameem Khan
- **Email**: althameem@marketlube.com
- **Role**: Founder & CEO
- **Permissions**: Full system access (*)

### Team Structure
1. **Althameem Khan** - Super Admin (Founder & CEO)
2. **Sarah Johnson** - Admin (Operations Manager)
3. **Mike Chen** - Manager (Sales Manager)
4. **Emily Rodriguez** - Manager (HR Manager)
5. **David Wilson** - User (Sales Executive)
6. **Lisa Thompson** - User (HR Executive)

## 📦 ERP Modules Architecture

### Core Modules Implemented
1. **Dashboard** - Overview and metrics
2. **Taskboard** - Project and task management
3. **Sales** - Lead pipeline, proposals, CRM
4. **HR** - Team management, attendance
5. **Accounting** - Financial management, invoices
6. **Reports** - Analytics and reporting
7. **Settings** - Roles, access, teams

## 🔧 Technical Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Font**: Poppins (Google Fonts)

### Backend (Future)
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Tenant Context
- **Hosting**: India-based servers

### Multi-Tenant Implementation
- **Context**: TenantContext (React Context API)
- **API Layer**: Tenant-aware service layer
- **Routing**: Dynamic tenant-based routing
- **Data Isolation**: Tenant ID in all data operations

## 🌍 Indian Market Optimization
- **Currency**: INR (₹)
- **Timezone**: Asia/Kolkata
- **Date Format**: DD/MM/YYYY
- **Phone Format**: +91 XXXXX XXXXX
- **Language**: English (with Indian terminology)

## 🚀 Development Status

### ✅ Completed
- Multi-tenant infrastructure
- Tenant context and user management
- All core UI modules (7 modules)
- Roles & access management (RBAC)
- Beautiful, modern UI design
- Indian localization
- API service layer structure
- Tenant-aware navigation

### 🔄 Current Focus
- Building client view functionality
- Refining individual module features
- Ensuring tenant isolation
- UI/UX optimization

### 📋 Future Phases
1. **Phase 1**: Complete client view (Current)
2. **Phase 2**: Backend MongoDB integration
3. **Phase 3**: Main owner view (/admin)
4. **Phase 4**: Multi-client deployment

## 🎨 UI/UX Philosophy
- **Design**: Modern, gradient-based, professional
- **Typography**: Poppins font family
- **Colors**: Tenant-specific branding (Marketlube: Purple theme)
- **Layout**: Sidebar navigation + main content area
- **Responsiveness**: Mobile-first approach

## 📁 File Structure
```
src/
├── components/
│   ├── Accounting/        # Financial modules
│   ├── Common/           # Shared components
│   ├── Dashboard/        # Main dashboard
│   ├── HR/              # Human resources
│   ├── Reports/         # Analytics & reporting
│   ├── Sales/           # CRM & sales pipeline
│   ├── Settings/        # System configuration
│   ├── Sidebar/         # Navigation components
│   └── Taskboard/       # Project management
├── contexts/
│   └── TenantContext.tsx # Multi-tenant state
├── services/
│   └── api.ts           # API service layer
└── types/               # TypeScript definitions
```

## 🔐 Security & Permissions
- **Role-Based Access Control (RBAC)**
- **Tenant Data Isolation**
- **Module-Level Permissions**
- **Team-Based Access Control**

## 📊 Business Model
- **Pricing**: Flat per-company pricing
- **Target**: Indian digital marketing agencies
- **Scale**: 1000+ users across multiple tenants
- **Revenue**: Subscription-based SaaS model

## 🧭 Development Guidelines

### Key Principles
1. **Tenant Isolation**: Every feature must respect tenant boundaries
2. **Indian Context**: Optimize for Indian business practices
3. **Client-First**: Focus on client view before admin features
4. **Scalability**: Build for 1000+ users from day one
5. **Modern UI**: Beautiful, gradient-rich designs

### Code Standards
- TypeScript for type safety
- Component-based architecture
- Consistent naming conventions
- Comprehensive error handling
- Mobile-responsive design

---

**Last Updated**: February 2024
**Current Phase**: Client View Development (Marketlube)
**Next Milestone**: Complete all module functionalities for client view 