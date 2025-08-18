import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  MessageSquare, 
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useUpdateNotificationMutation,
  useBulkUpdateNotificationsMutation,
  useBulkDeleteNotificationsMutation,
  useDeleteNotificationMutation,
  useExportNotificationsMutation,
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsRespondedMutation
} from '@/slices/notificationSlice';

const NotificationScreen = () => {
  // State management
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [responseNote, setResponseNote] = useState('');
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    priority: '',
    category: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    startDate: '',
    endDate: ''
  });

  // API hooks
  const { 
    data: notificationsData, 
    isLoading: loadingNotifications, 
    error: notificationsError,
    refetch: refetchNotifications
  } = useGetNotificationsQuery(filters);

  const { 
    data: statsData, 
    isLoading: loadingStats,
    refetch: refetchStats
  } = useGetNotificationStatsQuery();

  const [updateNotification] = useUpdateNotificationMutation();
  const [bulkUpdateNotifications] = useBulkUpdateNotificationsMutation();
  const [bulkDeleteNotifications] = useBulkDeleteNotificationsMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [exportNotifications] = useExportNotificationsMutation();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAsResponded] = useMarkNotificationAsRespondedMutation();

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'read': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'responded': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'archived': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notificationsData?.data?.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notificationsData?.data?.map(n => n._id) || []);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      if (status === 'read') {
        await markAsRead(id).unwrap();
      } else if (status === 'responded') {
        await markAsResponded({ id, responseNote }).unwrap();
      } else {
        await updateNotification({ id, updateData: { status } }).unwrap();
      }
      refetchNotifications();
      refetchStats();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await bulkUpdateNotifications({
        ids: selectedNotifications,
        updateData: { status }
      }).unwrap();
      setSelectedNotifications([]);
      refetchNotifications();
      refetchStats();
    } catch (error) {
      console.error('Failed to bulk update:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedNotifications.length} notification(s)?`)) {
      try {
        await bulkDeleteNotifications(selectedNotifications).unwrap();
        setSelectedNotifications([]);
        refetchNotifications();
        refetchStats();
      } catch (error) {
        console.error('Failed to bulk delete:', error);
      }
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      await exportNotifications({ format, ...filters }).unwrap();
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetails(true);
    if (notification.status === 'unread') {
      handleStatusUpdate(notification._id, 'read');
    }
  };

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage and respond to user inquiries</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => refetchNotifications()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {statsData?.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
              <div className="text-2xl font-bold text-gray-900">
                {statsData.data.summary.total}
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Unread</CardTitle>
              <div className="text-2xl font-bold text-red-600">
                {statsData.data.summary.unread}
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today</CardTitle>
              <div className="text-2xl font-bold text-blue-600">
                {statsData.data.summary.today}
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">This Month</CardTitle>
              <div className="text-2xl font-bold text-green-600">
                {statsData.data.summary.thisMonth}
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Response Rate</CardTitle>
              <div className="text-2xl font-bold text-purple-600">
                {statsData.data.summary.responseRate}%
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedNotifications.length} selected
                </span>
                <button
                  onClick={() => handleBulkStatusUpdate('read')}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('responded')}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                >
                  Mark as Responded
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="business">Business</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="firstName">Name</option>
              </select>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedNotifications.length === notificationsData?.data?.length && notificationsData?.data?.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingNotifications ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading notifications...
            </div>
          ) : notificationsError ? (
            <div className="text-center py-8 text-red-600">
              Error loading notifications. Please try again.
            </div>
          ) : notificationsData?.data?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.length === notificationsData?.data?.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Message</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationsData?.data?.map((notification) => (
                    <tr key={notification._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification._id)}
                          onChange={() => handleSelectNotification(notification._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(notification.status)}
                          <span className="text-sm capitalize">{notification.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {notification.firstName} {notification.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {notification.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {notification.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-sm text-gray-900 truncate">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Globe className="h-3 w-3 mr-1" />
                          {notification.preferredLanguage === 'Other' ? 
                            notification.otherLanguage : notification.preferredLanguage}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(notification.priority)}`}>
                          {notification.priority || 'medium'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(notification.createdAt)}
                        </div>
                        {notification.respondedAt && (
                          <div className="text-xs text-green-600">
                            Responded: {formatDate(notification.respondedAt)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewDetails(notification)}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {notification.status === 'unread' && (
                            <button
                              onClick={() => handleStatusUpdate(notification._id, 'read')}
                              className="p-1 text-gray-400 hover:text-yellow-600 rounded-md hover:bg-yellow-50"
                              title="Mark as Read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {(notification.status === 'unread' || notification.status === 'read') && (
                            <button
                              onClick={() => handleStatusUpdate(notification._id, 'responded')}
                              className="p-1 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50"
                              title="Mark as Responded"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this notification?')) {
                                deleteNotification(notification._id);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {notificationsData?.pagination && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {((notificationsData.pagination.currentPage - 1) * notificationsData.pagination.itemsPerPage) + 1} to{' '}
                {Math.min(notificationsData.pagination.currentPage * notificationsData.pagination.itemsPerPage, notificationsData.pagination.totalItems)} of{' '}
                {notificationsData.pagination.totalItems} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={!notificationsData.pagination.hasPrev}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {notificationsData.pagination.currentPage} of {notificationsData.pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={!notificationsData.pagination.hasNext}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Details Modal */}
      {showDetails && selectedNotification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Notification Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedNotification.firstName} {selectedNotification.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1 flex items-center space-x-2">
                      {getStatusIcon(selectedNotification.status)}
                      <span className="text-sm capitalize">{selectedNotification.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNotification.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNotification.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Language</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedNotification.preferredLanguage === 'Other' ? 
                        selectedNotification.otherLanguage : selectedNotification.preferredLanguage}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Priority</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(selectedNotification.priority)}`}>
                      {selectedNotification.priority || 'medium'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Message</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedNotification.message}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Submitted</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedNotification.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Source</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {selectedNotification.source || 'website'}
                    </p>
                  </div>
                </div>
                
                {selectedNotification.respondedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Responded By</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedNotification.respondedBy.firstName} {selectedNotification.respondedBy.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Responded At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedNotification.respondedAt && formatDate(selectedNotification.respondedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedNotification.responseNote && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Response Note</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedNotification.responseNote}
                    </p>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  {selectedNotification.status !== 'responded' && (
                    <>
                      <textarea
                        value={responseNote}
                        onChange={(e) => setResponseNote(e.target.value)}
                        placeholder="Add response note (optional)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                        rows="2"
                      />
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedNotification._id, 'responded');
                          setShowDetails(false);
                          setResponseNote('');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        Mark as Responded
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationScreen;