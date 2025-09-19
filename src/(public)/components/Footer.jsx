
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCreateSubscriberMutation } from '@/slices/subscriberApiSlice';
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
  ExternalLink,
  ArrowUp,
  Loader2
} from 'lucide-react';
import { IconBrandX, IconCircleChevronUp } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import KhismaAiAgent from './KhismaAiAgent';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Newsletter subscription mutation
  const [createSubscriber, { isLoading: isSubscribing }] = useCreateSubscriberMutation();



  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createSubscriber({
        email: email.toLowerCase().trim(),
        preferences: {
          frequency: 'weekly',
          topics: ['language-tech', 'company-updates']
        }
      }).unwrap();

      toast.success(result.message || 'Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      if (error.status === 409) {
        toast.info('You\'re already subscribed to our newsletter!');
      } else if (error.status === 429) {
        toast.error('Too many attempts. Please try again later.');
      } else {
        toast.error(error?.data?.message || 'Failed to subscribe. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    "Translation & Localization",
    "Language Data Services",
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
    { name: "About Us", href: "/about-us" },
    { name: "Our Services", href: "/services" },
    { name: "Our Mission", href: "/#mission" },
    { name: "Countries of Operation", href: "/workplace" },
    { name: "Contact", href: "/contact" },
    { name: "Get Quote", href: "/quote" }
  ];

  const socialLinks = [
    { name: "X", icon: <IconBrandX className="w-5 h-5" />, href: "https://x.com/Khisima_lsp?t=TZlhsibDZZZPKSjhqTiEzA&s=09" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/khisima/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3B%2FwevVHPPRviJQYMgTP2Dcw%3D%3D" },
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/profile.php?id=61580147190413" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/khisima_lsp/" }
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
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

           <form 
            onSubmit={handleNewsletterSubmit} 
            className="flex w-full max-w-sm items-center gap-2 mx-auto"
          >
            <div className="relative flex-1">
              <Mail 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 
                          text-gray-400 transition-colors duration-300
                          peer-focus:text-blue-500 peer-hover:text-blue-500" 
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isSubscribing}
                className="peer !pl-12 pr-4 py-3 rounded-l-xl
                          border border-gray-300 dark:border-gray-700
                          bg-white dark:bg-gray-800
                          text-gray-900 dark:text-white
                          placeholder-gray-400 dark:placeholder-gray-300
                          focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                          focus:border-blue-400 dark:focus:border-blue-500
                          transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isSubscribing || !email}
              className="px-5 py-3 rounded-r-xl
                        bg-blue-600 text-white
                        hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                        shadow-md hover:shadow-lg
                        flex items-center justify-center
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        min-w-[100px]"
            >
              {isSubmitting || isSubscribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>

          {/* Privacy Notice */}
          <p className="text-xs text-white opacity-75 mt-3 max-w-md mx-auto">
              By subscribing, you agree to receive our newsletter and accept our{' '}
              <Link to="/privacy-policy" className="underline hover:no-underline">
                Privacy Policy
              </Link>
              . You can unsubscribe at any time.
            </p>
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
                <a href="mailto:info@khisima.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                  info@khisima.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" style={{ color: '#3a7acc' }} />
                <a href="tel:+250789619370" className="text-gray-400 hover:text-white transition-colors duration-200">
                  +250 789 619 370
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="text-xs px-3 py-1" style={{ backgroundColor: '#3a7acc', color: 'white' }}>
                <Languages className="w-3 h-3 mr-1" />
                9+ Languages
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
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: '#3a7acc' }} />
                    <span className="group-hover:ml-1 transition-all duration-200">{service}</span>
                  </Link>
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
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: '#3a7acc' }} />
                    <span className="group-hover:ml-1 transition-all duration-200">{link.name}</span>
                  </Link>
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
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>&copy; {new Date().getFullYear()} Khisima. All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-400 mr-4">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200 hover:scale-110 group"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {React.cloneElement(social.icon, {
                    className: "w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200",
                    style: { color: '#3a7acc' }
                  })}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/careers" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
                Careers <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

     {/* Ai Agent */}
     <KhismaAiAgent />
    </footer>
  );
};

export default Footer;
