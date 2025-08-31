import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Users, FileText, MessageSquare, TrendingUp, Calendar, DollarSign, Clock, Star } from 'lucide-react';

// Import your actual API hooks
import { useGetCareerStatsQuery, useGetCareerApplicationsQuery } from '@/slices/careerApiSlice';
import { useGetNotificationStatsQuery, useGetNotificationsQuery } from '@/slices/notificationSlice';
import { useGetQuoteStatsQuery, useGetQuotesQuery } from '@/slices/quoteApiSlice';

// Section Cards Component
export const SectionCards = () => {
  const { data: careerStats, isLoading: careerLoading } = useGetCareerStatsQuery();
  const { data: notificationStats, isLoading: notificationLoading } = useGetNotificationStatsQuery();
  const { data: quoteStats, isLoading: quoteLoading } = useGetQuoteStatsQuery();

  const cards = [
    {
      title: 'Career Applications',
      value: careerStats?.data?.overview?.total || 0,
      subtitle: `${careerStats?.data?.overview?.pending || 0} pending review`,
      icon: Users,
      color: 'bg-blue-500',
      trend: careerStats?.data?.monthly?.length > 1 
        ? `${Math.round(((careerStats.data.monthly[0]?.count || 0) - (careerStats.data.monthly[1]?.count || 0)) / (careerStats.data.monthly[1]?.count || 1) * 100)}%`
        : '0%',
      isLoading: careerLoading
    },
    {
      title: 'Contact Messages',
      value: notificationStats?.data?.summary?.total || 0,
      subtitle: `${notificationStats?.data?.summary?.unread || 0} unread messages`,
      icon: MessageSquare,
      color: 'bg-green-500',
      trend: `${notificationStats?.data?.summary?.responseRate || 0}% response rate`,
      isLoading: notificationLoading
    },
    {
      title: 'Quote Requests',
      value: quoteStats?.data?.total || 0,
      subtitle: `${quoteStats?.data?.pending || 0} awaiting quotes`,
      icon: FileText,
      color: 'bg-purple-500',
      trend: quoteStats?.data?.monthlyTrends?.length > 1 
        ? `${Math.round(((quoteStats.data.monthlyTrends[0]?.count || 0) - (quoteStats.data.monthlyTrends[1]?.count || 0)) / (quoteStats.data.monthlyTrends[1]?.count || 1) * 100)}%`
        : '0%',
      isLoading: quoteLoading
    },
    {
      title: 'Total Revenue',
      value: `$${(quoteStats?.data?.totalValue || 0).toLocaleString()}`,
      subtitle: `$${(quoteStats?.data?.averageValue || 0).toLocaleString()} avg per quote`,
      icon: DollarSign,
      color: 'bg-orange-500',
      trend: quoteStats?.data?.monthlyTrends?.length > 1 
        ? `${Math.round(((quoteStats.data.monthlyTrends[0]?.totalValue || 0) - (quoteStats.data.monthlyTrends[1]?.totalValue || 0)) / (quoteStats.data.monthlyTrends[1]?.totalValue || 1) * 100)}%`
        : '0%',
      isLoading: quoteLoading
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${card.color} text-white`}>
                  <card.icon size={20} />
                </div>
                <h3 className="font-medium text-gray-600 text-sm">{card.title}</h3>
              </div>
              <div className="space-y-1">
                {card.isLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                )}
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>
            </div>
            <div className={`text-sm font-medium ${card.trend.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
              {card.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Chart Area Interactive Component
export const ChartAreaInteractive = () => {
  const [activeChart, setActiveChart] = useState('applications');
  const { data: careerStats } = useGetCareerStatsQuery();
  const { data: notificationStats } = useGetNotificationStatsQuery();
  const { data: quoteStats } = useGetQuoteStatsQuery();

  // Transform real data for charts
  const chartData = {
    applications: careerStats?.data?.monthly?.map(item => ({
      name: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      value: item.count,
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' })
    })).reverse() || [],
    
    notifications: notificationStats?.data?.weeklyTrend?.map(item => ({
      name: item._id,
      value: item.count,
      month: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' })
    })) || [],
    
    quotes: quoteStats?.data?.monthlyTrends?.map(item => ({
      name: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      value: item.count,
      revenue: item.totalValue,
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' })
    })).reverse() || []
  };

  const chartOptions = [
    { key: 'applications', label: 'Applications', color: '#3b82f6' },
    { key: 'notifications', label: 'Messages', color: '#10b981' },
    { key: 'quotes', label: 'Quotes', color: '#8b5cf6' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Activity Overview</h2>
          <p className="text-gray-500 text-sm">Track trends across all platforms</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {chartOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setActiveChart(option.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChart === option.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'quotes' ? (
            <AreaChart data={chartData[activeChart]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'value' ? `${value} quotes` : `$${value?.toLocaleString()}`,
                  name === 'value' ? 'Quotes' : 'Revenue'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData[activeChart]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value}`, chartOptions.find(opt => opt.key === activeChart)?.label]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartOptions.find(opt => opt.key === activeChart)?.color} 
                fill={chartOptions.find(opt => opt.key === activeChart)?.color} 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Status Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <StatusPieChart 
          title="Application Status"
          data={careerStats?.data?.overview}
          colors={['#fbbf24', '#3b82f6', '#10b981', '#22c55e', '#ef4444']}
          dataKeys={['pending', 'reviewed', 'interviewing', 'hired', 'rejected']}
        />
        <StatusPieChart 
          title="Message Status"
          data={notificationStats?.data?.breakdown}
          colors={['#f59e0b', '#3b82f6', '#10b981']}
          dataKeys={['unread', 'read', 'responded']}
        />
        <StatusPieChart 
          title="Quote Status"
          data={{
            pending: quoteStats?.data?.pending,
            quoted: quoteStats?.data?.quoted,
            accepted: quoteStats?.data?.accepted,
            rejected: quoteStats?.data?.rejected
          }}
          colors={['#fbbf24', '#3b82f6', '#10b981', '#ef4444']}
          dataKeys={['pending', 'quoted', 'accepted', 'rejected']}
        />
      </div>
    </div>
  );
};

// Status Pie Chart Component
const StatusPieChart = ({ title, data = {}, colors, dataKeys }) => {
  const chartData = dataKeys
    .filter(key => data[key] > 0)
    .map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: data[key],
      percentage: Math.round((data[key] / Object.values(data).reduce((a, b) => a + b, 0)) * 100)
    }));

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-gray-600">{entry.name}</span>
            </div>
            <span className="font-medium">{entry.value} ({entry.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Data Table Component
export const DataTable = () => {
  const [activeTab, setActiveTab] = useState('applications');
  
  // Fetch recent data for each tab
  const { data: applications, isLoading: applicationsLoading } = useGetCareerApplicationsQuery({ 
    page: 1, 
    limit: 5, 
    sortBy: 'createdAt', 
    sortOrder: 'desc' 
  });
  
  const { data: notifications, isLoading: notificationsLoading } = useGetNotificationsQuery({ 
    page: 1, 
    limit: 5, 
    sortBy: 'createdAt', 
    sortOrder: 'desc' 
  });
  
  const { data: quotes, isLoading: quotesLoading } = useGetQuotesQuery({ 
    page: 1, 
    limit: 5, 
    sortBy: 'createdAt', 
    sortOrder: 'desc' 
  });

  const tabs = [
    { key: 'applications', label: 'Recent Applications', icon: Users, data: applications?.data, loading: applicationsLoading },
    { key: 'messages', label: 'Recent Messages', icon: MessageSquare, data: notifications?.data, loading: notificationsLoading },
    { key: 'quotes', label: 'Recent Quotes', icon: FileText, data: quotes?.data, loading: quotesLoading }
  ];

  const getStatusBadge = (status, type) => {
    const styles = {
      applications: {
        pending: 'bg-yellow-100 text-yellow-800',
        reviewed: 'bg-blue-100 text-blue-800',
        interviewing: 'bg-purple-100 text-purple-800',
        hired: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
      },
      messages: {
        unread: 'bg-red-100 text-red-800',
        read: 'bg-blue-100 text-blue-800',
        responded: 'bg-green-100 text-green-800'
      },
      quotes: {
        pending: 'bg-yellow-100 text-yellow-800',
        reviewing: 'bg-blue-100 text-blue-800',
        quoted: 'bg-purple-100 text-purple-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        completed: 'bg-gray-100 text-gray-800',
        expired: 'bg-orange-100 text-orange-800'
      }
    };

    return styles[type]?.[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPositionTitle = (position) => {
    const titles = {
      'frontend-developer': 'Frontend Developer',
      'backend-developer': 'Backend Developer',
      'translator': 'Translator',
      'project-manager': 'Project Manager',
      'ui-ux-designer': 'UI/UX Designer',
      'data-analyst': 'Data Analyst'
    };
    return titles[position] || position?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Position';
  };

  const activeTabData = tabs.find(tab => tab.key === activeTab);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-gray-500 text-sm">Latest submissions and updates</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {activeTabData?.loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4 p-4 border-b border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'applications' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Applied</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications?.data?.map((app) => (
                    <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{app.firstName} {app.lastName}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {getPositionTitle(app.position)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(app.status, 'applications')}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'messages' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Language</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Message</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Received</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications?.data?.map((msg) => (
                    <tr key={msg._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{msg.firstName} {msg.lastName}</div>
                          <div className="text-sm text-gray-500">{msg.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {msg.preferredLanguage === 'Other' ? msg.otherLanguage : msg.preferredLanguage}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate">
                          {msg.message}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(msg.status, 'messages')}`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'quotes' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Languages</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Requested</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes?.data?.map((quote) => (
                    <tr key={quote._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{quote.firstName} {quote.lastName}</div>
                          <div className="text-sm text-gray-500">{quote.email}</div>
                          {quote.company && (
                            <div className="text-xs text-gray-400">{quote.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">{quote.projectType}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div>
                          <div>{quote.sourceLanguage === 'Other' ? quote.otherSourceLanguage : quote.sourceLanguage}</div>
                          <div className="text-xs text-gray-500">
                            → {quote.targetLanguages?.includes('Other') 
                              ? [...quote.targetLanguages.filter(lang => lang !== 'Other'), quote.otherTargetLanguage].filter(Boolean).join(', ')
                              : quote.targetLanguages?.join(', ')}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {quote.estimatedCost ? `$${quote.estimatedCost.toLocaleString()}` : 'TBD'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(quote.status, 'quotes')}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {formatDate(quote.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-6">
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          View All {activeTabData?.label?.replace('Recent ', '')}
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Page Component
const AdminIndexPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <div className="px-4 lg:px-6 pb-6">
        <DataTable />
      </div>
    </div>
  );
};

export default AdminIndexPage;