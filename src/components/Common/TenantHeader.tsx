import React from 'react';
import { Building, Users, Crown, Settings, ChevronDown, Bell, Search } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';

interface TenantHeaderProps {
  className?: string;
}

const TenantHeader: React.FC<TenantHeaderProps> = ({ className = '' }) => {
  const { tenant, user, isLoading } = useTenant();

  if (isLoading || !tenant || !user) {
    return (
      <div className={`bg-white border-b border-gray-200 px-6 py-3 ${className}`}>
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-48 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Tenant Info */}
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: tenant.customization.primaryColor }}
          >
            {tenant.companyName.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-poppins font-bold text-gray-900 text-lg">
                {tenant.companyName}
              </h1>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{tenant.subscription.currentUsers}/{tenant.subscription.maxUsers} users</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown size={12} />
                  <span className="capitalize">{tenant.subscription.plan}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  tenant.subscription.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : tenant.subscription.status === 'trial'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {tenant.subscription.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins text-sm w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div className="text-left">
              <p className="font-poppins font-medium text-gray-900 text-sm">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Subdomain Info */}
      <div className="mt-2 text-xs text-gray-500 font-poppins">
        <span className="bg-gray-100 px-2 py-1 rounded">
          digitalerp.com/{tenant.subdomain}
        </span>
      </div>
    </div>
  );
};

export default TenantHeader; 