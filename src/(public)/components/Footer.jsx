import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from './ModeToggle';
import { 
  Globe, 
  Languages, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  ArrowRight,
  Heart,
  ExternalLink
} from 'lucide-react';
import {Link} from 'react-router-dom';

const Footer = () => {
  const services = [
    "Translation & Localization",
    "NLP Data Services",
    "AI Language Consulting",
    "Cultural Adaptation",
    "Voice-over & Dubbing",
    "Multilingual SEO"
  ];

  const languages = [
    "English",
    "French",
    "Kinyarwanda",
    "Amharic",
    "Luganda",
    "Swahili",
    "Chewa",
    "Worof",
    "Oromo"
  ];

  const quickLinks = [
    { name: "About Us", href: "about-us" },
    { name: "Our Services", href: "services" },
    { name: "Our Mission", href: "#mission" },
    { name: "Countries of Operation", href: "workplace" },
    { name: "Contact", href: "contact" },
    { name: "Get Quote", href: "quote" }
  ];

  const socialLinks = [
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
     <div
  className="border-b border-gray-800"
  style={{ background: 'linear-gradient(135deg, #3a7acc 0%, #2563eb 100%)' }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
    <div className="text-center max-w-3xl">
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
        Stay Connected with African Language Innovation
      </h3>
      <p className="text-lg mb-6 opacity-90 text-white">
        Get updates on African language technology, industry insights, and our latest projects.
      </p>

      {/* Centered Input + Button */}
      <div className="flex w-full max-w-sm items-center gap-2 mx-auto">
        <Input
          type="email"
          placeholder="Email"
          className="flex-1 px-4 py-3 rounded-l-xl
                     border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                     focus:border-blue-400 dark:focus:border-blue-500
                     transition-all duration-300"
              />

              <Button
                type="submit"
                variant="outline"
                className="px-5 py-3 rounded-r-xl
                          bg-blue-600 text-white
                          hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                          shadow-md hover:shadow-lg
                          flex items-center justify-center
                          transition-all duration-300"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 sm:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="w-8 h-8" style={{ color: '#3a7acc' }} />
              <span className="text-2xl font-bold">Khisima</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              Bringing African languages into the heart of the digital world. We amplify African voices in global systems through expert language services and NLP data solutions.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" style={{ color: '#3a7acc' }} />
                <span className="text-gray-400">Kigali, Rwanda</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" style={{ color: '#3a7acc' }} />
                <span className="text-gray-400">info@khisima.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" style={{ color: '#3a7acc' }} />
                <span className="text-gray-400">+250 789 619 370</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="text-xs px-3 py-1" style={{ backgroundColor: '#3a7acc', color: 'white' }}>
                <Languages className="w-3 h-3 mr-1" />
                6+ Languages
              </Badge>
              <Badge className="text-xs px-3 py-1" style={{ backgroundColor: '#3a7acc', color: 'white' }}>
                <Globe className="w-3 h-3 mr-1" />
                Global Reach
              </Badge>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <div className="w-1 h-6 mr-3" style={{ backgroundColor: '#3a7acc' }}></div>
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: '#3a7acc' }} />
                    <span className="group-hover:ml-1 transition-all duration-200">{service}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <div className="w-1 h-6 mr-3" style={{ backgroundColor: '#3a7acc' }}></div>
              Languages We Support
            </h4>
            <ul className="space-y-3">
              {languages.map((language, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3a7acc' }}></div>
                  <span className="text-gray-400">{language}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                + Many more African languages
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <div className="w-1 h-6 mr-3" style={{ backgroundColor: '#3a7acc' }}></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: '#3a7acc' }} />
                    <span className="group-hover:ml-1 transition-all duration-200">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>&copy; {new Date().getFullYear()} Khisima. All rights reserved.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-400 mr-4">Follow us:</span>
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  to={social.href}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200 hover:scale-110 group"
                  aria-label={social.name}
                >
                  {React.cloneElement(social.icon, {
                    className: "w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200",
                    style: { color: '#3a7acc' }
                  })}
                </Link>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <span className="text-gray-600">•</span>
              <Link to ="/careers" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                Careers <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {/* theme */}
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Theme: </span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;