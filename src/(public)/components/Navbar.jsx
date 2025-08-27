/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { 
  IconPhone,
  IconApps,
  IconLanguage,
  IconHome,
  IconInfoSquareRounded,
  IconCircleDottedLetterK,     
  IconUser
} from '@tabler/icons-react';

import {Link, useLocation} from 'react-router-dom';
import {
  useGetServiceCategoriesQuery,
} from "@/slices/serviceCategoriesSlice"


// Enhanced SVG Icons with better styling
const MapPinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const EnvelopeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { data: categoriesData, isLoading, isError } = useGetServiceCategoriesQuery();
  const categories = categoriesData?.data || [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
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

  // Helper function to check if any language page is active
  const isLanguageActive = () => {
    return location.pathname.startsWith('/languages');
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
  const getMobileNavClasses = (path, isService = false, isLanguage = false) => {
    const baseClasses = "flex items-center py-3 px-4 rounded-xl transition-all duration-300 group";
    
    let isCurrentActive = false;
    if (isService) {
      isCurrentActive = isServiceActive() && isActive(path);
    } else if (isLanguage) {
      isCurrentActive = isActive(path);
    } else {
      isCurrentActive = isActive(path);
    }
    
    if (isCurrentActive) {
      return `${baseClasses} text-[#4993f2] bg-blue-50 shadow-sm border border-blue-200`;
    }
    
    return `${baseClasses} text-gray-700 hover:bg-blue-50 hover:text-[#4993f2]`;
  };

  // Organized menu items with icons and descriptions
  const companyItems = [
    { name: "Home", path: "/", icon: <IconHome stroke={2} />, desc: "Back to homepage" },
    { name: "About Us", path: "/about-us", icon: <IconInfoSquareRounded stroke={2} />, desc: "Our story & mission" },
    { name: "Contact", path: "/contact", icon: <IconPhone stroke={2} />, desc: "Get in touch" },
  ];


  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "shadow-2xl" : ""}`}>
      {/* Enhanced Top Navigation Bar */}
      <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 text-white py-3 px-4 text-sm hidden lg:block relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4993f2]/10 via-transparent to-[#4993f2]/10 animate-pulse"></div>
        <div className="container mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center hover:text-blue-300 transition-colors duration-300 group">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-blue-500/30 transition-colors">
                <MapPinIcon className="h-4 w-4 text-blue-300" />
              </div>
              <span className="font-medium">123 Language St, Kigali, Rwanda</span>
            </div>
            <div className="flex items-center hover:text-green-300 transition-colors duration-300 group">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-green-500/30 transition-colors">
                <PhoneIcon className="h-4 w-4 text-green-300" />
              </div>
              <span className="font-medium">+250 700 123 456</span>
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
          </div>
        </div>
      </div>

      {/* Enhanced Main Navigation Bar */}
      <div className={`bg-white/95 backdrop-blur-md transition-all duration-500 border-b border-gray-100 ${
        scrolled ? "py-3 shadow-lg" : "py-5"
      }`}>
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
                
                {/* Enhanced  Solutions & Services Dropdown */}
                <div className="group relative">
                  <button className={getDropdownClasses(isServiceActive)}>
                    Solutions
                    <ChevronDownIcon />
                    {isServiceActive() && (
                      <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#4993f2]"></div>
                    )}
                  </button>
                  <div className="absolute left-0 mt-2 w-80 bg-white shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                        <span className="text-lg mr-2"><IconApps stroke={1} /></span>
                        Our Solutions
                      </h3>
                    </div>
                    {categories.map((cat) => (
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
                  </div>
                </div>

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
                        <span className="text-lg mr-2"><IconApps stroke={1} /></span>
                        Our Services
                      </h3>
                    </div>
                    {categories.map((cat) => (
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
                  to="/career"
                  className={getNavLinkClasses("/career")}
                >
                  Career
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-[#4993f2] transition-all duration-300 ${
                    isActive("/career") ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>

                
              </nav>
            </div>

            {/* Right side - Contact + CTA */}
            <div className="flex items-center space-x-4">
              <Link
                to="/contact"
                className={`hidden md:flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  isActive("/contact") 
                    ? 'text-[#4993f2] bg-blue-50' 
                    : 'text-gray-700 hover:text-[#4993f2]'
                }`}
              >
                <span className="mr-2 group-hover:scale-110 transition-transform"><IconPhone stroke={2} /></span>
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
                <span className="mr-2 group-hover:scale-110 transition-transform"><IconUser stroke={2} /></span>
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
                  <span className="mr-2"><IconCircleDottedLetterK stroke={2} /></span>
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
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
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

              {/* Services Section */}
              <div>
                <h3 className="text-gray-400 uppercase text-xs font-bold mb-3 flex items-center">
                  <span className="mr-2"><IconApps stroke={1}/></span>
                  Services
                  {isServiceActive() && (
                    <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full animate-pulse"></div>
                  )}
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
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
                </div>
              </div>

              {/* Other Links */}
              <div className="space-y-1">
                <Link
                  to="/resources"
                  className={getMobileNavClasses("/resources")}
                  onClick={handleLinkClick}
                >
                  <span className="text-lg mr-3 group-hover:scale-110 transition-transform">⚙️</span>
                  <div>
                    <div className="font-medium">Resources</div>
                    <div className="text-xs text-gray-500">Our resources</div>
                  </div>
                  {isActive("/resources") && (
                    <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                  )}
                </Link>

                <Link
                  to="/career"
                  className={getMobileNavClasses("/career")}
                  onClick={handleLinkClick}
                >
                  <span className="text-lg mr-3 group-hover:scale-110 transition-transform">👔</span>
                  <div>
                    <div className="font-medium">Career</div>
                    <div className="text-xs text-gray-500">Join our team</div>
                  </div>
                  {isActive("/career") && (
                    <div className="ml-auto w-2 h-2 bg-[#4993f2] rounded-full"></div>
                  )}
                </Link>
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
                  <span className="mr-2">📞</span>
                  Quick Contact
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center hover:text-[#4993f2] transition-colors">
                    <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span>123 Language St, Kigali</span>
                  </div>
                  <div className="flex items-center hover:text-[#4993f2] transition-colors">
                    <PhoneIcon className="h-4 w-4 mr-2 text-green-500" />
                    <span>+250 700 123 456</span>
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
    </header>
  );
};

export default Navbar;