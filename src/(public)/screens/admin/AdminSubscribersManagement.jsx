import React, { useState, useEffect } from 'react';
import {
  useGetSubscribersQuery,
  useGetSubscriberStatsQuery,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
  useBulkOperationsMutation
  } from '@/slices/subscriberApiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Mail,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Trash2,
  UserCheck,
  UserX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { toast } from 'sonner';

const AdminSubscribersManagement = () => {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  
  // Dialog states
  const [editDialog, setEditDialog] = useState({ open: false, subscriber: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, subscriber: null });
  const [bulkDialog, setBulkDialog] = useState({ open: false, action: '', count: 0 });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // API hooks
  const {
    data: subscribersData,
    isLoading: subscribersLoading,
    error: subscribersError
  } = useGetSubscribersQuery({
    page: currentPage,
    limit: pageSize,
    status: statusFilter,
    search: searchTerm
  });

  const {
    data: statsData,
    isLoading: statsLoading
  } = useGetSubscriberStatsQuery();

  const [updateSubscriber] = useUpdateSubscriberMutation();
  const [deleteSubscriber] = useDeleteSubscriberMutation();
  const [bulkOperations] = useBulkOperationsMutation();

  // Handlers
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === 'all' ? '' : status);
    setCurrentPage(1);
  };

  const handleSelectSubscriber = (subscriberId) => {
    setSelectedSubscribers(prev =>
      prev.includes(subscriberId)
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === subscribersData?.data.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribersData?.data.map(sub => sub._id) || []);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedSubscribers.length === 0) return;

    setBulkDialog({
      open: true,
      action: bulkAction,
      count: selectedSubscribers.length
    });
  };

  const confirmBulkAction = async () => {
    try {
      await bulkOperations({
        action: bulkAction,
        ids: selectedSubscribers
      }).unwrap();

      toast.success(`Successfully ${bulkAction}d ${selectedSubscribers.length} subscribers`);
      setSelectedSubscribers([]);
      setBulkAction('');
      setBulkDialog({ open: false, action: '', count: 0 });
    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${bulkAction} subscribers`);
    }
  };

  const handleEditSubscriber = async (subscriberData) => {
    try {
      await updateSubscriber(subscriberData).unwrap();
      toast.success('Subscriber updated successfully');
      setEditDialog({ open: false, subscriber: null });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update subscriber');
    }
  };

  const handleDeleteSubscriber = async () => {
    try {
      await deleteSubscriber(deleteDialog.subscriber._id).unwrap();
      toast.success('Subscriber deleted successfully');
      setDeleteDialog({ open: false, subscriber: null });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete subscriber');
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    params.append('format', 'csv');
    
    const url = `/api/subscribers/export?${params.toString()}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
      unsubscribed: { color: 'bg-red-100 text-red-800', text: 'Unsubscribed' }
    };
    
    const variant = variants[status] || variants.inactive;
    return (
      <Badge className={`${variant.color} font-medium`}>
        {variant.text}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Stats calculations
  const stats = statsData?.data?.overview || { total: 0, stats: [] };
  const statsMap = stats.stats?.reduce((acc, stat) => {
    acc[stat.status] = stat.count;
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <p className="text-gray-600 mt-1">Manage your newsletter subscriber base</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats.total.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statsLoading ? '...' : (statsMap.active || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Unsubscribed</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {statsLoading ? '...' : (statsMap.unsubscribed || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Recent (30d)</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {statsLoading ? '...' : (statsData?.data?.recentSubscriptions || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search subscribers..."
                    value={searchInput}
                    onChange={handleSearch}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedSubscribers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Bulk actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activate">Activate</SelectItem>
                      <SelectItem value="deactivate">Deactivate</SelectItem>
                      <SelectItem value="unsubscribe">Unsubscribe</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    variant="outline"
                    size="sm"
                  >
                    Apply to {selectedSubscribers.length}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Subscribers</span>
              {selectedSubscribers.length > 0 && (
                <span className="text-sm font-normal text-gray-600">
                  {selectedSubscribers.length} selected
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {subscribersLoading ? (
              <div className="p-8 text-center text-gray-500">Loading subscribers...</div>
            ) : subscribersError ? (
              <div className="p-8 text-center text-red-600">
                Error loading subscribers: {subscribersError.message}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <button
                          onClick={handleSelectAll}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {selectedSubscribers.length === subscribersData?.data.length ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Topics</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribersData?.data?.map((subscriber) => (
                      <TableRow key={subscriber._id} className="hover:bg-gray-50">
                        <TableCell>
                          <button
                            onClick={() => handleSelectSubscriber(subscriber._id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {selectedSubscribers.includes(subscriber._id) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{subscriber.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(subscriber.subscribedAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {subscriber.preferences?.frequency || 'Weekly'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {subscriber.preferences?.topics?.slice(0, 2).map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic.replace('-', ' ')}
                              </Badge>
                            ))}
                            {subscriber.preferences?.topics?.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{subscriber.preferences.topics.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {subscriber.source}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditDialog({ open: true, subscriber })}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteDialog({ open: true, subscriber })}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {subscribersData?.pagination && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                      {Math.min(currentPage * pageSize, subscribersData.pagination.totalItems)} of{' '}
                      {subscribersData.pagination.totalItems} subscribers
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, subscribersData.pagination.total) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(subscribersData.pagination.total, prev + 1))}
                        disabled={currentPage === subscribersData.pagination.total}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Subscriber Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, subscriber: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>
              Update subscriber preferences and status.
            </DialogDescription>
          </DialogHeader>
          
          {editDialog.subscriber && (
            <EditSubscriberForm
              subscriber={editDialog.subscriber}
              onSubmit={handleEditSubscriber}
              onCancel={() => setEditDialog({ open: false, subscriber: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, subscriber: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.subscriber?.email}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubscriber}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Confirmation Dialog */}
      <AlertDialog open={bulkDialog.open} onOpenChange={(open) => setBulkDialog({ open, action: '', count: 0 })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkDialog.action} {bulkDialog.count} subscribers?
              {bulkDialog.action === 'delete' && ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkAction}
              className={bulkDialog.action === 'delete' ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {bulkDialog.action === 'delete' ? 'Delete' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Edit Subscriber Form Component
const EditSubscriberForm = ({ subscriber, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    _id: subscriber._id,
    status: subscriber.status,
    preferences: {
      frequency: subscriber.preferences?.frequency || 'weekly',
      topics: subscriber.preferences?.topics || []
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTopicChange = (topic, checked) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        topics: checked
          ? [...prev.preferences.topics, topic]
          : prev.preferences.topics.filter(t => t !== topic)
      }
    }));
  };

  const topicOptions = [
    { value: 'language-tech', label: 'Language Technology' },
    { value: 'industry-insights', label: 'Industry Insights' },
    { value: 'company-updates', label: 'Company Updates' },
    { value: 'research', label: 'Research' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input value={subscriber.email} disabled className="bg-gray-50" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <Select 
          value={formData.preferences.frequency} 
          onValueChange={(value) => setFormData(prev => ({ 
            ...prev, 
            preferences: { ...prev.preferences, frequency: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topics of Interest
        </label>
        <div className="space-y-2">
          {topicOptions.map((topic) => (
            <label key={topic.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferences.topics.includes(topic.value)}
                onChange={(e) => handleTopicChange(topic.value, e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{topic.label}</span>
            </label>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Subscriber
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AdminSubscribersManagement;