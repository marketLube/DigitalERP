import React, { useState } from 'react';
import { Eye, EyeOff, Building2, Crown, Shield, Users, Lock, Mail } from 'lucide-react';

interface LoginCredentials {
  email: string;
  password: string;
  userType: 'owner' | 'tenant';
}

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'owner' | 'tenant'>('tenant');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Default development credentials
  const defaultCredentials = {
    tenant: {
      email: 'admin@tenant.com',
      password: 'tenant123'
    },
    owner: {
      email: 'owner@digitalerp.com',
      password: 'owner123'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate credentials
      const defaultCreds = defaultCredentials[userType];
      if (email === defaultCreds.email && password === defaultCreds.password) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        onLogin({ email, password, userType });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDefaultCredentials = (type: 'owner' | 'tenant') => {
    const creds = defaultCredentials[type];
    setEmail(creds.email);
    setPassword(creds.password);
    setUserType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Digital ERP</h1>
                <p className="text-sm text-gray-600">Enterprise Resource Planning</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome to Digital ERP Platform
              </h2>
              <p className="text-gray-600 text-lg">
                Comprehensive business management solution for modern enterprises
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <Crown className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-800">Owner Dashboard</h3>
                <p className="text-sm text-gray-600">Platform-wide control and analytics</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <Shield className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-800">Tenant Portal</h3>
                <p className="text-sm text-gray-600">Complete ERP suite for your business</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Access your Digital ERP dashboard</p>
            </div>

            {/* User Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Login As</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('tenant')}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    userType === 'tenant'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Shield className={`w-5 h-5 mx-auto mb-1 ${
                    userType === 'tenant' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="text-sm font-medium">Tenant</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('owner')}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    userType === 'owner'
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Crown className={`w-5 h-5 mx-auto mb-1 ${
                    userType === 'owner' ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  <div className="text-sm font-medium">Owner</div>
                  <div className="text-xs text-gray-500">Platform Owner</div>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  userType === 'owner'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                } text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  `Sign In as ${userType === 'owner' ? 'Platform Owner' : 'Tenant Admin'}`
                )}
              </button>
            </form>

            {/* Development Quick Login */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-3">Development Quick Login</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillDefaultCredentials('tenant')}
                  className="p-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Shield className="w-4 h-4 inline mr-1" />
                  Tenant Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDefaultCredentials('owner')}
                  className="p-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
                >
                  <Crown className="w-4 h-4 inline mr-1" />
                  Owner Demo
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-400 text-center">
                <p>Tenant: admin@tenant.com / tenant123</p>
                <p>Owner: owner@digitalerp.com / owner123</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 