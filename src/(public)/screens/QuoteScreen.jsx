import React, { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  Globe, 
  Clock, 
  Send, 
  Languages, 
  DollarSign,
  MessageCircle,
  CheckCircle,
  Upload,
  X,
  AlertCircle,
  Phone,
} from 'lucide-react';
import DynamicText from "@/components/kokonutui/dynamic-text";

const QuoteScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    sourceLanguage: '',
    targetLanguages: [],
    otherSourceLanguage: '',
    otherTargetLanguage: '',
    wordCount: '',
    deadline: '',
    specialRequirements: '',
    budget: '',
    description: ''
  });

  const projectTypes = [
    'Document Translation',
    'Website Localization',
    'Software Localization',
    'Marketing Materials',
    'Legal Documents',
    'Medical Translation',
    'Technical Documentation',
    'Audio/Video Transcription',
    'Interpretation Services',
    'Other'
  ];

  const languages = [
    'English', 'French', 'Kinyarwanda', 'Swahili', 'Portuguese', 'Spanish',
    'Arabic', 'Amharic', 'Yoruba', 'Igbo', 'Hausa', 'Zulu', 'Afrikaans',
    'Somali', 'Oromo', 'Tigrinya', 'Lingala', 'Kikongo', 'Other'
  ];

  const budgetRanges = [
    'Under $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    'Over $10,000',
    'Not sure - please advise'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (language, isTarget = false) => {
    if (isTarget) {
      setFormData(prev => ({
        ...prev,
        targetLanguages: prev.targetLanguages.includes(language)
          ? prev.targetLanguages.filter(lang => lang !== language)
          : [...prev.targetLanguages, language]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sourceLanguage: language
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Create FormData for file upload
    const submitData = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      if (key === 'targetLanguages') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Append files
    files.forEach(file => {
      submitData.append('files', file);
    });

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        sourceLanguage: '',
        targetLanguages: [],
        otherSourceLanguage: '',
        otherTargetLanguage: '',
        wordCount: '',
        deadline: '',
        specialRequirements: '',
        budget: '',
        description: ''
      });
      setFiles([]);
      
      // Show success message
      alert('Quote request submitted successfully! We\'ll get back to you within 24 hours.');
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('Error submitting quote request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-indigo-500/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 text-white/20 animate-float-slow">
            <Calculator className="w-8 h-8" />
          </div>
          <div className="absolute top-32 right-20 text-white/15 animate-float-medium">
            <Globe className="w-10 h-10" />
          </div>
          <div className="absolute bottom-40 left-20 text-white/20 animate-float-fast">
            <FileText className="w-6 h-6" />
          </div>
          <div className="absolute top-40 right-40 text-white/10 animate-float-slow">
            <DollarSign className="w-12 h-12" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li>
                <a href="/" className="hover:text-white transition-colors duration-200">Home</a>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-white font-medium">Get Quote</span>
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="text-center animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#86befe] to-white mb-4 leading-tight">
              Saba!
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Request Your Quote
            </p>
            <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed mb-8"> 
              <span className="font-semibold text-yellow-300">"Saba"</span> means{" "}
              "<DynamicText />" in Kinyarwanda. 
              Get a personalized quote for your translation and localization needs. 
              We provide transparent pricing with no hidden fees.
            </p>
            
            {/* Key Features */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-lg font-semibold mb-1">Fast Quotes</div>
                <div className="text-blue-100 text-sm">24-hour response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-2">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-lg font-semibold mb-1">Transparent</div>
                <div className="text-blue-100 text-sm">No hidden fees</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg font-semibold mb-1">Accurate</div>
                <div className="text-blue-100 text-sm">Detailed estimates</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                <div className="text-2xl mb-2">🤝</div>
                <div className="text-lg font-semibold mb-1">Flexible</div>
                <div className="text-blue-100 text-sm">Custom solutions</div>
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
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            
            {/* Quote Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white rounded-t-2xl">
                  <h2 className="text-3xl font-bold mb-4 flex items-center">
                    <Calculator className="w-8 h-8 mr-3" />
                    Request Quote
                  </h2>
                  <p className="text-blue-100 leading-relaxed">
                    Tell us about your project and we'll provide a detailed quote tailored to your needs.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                      Contact Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Your first name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="+250 xxx xxx xxx"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Your company or organization"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                      Project Details
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Source Language *
                      </label>
                      <select
                        name="sourceLanguage"
                        value={formData.sourceLanguage}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Select source language</option>
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>

                      {formData.sourceLanguage === 'Other' && (
                        <input
                          type="text"
                          name="otherSourceLanguage"
                          value={formData.otherSourceLanguage}
                          onChange={handleChange}
                          placeholder="Specify source language"
                          className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Languages * (Select multiple)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-xl max-h-48 overflow-y-auto">
                        {languages.map(lang => (
                          <label key={lang} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.targetLanguages.includes(lang)}
                              onChange={() => handleLanguageChange(lang, true)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{lang}</span>
                          </label>
                        ))}
                      </div>
                      
                      {formData.targetLanguages.includes('Other') && (
                        <input
                          type="text"
                          name="otherTargetLanguage"
                          value={formData.otherTargetLanguage}
                          onChange={handleChange}
                          placeholder="Specify target language(s)"
                          className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estimated Word Count
                        </label>
                        <input
                          type="number"
                          name="wordCount"
                          value={formData.wordCount}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="e.g., 5000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Deadline
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                      Project Files (Optional)
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Documents
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                        <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-blue-600 font-semibold">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          PDF, DOC, DOCX, TXT, XLSX, PPTX (Max 10MB each)
                        </p>
                      </div>
                      
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                      Additional Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Special Requirements
                      </label>
                      <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Any specific formatting, style guides, or technical requirements..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Describe your project in detail. What do you need translated? What is the purpose? Who is your target audience?"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Request Quote
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quote Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-blue-600" />
                  Quote Process
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <Send className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">1. Submit Request</h4>
                      <p className="text-sm text-gray-600">Fill out the form with your project details</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">2. Review & Analysis</h4>
                      <p className="text-sm text-gray-600">Our team analyzes your requirements</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">3. Receive Quote</h4>
                      <p className="text-sm text-gray-600">Get your detailed quote within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">4. Project Start</h4>
                      <p className="text-sm text-gray-600">Approve the quote and we begin work</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-8 text-white animate-fade-in-up relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-3" />
                    Pricing Factors
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <p className="text-blue-100">Language pair complexity</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <p className="text-blue-100">Document type & formatting</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <p className="text-blue-100">Project timeline & urgency</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <p className="text-blue-100">Word count & volume</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                      <p className="text-blue-100">Subject matter expertise required</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3 text-blue-600" />
                  Need Help?
                </h3>
                
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Have questions about your project? Our multilingual support team is here to help.
                  </p>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Live Chat</p>
                      <p className="text-xs text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">+250 788 123 456</p>
                      <p className="text-xs text-gray-600">Mon-Fri, 9AM-6PM CAT</p>
                    </div>
                  </div>
                </div>
              </div>
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
      `}</style>
    </div>
  );
};

export default QuoteScreen;