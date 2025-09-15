import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Sparkles, 
  MessageCircle, 
  Languages, 
  Heart, 
  Clock, 
  Send, 
  User,
  ChevronRight
} from 'lucide-react';
import { IconHeadphones, IconLanguage, IconWorldStar, IconBrandInstagram } from '@tabler/icons-react';
import { toast } from "sonner";
import DynamicText from "@/components/kokonutui/dynamic-text";
import Meta from '../components/Meta';
import { useSubmitContactFormMutation } from '@/slices/notificationSlice'; 

const ContactScreen = () => {
  const [submitContactForm, { isLoading }] = useSubmitContactFormMutation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'English',
    otherLanguage: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Prepare data for API
    const submissionData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      preferredLanguage: formData.language,
      message: formData.message.trim(),
      ...(formData.language === 'Other' && formData.otherLanguage && {
        otherLanguage: formData.otherLanguage.trim()
      })
    };

    try {
      const result = await submitContactForm(submissionData).unwrap();
      
      if (result.success) {
        toast.success(result.message || 'Message sent successfully! We\'ll get back to you within 24 hours.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          language: 'English',
          otherLanguage: '',
          message: ''
        });
      } else {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      // Handle different error scenarios
      if (error.data?.errors) {
        // Validation errors from backend
        const errorMessages = error.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (error.data?.message) {
        // Backend error message
        toast.error(error.data.message);
      } else if (error.status === 400) {
        toast.error('Bad request. Please check your input.');
      } else if (error.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to send message. Please check your connection and try again.');
      }
    }
  };

  return (
    <>
      <Meta title="Contact Us" description="Get in touch with Khisima for language services and support" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-indigo-500/10"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 text-white/20 animate-float-slow">
              <Languages className="w-8 h-8" />
            </div>
            <div className="absolute top-32 right-20 text-white/15 animate-float-medium">
              <Globe className="w-10 h-10" />
            </div>
            <div className="absolute bottom-40 left-20 text-white/20 animate-float-fast">
              <MessageCircle className="w-6 h-6" />
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
                  <span className="text-white font-medium">Contact</span>
                </li>
              </ol>
            </nav>

            {/* Hero Content */}
            <div className="text-center animate-slide-up">
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-[#86befe] to-white mb-4 leading-tight">
                Muraho!
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Connect with Khisima
              </p>
              <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed mb-8"> 
                <span className="font-semibold text-yellow-300">"Muraho"</span> means{" "}
                "<DynamicText />" in Kinyarwanda. 
                We're passionate about bridging cultures through language, bringing African voices to the digital world. 
                Let's start a conversation that transcends borders.
              </p>
              
              {/* Key Icons */}
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay">
                  <div className="text-2xl mb-2">🇷🇼</div>
                  <div className="text-lg font-semibold mb-1">Rwanda Based</div>
                  <div className="text-blue-100 text-sm">East African hub</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-2">
                  <div className="text-2xl mb-2 justify-center flex"><IconWorldStar stroke={2} /></div>
                  <div className="text-lg font-semibold mb-1">Global Reach,</div>
                  <div className="text-blue-100 text-sm">Worldwide services</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                  <div className="text-2xl mb-2 justify-center flex"><IconHeadphones stroke={2} /></div>
                  <div className="text-lg font-semibold mb-1">24/7 Support</div>
                  <div className="text-blue-100 text-sm">Always available</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                  <div className="text-2xl mb-2 justify-center flex"><IconLanguage stroke={2} /></div>
                  <div className="text-lg font-semibold mb-1">Multi-lingual</div>
                  <div className="text-blue-100 text-sm">50+ languages</div>
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
            {/* Main Content Section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              
              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white rounded-t-2xl">
                  <h2 className="text-3xl font-bold mb-4 flex items-center">
                    <MessageCircle className="w-8 h-8 mr-3" />
                    Let's Talk
                  </h2>
                  <p className="text-blue-100 leading-relaxed">
                    Share your thoughts with us in any language. We're here to listen and help.
                  </p>
                </div>
                
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white"
                          placeholder="Your first name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white"
                        placeholder="+250 xxx xxx xxx"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Language *
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="English">English</option>
                        <option value="Kinyarwanda">Kinyarwanda</option>
                        <option value="French">French</option>
                        <option value="Swahili">Swahili</option>
                        <option value="Other">Other</option>
                      </select>

                      {formData.language === 'Other' && (
                        <input
                          type="text"
                          name="otherLanguage"
                          value={formData.otherLanguage}
                          onChange={handleChange}
                          placeholder="Specify your language"
                          className="w-full mt-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white"
                          required={formData.language === 'Other'}
                        />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none dark:bg-gray-700 dark:text-white"
                        placeholder="Tell us about your project, questions, or how we can help you..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Contact Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-blue-600" />
                    Get in Touch
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Our Location</h4>
                        <p className="text-gray-600 dark:text-gray-300">Kigali, Rwanda</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">East Africa</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Email Us</h4>
                        <p className="text-gray-600 dark:text-gray-300">info@khisima.com</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <Phone className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Call Us</h4>
                        <p className="text-gray-600 dark:text-gray-300">+250 789 619 370</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri, 7AM-10PM (CAT)</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Business Hours</h4>
                        <p className="text-gray-600 dark:text-gray-300">Mon - Fri: 9:00 AM - 6:00 PM</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Central Africa Time (CAT)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-8 text-white animate-fade-in-up relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 flex items-center">
                      <Heart className="w-6 h-6 mr-3" />
                      Why Choose Khisima?
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                        <p className="text-blue-100">Native African language expertise</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                        <p className="text-blue-100">Cultural sensitivity & authenticity</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                        <p className="text-blue-100">24/7 multilingual support</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                        <p className="text-blue-100">Technology meets tradition</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 dark:border-gray-700 animate-fade-in-up">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                  <Globe className="w-8 h-8 mr-3 text-blue-600" />
                  Connect with Us
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Follow our journey as we bridge cultures and languages across Africa and beyond
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  {/* X */}
                  <a
                    href="https://x.com/Khisima_lsp?t=TZlhsibDZZZPKSjhqTiEzA&s=09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-900 p-4 rounded-full text-white text-xl 
                              transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl animate-fade-in"
                    title="X"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/profile.php?id=61580147190413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full text-white text-xl 
                              transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl animate-fade-in"
                    title="Facebook"
                    style={{ animationDelay: "100ms" }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/khisima/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3B%2FwevVHPPRviJQYMgTP2Dcw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 hover:bg-blue-800 p-4 rounded-full text-white text-xl 
                              transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl animate-fade-in"
                    title="LinkedIn"
                    style={{ animationDelay: "200ms" }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/khisima_lsp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-500 hover:bg-pink-600 p-4 rounded-full text-white text-xl 
                              transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl animate-fade-in"
                    title="Instagram"
                    style={{ animationDelay: "300ms" }}
                  >
                    <IconBrandInstagram stroke={2} className="w-6 h-6" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/message/BJAPVTZERQWWH1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 p-4 rounded-full text-white text-xl 
                              transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl animate-fade-in"
                    title="WhatsApp"
                    style={{ animationDelay: "400ms" }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                  </a>

                  {/* Telegram */}
                  <a
                    href="https://t.me/khisima"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 p-4 rounded-full text-white text-xl 
                              transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl animate-fade-in"
                    title="Khidima Telegram Channel"
                    style={{ animationDelay: "500ms" }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.020.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
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
    </>
  );
};

export default ContactScreen;