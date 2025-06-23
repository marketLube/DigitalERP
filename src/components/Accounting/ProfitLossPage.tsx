import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Download, Calendar, Filter, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PLItem {
  category: string;
  subcategory?: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface PLSection {
  title: string;
  items: PLItem[];
  total: number;
  color: string;
}

interface ProfitLossPageProps {
  onBack: () => void;
  showHeader?: boolean;
}

const ProfitLossPage: React.FC<ProfitLossPageProps> = ({ onBack, showHeader = true }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [comparisonPeriod, setComparisonPeriod] = useState('Previous Month');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');

  // Mock P&L Data
  const revenue: PLSection = {
    title: 'Revenue',
    color: 'text-green-600',
    total: 156750,
    items: [
      { category: 'Product Sales', amount: 89500, percentage: 57.1, trend: 'up', trendValue: 12.5 },
      { category: 'Service Revenue', amount: 45250, percentage: 28.9, trend: 'up', trendValue: 8.3 },
      { category: 'Consulting', amount: 22000, percentage: 14.0, trend: 'down', trendValue: -3.2 }
    ]
  };

  const costOfGoodsSold: PLSection = {
    title: 'Cost of Goods Sold',
    color: 'text-red-600',
    total: 62700,
    items: [
      { category: 'Direct Materials', amount: 35400, percentage: 56.5, trend: 'up', trendValue: 5.2 },
      { category: 'Direct Labor', amount: 18900, percentage: 30.1, trend: 'stable', trendValue: 0.8 },
      { category: 'Manufacturing Overhead', amount: 8400, percentage: 13.4, trend: 'down', trendValue: -2.1 }
    ]
  };

  const operatingExpenses: PLSection = {
    title: 'Operating Expenses',
    color: 'text-orange-600',
    total: 48250,
    items: [
      { category: 'Salaries & Benefits', amount: 28500, percentage: 59.1, trend: 'up', trendValue: 3.5 },
      { category: 'Rent & Utilities', amount: 8750, percentage: 18.1, trend: 'stable', trendValue: 0.0 },
      { category: 'Marketing & Advertising', amount: 6200, percentage: 12.8, trend: 'up', trendValue: 15.2 },
      { category: 'Office Supplies', amount: 2800, percentage: 5.8, trend: 'down', trendValue: -8.5 },
      { category: 'Professional Services', amount: 2000, percentage: 4.1, trend: 'stable', trendValue: 1.2 }
    ]
  };

  const grossProfit = revenue.total - costOfGoodsSold.total;
  const operatingIncome = grossProfit - operatingExpenses.total;
  const netIncome = operatingIncome; // Simplified for this example

  const grossProfitMargin = (grossProfit / revenue.total) * 100;
  const operatingMargin = (operatingIncome / revenue.total) * 100;
  const netMargin = (netIncome / revenue.total) * 100;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} className="text-green-600" />;
      case 'down': return <TrendingDown size={14} className="text-red-600" />;
      default: return <div className="w-3.5 h-3.5 bg-gray-400 rounded-full"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderPLSection = (section: PLSection) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-poppins font-semibold ${section.color}`}>
          {section.title}
        </h3>
        <p className={`text-xl font-poppins font-bold ${section.color}`}>
          ${section.total.toLocaleString()}
        </p>
      </div>
      
      <div className="space-y-3">
        {section.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-poppins font-medium text-gray-900">{item.category}</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(item.trend)}
                  <span className={`text-xs font-poppins font-medium ${getTrendColor(item.trend)}`}>
                    {item.trend === 'up' ? '+' : item.trend === 'down' ? '' : ''}{item.trendValue}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-500 font-poppins">
                  {item.percentage.toFixed(1)}% of total
                </span>
                <div className="flex-1 max-w-32">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        section.color.includes('green') ? 'bg-green-500' :
                        section.color.includes('red') ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="font-poppins font-semibold text-gray-900 text-right">
              ${item.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={showHeader ? "p-6 animate-fadeIn" : "animate-fadeIn"}>
      {/* Header - Only show when showHeader is true */}
      {showHeader && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
                Profit & Loss
              </h1>
              <p className="text-gray-600 font-poppins">
                Analyze profit and loss statements for financial insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
              >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Quarter">This Quarter</option>
                <option value="This Year">This Year</option>
                <option value="Custom">Custom Range</option>
              </select>
              
              <button
                onClick={() => setViewMode(viewMode === 'detailed' ? 'summary' : 'detailed')}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                {viewMode === 'detailed' ? 'Summary View' : 'Detailed View'}
              </button>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar - Always show when used as tab */}
      {!showHeader && (
        <div className="flex items-center justify-end gap-3 mb-6">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm bg-white"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Quarter">This Quarter</option>
            <option value="This Year">This Year</option>
            <option value="Custom">Custom Range</option>
          </select>
          
          <button
            onClick={() => setViewMode(viewMode === 'detailed' ? 'summary' : 'detailed')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            {viewMode === 'detailed' ? 'Summary View' : 'Detailed View'}
          </button>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign size={20} className="text-green-600" />
            <span className="font-poppins font-medium text-gray-900">Total Revenue</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-green-600">
            ${revenue.total.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={14} className="text-green-600" />
            <span className="text-sm text-green-600 font-poppins font-medium">+8.5%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 size={20} className="text-blue-600" />
            <span className="font-poppins font-medium text-gray-900">Gross Profit</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-blue-600">
            ${grossProfit.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {grossProfitMargin.toFixed(1)}% margin
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <PieChart size={20} className="text-purple-600" />
            <span className="font-poppins font-medium text-gray-900">Operating Income</span>
          </div>
          <p className="text-2xl font-poppins font-semibold text-purple-600">
            ${operatingIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {operatingMargin.toFixed(1)}% margin
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={20} className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'} />
            <span className="font-poppins font-medium text-gray-900">Net Income</span>
          </div>
          <p className={`text-2xl font-poppins font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-1">
            {netMargin.toFixed(1)}% margin
          </p>
        </div>
      </div>

      {viewMode === 'detailed' ? (
        <div className="space-y-4">
          {/* Revenue Section */}
          {renderPLSection(revenue)}

          {/* Gross Profit Calculation */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-poppins font-semibold text-blue-900">
                Gross Profit
              </h3>
              <div className="text-right">
                <p className="text-2xl font-poppins font-bold text-blue-900">
                  ${grossProfit.toLocaleString()}
                </p>
                <p className="text-sm text-blue-700 font-poppins">
                  {grossProfitMargin.toFixed(1)}% margin
                </p>
              </div>
            </div>
          </div>

          {/* Cost of Goods Sold */}
          {renderPLSection(costOfGoodsSold)}

          {/* Operating Income Calculation */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-poppins font-semibold text-purple-900">
                Operating Income
              </h3>
              <div className="text-right">
                <p className="text-2xl font-poppins font-bold text-purple-900">
                  ${operatingIncome.toLocaleString()}
                </p>
                <p className="text-sm text-purple-700 font-poppins">
                  {operatingMargin.toFixed(1)}% margin
                </p>
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          {renderPLSection(operatingExpenses)}

          {/* Net Income */}
          <div className={`bg-gradient-to-r ${netIncome >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'} rounded-xl border p-5`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-poppins font-semibold ${netIncome >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                Net Income
              </h3>
              <div className="text-right">
                <p className={`text-3xl font-poppins font-bold ${netIncome >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  ${netIncome.toLocaleString()}
                </p>
                <p className={`text-sm font-poppins ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {netMargin.toFixed(1)}% net margin
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Summary View */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-poppins font-semibold text-gray-900">
              P&L Summary - {selectedPeriod}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {/* Revenue Line */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <ArrowDownRight size={16} className="text-green-600" />
                  <span className="font-poppins font-medium text-gray-900">Total Revenue</span>
                </div>
                <span className="font-poppins font-semibold text-green-600">
                  ${revenue.total.toLocaleString()}
                </span>
              </div>

              {/* COGS Line */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <ArrowUpRight size={16} className="text-red-600" />
                  <span className="font-poppins font-medium text-gray-900">Cost of Goods Sold</span>
                </div>
                <span className="font-poppins font-semibold text-red-600">
                  (${costOfGoodsSold.total.toLocaleString()})
                </span>
              </div>

              {/* Gross Profit Line */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 bg-blue-50 px-4 rounded-lg">
                <span className="font-poppins font-semibold text-blue-900">Gross Profit</span>
                <span className="font-poppins font-bold text-blue-900">
                  ${grossProfit.toLocaleString()}
                </span>
              </div>

              {/* Operating Expenses Line */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <ArrowUpRight size={16} className="text-orange-600" />
                  <span className="font-poppins font-medium text-gray-900">Operating Expenses</span>
                </div>
                <span className="font-poppins font-semibold text-orange-600">
                  (${operatingExpenses.total.toLocaleString()})
                </span>
              </div>

              {/* Operating Income Line */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 bg-purple-50 px-4 rounded-lg">
                <span className="font-poppins font-semibold text-purple-900">Operating Income</span>
                <span className="font-poppins font-bold text-purple-900">
                  ${operatingIncome.toLocaleString()}
                </span>
              </div>

              {/* Net Income Line */}
              <div className={`flex items-center justify-between py-4 px-4 rounded-lg ${netIncome >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className={`font-poppins font-bold text-lg ${netIncome >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  Net Income
                </span>
                <span className={`font-poppins font-bold text-xl ${netIncome >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  ${netIncome.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Key Ratios */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-poppins font-semibold text-gray-900 mb-4">Key Financial Ratios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-poppins font-bold text-blue-600">
                    {grossProfitMargin.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 font-poppins">Gross Margin</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-poppins font-bold text-purple-600">
                    {operatingMargin.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 font-poppins">Operating Margin</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className={`text-2xl font-poppins font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netMargin.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 font-poppins">Net Margin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitLossPage;