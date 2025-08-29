/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
  ChevronUp
} from 'lucide-react';

const ResourcesScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const categories = [
    { id: 'all', name: 'All Resources', icon: Globe, count: 48 },
    { id: 'trends', name: 'Language Trends', icon: TrendingUp, count: 12 },
    { id: 'ai-language', name: 'AI vs Language', icon: Brain, count: 15 },
    { id: 'linguistics', name: 'Practical Linguistics', icon: BookOpen, count: 14 },
    { id: 'open-resources', name: 'Open Resources', icon: Download, count: 7 }
  ];

  const featuredResources = [
    {
      id: 1,
      title: 'The Future of African Languages in Digital Transformation',
      category: 'trends',
      type: 'research',
      description: 'Comprehensive analysis of how African languages are being integrated into digital platforms and the challenges ahead.',
      author: 'Dr. Amina Kone',
      date: '2024-08-15',
      readTime: '12 min',
      rating: 4.9,
      downloads: 2847,
      tags: ['Digital Transformation', 'African Languages', 'Technology'],
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Breaking Language Barriers: AI vs Human Translation',
      category: 'ai-language',
      type: 'whitepaper',
      description: 'In-depth comparison of AI translation systems versus human translators for African languages.',
      author: 'Khisima Research Team',
      date: '2024-08-10',
      readTime: '18 min',
      rating: 4.8,
      downloads: 3521,
      tags: ['AI Translation', 'Machine Learning', 'Language Processing'],
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Practical Guide to Swahili NLP Implementation',
      category: 'linguistics',
      type: 'guide',
      description: 'Step-by-step guide for implementing natural language processing solutions for Swahili language applications.',
      author: 'Prof. James Mwangi',
      date: '2024-08-05',
      readTime: '25 min',
      rating: 4.9,
      downloads: 1876,
      tags: ['Swahili', 'NLP', 'Implementation'],
      image: '/api/placeholder/400/250'
    }
  ];

  const resources = [
    // Language Trends
    {
      id: 4,
      title: 'African Language Usage Statistics 2024',
      category: 'trends',
      type: 'data',
      description: 'Latest statistics on African language usage across digital platforms.',
      author: 'Khisima Analytics',
      date: '2024-07-28',
      readTime: '8 min',
      rating: 4.7,
      downloads: 1234,
      tags: ['Statistics', 'Usage Data', 'Trends']
    },
    {
      id: 5,
      title: 'Rise of Voice Technology in Africa',
      category: 'trends',
      type: 'article',
      description: 'How voice assistants and speech recognition are adapting to African languages.',
      author: 'Sarah Okonkwo',
      date: '2024-07-20',
      readTime: '10 min',
      rating: 4.6,
      downloads: 892,
      tags: ['Voice Technology', 'Speech Recognition', 'Africa']
    },
    {
      id: 6,
      title: 'Mobile Apps Driving Language Preservation',
      category: 'trends',
      type: 'case-study',
      description: 'Case studies of successful mobile applications preserving endangered African languages.',
      author: 'Dr. Fatima Hassan',
      date: '2024-07-15',
      readTime: '15 min',
      rating: 4.8,
      downloads: 1567,
      tags: ['Mobile Apps', 'Language Preservation', 'Case Studies']
    },

    // AI vs Language
    {
      id: 7,
      title: 'Training Large Language Models for African Languages',
      category: 'ai-language',
      type: 'technical',
      description: 'Technical guide on training and fine-tuning LLMs for low-resource African languages.',
      author: 'AI Research Collective',
      date: '2024-07-25',
      readTime: '22 min',
      rating: 4.9,
      downloads: 2341,
      tags: ['LLM', 'Training', 'African Languages']
    },
    {
      id: 8,
      title: 'Bias in AI Language Models: African Perspectives',
      category: 'ai-language',
      type: 'research',
      description: 'Analysis of bias in current AI language models when processing African languages.',
      author: 'Dr. Kwame Asante',
      date: '2024-07-18',
      readTime: '16 min',
      rating: 4.7,
      downloads: 1876,
      tags: ['AI Bias', 'Ethics', 'Language Models']
    },
    {
      id: 9,
      title: 'Code-Switching in Multilingual AI Systems',
      category: 'ai-language',
      type: 'paper',
      description: 'How AI systems handle code-switching in African multilingual contexts.',
      author: 'Multilingual AI Lab',
      date: '2024-07-10',
      readTime: '20 min',
      rating: 4.8,
      downloads: 1432,
      tags: ['Code-Switching', 'Multilingual', 'AI Systems']
    },

    // Practical Linguistics
    {
      id: 10,
      title: 'Phonetic Analysis Tools for African Languages',
      category: 'linguistics',
      type: 'tools',
      description: 'Collection of phonetic analysis tools specifically designed for African language research.',
      author: 'Linguistics Toolkit Team',
      date: '2024-07-30',
      readTime: '12 min',
      rating: 4.6,
      downloads: 987,
      tags: ['Phonetics', 'Tools', 'Research']
    },
    {
      id: 11,
      title: 'Tone Recognition in Bantu Languages',
      category: 'linguistics',
      type: 'methodology',
      description: 'Methodologies for implementing tone recognition systems in Bantu language processing.',
      author: 'Dr. Grace Nyong',
      date: '2024-07-22',
      readTime: '18 min',
      rating: 4.9,
      downloads: 1654,
      tags: ['Tone Recognition', 'Bantu Languages', 'Methodology']
    },
    {
      id: 12,
      title: 'Corpus Building for Low-Resource Languages',
      category: 'linguistics',
      type: 'guide',
      description: 'Best practices for building high-quality corpora for under-resourced African languages.',
      author: 'Corpus Linguistics Group',
      date: '2024-07-14',
      readTime: '14 min',
      rating: 4.7,
      downloads: 1298,
      tags: ['Corpus Building', 'Low-Resource', 'Best Practices']
    },

    // Open Resources
    {
      id: 13,
      title: 'Open Dataset: Yoruba Speech Recognition',
      category: 'open-resources',
      type: 'dataset',
      description: 'Free dataset containing 500 hours of Yoruba speech with transcriptions.',
      author: 'Khisima Open Data',
      date: '2024-08-01',
      readTime: '5 min',
      rating: 4.8,
      downloads: 3456,
      tags: ['Yoruba', 'Speech Recognition', 'Open Data']
    },
    {
      id: 14,
      title: 'Hausa Language Processing Toolkit',
      category: 'open-resources',
      type: 'software',
      description: 'Open-source toolkit for Hausa language processing and analysis.',
      author: 'Open Source Community',
      date: '2024-07-26',
      readTime: '7 min',
      rating: 4.9,
      downloads: 2187,
      tags: ['Hausa', 'Open Source', 'Toolkit']
    }
  ];

  const trendingTopics = [
    { name: 'AI Translation', growth: '+45%', posts: 127 },
    { name: 'Voice Recognition', growth: '+38%', posts: 89 },
    { name: 'Language Preservation', growth: '+52%', posts: 156 },
    { name: 'Code-Switching', growth: '+29%', posts: 67 },
    { name: 'Multilingual NLP', growth: '+41%', posts: 98 }
  ];

  const filteredResources = [...featuredResources, ...resources].filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type) => {
    const icons = {
      research: FileText,
      whitepaper: FileText,
      guide: BookOpen,
      data: TrendingUp,
      article: FileText,
      'case-study': FileText,
      technical: Cpu,
      paper: FileText,
      tools: Download,
      methodology: BookOpen,
      dataset: Download,
      software: Download
    };
    return icons[type] || FileText;
  };

  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white/95 backdrop-blur-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay">
                <div className="text-2xl font-bold mb-1">48+</div>
                <div className="text-blue-100 text-sm">Resources Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-2">
                <div className="text-2xl font-bold mb-1">12</div>
                <div className="text-blue-100 text-sm">African Languages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                <div className="text-2xl font-bold mb-1">25K+</div>
                <div className="text-blue-100 text-sm">Downloads</div>
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
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories Filter */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                            : 'text-gray-600 hover:bg-blue-50 hover:text-[#4c91f5]'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 mr-3" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{topic.name}</div>
                        <div className="text-xs text-gray-500">{topic.posts} resources</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-semibold text-sm">{topic.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
                <div className="space-y-3">
                  <Link
                    to="/datasets"
                    className="flex items-center text-[#4c91f5] hover:text-blue-700 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Open Datasets
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link
                    to="/tools"
                    className="flex items-center text-[#4c91f5] hover:text-blue-700 transition-colors duration-200"
                  >
                    <Cpu className="w-4 h-4 mr-2" />
                    Language Tools
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Link>
                  <Link
                    to="/research"
                    className="flex items-center text-[#4c91f5] hover:text-blue-700 transition-colors duration-200"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Research Papers
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Resources */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredResources
                    .filter(resource => activeCategory === 'all' || resource.category === activeCategory)
                    .map((resource) => {
                      const TypeIcon = getTypeIcon(resource.type);
                      return (
                        <div
                          key={resource.id}
                          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="relative h-48 bg-gradient-to-br from-[#4c91f5] to-indigo-600">
                            <div className="absolute inset-0 bg-black opacity-20"></div>
                            <div className="absolute top-4 left-4">
                              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 capitalize">
                                {resource.type}
                              </span>
                            </div>
                            <div className="absolute top-4 right-4">
                              <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                                <span className="text-xs font-medium text-gray-700">{resource.rating}</span>
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-white font-bold text-lg leading-tight group-hover:text-yellow-200 transition-colors duration-200">
                                {resource.title}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                              {resource.description}
                            </p>
                            
                            <div className="flex items-center text-xs text-gray-500 mb-4">
                              <User className="w-3 h-3 mr-1" />
                              <span className="mr-4">{resource.author}</span>
                              <Calendar className="w-3 h-3 mr-1" />
                              <span className="mr-4">{new Date(resource.date).toLocaleDateString()}</span>
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{resource.readTime}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {resource.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-50 text-[#4c91f5] px-2 py-1 rounded-full text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {resource.tags.length > 2 && (
                                <span className="text-gray-400 text-xs">+{resource.tags.length - 2} more</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-500 text-xs">
                                <Download className="w-3 h-3 mr-1" />
                                <span>{resource.downloads.toLocaleString()} downloads</span>
                              </div>
                              <button className="bg-[#4c91f5] text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center text-sm font-medium">
                                View
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* All Resources */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Resources</h2>
                <div className="space-y-4">
                  {filteredResources.slice(3).map((resource) => {
                    const TypeIcon = getTypeIcon(resource.type);
                    return (
                      <div
                        key={resource.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <TypeIcon className="w-5 h-5 text-[#4c91f5] mr-2" />
                              <span className="bg-blue-50 text-[#4c91f5] px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                {resource.type}
                              </span>
                              <div className="flex items-center ml-4 bg-gray-50 px-2 py-1 rounded-full">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                                <span className="text-xs font-medium text-gray-600">{resource.rating}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#4c91f5] transition-colors duration-200">
                              {resource.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {resource.description}
                            </p>
                            
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <User className="w-4 h-4 mr-1" />
                              <span className="mr-6">{resource.author}</span>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="mr-6">{new Date(resource.date).toLocaleDateString()}</span>
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="mr-6">{resource.readTime}</span>
                              <Download className="w-4 h-4 mr-1" />
                              <span>{resource.downloads.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-50 hover:text-[#4c91f5] transition-colors duration-200 cursor-pointer"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="ml-6">
                            <button className="bg-[#4c91f5] text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center font-medium group-hover:scale-105 transform transition-transform duration-200">
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

              {/* Pagination */}


            </div>
          </div>

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
  );
};

export default ResourcesScreen;