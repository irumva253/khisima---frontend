/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetSolutionsQuery,
  useGetSolutionCategoriesQuery,
} from '@/slices/solutionApiSlice';
import Spinner from '@/components/ui/Spinner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { S3_BASE_URL } from '@/constants';

const SolutionScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Fetch all solutions and categories
  const {
    data: solutionsData,
    isLoading: isSolutionsLoading,
    isError: isSolutionsError,
    error: solutionsError,
  } = useGetSolutionsQuery();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useGetSolutionCategoriesQuery();

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      published: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Filter and sort solutions - SHOW ONLY PUBLISHED
  const filteredAndSortedSolutions = useMemo(() => {
    if (!solutionsData?.data) return [];
    
    // Filter solutions to show only published ones
    let filtered = solutionsData.data.filter(solution => {
      // Only show published solutions
      if (solution.status !== 'published') return false;

      // Search filter
      const matchesSearch = searchQuery === '' || 
        solution.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.smallDescription?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter - handle both string and object categories
      let solutionCategoryId;
      if (typeof solution.category === 'string') {
        solutionCategoryId = solution.category;
      } else if (solution.category && typeof solution.category === 'object') {
        solutionCategoryId = solution.category._id;
      }
      
      const matchesCategory = selectedCategory === 'all' || 
        solutionCategoryId === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort solutions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [solutionsData?.data, searchQuery, selectedCategory, sortBy]);

  // Loading state
  if (isSolutionsLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 animate-spin"></div>
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 font-medium">Loading solutions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isSolutionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Solutions Error"
            message={solutionsError?.data?.message || "Failed to load solutions"}
            actionText="Try Again"
            actionLink="/solutions"
          />
        </div>
      </div>
    );
  }

  const solutions = solutionsData?.data || [];
  const categories = categoriesData?.data || [];
  const publishedSolutions = solutions.filter(s => s.status === 'published');
  const draftSolutions = solutions.filter(s => s.status === 'draft');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-indigo-500/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Bubbles */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full animate-float-slow"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-white/3 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-white/7 rounded-full animate-float-fast"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/4 rounded-full animate-float-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white/6 rounded-full animate-float-medium"></div>
          <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-white/3 rounded-full animate-float-fast"></div>
          
          {/* Floating Solution Icons */}
          <div className="absolute top-24 right-32 text-white/20 animate-float-icon-1">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </div>
          <div className="absolute bottom-32 left-32 text-white/20 animate-float-icon-2">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="absolute top-1/2 left-16 text-white/15 animate-float-icon-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div className="absolute bottom-1/3 right-24 text-white/20 animate-float-icon-4">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
            </svg>
          </div>
          <div className="absolute top-40 left-1/2 text-white/15 animate-float-icon-5">
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-16 left-1/4 w-4 h-4 bg-white/10 rotate-45 animate-float-shape-1"></div>
          <div className="absolute bottom-24 right-1/4 w-6 h-6 bg-white/8 rotate-12 animate-float-shape-2"></div>
          <div className="absolute top-1/3 right-16 w-3 h-3 bg-white/12 rotate-45 animate-float-shape-3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-white font-medium">Solutions</span>
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="text-center animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Solutions
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              Discover our comprehensive range of professional solutions designed to meet your needs. 
              From consultation to implementation, we've got you covered.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay">
                <div className="text-3xl font-bold mb-2">{publishedSolutions.length}</div>
                <div className="text-blue-100 font-medium">Published Solutions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-2">
                <div className="text-3xl font-bold mb-2">{categories.length}</div>
                <div className="text-blue-100 font-medium">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                <div className="text-3xl font-bold mb-2">{solutions.length}</div>
                <div className="text-blue-100 font-medium">Total Solutions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 text-slate-50">
            <path fill="currentColor" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"></path>
          </svg>
        </div>
      </div>

      <div className="relative -mt-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search published solutions..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-auto">
                <select
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="w-full lg:w-auto">
                <select
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">By Title</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Results info */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>
                Showing {filteredAndSortedSolutions.length} of {publishedSolutions.length} published solutions
              </span>
              {searchQuery && (
                <span>
                  Search results for "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          {/* Solutions Display */}
          {filteredAndSortedSolutions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100 animate-fade-in">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No published solutions found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No published solutions match your search "${searchQuery}"`
                  : "No published solutions available in the selected category"
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className={`animate-fade-in-up ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }`}>
              {filteredAndSortedSolutions.map((solution, index) => (
                <div
                  key={solution._id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-1 animate-fade-in-up ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Solution Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'} overflow-hidden`}>
                    {solution.fileKey ? (
                      <img
                        src={`${S3_BASE_URL}/${solution.fileKey}`}
                        alt={solution.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback placeholder */}
                    <div className={`${solution.fileKey ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200 items-center justify-center`}>
                      <div className="text-center text-blue-600">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 极l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 极 002 2z" />
                        </svg>
                        <p className="font-medium text-sm">Solution Image</p>
                      </div>
                    </div>

                    {/* Status Badge - Only show for published solutions */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getStatusBadge(solution.status)} shadow-lg`}>
                        Published
                      </span>
                    </div>
                  </div>

                  {/* Solution Content */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      {/* Category Tag */}
                      {solution.category && categories.find(cat => cat._id === solution.category) && (
                        <div className="mb-3">
                          <Link
                            to={`/solutions/${solution.category}`}
                            className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200"
                          >
                            {categories.find(cat => cat._id === solution.category)?.title}
                          </Link>
                        </div>
                      )}

                      {/* Title and Description */}
                      <h3 className="text-xl font-bold text-gray-极 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {solution.title}
                      </h3>

                      {solution.smallDescription && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {viewMode === 'list' 
                            ? truncateText(solution.smallDescription, 200)
                            : truncateText(solution.smallDescription, 120)
                          }
                        </p>
                      )}

                      {/* Solution metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 极 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(solution.createdAt)}</span>
                        </div>
                        {solution.updatedAt !== solution.createdAt && (
                          <div className="flex items-center">
                            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Updated {formatDate(solution.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <Link
                        to={`/solutions/${solution.category?._id || solution.category}`}
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action Section */}
          {filteredAndSortedSolutions.length > 0 && (
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-12 mt-16 text-white text-center relative overflow-hidden animate-fade-in">
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Can't find what you're looking for?
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Our team can help you find the perfect solution for your needs or create a custom solution tailored specifically for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Contact Us
                  </Link>
                  <Dialog>
                    <DialogTrigger>
                      <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                        Request Custom Solution
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Custom Solution</DialogTitle>
                        <DialogDescription>
                          Please provide details about your custom solution request.
                        </DialogDescription>
                      </DialogHeader>
                          <blockquote className="mt-6 border-l-2 pl-6 italic">
                            &quot;After all,&quot; share it via our email:, &quot;<a href="mailto:info@khisima.com">info@khisima.com</a>
                            &apos;s email.&quot;
                          </blockquote>
                                              
                      <DialogFooter>
                        <DialogClose className="text-blue-600">Close</DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div><br/></div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 极.8s ease-out 0.6s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.9s both;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SolutionScreen;