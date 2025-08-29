/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { 
  IconPhone,
  IconApps,
  IconLanguage,
  IconHome,
  IconInfoSquareRounded,
  IconCircleDottedLetterK,     
  IconUser,
  IconBriefcase,
  IconBook,
  IconChevronDown,
  IconMenu2,
  IconX,
  IconSparkles,
  IconMapPin,
  IconMail,
  IconGlobe,
  IconChevronRight
} from '@tabler/icons-react';

import {Link, useLocation} from 'react-router-dom';
import {
  useGetServiceCategoriesQuery,
} from "@/slices/serviceCategoriesSlice"

// Enhanced SVG Icons with better styling
const MapPinIcon = (props) => (
  <IconMapPin className="w-4 h-4" {...props} />
);

const PhoneIcon = (props) => (
  <IconPhone className="w-4 h-4" {...props} />
);

const EnvelopeIcon = (props) => (
  <IconMail className="w-4 h-4" {...props} />
);

const ChevronDownIcon = () => (
  <IconChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
);

const MenuIcon = () => (
  <IconMenu2 className="w-6 h-6" />
);

const CloseIcon = () => (
  <IconX className="w-6 h-6" />
);

const SparkleIcon = () => (
  <IconSparkles className="w-5 h-5" />
);

const GlobeIcon = () => (
  <IconGlobe className="w-5 h-5" />
);

