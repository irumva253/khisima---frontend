/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  useGetQuotesQuery, 
  useUpdateQuoteMutation, 
  useDeleteQuoteMutation,
  useGetQuoteStatsQuery,
  useExportQuotesMutation,
  useAddCommunicationMutation,
  useGetQuoteByIdQuery,
  useLazyGetQuoteByIdQuery,
  useDownloadQuoteFileMutation,
  useUpdateQuoteStatusMutation,
  getQuoteStatusColor,
  getQuotePriorityColor
} from '@/slices/quoteApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  User,
  Building,
  Globe,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Printer,
  Share2,
  Archive,
  Tag,
  Star,
  Clock4,
  CalendarDays,
  Users,
  FileDown,
  Send,
  Loader2,
  X,
  FileIcon
} from 'lucide-react';

const AdminCheckQuoteScreen = () => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    projectType: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    priority: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [communicationData, setCommunicationData] = useState({
    type: 'email',
    subject: '',
    message: '',
    direction: 'outbound'
  });
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    notes: ''
  });

  // RTK Query hooks
  const { 
    data: quotesData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetQuotesQuery({ 
    ...filters, 
    page, 
    limit, 
    sortBy, 
    sortOrder 
  });

  const { data: statsData } = useGetQuoteStatsQuery();
  const [updateQuote] = useUpdateQuoteMutation();
  const [deleteQuote] = useDeleteQuoteMutation();
  const [exportQuotes] = useExportQuotesMutation();
  const [addCommunication] = useAddCommunicationMutation();
  const [downloadQuoteFile] = useDownloadQuoteFileMutation();
  const [updateQuoteStatus] = useUpdateQuoteStatusMutation();
  const [getQuoteById, { data: detailedQuote, isLoading: loadingDetail }] = useLazyGetQuoteByIdQuery();

  const quotes = quotesData?.data || [];
  const pagination = quotesData?.pagination || {};

  useEffect(() => {
    if (selectedQuote && showDetailModal) {
      getQuoteById(selectedQuote._id);
    }
  }, [selectedQuote, showDetailModal, getQuoteById]);

  useEffect(() => {
    if (selectedQuote) {
      setStatusUpdateData({
        status: selectedQuote.status,
        notes: selectedQuote.adminNotes || ''
      });
    }
  }, [selectedQuote]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedQuote) return;

    try {
      await updateQuoteStatus({
        id: selectedQuote._id,
        status: statusUpdateData.status,
        notes: statusUpdateData.notes
      }).unwrap();
      
      toast.success(`Quote status updated to ${statusUpdateData.status}`);
      setShowStatusModal(false);
      refetch();
      
      // Refresh the detailed quote if modal is open
      if (showDetailModal) {
        getQuoteById(selectedQuote._id);
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      try {
        await deleteQuote(quoteId).unwrap();
        toast.success('Quote deleted successfully');
        refetch();
        if (selectedQuote?._id === quoteId) {
          setSelectedQuote(null);
          setShowDetailModal(false);
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error?.data?.message || 'Failed to delete quote');
      }
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      await exportQuotes({ ...filters, format });
      toast.success('Export started successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error?.data?.message || 'Failed to export quotes');
    }
  };

  const handleAddCommunication = async (e) => {
    e.preventDefault();
    if (!selectedQuote) return;

    try {
      await addCommunication({
        quoteId: selectedQuote._id,
        communicationData
      }).unwrap();
      
      toast.success('Communication added successfully');
      setShowCommunicationModal(false);
      setCommunicationData({
        type: 'email',
        subject: '',
        message: '',
        direction: 'outbound'
      });
      refetch();
      
      // Refresh the detailed quote
      getQuoteById(selectedQuote._id);
    } catch (error) {
      console.error('Communication error:', error);
      toast.error(error?.data?.message || 'Failed to add communication');
    }
  };

  const handleDownloadFile = async (file) => {
  if (!selectedQuote) return;

  try {
    const result = await downloadQuoteFile({ 
      quoteId: selectedQuote._id, 
      fileId: file._id 
    }).unwrap();
    
    if (result.success && result.data.downloadUrl) {
      // Use the signed URL from the backend response
      const link = document.createElement('a');
      link.href = result.data.downloadUrl;
      link.setAttribute('download', file.originalName);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloading ${file.originalName}`);
    }
  } catch (error) {
    console.error('Download failed:', error);
    toast.error(error?.data?.message || 'Failed to download file');
  }
};

  const StatusBadge = ({ status }) => {
    const statusClass = getQuoteStatusColor(status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const priorityClass = getQuotePriorityColor(priority);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClass}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading quotes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Quotes</h2>
          <p className="text-gray-600 mb-4">{error?.data?.message || 'Failed to load quotes'}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote Management</h1>
            <p className="text-gray-600">Manage and review all quote requests</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              className="flex items-center px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center px-3 py-2 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{statsData?.data?.totalQuotes || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">
                  {statsData?.data?.statusBreakdown?.find(s => s._id === 'pending')?.count || 0}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock4 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quoted</p>
                <p className="text-2xl font-bold text-green-600">
                  {statsData?.data?.statusBreakdown?.find(s => s._id === 'quoted')?.count || 0}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {statsData?.data?.avgResponseTimeHours ? `${Math.round(statsData.data.avgResponseTimeHours)}h` : 'N/A'}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="quoted">Quoted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filters.projectType}
              onChange={(e) => handleFilterChange('projectType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Document Translation">Document Translation</option>
              <option value="Website Localization">Website Localization</option>
              <option value="Software Localization">Software Localization</option>
              <option value="Marketing Materials">Marketing Materials</option>
              <option value="Legal Documents">Legal Documents</option>
              <option value="Medical Translation">Medical Translation</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'createdAt' && (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Languages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('estimatedCost')}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortBy === 'estimatedCost' && (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(quote.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {quote.firstName} {quote.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{quote.email}</div>
                          {quote.company && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {quote.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{quote.projectType}</div>
                      <div className="text-sm text-gray-500">
                        {quote.wordCount ? `${quote.wordCount.toLocaleString()} words` : 'Word count not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Globe className="w-4 h-4 mr-1 text-gray-400" />
                        {quote.sourceLanguage} → {quote.targetLanguages.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={quote.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                        {quote.estimatedCost ? `$${quote.estimatedCost.toLocaleString()}` : 'Not quoted'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowStatusModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Update Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Quote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {quotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No quotes found</h3>
              <p className="text-gray-500 mt-2">
                {Object.values(filters).some(filter => filter !== '') 
                  ? 'Try adjusting your filters' 
                  : 'No quotes have been submitted yet'
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * limit, pagination.totalQuotes)}</span> of{' '}
                  <span className="font-medium">{pagination.totalQuotes}</span> quotes
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quote Detail Modal */}
      {showDetailModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Quote Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Client Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Client Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Name</label>
                      <p className="text-sm font-medium">{selectedQuote.firstName} {selectedQuote.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Email</label>
                      <p className="text-sm font-medium">{selectedQuote.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Phone</label>
                      <p className="text-sm font-medium">{selectedQuote.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Company</label>
                      <p className="text-sm font-medium">{selectedQuote.company || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Project Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Project Type</label>
                      <p className="text-sm font-medium">{selectedQuote.projectType}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Languages</label>
                      <p className="text-sm font-medium">
                        {selectedQuote.sourceLanguage} → {selectedQuote.targetLanguages.join(', ')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Word Count</label>
                      <p className="text-sm font-medium">
                        {selectedQuote.wordCount ? `${selectedQuote.wordCount.toLocaleString()} words` : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Deadline</label>
                      <p className="text-sm font-medium">
                        {selectedQuote.deadline ? new Date(selectedQuote.deadline).toLocaleDateString() : 'Flexible'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Budget</label>
                      <p className="text-sm font-medium">{selectedQuote.budget || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Project Description</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedQuote.description}
                  </p>
                </div>

                {/* Special Requirements */}
                {selectedQuote.specialRequirements && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Special Requirements</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                      {selectedQuote.specialRequirements}
                    </p>
                  </div>
                )}

                {/* Files */}
                {selectedQuote.files && selectedQuote.files.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Attached Files</h4>
                    <div className="space-y-2">
                      {selectedQuote.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <span className="text-sm text-gray-700 block">{file.originalName}</span>
                              <span className="text-xs text-gray-500">
                                {formatFileSize(file.size)} • 
                                {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Unknown date'}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDownloadFile(file)}
                            className="text-blue-600 text-sm hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-md flex items-center"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quote Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Quote Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Status</label>
                      <StatusBadge status={selectedQuote.status} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Priority</label>
                      <PriorityBadge priority={selectedQuote.priority} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Estimated Cost</label>
                      <p className="text-sm font-medium">
                        {selectedQuote.estimatedCost ? `$${selectedQuote.estimatedCost.toLocaleString()}` : 'Not quoted yet'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Estimated Duration</label>
                      <p className="text-sm font-medium">{selectedQuote.estimatedDuration || 'Not specified'}</p>
                    </div>
                    {selectedQuote.quotedAt && (
                      <div>
                        <label className="block text-sm text-gray-600">Quoted At</label>
                        <p className="text-sm font-medium">{new Date(selectedQuote.quotedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedQuote.quoteValidUntil && (
                      <div>
                        <label className="block text-sm text-gray-600">Quote Valid Until</label>
                        <p className="text-sm font-medium">{new Date(selectedQuote.quoteValidUntil).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedQuote.adminNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Admin Notes</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                      {selectedQuote.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowCommunicationModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Communication
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Update Quote Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  value={statusUpdateData.status}
                  onChange={(e) => setStatusUpdateData(prev => ({...prev, status: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={statusUpdateData.notes}
                  onChange={(e) => setStatusUpdateData(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Add any notes about this status change..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {showCommunicationModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add Communication</h3>
              <button
                onClick={() => setShowCommunicationModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddCommunication} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={communicationData.type}
                  onChange={(e) => setCommunicationData(prev => ({...prev, type: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="meeting">Meeting</option>
                  <option value="internal_note">Internal Note</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={communicationData.subject}
                  onChange={(e) => setCommunicationData(prev => ({...prev, subject: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  value={communicationData.message}
                  onChange={(e) => setCommunicationData(prev => ({...prev, message: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                <select
                  value={communicationData.direction}
                  onChange={(e) => setCommunicationData(prev => ({...prev, direction: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="outbound">Outbound (We contacted client)</option>
                  <option value="inbound">Inbound (Client contacted us)</option>
                  <option value="internal">Internal (Team communication)</option>
                </select>
              </div>
            </form>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCommunicationModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCommunication}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Communication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCheckQuoteScreen;