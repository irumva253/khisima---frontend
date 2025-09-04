import React, { useState } from 'react';
import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useBulkUpdateNotificationsMutation,
  useBulkDeleteNotificationsMutation,
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsRespondedMutation,
  useGetNotificationStatsQuery
} from '@/slices/notificationSlice';
import {
  Eye,
  EyeOff,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  MoreVertical,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

const NotificationScreen = () => {
  // State management
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [responseNote, setResponseNote] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);

  // RTK Query hooks
  const {
    data: notificationsData,
    isLoading,
    refetch
  } = useGetNotificationsQuery(filters);

  const { data: statsData } = useGetNotificationStatsQuery();
  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [bulkUpdate] = useBulkUpdateNotificationsMutation();
  const [bulkDelete] = useBulkDeleteNotificationsMutation();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAsResponded] = useMarkNotificationAsRespondedMutation();

  const notifications = notificationsData?.data || [];
  const pagination = notificationsData?.pagination || {};
  // Use statsData if available, otherwise fall back to notificationsData.stats
  const stats = statsData || notificationsData?.stats || {};

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n._id));
    }
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // Action handlers
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
      toast.success('Notification marked as read');
      refetch();
    } catch (err) {
      console.error('Failed to mark as read:', err);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAsResponded = async (id, note) => {
    try {
      await markAsResponded({ id, responseNote: note }).unwrap();
      toast.success('Notification marked as responded');
      setResponseNote('');
      setSelectedNotification(null);
      refetch();
    } catch (err) {
      console.error('Failed to mark as responded:', err);
      toast.error('Failed to mark as responded');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success('Notification deleted');
      refetch();
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      await bulkUpdate({
        ids: selectedNotifications,
        updateData: { status: 'read' }
      }).unwrap();
      toast.success(`${selectedNotifications.length} notifications marked as read`);
      setSelectedNotifications([]);
      refetch();
    } catch (err) {
      console.error('Failed to bulk update:', err);
      toast.error('Failed to bulk update');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      await bulkDelete({ ids: selectedNotifications }).unwrap();
      toast.success(`${selectedNotifications.length} notifications deleted`);
      setSelectedNotifications([]);
      refetch();
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      toast.error('Failed to bulk delete');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateNotification({
        id,
        updateData: { status: newStatus }
      }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      setStatusDropdown(null);
      refetch();
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status');
    }
  };

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      unread: { color: 'bg-red-100 text-red-800', icon: EyeOff },
      read: { color: 'bg-blue-100 text-blue-800', icon: Eye },
      responded: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.unread;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority}
      </span>
    );
  };

  // Status dropdown component
  const StatusDropdown = ({ notification, onClose }) => {
    const statusOptions = [
      { value: 'unread', label: 'Mark as Unread', icon: EyeOff },
      { value: 'read', label: 'Mark as Read', icon: Eye },
      { value: 'responded', label: 'Mark as Responded', icon: CheckCircle }
    ];

    return (
      <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-48">
        {statusOptions
          .filter(option => option.value !== notification.status)
          .map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  if (option.value === 'responded') {
                    setSelectedNotification(notification);
                  } else {
                    handleUpdateStatus(notification._id, option.value);
                  }
                  onClose();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-sm"
              >
                <Icon className="w-4 h-4 mr-2" />
                {option.label}
              </button>
            );
          })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={refetch}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500">
                {pagination.totalItems || 0} total notifications
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.unread || 0}</div>
              <div className="text-sm text-blue-600">Unread</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.responded || 0}</div>
              <div className="text-sm text-green-600">Responded</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.read || 0}</div>
              <div className="text-sm text-yellow-600">Read</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{pagination.totalItems || 0}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">
                  {selectedNotifications.length} notification(s) selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkMarkAsRead}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === notifications.length && notifications.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={() => toggleSelectNotification(notification._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {notification.firstName} {notification.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{notification.email}</div>
                    {notification.phone && (
                      <div className="text-sm text-gray-500">{notification.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      Language: {notification.preferredLanguage}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={notification.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={notification.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {notification.status !== 'read' && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Mark as Read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {notification.status !== 'responded' && (
                        <button
                          onClick={() => setSelectedNotification(notification)}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Responded"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdown(
                            statusDropdown === notification._id ? null : notification._id
                          )}
                          className="text-gray-600 hover:text-gray-900"
                          title="More Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {statusDropdown === notification._id && (
                          <StatusDropdown 
                            notification={notification}
                            onClose={() => setStatusDropdown(null)}
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((filters.page - 1) * filters.limit) + 1} to{' '}
                  {Math.min(filters.page * filters.limit, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Respond Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Mark as Responded</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add a response note for {selectedNotification.firstName} {selectedNotification.lastName}
            </p>
            <textarea
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              placeholder="Enter your response note..."
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setSelectedNotification(null);
                  setResponseNote('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkAsResponded(selectedNotification._id, responseNote)}
                disabled={!responseNote.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {statusDropdown && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setStatusDropdown(null)}
        />
      )}
    </div>
  );
};

export default NotificationScreen;