// Language options
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [topNavHidden, setTopNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const location = useLocation();

  const { data: categoriesData, isLoading, isError } = useGetServiceCategoriesQuery();
  const categories = categoriesData?.data || [];
  
  // Limit categories to 3 for display
  const displayedCategories = categories.slice(0, 3);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for styling
      setScrolled(currentScrollY > 10);
      
      // Hide/show top nav based on scroll direction and position
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide top nav
          setTopNavHidden(true);
        } else {
          // Scrolling up - show top nav
          setTopNavHidden(false);
        }
      } else {
        // At top - always show top nav
        setTopNavHidden(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setMobileLangOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  // Helper function to check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to check if any service is active
  const isServiceActive = () => {
    return categories.some(cat => 
      location.pathname.startsWith(`/services/${cat._id}`)
    );
  };

  // Get active link classes
  const getNavLinkClasses = (path, isDropdown = false) => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-300 relative group";
    const dropdownClasses = "flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300";
    
    if (isActive(path)) {
      return `${isDropdown ? dropdownClasses : baseClasses} text-[#4993f2] bg-blue-50 shadow-sm`;
    }
    
    return `${isDropdown ? dropdownClasses : baseClasses} text-gray-700 hover:text-[#4993f2] hover:bg-blue-50`;
  };

  // Get dropdown trigger classes
  const getDropdownClasses = (checkFunction) => {
    const baseClasses = "flex items-center px-4 py-2 text-gray-700 hover:text-[#4993f2] hover:bg-blue-50 rounded-lg font-medium transition-all duration-300";
    
    if (checkFunction()) {
      return `${baseClasses.replace('text-gray-700', 'text-[#4993f2]')} bg-blue-50 shadow-sm`;
    }
    
    return baseClasses;
  };

  // Get mobile nav item classes
  const getMobileNavClasses = (path, isService = false) => {
    const baseClasses = "flex items-center py-3 px-4 rounded-xl transition-all duration-300 group";
    
    let isCurrentActive = false;
    if (isService) {
      isCurrentActive = isServiceActive() && isActive(path);
    } else {
      isCurrentActive = isActive(path);
    }
    
    if (isCurrentActive) {
      return `${baseClasses} text-[#4993f2] bg-blue-50 shadow-sm border border-blue-200`;
    }
    
    return `${baseClasses} text-gray-700 hover:bg-blue-50 hover:text-[#4993f2]`;
  };

  // Organized menu items with proper icons and descriptions
  const companyItems = [
    { name: "Home", path: "/", icon: <IconHome size={20} />, desc: "Back to homepage" },
    { name: "About Us", path: "/about-us", icon: <IconInfoSquareRounded size={20} />, desc: "Our story & mission" },
    { name: "Contact", path: "/contact", icon: <IconPhone size={20} />, desc: "Get in touch" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setMobileLangOpen(false);
    setMobileServicesOpen(false);
  };

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    setLangDropdownOpen(false);
    setMobileLangOpen(false);
    // Here you would typically integrate with your i18n system
    console.log('Language changed to:', lang.code);
  };

  return (
    <div className="relative">
      {/* Enhanced Top Navigation Bar - Separate fixed positioning */}
      <div className={`fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 text-white py-3 px-4 text-sm hidden lg:block overflow-hidden transition-all duration-500 ${
        topNavHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4993f2]/10 via-transparent to-[#4993f2]/10 animate-pulse"></div>
        <div className="container mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center hover:text-blue-300 transition-colors duration-300 group">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-blue-500/30 transition-colors">
                <MapPinIcon className="h-4 w-4 text-blue-300" />
              </div>
              <span className="font-medium">Rwanda, Kigali, Rwanda</span>
            </div>
            <div className="flex items-center hover:text-green-300 transition-colors duration-300 group">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-green-500/30 transition-colors">
                <PhoneIcon className="h-4 w-4 text-green-300" />
              </div>
              <span className="font-medium">+250 786 208 015</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center hover:text-purple-300 transition-colors duration-300 group">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-purple-500/30 transition-colors">
                <EnvelopeIcon className="h-4 w-4 text-purple-300" />
              </div>
              <span className="font-medium">info@khisima.com</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <SparkleIcon />
              <span className="text-yellow-300 font-semibold">24/7 Support Available</span>
            </div>
            
            {/* Language Switcher */}
            <div className="relative group">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group"
              >
                <GlobeIcon />
                <span className="font-medium">{currentLang.flag}</span>
                <span className="font-medium">{currentLang.code.toUpperCase()}</span>
                <IconChevronDown size={16} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 shadow-2xl rounded-xl py-2 border border-gray-100">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full flex items-center px-4 py-3 hover:bg-blue-50 transition-colors duration-200 ${
                        currentLang.code === lang.code ? 'bg-blue-50 text-[#4993f2]' : ''
                      }`}
                    >
                      <span className="text-lg mr-3">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {currentLang.code === lang.code && (
                        <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Navigation Bar - Fixed positioning */}
      <div className={`fixed w-full z-40 bg-white/95 backdrop-blur-md transition-all duration-500 border-b border-gray-100 ${
        topNavHidden ? 'top-0 shadow-2xl' : 'top-0 lg:top-[52px]'
      } ${scrolled ? "py-3 shadow-lg" : "py-5"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile menu + Logo + Navigation */}
            <div className="flex items-center space-x-8">
              {/* Enhanced Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-[#4993f2]/10 hover:text-[#4993f2] transition-all duration-300 group"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </button>

              {/* Enhanced Logo */}
              <Link to="/" className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4993f2] to-[#3b82f6] rounded-xl flex items-center justify-center text-white font-bold mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-lg">K</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-black text-gray-800 group-hover:text-[#4993f2] transition-colors duration-300">
                    Khis<span className="text-[#4993f2]">ima</span>
                  </span>
                  <div className="text-xs text-gray-500 font-medium -mt-1">Language Solutions</div>
                </div>
              </Link>

              {/* Enhanced Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {companyItems.filter(item => item.name !== "Contact").map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={getNavLinkClasses(item.path)}
                  >
                    {item.name}
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-[#4993f2] transition-all duration-300 ${
                      isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></div>
                  </Link>
                ))}
                
                {/* Enhanced Services Dropdown */}
                <div className="group relative">
                  <button className={getDropdownClasses(isServiceActive)}>
                    Services
                    <ChevronDownIcon />
                    {isServiceActive() && (
                      <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#4993f2]"></div>
                    )}
                  </button>
                  <div className="absolute left-0 mt-2 w-80 bg-white shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                        <IconApps size={18} className="mr-2" />
                        Our Services
                      </h3>
                    </div>
                    {displayedCategories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/services/${cat._id}`}
                        className={`flex items-center px-4 py-3 transition-all duration-300 group/item ${
                          isActive(`/services/${cat._id}`) 
                            ? 'text-[#4993f2] bg-blue-50 border-r-2 border-[#4993f2]' 
                            : 'text-gray-700 hover:bg-blue-50 hover:text-[#4993f2]'
                        }`}
                      >
                        {cat.iconSvg ? (
                          <div className="w-6 h-6 mr-3 group-hover/item:scale-110 transition-transform" dangerouslySetInnerHTML={{ __html: cat.iconSvg }} />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-3 group-hover/item:scale-110 transition-transform" />
                        )}
                        <div>
                          <div className="font-medium">{cat.title}</div>
                          <div className="text-xs text-gray-500">{cat.caption || 'Professional service'}</div>
                        </div>
                      </Link>
                    ))}
                    
                    {/* View All link - ALWAYS VISIBLE regardless of category count */}
                    <Link
                      to="/services"
                      className="flex items-center px-4 py-3 text-[#4993f2] hover:bg-blue-50 transition-all duration-300 border-t border-gray-100 group/item"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-[#4993f2] to-[#3b82f6] rounded-full mr-3 flex items-center justify-center text-white group-hover/item:scale-110 transition-transform">
                        <IconApps size={14} />
                      </div>
                      <div>
                        <div className="font-semibold">View All Services</div>
                        <div className="text-xs text-gray-500">
                          {categories.length > 0 ? `See all ${categories.length} services` : 'Browse all services'}
                        </div>
                      </div>
                      <IconChevronDown size={16} className="ml-auto transform rotate-90 text-gray-400" />
                    </Link>
                  </div>
                </div>

                <Link
                  to="/resources"
                  className={getNavLinkClasses("/resources")}
                >
                  Resources
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-[#4993f2] transition-all duration-300 ${
                    isActive("/resources") ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>

                <Link
                  to="/careers"
                  className={getNavLinkClasses("/careers")}
                >
                  Career
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-[#4993f2] transition-all duration-300 ${
                    isActive("/careers") ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>
              </nav>
            </div>

            {/* Right side - Language (mobile), Contact + CTA */}
            <div className="flex items-center space-x-4">
              <Link
                to="/contact"
                className={`hidden md:flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  isActive("/contact") 
                    ? 'text-[#4993f2] bg-blue-50' 
                    : 'text-gray-700 hover:text-[#4993f2]'
                }`}
              >
                <IconPhone size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                Contact
              </Link>
              <Link
                to="/login"
                className={`hidden md:flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  isActive("/login") 
                    ? 'text-[#4993f2] bg-blue-50' 
                    : 'text-gray-700 hover:text-[#4993f2]'
                }`}
              >
                <IconUser size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                Login
              </Link>
              <Link
                to="/get-quote"
                className="bg-gradient-to-r from-[#4993f2] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Get Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transition-all duration-500 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Enhanced Mobile Header */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4993f2] to-[#3b82f6] rounded-xl flex items-center justify-center text-white font-bold mr-3">
                  K
                </div>
                <div>
                  <span className="text-xl font-black text-gray-800">
                    Khis<span className="text-[#4993f2]">ima</span>
                  </span>
                  <div className="text-xs text-gray-500">Language Solutions</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Enhanced Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-6">
              {/* Company Section */}
              <div>
                <h3 className="text-gray-400 uppercase text-xs font-bold mb-3 flex items-center">
                  <IconCircleDottedLetterK size={16} className="mr-2" />
                  Company
                </h3>
                <div className="space-y-1">
                  {companyItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={getMobileNavClasses(item.path)}
                      onClick={handleLinkClick}
                    >
                      <span className="mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      {isActive(item.path) && (
                        <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Services Section - Collapsible */}
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 group text-gray-700 hover:bg-blue-50 hover:text-[#4993f2]"
                >
                  <div className="flex items-center">
                    <IconApps size={16} className="mr-2" />
                    <span className="text-sm font-semibold">Services</span>
                    {isServiceActive() && (
                      <div className="ml-2 w-2 h-2 bg-[#4993f2] rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <IconChevronRight 
                    size={16} 
                    className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-90' : ''}`} 
                  />
                </button>

                {/* Services dropdown content - hidden by default */}
                {mobileServicesOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {/* Display categories (max 3) */}
                    {displayedCategories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/services/${cat._id}`}
                        className={getMobileNavClasses(`/services/${cat._id}`, true)}
                        onClick={handleLinkClick}
                      >
                        {cat.iconSvg ? (
                          <div className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" dangerouslySetInnerHTML={{ __html: cat.iconSvg }} />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-3 group-hover:scale-110 transition-transform" />
                        )}
                        <div>
                          <div className="font-medium">{cat.title}</div>
                          <div className="text-xs text-gray-500">{cat.caption || 'Professional service'}</div>
                        </div>
                        {isActive(`/services/${cat._id}`) && (
                          <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                        )}
                      </Link>
                    ))}
                    
                    {/* View All link - ALWAYS VISIBLE */}
                    <Link
                      to="/services"
                      className="flex items-center py-2 px-3 rounded-lg transition-all duration-300 text-[#4993f2] hover:bg-blue-50 border border-blue-200"
                      onClick={handleLinkClick}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-[#4993f2] to-[#3b82f6] rounded-full mr-3 flex items-center justify-center text-white">
                        <IconApps size={14} />
                      </div>
                      <div>
                        <div className="font-semibold">View All Services</div>
                        <div className="text-xs text-blue-400">
                          {categories.length > 0 ? `See all ${categories.length} services` : 'Browse all services'}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Other Links */}
              <div className="space-y-1">
                <Link
                  to="/resources"
                  className={getMobileNavClasses("/resources")}
                  onClick={handleLinkClick}
                >
                  <IconBook size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">Resources</div>
                    <div className="text-xs text-gray-500">Learning materials</div>
                  </div>
                  {isActive("/resources") && (
                    <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                  )}
                </Link>

                <Link
                  to="/careers"
                  className={getMobileNavClasses("/careers")}
                  onClick={handleLinkClick}
                >
                  <IconBriefcase size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium">Career</div>
                    <div className="text-xs text-gray-500">Join our team</div>
                  </div>
                  {isActive("/careers") && (
                    <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                  )}
                </Link>
              </div>

              {/* Mobile Language Section */}
              <div>
                <h3 className="text-gray-400 uppercase text-xs font-bold mb-3 flex items-center">
                  <IconLanguage size={16} className="mr-2" />
                  Language
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setMobileLangOpen(!mobileLangOpen)}
                    className="w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 group text-gray-700 hover:bg-blue-50 hover:text-[#4993f2]"
                  >
                    <GlobeIcon />
                    <div className="ml-3 flex-1">
                      <div className="font-medium flex items-center">
                        <span className="mr-2">{currentLang.flag}</span>
                        {currentLang.name}
                      </div>
                      <div className="text-xs text-gray-500">Change language</div>
                    </div>
                    <IconChevronDown size={16} className={`transition-transform duration-200 ${mobileLangOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {mobileLangOpen && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang)}
                          className={`w-full flex items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                            currentLang.code === lang.code 
                              ? 'text-[#4993f2] bg-blue-50 border border-blue-200' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-[#4993f2]'
                          }`}
                        >
                          <span className="text-lg mr-3">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                          {currentLang.code === lang.code && (
                            <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* Enhanced Mobile Footer */}
            <div className="mt-auto pt-6 border-t border-gray-200 space-y-4">
              <Link
                to="/get-quote"
                className="block w-full bg-gradient-to-r from-[#4993f2] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#2563eb] text-white px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleLinkClick}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Get Free Quote</span>
                </div>
              </Link>
              
              {/* Enhanced Contact info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                  <IconPhone size={16} className="mr-2" />
                  Quick Contact
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center hover:text-[#4993f2] transition-colors">
                    <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Rwanda, Kigali</span>
                  </div>
                  <div className="flex items-center hover:text-[#4993f2] transition-colors">
                    <PhoneIcon className="h-4 w-4 mr-2 text-green-500" />
                    <span>+250 786 208 015</span>
                  </div>
                  <div className="flex items-center hover:text-[#4993f2] transition-colors">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-purple-500" />
                    <span>info@khisima.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;