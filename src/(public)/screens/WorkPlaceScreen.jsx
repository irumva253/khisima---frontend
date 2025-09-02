import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin,
  Star,
  Building,
  ChevronRight,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import {
  useGetWorkplacesQuery,
  useGetWorkplaceStatsQuery,
  useGetFeaturedWorkplacesQuery
} from '@/slices/workplaceSlice';
import Meta from '../components/Meta';

const WorkPlaceScreen = () => {
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    status: 'active'
  });

  const { data: workplacesData, isLoading: loadingWorkplaces } = 
    useGetWorkplacesQuery(filters);
  
  const { data: statsData } = useGetWorkplaceStatsQuery();
  const { data: featuredData } = useGetFeaturedWorkplacesQuery(3);

  const workplaces = workplacesData?.data || [];
  const featuredWorkplaces = featuredData?.data || [];
  const stats = statsData?.data || {};

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEM0My4zMTM3IDQwIDQ2IDM3LjMxMzcgNDYgMzRDNDYgMzAuNjg2MyA0My4zMTM3IDI4IDQwIDI4QzM2LjY4NjMgMjggMzQgMzAuNjg2MyAzNCAzNEMzNCAzNy4zMTM3IDM2LjY4NjMgNDAgNDAgNDBaTTQwIDUyQzMyLjI2IDUyIDI1LjA2IDQ4LjU4IDIwIDQyLjU4QzIwIDM2IDI4IDMzLjUgNDAgMzMuNUM1MiAzMy41IDYwIDM2IDYwIDQyLjU4QzU0Ljk0IDQ4LjU4IDQ3Ljc0IDUyIDQwIDUyWiIgZmlsbD0iIzlDAUVDQyIvPgo8L3N2Zz4K';
    e.target.alt = 'Image not available';
  };

  if (loadingWorkplaces) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading workplaces...</span>
      </div>
    );
  }

  return (
    <>
    <Meta title="Our Workplaces" description="Explore our global network of workplaces." />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Workplaces
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              Discover our global network of workplaces, each designed to provide exceptional 
              facilities and support for our team members around the world.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search workplaces by name, city, or country..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 dark:text-white bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-1">{stats.total || 0}</div>
                <div className="text-blue-100 text-sm">Total Workplaces</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-1">{stats.featured || 0}</div>
                <div className="text-blue-100 text-sm">Featured Locations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-1">
                  {Object.keys(stats.byCountry || {}).length}
                </div>
                <div className="text-blue-100 text-sm">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search workplaces..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Countries</option>
              {Object.keys(stats.byCountry || {}).map(country => (
                <option key={country} value={country}>
                  {country} ({stats.byCountry[country]})
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under_maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>

        {/* Featured Workplaces */}
        {featuredWorkplaces.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Workplaces</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredWorkplaces.map((workplace) => (
                <div
                  key={workplace._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {workplace.images && workplace.images[0] ? (
                    <img
                      src={workplace.images[0].url}
                      alt={workplace.images[0].caption || workplace.title}
                      className="w-full h-48 object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {workplace.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{workplace.address.city}, {workplace.country.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {workplace.rating?.average?.toFixed(1) || '0.0'} ({workplace.rating?.count || 0})
                        </span>
                      </div>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {workplace.introduction}
                    </p>
                    
                    <Link
                      to={`/workplace/${workplace._id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Workplaces */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Workplaces</h2>
          <div className="grid grid-cols-1 gap-6">
            {workplaces.map((workplace) => (
              <div
                key={workplace._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {workplace.images && workplace.images[0] ? (
                    <img
                      src={workplace.images[0].url}
                      alt={workplace.images[0].caption || workplace.title}
                      className="w-full md:w-64 h-48 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full md:w-64 h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                      <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {workplace.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{workplace.address.city}, {workplace.country.name}</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
                        {workplace.rating?.average?.toFixed(1) || '0.0'} ({workplace.rating?.count || 0})
                      </span>
                      <Building className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Head: {workplace.headOfStation}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {workplace.introduction}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {workplace.facilities?.slice(0, 4).map((facility, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs"
                        >
                          {facility}
                        </span>
                      ))}
                      {workplace.facilities?.length > 4 && (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                          +{workplace.facilities.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    <Link
                      to={`/workplace/${workplace._id}`}
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                      View Workplace
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workplaces.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Building className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workplaces found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filters.search 
                  ? `No workplaces match your search for "${filters.search}"`
                  : 'There are no workplaces available with the current filters.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default WorkPlaceScreen;