import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  X,
  Save,
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  Upload,
  Star
} from 'lucide-react';
import { RichTextEditorWrapper } from '@/components/rich-text-editor/RichTextEditorWrapper';
import {
  useGetWorkplacesQuery,
  useCreateWorkplaceMutation,
  useUpdateWorkplaceMutation,
  useDeleteWorkplaceMutation,
  useUpdateWorkplaceStatusMutation,
  getWorkplaceStatusColor
} from '@/slices/workplaceSlice';

const AdminManageWorkPlace = () => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    country: '',
    page: 1,
    limit: 10
  });

  // Helper function to get initial form data
  const getInitialFormData = () => ({
    title: '',
    headOfStation: '',
    country: {
      name: '',
      flagImage: ''
    },
    introduction: '',
    description: {},
    images: [],
    highlightVideo: '',
    contact: {
      emails: [''],
      phones: ['']
    },
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      fullAddress: ''
    },
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    operatingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    facilities: [],
    status: 'active',
    isFeatured: false
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [newFacility, setNewFacility] = useState('');
  const [imageUploads, setImageUploads] = useState([]);

  // RTK Query hooks
  const { data: workplacesData, isLoading: loadingWorkplaces, refetch: refetchWorkplaces } = 
    useGetWorkplacesQuery(filters);
  
  const [createWorkplace, { isLoading: creating }] = useCreateWorkplaceMutation();
  const [updateWorkplace, { isLoading: updating }] = useUpdateWorkplaceMutation();
  const [deleteWorkplace] = useDeleteWorkplaceMutation();
  const [updateWorkplaceStatus] = useUpdateWorkplaceStatusMutation();

  const workplaces = workplacesData?.data || [];
  const pagination = workplacesData?.pagination || {};

  useEffect(() => {
    refetchWorkplaces();
  }, [filters, refetchWorkplaces]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('contact.')) {
      const [_, contactType, index] = name.split('.');
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactType]: (prev.contact[contactType] || []).map((item, i) => 
            i === parseInt(index) ? value : item
          )
        }
      }));
    } else if (name.includes('operatingHours.')) {
      const [_, day, time] = name.split('.');
      setFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: {
            ...prev.operatingHours[day],
            [time]: value
          }
        }
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddContact = (type) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [type]: [...(prev.contact[type] || []), '']
      }
    }));
  };

  const handleRemoveContact = (type, index) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [type]: (prev.contact[type] || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(facility => facility !== facilityToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      caption: '',
      file
    }));
    setImageUploads(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImageUploads(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Handle image uploads to your server
      const submitData = {
        ...formData,
        images: [
          // This would be replaced with actual uploaded image URLs
          { url: 'https://example.com/image1.jpg', caption: 'Main entrance' },
          { url: 'https://example.com/image2.jpg', caption: 'Work area' }
        ]
      };

      if (editMode) {
        await updateWorkplace({ id: formData._id, updateData: submitData }).unwrap();
      } else {
        await createWorkplace(submitData).unwrap();
      }
      handleCloseForm();
      refetchWorkplaces();
    } catch (error) {
      console.error('Failed to save workplace:', error);
    }
  };

  // Helper function to normalize workplace data
  const normalizeWorkplaceData = (workplace) => {
    return {
      ...workplace,
      contact: {
        emails: Array.isArray(workplace.contact?.emails) ? workplace.contact.emails : [''],
        phones: Array.isArray(workplace.contact?.phones) ? workplace.contact.phones : ['']
      },
      country: workplace.country || { name: '', flagImage: '' },
      address: workplace.address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        fullAddress: ''
      },
      coordinates: workplace.coordinates || { latitude: 0, longitude: 0 },
      operatingHours: workplace.operatingHours || {
        monday: { open: '', close: '' },
        tuesday: { open: '', close: '' },
        wednesday: { open: '', close: '' },
        thursday: { open: '', close: '' },
        friday: { open: '', close: '' },
        saturday: { open: '', close: '' },
        sunday: { open: '', close: '' }
      },
      facilities: Array.isArray(workplace.facilities) ? workplace.facilities : [],
      images: Array.isArray(workplace.images) ? workplace.images : []
    };
  };

  const handleEdit = (workplace) => {
    const normalizedWorkplace = normalizeWorkplaceData(workplace);
    setFormData(normalizedWorkplace);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workplace?')) {
      try {
        await deleteWorkplace(id).unwrap();
        refetchWorkplaces();
      } catch (error) {
        console.error('Failed to delete workplace:', error);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateWorkplaceStatus({ id, status }).unwrap();
      refetchWorkplaces();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditMode(false);
    setFormData(getInitialFormData());
    setImageUploads([]);
    setNewFacility('');
  };

  if (loadingWorkplaces) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Ensure contact arrays are always arrays before rendering
  const safeEmails = Array.isArray(formData.contact?.emails) ? formData.contact.emails : [''];
  const safePhones = Array.isArray(formData.contact?.phones) ? formData.contact.phones : [''];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workplace Management</h1>
          <p className="text-gray-600">Manage all workplace locations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Workplace
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workplaces..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Countries</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="under_maintenance">Under Maintenance</option>
          </select>
          
          <button
            onClick={() => setFilters({
              search: '',
              country: '',
              status: '',
              page: 1,
              limit: 10
            })}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center"
          >
            <X className="w-5 h-5 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Workplaces Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workplace
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Head of Station
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workplaces.map((workplace) => {
              const statusColor = getWorkplaceStatusColor(workplace.status);
              
              return (
                <tr key={workplace._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {workplace.images && workplace.images[0] && (
                        <img
                          src={workplace.images[0].url}
                          alt={workplace.title}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {workplace.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {workplace.country?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {workplace.address?.city}, {workplace.address?.state}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {workplace.headOfStation}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColor}`}>
                      {workplace.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {workplace.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                        {workplace.rating.average?.toFixed(1)} ({workplace.rating.count})
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(workplace)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(
                          workplace._id, 
                          workplace.status === 'active' ? 'inactive' : 'active'
                        )}
                        className="text-green-600 hover:text-green-900"
                        title={workplace.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(workplace._id)}
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

      {/* Workplace Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editMode ? 'Edit Workplace' : 'Create Workplace'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
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
                    Head of Station *
                  </label>
                  <input
                    type="text"
                    name="headOfStation"
                    value={formData.headOfStation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country.name"
                    value={formData.country?.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country Flag Image URL
                  </label>
                  <input
                    type="url"
                    name="country.flagImage"
                    value={formData.country?.flagImage || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction *
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Rich Text Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <div className="border rounded-md p-1">
                  <RichTextEditorWrapper
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Addresses *
                    </label>
                    {safeEmails.map((email, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleInputChange({
                            target: {
                              name: `contact.emails.${index}`,
                              value: e.target.value
                            }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {safeEmails.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveContact('emails', index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddContact('emails')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Email
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Numbers *
                    </label>
                    {safePhones.map((phone, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => handleInputChange({
                            target: {
                              name: `contact.phones.${index}`,
                              value: e.target.value
                            }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        {safePhones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveContact('phones', index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddContact('phones')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Phone
                    </button>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address?.street || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address?.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address?.state || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address?.postalCode || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address *
                  </label>
                  <textarea
                    name="address.fullAddress"
                    value={formData.address?.fullAddress || ''}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="coordinates.latitude"
                      value={formData.coordinates?.latitude || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="coordinates.longitude"
                      value={formData.coordinates?.longitude || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Facilities</h3>
                
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="Add a facility"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.facilities?.map((facility, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(facility)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload workplace images (JPEG, PNG, GIF)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Select Images
                  </label>
                </div>

                {imageUploads.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {imageUploads.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Image caption"
                          value={image.caption}
                          onChange={(e) => {
                            const newUploads = [...imageUploads];
                            newUploads[index].caption = e.target.value;
                            setImageUploads(newUploads);
                          }}
                          className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Highlight Video */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Highlight Video</h3>
                <input
                  type="url"
                  name="highlightVideo"
                  value={formData.highlightVideo}
                  onChange={handleInputChange}
                  placeholder="YouTube or Vimeo video URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>

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
                    Featured Workplace
                  </label>
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
                  {editMode ? (updating ? 'Updating...' : 'Update') : (creating ? 'Creating...' : 'Create')} Workplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageWorkPlace;