import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
  X,
  Save,
  FileText,
  Video,
  Headphones,
  BookOpen,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useGetResourceStatsQuery,
  useExportResourcesMutation,
  useUpdateResourceStatusMutation,
  getResourceTypeIcon,
  getResourceStatusColor,
  getResourceCategoryColor
} from '@/slices/resourceSlice';

const AdminResourcesScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    page: 1,
    limit: 10
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: 'trends',
    type: 'article',
    content: {
      text: '',
      videoUrl: '',
      audioUrl: '',
      fileUrl: ''
    },
    readTime: '5 min',
    rating: 4.5,
    tags: [],
    imageUrl: '',
    isFeatured: false,
    status: 'draft'
  });
  
  const [tagInput, setTagInput] = useState('');

  // RTK Query hooks
  const { data: resourcesData, isLoading: loadingResources, refetch: refetchResources } = 
    useGetResourcesQuery(filters);
  
  const { data: statsData } = useGetResourceStatsQuery();
  
  const [createResource, { isLoading: creating }] = useCreateResourceMutation();
  const [updateResource, { isLoading: updating }] = useUpdateResourceMutation();
  const [deleteResource] = useDeleteResourceMutation();
  const [exportResources] = useExportResourcesMutation();
  const [updateResourceStatus] = useUpdateResourceStatusMutation();

  const resources = resourcesData?.data || [];
  const pagination = resourcesData?.pagination || {};

  useEffect(() => {
    if (filters.status === '') {
      // Load all resources regardless of status for admin
      refetchResources();
    }
  }, [filters, refetchResources]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateResource({ id: formData._id, updateData: formData }).unwrap();
      } else {
        await createResource(formData).unwrap();
      }
      handleCloseForm();
      refetchResources();
    } catch (error) {
      console.error('Failed to save resource:', error);
    }
  };

  const handleEdit = (resource) => {
    setFormData(resource);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id).unwrap();
        refetchResources();
      } catch (error) {
        console.error('Failed to delete resource:', error);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateResourceStatus({ id, status }).unwrap();
      refetchResources();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      await exportResources({ format, ...filters }).unwrap();
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditMode(false);
    setFormData({
      title: '',
      description: '',
      author: '',
      category: 'trends',
      type: 'article',
      content: {
        text: '',
        videoUrl: '',
        audioUrl: '',
        fileUrl: ''
      },
      readTime: '5 min',
      rating: 4.5,
      tags: [],
      imageUrl: '',
      isFeatured: false,
      status: 'draft'
    });
  };

  const getTypeIconComponent = (type) => {
    const iconName = getResourceTypeIcon(type);
    const icons = {
      FileText,
      Video,
      Headphones,
      BookOpen,
      TrendingUp,
      Cpu,
      Download
    };
    return icons[iconName] || FileText;
  };

  if (loadingResources) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600">Create and manage resources</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Resource
        </button>
      </div>

      {/* Statistics */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{statsData.data.total}</div>
            <div className="text-gray-600 text-sm">Total Resources</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{statsData.data.featured}</div>
            <div className="text-gray-600 text-sm">Featured Resources</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{statsData.data.totalDownloads}</div>
            <div className="text-gray-600 text-sm">Total Downloads</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(statsData.data.byCategory || {}).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-gray-600 text-sm">By Category</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="trends">Language Trends</option>
            <option value="ai-language">AI vs Language</option>
            <option value="linguistics">Practical Linguistics</option>
            <option value="open-resources">Open Resources</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="article">Article</option>
            <option value="research">Research</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="book">Book</option>
            <option value="dataset">Dataset</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                status: '',
                type: '',
                page: 1,
                limit: 10
              })}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Downloads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {resources.map((resource) => {
              const TypeIcon = getTypeIconComponent(resource.type);
              const statusColor = getResourceStatusColor(resource.status);
              const categoryColor = getResourceCategoryColor(resource.category);
              
              return (
                <tr key={resource._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {resource.imageUrl && (
                        <img
                          src={resource.imageUrl}
                          alt={resource.title}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {resource.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {resource.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColor}`}>
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <TypeIcon className="w-4 h-4 mr-2" />
                      {resource.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {resource.downloads}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(
                          resource._id, 
                          resource.status === 'published' ? 'archived' : 'published'
                        )}
                        className="text-green-600 hover:text-green-900"
                        title={resource.status === 'published' ? 'Archive' : 'Publish'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(resource._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Resource Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editMode ? 'Edit Resource' : 'Create Resource'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="trends">Language Trends</option>
                    <option value="ai-language">AI vs Language</option>
                    <option value="linguistics">Practical Linguistics</option>
                    <option value="open-resources">Open Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="article">Article</option>
                    <option value="research">Research</option>
                    <option value="whitepaper">Whitepaper</option>
                    <option value="guide">Guide</option>
                    <option value="book">Book</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="dataset">Dataset</option>
                    <option value="software">Software</option>
                  </select>
                </div>
              </div>

              {/* Content based on type */}
              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL (YouTube)
                  </label>
                  <input
                    type="url"
                    value={formData.content.videoUrl}
                    onChange={(e) => handleContentChange('videoUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              )}

              {formData.type === 'audio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audio URL
                  </label>
                  <input
                    type="url"
                    value={formData.content.audioUrl}
                    onChange={(e) => handleContentChange('audioUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/audio.mp3"
                  />
                </div>
              )}

              {['article', 'research', 'whitepaper', 'guide', 'book'].includes(formData.type) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.content.text}
                    onChange={(e) => handleContentChange('text', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="5 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="mr-2"
                    id="featured"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Featured Resource
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editMode ? (updating ? 'Updating...' : 'Update') : (creating ? 'Creating...' : 'Create')} Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResourcesScreen;