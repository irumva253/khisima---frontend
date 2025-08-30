/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  useGetCareerApplicationsQuery,
  useUpdateCareerApplicationStatusMutation,
  useDeleteCareerApplicationMutation,
  useGetCareerStatsQuery,
  useGetResumeDownloadUrlMutation, 
} from '@/slices/careerApiSlice';
import { toast } from 'sonner';
import Spinner from '@/components/ui/Spinner';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Mail,
  Calendar,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Briefcase
} from 'lucide-react';

const AdminCareersManagementScreen = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    position: 'all',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: ''
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [showNotes, setShowNotes] = useState({});

  // Fetch applications
  const { 
    data: applicationsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetCareerApplicationsQuery(filters);

  // Fetch stats
  const { data: statsData } = useGetCareerStatsQuery();

  // Mutations
  const [updateStatus] = useUpdateCareerApplicationStatusMutation();
  const [deleteApplication] = useDeleteCareerApplicationMutation();

  const applications = applicationsData?.data || [];
  const pagination = applicationsData?.pagination || {};
  const stats = statsData?.data || {};

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    interviewing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    hired: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const positionTitles = {
    translator: 'Freelance Translator',
    interpreter: 'Remote Interpreter',
    'intern-linguistic': 'Linguistic Research Intern',
    'intern-tech': 'Tech & Localization Intern',
    other: 'Other Position'
  };

  const handleStatusUpdate = async (id, newStatus, notes = '') => {
    try {
      await updateStatus({ 
        id, 
        status: newStatus,
        notes 
      }).unwrap();
      
      toast.success('Status updated successfully');
      setStatusUpdate(prev => ({ ...prev, [id]: false }));
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    try {
      await deleteApplication(id).unwrap();
      toast.success('Application deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete application');
    }
  };

  const [getDownloadUrl, { isLoading: isDownloading }] = useGetResumeDownloadUrlMutation();

    const handleDownloadResume = async (application) => {
    try {
               
        const { data } = await getDownloadUrl(application._id).unwrap();
    
        // FIX: Check for the actual response format (without success/data wrapper)
        if (data?.downloadUrl) {
       
        // Test if the URL is accessible
        try {
            const testResponse = await fetch(data.downloadUrl, { method: 'HEAD' });

            if (testResponse.ok) {
            // Create download link
            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.download = data.fileName || 'resume.pdf';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('Download started!');
            } else {
            toast.error('Download link is not accessible');
            }
        } catch (fetchError) {
            console.error('❌ URL test failed:', fetchError);
            toast.error('⚠️ Cannot access download link. Trying alternative method...');
            
            // Fallback: open in new tab
            window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
        }
        } else {
        console.error('Invalid API response format:', data);
        toast.error('Failed to generate download link: Invalid response format');
        }
    } catch (error) {
        console.error('Download error details:', error);
        toast.error(error?.data?.message || 'Failed to download resume');
    }
    };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
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

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-600 dark:text-red-400 p-4">Error loading applications</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Career Applications Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and review all job applications submitted to Khisima
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.overview?.total || 0, color: 'bg-gray-500' },
            { label: 'Pending', value: stats.overview?.pending || 0, color: 'bg-yellow-500' },
            { label: 'Reviewed', value: stats.overview?.reviewed || 0, color: 'bg-blue-500' },
            { label: 'Interviewing', value: stats.overview?.interviewing || 0, color: 'bg-purple-500' },
            { label: 'Hired', value: stats.overview?.hired || 0, color: 'bg-green-500' },
            { label: 'Rejected', value: stats.overview?.rejected || 0, color: 'bg-red-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full lg:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewing">Interviewing</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Positions</option>
                <option value="translator">Freelance Translator</option>
                <option value="interpreter">Remote Interpreter</option>
                <option value="intern-linguistic">Linguistic Research Intern</option>
                <option value="intern-tech">Tech & Localization Intern</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="firstName">Name</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Items per page
                  </label>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {application.firstName} {application.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {application.email}
                          </div>
                          {application.phone && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {application.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {positionTitles[application.position] || application.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {application.experience} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[application.status]}`}>
                          {application.status}
                        </span>
                        {statusUpdate[application._id] && (
                          <select
                            value={application.status}
                            onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                            className="text-xs border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            onBlur={() => setStatusUpdate(prev => ({ ...prev, [application._id]: false }))}
                            autoFocus
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                        onClick={(e) => handleDownloadResume(application, e)}
                        disabled={isDownloading}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 disabled:opacity-50"
                        title="Download Resume"
                        >
                        {isDownloading ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        </button>
                        <button
                          onClick={() => setStatusUpdate(prev => ({ ...prev, [application._id]: true }))}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
                          title="Update Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(application._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                          title="Delete Application"
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(filters.page * filters.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-white"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Application Details
                  </h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedApplication.firstName} {selectedApplication.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedApplication.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Applied On</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(selectedApplication.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Position Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Position Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {positionTitles[selectedApplication.position]}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedApplication.experience} years
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Type</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                        {selectedApplication.workType}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Availability</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                        {selectedApplication.availability}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Languages</h3>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedApplication.languages}
                  </p>
                </div>

                {/* Cover Letter */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cover Letter</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.portfolioUrl && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio</label>
                        <a
                          href={selectedApplication.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-words"
                        >
                          {selectedApplication.portfolioUrl}
                        </a>
                      </div>
                    )}
                    {selectedApplication.expectedSalary && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Salary</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedApplication.expectedSalary}
                        </p>
                      </div>
                    )}
                    {selectedApplication.referralSource && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referral Source</label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                          {selectedApplication.referralSource}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resume</h3>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {selectedApplication.resumeFileName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDownloadResume(selectedApplication)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCareersManagementScreen;