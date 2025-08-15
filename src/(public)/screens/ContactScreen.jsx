import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  LanguageIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";

// Enhanced African symbols with Google Translate and Rwanda flag representation
const africanSymbols = ["🗣️", "📜", "🖤", "🌍", "🔷", "🟧", "🎭", "🏺", "🌿", "⭐", "🔤", "🇷🇼", "🌐", "📖", "💬", "🎨"]; 

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Message submitted:", formData);
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after success message
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: <MapPinIcon className="w-10 h-10" />,
      title: "Visit Us",
      description: "123 Language Street, Kigali, Rwanda",
      subtext: "East Africa Hub",
      color: "emerald",
      pattern: "🌍"
    },
    {
      icon: <PhoneIcon className="w-10 h-10" />,
      title: "Call Us",
      description: "+250 700 123 456",
      subtext: "24/7 Support",
      color: "blue",
      pattern: "📞"
    },
    {
      icon: <EnvelopeIcon className="w-10 h-10" />,
      title: "Email Us",
      description: "info@khisima.com",
      subtext: "Quick Response",
      color: "purple",
      pattern: "✉️"
    },
    {
      icon: <GlobeAltIcon className="w-10 h-10" />,
      title: "Online",
      description: "www.khisima.com",
      subtext: "Digital Services",
      color: "orange",
      pattern: "🌐"
    },
  ];

  const socialLinks = [
    { Icon: FaTwitter, color: "bg-blue-500 hover:bg-blue-600", name: "Twitter", handle: "@khisima" },
    { Icon: FaFacebookF, color: "bg-blue-700 hover:bg-blue-800", name: "Facebook", handle: "/khisima" },
    { Icon: FaLinkedinIn, color: "bg-blue-600 hover:bg-blue-700", name: "LinkedIn", handle: "/company/khisima" },
    { Icon: FaInstagram, color: "bg-pink-500 hover:bg-pink-600", name: "Instagram", handle: "@khisima" },
    { Icon: FaWhatsapp, color: "bg-green-500 hover:bg-green-600", name: "WhatsApp", handle: "+250 700 123" },
    { Icon: FaTelegram, color: "bg-blue-400 hover:bg-blue-500", name: "Telegram", handle: "@khisima" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative overflow-hidden">
      
      {/* African-inspired geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-orange-500 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-4 border-red-500 rounded-full animate-pulse-gentle"></div>
        <div className="absolute bottom-40 left-40 w-28 h-28 border-4 border-yellow-500 rotate-12 animate-bounce-subtle"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 border-4 border-green-500 rounded-full rotate-45 animate-spin-reverse"></div>
      </div>

      {/* Floating cultural symbols */}
      <div className="absolute w-full h-full pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => {
          const symbol = africanSymbols[Math.floor(Math.random() * africanSymbols.length)];
          return (
            <div
              key={`symbol-${i}`}
              className="absolute text-3xl opacity-20 animate-float-cultural"
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                color: ['#f97316', '#dc2626', '#eab308', '#16a34a', '#3b82f6'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${12 + Math.random() * 8}s`,
              }}
            >
              {symbol}
            </div>
          );
        })}
      </div>

      {/* Hero Section with African Pattern */}
      <section className="relative z-10 text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb with African styling */}
          <nav className="text-sm text-gray-600 mb-8">
            <div className="flex justify-center items-center space-x-3">
              <a href="/" className="hover:text-orange-600 transition-colors font-medium flex items-center space-x-1">
                <span>🏠</span>
                <span>Home</span>
              </a>
              <span className="text-orange-400">•</span>
              <span className="text-orange-700 font-bold flex items-center space-x-1">
                <span>📞</span>
                <span>Contact</span>
              </span>
            </div>
          </nav>

          {/* Main heading with cultural flair */}
          <div className="relative mb-8">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <LanguageIcon className="w-12 h-12 text-orange-400 animate-bounce-gentle" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 mb-4 leading-tight">
              Muraho!
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Connect with Khisima
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            <span className="font-semibold text-orange-700">"Muraho"</span> means "Hello" in Kinyarwanda. 
            We're passionate about bridging cultures through language, bringing African voices to the digital world. 
            Let's start a conversation that transcends borders.
          </p>

          <div className="flex justify-center space-x-6 text-4xl mb-8">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🇷🇼</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌍</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>💬</span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🔤</span>
          </div>
        </div>
      </section>

      {/* Contact Methods - Clean Modern Style */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactMethods.map((method, i) => (
            <div 
              key={i}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 animate-slide-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4993f2] to-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-700 font-medium mb-1">{method.description}</p>
                <p className="text-sm text-[#4993f2] font-medium bg-blue-50 px-3 py-1 rounded-full">
                  {method.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content - Improved Layout */}
      <section className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Contact Form - Full Width */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#4993f2] to-[#3b82f6] p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Let's Start a Conversation</h2>
                  <p className="text-blue-100">Share your language needs with us</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {submitted ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center animate-scale-in">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Murakoze! (Thank you!)</h3>
                  <p className="text-green-700 text-lg">Your message has been received. We'll respond within 24 hours.</p>
                  <div className="flex justify-center mt-4 space-x-2 text-2xl">
                    <span>🙏</span>
                    <span>✨</span>
                    <span>🌍</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <span>👤</span>
                        <span>Full Name</span>
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-[#4993f2] rounded-xl transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <span>📧</span>
                        <span>Email Address</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-[#4993f2] rounded-xl transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <span>📝</span>
                        <span>Subject</span>
                      </label>
                      <Input
                        placeholder="What would you like to discuss?"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-[#4993f2] rounded-xl transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Message and Submit */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                        <span>💬</span>
                        <span>Message</span>
                      </label>
                      <Textarea
                        placeholder="Tell us about your language service needs, project details, or any questions you have..."
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={8}
                        className="border-2 border-gray-200 focus:border-[#4993f2] rounded-xl transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                      />
                    </div>
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full h-14 bg-[#4993f2] hover:bg-[#3b82f6] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Send Message</span>
                          <span>🚀</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid - Map and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <span>📍</span>
                  <span>Visit Our Office in Kigali</span>
                </h3>
                <p className="text-gray-600 mt-1">The Heart of Africa</p>
              </div>
              <div className="h-80 relative group">
                <iframe
                  title="Kigali Map"
                  src="https://maps.google.com/maps?q=kigali,%20rwanda&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 transition-all duration-300"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Info - 1/3 width */}
          <div className="space-y-8">
            
            {/* Social Media - Simple List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <span>🌐</span>
                <span>Follow Us</span>
              </h3>
              <div className="space-y-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center justify-between p-3 hover:bg-[#4993f2] hover:text-white rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <social.Icon className="w-5 h-5 text-[#4993f2] group-hover:text-white transition-colors" />
                      <span className="font-medium">{social.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 group-hover:text-blue-100">{social.handle}</span>
                  </a>
                ))}
              </div>
            </div>

          <br/>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 25s linear infinite;
        }

        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        @keyframes float-cultural {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0.2; }
          25% { transform: translate(20px, -20px) rotate(90deg) scale(1.1); opacity: 0.3; }
          50% { transform: translate(0, -40px) rotate(180deg) scale(0.9); opacity: 0.2; }
          75% { transform: translate(-20px, -20px) rotate(270deg) scale(1.05); opacity: 0.25; }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); opacity: 0.2; }
        }
        .animate-float-cultural {
          animation: float-cultural 15s ease-in-out infinite;
        }

        @keyframes slide-in-up {
          0% { 
            opacity: 0; 
            transform: translateY(40px);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out forwards;
        }

        @keyframes slide-in-right {
          0% { 
            opacity: 0; 
            transform: translateX(20px);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        @keyframes scale-in {
          0% { 
            opacity: 0; 
            transform: scale(0.9);
          }
          100% { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Enhanced focus states */
        input:focus, textarea:focus {
          border-color: #4993f2 !important;
          box-shadow: 0 0 0 3px rgba(73, 147, 242, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default ContactScreen;