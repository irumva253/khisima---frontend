import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  useGetServiceCategoryQuery,
  useGetServicesByCategoryQuery,
  useGetServicesQuery
} from "@/slices/serviceApiSlice";
import {
  useGetServiceCategoriesQuery,
} from "@/slices/serviceCategoriesSlice";
import Spinner from "@/components/ui/Spinner";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { S3_BASE_URL } from "@/constants";
import Meta from "../components/Meta";
import { useState, useMemo, useEffect } from "react";

const ServicePageScreen = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const servicesPerPage = 1; // Show 1 service per page

  // Handle URL page parameter
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  // Helper functions defined first
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50",
      published: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Fetch category
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useGetServiceCategoryQuery(id);

  // Fetch services for current category
  const {
    data: servicesData,
    isLoading: isServicesLoading,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByCategoryQuery(id);

  // Fetch ALL services for recent updates
  const {
    data: allServicesData,
  } = useGetServicesQuery();

  // Fetch all categories for recent updates mapping
  const {
    data: allCategoriesData,
  } = useGetServiceCategoriesQuery();

  // Filter and sort services by creation date (newest first) and paginate - SHOW ONLY PUBLISHED
  const sortedAndPaginatedServices = useMemo(() => {
    if (!servicesData?.data) return [];
    
    // Filter services to show only published ones
    const publishedServices = servicesData.data.filter(service => 
      service.status === 'published'
    );
    
    // Sort published services by createdAt date (newest first)
    const sortedServices = [...publishedServices].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Calculate pagination
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    
    return sortedServices.slice(startIndex, endIndex);
  }, [servicesData?.data, currentPage]);

  // Get all published services for statistics
  const publishedServices = useMemo(() => {
    if (!servicesData?.data) return [];
    return servicesData.data.filter(service => service.status === 'published');
  }, [servicesData?.data]);

  // Generate recent updates from ALL published services across ALL categories

  const recentUpdates = useMemo(() => {
    if (!allServicesData?.data || !allCategoriesData?.data) return [];
    
    const allPublishedServices = allServicesData.data
      .filter(service => service.status === 'published')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4);

    return allPublishedServices.map(service => {
      const categoryId = typeof service.category === 'object' 
        ? service.category._id 
        : service.category;
      
      const category = allCategoriesData.data.find(cat => 
        cat._id.toString() === categoryId.toString()
      );
      
      const isNewlyAdded = new Date(service.createdAt).getTime() === new Date(service.updatedAt).getTime();
      
      // Calculate which page this service would be on in its category
     // Calculate which page this service would be on in its category
let pageNumber = 1;
if (allServicesData?.data) {
  // Get all published services for this specific category, sorted by date
  const categoryServices = allServicesData.data
    .filter(s => {
      const sCategoryId = typeof s.category === 'object' ? s.category._id : s.category;
      return s.status === 'published' && sCategoryId.toString() === categoryId.toString();
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const serviceIndex = categoryServices.findIndex(s => s._id === service._id);
  if (serviceIndex !== -1) {
    pageNumber = Math.floor(serviceIndex / servicesPerPage) + 1;
  }
}
      
      return {
        title: isNewlyAdded ? `New service: ${service.title}` : `Updated: ${service.title}`,
        date: formatRelativeDate(service.updatedAt),
        category: category?.title || 'Unknown Category',
        serviceId: service._id,
        categoryId: categoryId,
        page: pageNumber // Add page number to the update object
      };
    });
  }, [allServicesData?.data, allCategoriesData?.data, servicesData?.data]);

  const totalPublishedServices = publishedServices.length;
  const totalPages = Math.ceil(totalPublishedServices / servicesPerPage);

  // Handle page changes with URL updates and loading state
  const handlePageChange = (newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    
    setIsPageChanging(true);
    setCurrentPage(newPage);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', newPage.toString());
    }
    setSearchParams(newSearchParams);
    
    // Simulate loading delay and scroll to top
    setTimeout(() => {
      setIsPageChanging(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  // Loading state
  if (isCategoryLoading || isServicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full mx-auto mb-4 animate-spin"></div>
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state for category
  if (isCategoryError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Category Error"
            message={
              categoryError?.data?.message || "Failed to load category details"
            }
            actionText="Try Again"
            actionLink={`/services/${id}`}
          />
        </div>
      </div>
    );
  }

  // Category not found
  if (!categoryData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Category Not Found"
            message="The service category you're looking for doesn't exist or may have been removed."
            actionText="Browse All Services"
            actionLink="/services"
          />
        </div>
      </div>
    );
  }

  const category = categoryData.data;
  const allServices = servicesData?.data || [];

  return (
    <>
    <Meta title={category.title} description={category.smallDescription} />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section with Category */}
      <div className="relative bg-gradient-to-r from-[#498cef] via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-indigo-500/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <Link to="/services" className="hover:text-white transition-colors duration-200">Services</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-white font-medium">{category.title}</span>
              </li>
            </ol>
          </nav>

          {/* Category Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 animate-slide-up">
            <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
              {category.iconSvg ? (
                <div
                  className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center p-6 text-white border border-white/20"
                  dangerouslySetInnerHTML={{ __html: category.iconSvg }}
                />
              ) : (
                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center text-white text-5xl font-bold border border-white/20">
                  {category?.title?.charAt(0) || "?"}
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-delay">
                {category.title || "Untitled Category"}
              </h1>
              <div className="text-xl text-blue-100 leading-relaxed max-w-3xl animate-fade-in-delay-2">
                <RenderDescription json={category.description} />
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 text-slate-50 dark:text-gray-900">
            <path fill="currentColor" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"></path>
          </svg>
        </div>
      </div>

      <div className="relative -mt-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - 70% on large screens */}
            <div className="lg:w-[70%]">
              {/* Services List */}
              {isServicesError ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700 animate-fade-in">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6 animate-bounce">
                    <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Unable to load services</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {servicesError?.data?.message || "Failed to load services for this category"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-[#498cef] text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Try Again
                  </button>
                </div>
              ) : totalPublishedServices === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700 animate-fade-in">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#498cef] dark:text-blue-400 mb-6 animate-pulse">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No published services available</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">There are no published services available in this category yet.</p>
                  <Link
                    to="/services"
                    className="inline-block px-6 py-3 bg-[#498cef] text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Browse All Services
                  </Link>
                </div>
              ) : (
                <div className="animate-fade-in-up relative">
                  {/* Loading overlay when changing pages */}
                  {isPageChanging && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#498cef] rounded-full mx-auto mb-4 animate-spin flex items-center justify-center">
                          <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full"></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading page {currentPage}...</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                    <div className="relative">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white animate-slide-right relative overflow-hidden">
                        <span className="relative z-10 bg-gradient-to-r from-gray-900 dark:from-gray-100 via-[#498cef] to-gray-900 dark:to-gray-100 bg-clip-text text-transparent animate-gradient-x">
                          Our Services
                        </span>
                        <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#498cef] to-indigo-500 rounded-full animate-expand-line"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 dark:via-blue-900/20 to-transparent rounded-lg animate-shimmer"></div>
                      </h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-[#498cef] dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 animate-fade-in">
                        {totalPublishedServices} {totalPublishedServices === 1 ? 'published service' : 'published services'} available
                      </span>
                      {totalPages > 1 && (
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid gap-8">
                    {sortedAndPaginatedServices.map((service, index) => (
                      <div
                        key={service._id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group transform hover:-translate-y-1 animate-fade-in-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        {/* Service Header with Image */}
                        <div className="relative">
                          {service.fileKey && (
                            <div className="h-64 md:h-80 overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
                              <img
                                src={`${S3_BASE_URL}/${service.fileKey}`}
                                alt={service.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              {/* Fallback placeholder */}
                              <div className="hidden w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-900/50 dark:to-indigo-900/50 items-center justify-center">
                                <div className="text-center text-[#498cef] dark:text-blue-400">
                                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="font-medium">Service Image</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Status overlay */}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full border backdrop-blur-sm ${getStatusBadge(service.status)} shadow-lg`}>
                              {service.status?.charAt(0).toUpperCase() + service.status?.slice(1) || 'Draft'}
                            </span>
                          </div>
                        </div>

                        <div className="p-8">
                          {/* Service Title and Small Description */}
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#498cef] dark:group-hover:text-blue-400 transition-colors duration-300">
                              {service.title}
                            </h3>
                            
                            {service.smallDescription && (
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border-l-4 border-blue-500 transform hover:scale-[1.01] transition-transform duration-200">
                                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                  {service.smallDescription}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Main Content Grid */}
                          <div className="grid lg:grid-cols-3 gap-6 mb-8">
                            {/* Description Column */}
                            <div className="lg:col-span-2">
                              
                              {service.description ? (
                                <div className="prose prose-gray dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
                                  <RenderDescription json={service.description} />
                                </div>
                              ) : (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                                  <p className="text-gray-400 dark:text-gray-500 italic">No detailed description available.</p>
                                </div>
                              )}
                            </div>

                            {/* Quick Info Column */}
                            <div className="space-y-4">
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800 hover:shadow-md transition-shadow duration-300">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Service Info
                                </h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Added:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(service.createdAt)}</span>
                                  </div>
                                  {service.updatedAt !== service.createdAt && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(service.updatedAt)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className="font-medium text-gray-900 dark:text-white capitalize">{service.status}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Delivery Promise */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center text-blue-700 dark:text-blue-400 mb-2">
                                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-semibold">Fast Delivery</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Professional service delivery within 24-48 hours</p>
                              </div>
                            </div>
                          </div>

                          {/* Video Section */}
                          {service.videoUrl && (
                            <div className="mb-8 animate-fade-in-up">
                              
                              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-600">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                                  {getYouTubeId(service.videoUrl) ? (
                                    <iframe
                                      src={`https://www.youtube.com/embed/${getYouTubeId(service.videoUrl)}`}
                                      className="w-full h-full"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      title={`${service.title} Overview Video`}
                                    />
                                  ) : (
                                    <video 
                                      controls 
                                      className="w-full h-full object-cover"
                                      title={`${service.title} Overview Video`}
                                    >
                                      <source src={service.videoUrl} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Call to Action */}
                          <div className="bg-gradient-to-r from-[#498cef] to-indigo-700 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                              <div>
                                <h4 className="text-2xl font-bold mb-2">Ready to get started?</h4>
                                <p className="text-blue-100">Get professional service delivery with guaranteed quality</p>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <button className="bg-white text-[#498cef] px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                  <Link to="/contact">Request Service</Link>
                                </button>
                                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#498cef] transition-all duration-200">
                                 <Link to="/quote">Get Quote</Link>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Service Metadata */}
                          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span>/{service.slug}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>ID: {service._id?.slice(-6).toUpperCase()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-4 animate-fade-in-up">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isPageChanging}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          currentPage === 1 || isPageChanging
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-[#498cef] text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                      >
                        {isPageChanging ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Previous
                          </div>
                        ) : (
                          'Previous'
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={isPageChanging}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-[#498cef] text-white shadow-lg'
                                : isPageChanging 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {isPageChanging && currentPage === page ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                            ) : (
                              page
                            )}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isPageChanging}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          currentPage === totalPages || isPageChanging
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-[#498cef] text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                      >
                        {isPageChanging ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Next
                          </div>
                        ) : (
                          'Next'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recent Updates Sidebar - 30% on large screens */}
            <div className="lg:w-[30%]">
              <div className="sticky top-6 animate-fade-in-right">
               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-600 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-[#498cef] dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Recent Updates
                  </h2>
                  {recentUpdates.length > 0 ? (
                    <ul className="space-y-4">
                      {recentUpdates.map((update, index) => (
                        <li
                          key={index}
                          className="group cursor-pointer animate-fade-in-stagger"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Link 
                            to={`/services/${update.categoryId}?page=${update.page}`}
                            className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-300 border border-blue-100 dark:border-blue-800 group-hover:border-blue-200 dark:group-hover:border-blue-700 group-hover:shadow-md transform group-hover:-translate-y-0.5"
                          >
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#498cef] dark:group-hover:text-blue-400 transition-colors duration-200">
                              {update.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{update.date}</p>
                            <div className="flex items-center text-xs">
                              <span className="text-[#498cef] dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                                {update.category}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">No recent updates available</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-[#498cef] via-blue-700 to-indigo-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  {/* Background decoration */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">Need Help?</h3>
                    </div>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                      Our experts can help you select the right service for your needs and provide personalized guidance.
                    </p>
                    <button className="w-full bg-white text-[#498cef] hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <Link to="/contact">
                        Contact Support
                      </Link>
                    </button>
                  </div>
                </div>

                {/* Service Statistics */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-6 border border-gray-100 dark:border-gray-700 animate-fade-in-delay">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    Category Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</span>
                      <span className="text-xl font-bold text-[#498cef] dark:text-blue-400">{allServices.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">{totalPublishedServices}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">In Draft</span>
                      <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                        {allServices.filter(s => s.status === 'draft').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div><br /></div>

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
        
        @keyframes slide-right {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes fade-in-right {
          from { 
            opacity: 0; 
            transform: translateX(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes expand-line {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
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
        
        .animate-slide-right {
          animation: slide-right 0.6s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-fade-in-stagger {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-expand-line {
          animation: expand-line 1.5s ease-out 0.5s both;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
    </>
  );
};

export default ServicePageScreen;