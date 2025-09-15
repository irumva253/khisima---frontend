/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Brain, 
  BookOpen, 
  Download, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  ExternalLink,
  Star,
  Globe,
  Languages,
  Cpu,
  FileText,
  Video,
  Headphones,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import {
  useGetResourcesQuery,
  useGetResourceStatsQuery,
  useGetFeaturedResourcesQuery,
  useIncrementDownloadCountMutation,
  getResourceTypeIcon,
  getResourceCategoryColor
} from '@/slices/resourceSlice';
import Meta from '../components/Meta';

const ResourcesScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  // RTK Query hooks
  const { data: resourcesData, isLoading: loadingResources } = 
    useGetResourcesQuery({ 
      status: 'published', 
      category: activeCategory === 'all' ? '' : activeCategory,
      search: searchQuery 
    });
  
  const { data: statsData } = useGetResourceStatsQuery();
  const { data: featuredData } = useGetFeaturedResourcesQuery(3);
  const [incrementDownloadCount] = useIncrementDownloadCountMutation();

  const resources = resourcesData?.data || [];
  const featuredResources = featuredData?.data || [];
  const stats = statsData?.data || {};

  const categories = [
    { id: 'all', name: 'All Resources', icon: Globe, count: stats.total || 0 },
    { id: 'trends', name: 'Language Trends', icon: TrendingUp, count: stats.byCategory?.trends || 0 },
    { id: 'ai-language', name: 'AI vs Language', icon: Brain, count: stats.byCategory?.['ai-language'] || 0 },
    { id: 'linguistics', name: 'Practical Linguistics', icon: BookOpen, count: stats.byCategory?.linguistics || 0 },
    { id: 'open-resources', name: 'Open Resources', icon: Download, count: stats.byCategory?.['open-resources'] || 0 }
  ];

  const trendingTopics = [
    { name: 'AI Translation', growth: '+45%', posts: 127 },
    { name: 'Voice Recognition', growth: '+38%', posts: 89 },
    { name: 'Language Preservation', growth: '+52%', posts: 156 },
    { name: 'Code-Switching', growth: '+29%', posts: 67 },
    { name: 'Multilingual NLP', growth: '+41%', posts: 98 }
  ];

  const handleDownload = async (resourceId) => {
    try {
      await incrementDownloadCount(resourceId).unwrap();
      // Additional download logic here
    } catch (error) {
      console.error('Failed to increment download count:', error);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loadingResources) {
    return (
      <div className="flex items-center justify-center h-64 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin dark:text-white" />
        <span className="ml-2 dark:text-white">Loading resources...</span>
      </div>
    );
  }

  return (
    <>
    <Meta title="Resources" description="Explore our collection of language resources" />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#4c91f5] via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-indigo-500/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 text-white/20 animate-float-slow">
            <Languages className="w-8 h-8" />
          </div>
          <div className="absolute top-32 right-20 text-white/15 animate-float-medium">
            <Brain className="w-10 h-10" />
          </div>
          <div className="absolute bottom-40 left-20 text-white/20 animate-float-fast">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="absolute top-1/2 right-1/3 text-white/10 animate-float-slow">
            <TrendingUp className="w-12 h-12" />
          </div>
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
                <span className="text-white font-medium">Resources</span>
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="text-center animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Language Resources Hub
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              Explore cutting-edge research, trends, and tools shaping the future of African languages 
              in the digital world. From AI insights to practical linguistics guides.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 dark:text-white bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay">
                <div className="text-2xl font-bold mb-1">{stats.total || 0}+</div>
                <div className="text-blue-100 text-sm">Resources Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-2">
                <div className="text-2xl font-bold mb-1">12</div>
                <div className="text-blue-100 text-sm">African Languages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                <div className="text-2xl font-bold mb-1">{stats.totalDownloads?.toLocaleString() || '25K+'}</div>
                <div className="text-blue-100 text-sm">Downloads</div>
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
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 mb-8 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeCategory === category.id
                            ? 'bg-[#4c91f5] text-white border border-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-[#4c91f5] dark:hover:text-blue-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 mr-3" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

           
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Resources */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredResources.map((resource) => {
                    const TypeIcon = getTypeIconComponent(resource.type);
                    const categoryColor = getResourceCategoryColor(resource.category);
                    
                    return (
                      <div
                        key={resource._id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-[#4c91f5] to-indigo-600">
                          {resource.imageUrl && (
                            <img
                              src={resource.imageUrl}
                              alt={resource.title}
                              className="w-full h-full object-cover opacity-50"
                            />
                          )}
                          <div className="absolute inset-0 bg-black opacity-20"></div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">
                              {resource.type}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{resource.rating}</span>
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-yellow-200 transition-colors duration-200">
                              {resource.title}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                            {resource.description}
                          </p>
                          
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <User className="w-3 h-3 mr-1" />
                            <span className="mr-4">{resource.author}</span>
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className="mr-4">{formatDate(resource.createdAt)}</span>
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{resource.readTime}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColor}`}>
                              {resource.category}
                            </span>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              <span>{resource.downloads.toLocaleString()} downloads</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleDownload(resource._id)}
                            className="w-full bg-[#4c91f5] text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center text-sm font-medium"
                          >
                            Download
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* All Resources */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Resources</h2>
                <div className="space-y-4">
                  {resources.map((resource) => {
                    const TypeIcon = getTypeIconComponent(resource.type);
                    const categoryColor = getResourceCategoryColor(resource.category);
                    
                    return (
                      <div
                        key={resource._id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <TypeIcon className="w-5 h-5 text-[#4c91f5] mr-2" />
                              <span className="bg-blue-50 dark:bg-blue-900/30 text-[#4c91f5] dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                {resource.type}
                              </span>
                              <div className="flex items-center ml-4 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{resource.rating}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#4c91f5] transition-colors duration-200">
                              {resource.title}
                            </h3>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                              {resource.description}
                            </p>
                            
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <User className="w-4 h-4 mr-1" />
                              <span className="mr-6">{resource.author}</span>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="mr-6">{formatDate(resource.createdAt)}</span>
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="mr-6">{resource.readTime}</span>
                              <Download className="w-4 h-4 mr-1" />
                              <span>{resource.downloads.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColor}`}>
                                {resource.category}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {resource.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {resource.tags.length > 3 && (
                                  <span className="text-gray-400 text-xs">+{resource.tags.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-6">
                            <button 
                              onClick={() => handleDownload(resource._id)}
                              className="bg-[#4c91f5] text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center font-medium group-hover:scale-105 transform transition-transform duration-200"
                            >
                              Access
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {resources.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FileText className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resources found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery 
                      ? `No resources match your search for "${searchQuery}"`
                      : 'There are no resources available in this category yet.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(270deg); }
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
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.9s both;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
    </>
  );
};

export default ResourcesScreen;