import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  Languages,
  Building2,
  User,
  MessageSquare,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

const AdminCheckQuoteScreen = () => {
  // State management
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    projectType: '',
    priority: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalQuotes: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  // Mock data - replace with actual API calls
  const mockQuotes = [
    {
      _id: '1',
      firstName: 'Jean',
      lastName: 'Mugabo',
      email: 'jean.mugabo@example.com',
      phone: '+250 788 123 456',
      company: 'Kigali Tech Hub',
      projectType: 'Website Localization',
      sourceLanguage: 'English',
      targetLanguages: ['Kinyarwanda', 'French'],
      wordCount: 2500,
      estimatedCost: 750,
      status: 'pending',
      priority: 'high',
      deadline: '2025-01-15',
      createdAt: '2025-01-10T09:30:00Z',
      description: 'Need to localize our e-commerce website for the Rwandan market',
      ageInDays: 2
    },
    {
      _id: '2',
      firstName: 'Grace',
      lastName: 'Nyirahabimana',
      email: 'grace@example.com',
      phone: '+250 788 987 654',
      company: 'Rwanda Development Board',
      projectType: 'Document Translation',
      sourceLanguage: 'Kinyarwanda',
      targetLanguages: ['English', 'French'],
      wordCount: 5000,
      estimatedCost: 1200,
      status: 'quoted',
      priority: 'normal',
      deadline: '2025-01-20',
      createdAt: '2025-01-08T14:15:00Z',
      quotedAt: '2025-01-09T10:00:00Z',
      description: 'Official documents for international partnership',
      ageInDays: 4
    },
    {
      _id: '3',
      firstName: 'Emmanuel',
      lastName: 'Bizimana',
      email: 'emmanuel.biz@example.com',
      phone: '+250 788 555 666',
      company: 'East African Bank',
      projectType: 'Legal Documents',
      sourceLanguage: 'English',
      targetLanguages: ['Kinyarwanda', 'Swahili'],
      wordCount: 8000,
      estimatedCost: 2400,
      status: 'reviewing',
      priority: 'urgent',
      deadline: '2025-01-12',
      createdAt: '2025-01-07T16:45:00Z',
      description: 'Banking regulations and compliance documents',
      ageInDays: 5
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuotes(mockQuotes);
      setPagination(prev => ({ ...prev, totalQuotes: mockQuotes.length }));
      setLoading(false);
    }, 1000);
  }, [filters, pagination.currentPage]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
      quoted: 'bg-green-100 text-green-800 border-green-200',
      accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      normal: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors.normal;
  };

  const handleSelectQuote = (quoteId) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleSelectAll = () => {
    setSelectedQuotes(
      selectedQuotes.length === quotes.length ? [] : quotes.map(q => q._id)
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSort = (column) => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({ ...prev, sortBy: column, sortOrder: newOrder }));
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedQuotes.length === 0) return;
    
    // Handle bulk actions here
    console.log(`Bulk action: ${bulkAction} on quotes:`, selectedQuotes);
    setBulkAction('');
    setSelectedQuotes([]);
  };

  const handleQuoteAction = (action, quoteId) => {
    console.log(`${action} quote:`, quoteId);
    // Handle individual quote actions
  };

  const QuoteDetailsModal = () => {
    if (!selectedQuote) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Quote Details</h2>
                <p className="text-blue-100">ID: #{selectedQuote._id.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Client Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Client Information
                </h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Name:</span> {selectedQuote.firstName} {selectedQuote.lastName}</p>
                  <p><span className="font-medium">Email:</span> {selectedQuote.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedQuote.phone}</p>
                  <p><span className="font-medium">Company:</span> {selectedQuote.company}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Project Details
                </h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Type:</span> {selectedQuote.projectType}</p>
                  <p><span className="font-medium">Languages:</span> {selectedQuote.sourceLanguage} → {selectedQuote.targetLanguages.join(', ')}</p>
                  <p><span className="font-medium">Word Count:</span> {selectedQuote.wordCount?.toLocaleString()}</p>
                  <p><span className="font-medium">Deadline:</span> {new Date(selectedQuote.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Status and Pricing */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedQuote.status)}`}>
                  {selectedQuote.status.charAt(0).toUpperCase() + selectedQuote.status.slice(1)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Status</p>
              </div>
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getPriorityColor(selectedQuote.priority)}`}>
                  {selectedQuote.priority.charAt(0).toUpperCase() + selectedQuote.priority.slice(1)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Priority</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${selectedQuote.estimatedCost?.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-2">Estimated Cost</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Project Description</h3>
              <p className="text-gray-700 leading-relaxed">{selectedQuote.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <button
                onClick={() => handleQuoteAction('quote', selectedQuote._id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Send Quote
              </button>
              <button
                onClick={() => handleQuoteAction('email', selectedQuote._id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Client
              </button>
              <button
                onClick={() => handleQuoteAction('edit', selectedQuote._id)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quote Management</h1>
              <p className="text-gray-600 mt-1">Manage and review client quote requests</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">23</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-red-600 mt-2">Needs attention</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-green-600">$45,200</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">+8% revenue growth</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-blue-600">4.2h</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">-30min improvement</p>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search quotes..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <select
                  value={filters.projectType}
                  onChange={(e) => handleFilterChange('projectType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Document Translation">Document Translation</option>
                  <option value="Website Localization">Website Localization</option>
                  <option value="Legal Documents">Legal Documents</option>
                  <option value="Marketing Materials">Marketing Materials</option>
                  <option value="Technical Documentation">Technical Documentation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedQuotes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedQuotes.length} quote{selectedQuotes.length > 1 ? 's' : ''} selected
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose action</option>
                  <option value="update-status">Update Status</option>
                  <option value="update-priority">Update Priority</option>
                  <option value="export-selected">Export Selected</option>
                  <option value="delete">Delete</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
              </div>
              <button
                onClick={() => setSelectedQuotes([])}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Quotes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading quotes...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedQuotes.length === quotes.length && quotes.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('firstName')}
                      >
                        <div className="flex items-center">
                          Client
                          <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Languages
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('estimatedCost')}
                      >
                        <div className="flex items-center">
                          Value
                          <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('deadline')}
                      >
                        <div className="flex items-center">
                          Deadline
                          <ArrowUpDown className="ml-1 w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quotes.map((quote) => (
                      <tr key={quote._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedQuotes.includes(quote._id)}
                            onChange={() => handleSelectQuote(quote._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {quote.ageInDays} days ago
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {quote.firstName.charAt(0)}{quote.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {quote.firstName} {quote.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {quote.email}
                              </div>
                              {quote.company && (
                                <div className="text-xs text-gray-400 flex items-center mt-1">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {quote.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {quote.projectType}
                          </div>
                          {quote.wordCount && (
                            <div className="text-sm text-gray-500">
                              {quote.wordCount.toLocaleString()} words
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Languages className="w-4 h-4 mr-2 text-gray-400" />
                            {quote.sourceLanguage}
                          </div>
                          <div className="text-xs text-gray-500">
                            → {quote.targetLanguages.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${quote.estimatedCost?.toLocaleString() || 'TBD'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                            {quote.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {quote.status === 'quoted' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {quote.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(quote.priority)}`}>
                            {quote.priority === 'urgent' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {quote.priority.charAt(0).toUpperCase() + quote.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(quote.deadline).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.ceil((new Date(quote.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedQuote(quote);
                                setShowQuoteModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleQuoteAction('edit', quote._id)}
                              className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-colors"
                              title="Edit Quote"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleQuoteAction('email', quote._id)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                              title="Email Client"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <div className="relative group">
                              <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <button
                                  onClick={() => handleQuoteAction('duplicate', quote._id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => handleQuoteAction('archive', quote._id)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  Archive
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleQuoteAction('delete', quote._id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{' '}
                        <span className="font-medium">{quotes.length}</span> of{' '}
                        <span className="font-medium">{pagination.totalQuotes}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          disabled={pagination.currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {[1, 2, 3].map((page) => (
                          <button
                            key={page}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quote Details Modal */}
      {showQuoteModal && <QuoteDetailsModal />}
    </div>
  );
};

export default AdminCheckQuoteScreen;