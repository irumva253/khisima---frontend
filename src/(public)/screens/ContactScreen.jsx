/* eslint-disable no-unused-vars */
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
  ClockIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  
} from "react-icons/fa";
import DynamicText from "@/components/kokonutui/dynamic-text";

// Enhanced African symbols with Google Translate and Rwanda flag representation
const africanSymbols = ["🗣️", "📜", "🖤", "🌍", "🔷", "🟧", "🎭", "🏺", "🌿", "⭐", "🔤", "🇷🇼", "🌐", "📖", "💬", "🎨"]; 

const ContactScreen = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-yellow-50 relative overflow-hidden">

      {/* African-inspired geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-blue-500 rotate-45 animate-spin-slow"></div>
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
              <span className="text-blue-400">•</span>
              <span className="text-blue-700 font-bold flex items-center space-x-1">
                <span><PhoneIcon className="w-4 h-4" /></span>
                <span>Contact</span>
              </span>
            </div>
          </nav>

          {/* Main heading with cultural flair */}
          <div className="relative mb-8">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <LanguageIcon className="w-12 h-12 text-blue-400 animate-bounce-gentle" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 mb-4 leading-tight">
              Muraho!
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Connect with Khisima
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8"> 
              <span className="font-semibold text-orange-700">"Muraho"</span> means{" "}
              "<DynamicText />" in Kinyarwanda. 
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

      {/* Contact us form main section */}

      {/* Contact Form Section */}
      <section className="relative z-10 py-16 px-4 -mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form - Left Side */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden 
              animate-slide-in-up hover:scale-[1.02] transition-transform duration-500">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                  <ChatBubbleLeftRightIcon className="w-8 h-8" />
                  <span>Let's Talk</span>
                </h2>
                <p className="text-blue-100 mt-2">Share your thoughts with us in any language</p>
              </div>
              
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                        <span>First Name</span>
                      </label>
                      <Input 
                        placeholder="Your first name" 
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span>Last Name</span>
                      </label>
                      <Input 
                        placeholder="Your last name" 
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                      <span>Email Address</span>
                    </label>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-blue-600" />
                      <span>Phone Number</span>
                    </label>
                    <Input 
                      type="tel" 
                      placeholder="+250 xxx xxx xxx" 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Preferred Language */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                      <LanguageIcon className="w-4 h-4 text-blue-600" />
                      <span>Preferred Language</span>
                    </label>
                    <select 
                      id="languageSelect"
                      onChange={(e) => {
                        const otherInput = document.getElementById("otherLanguageInput");
                        if (e.target.value === "Other") {
                          otherInput.classList.remove("hidden");
                        } else {
                          otherInput.classList.add("hidden");
                        }
                      }}
                      className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300 px-4 bg-white"
                    >
                      <option>English</option>
                      <option>Kinyarwanda</option>
                      <option>French</option>
                      <option>Swahili</option>
                      <option>Other</option>
                    </select>

                    {/* Input appears if Other selected */}
                    <Input
                      id="otherLanguageInput"
                      placeholder="Enter your language"
                      className="mt-3 h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300 hidden"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                      <SparklesIcon className="w-4 h-4 text-blue-600" />
                      <span>Your Message</span>
                    </label>
                    <Textarea 
                      placeholder="Tell us about your project, questions, or how we can help you..." 
                      rows={5}
                      className="border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300 resize-none"
                    />
                  </div>
                  
                  <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 
                    hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl 
                    transition-all duration-300 transform hover:scale-105 shadow-lg animate-scale-in">
                    <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information - Right Side */}
            <div className="space-y-8">
              
              {/* Contact Details */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-xl rounded-3xl 
                overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-transform duration-500 animate-slide-in-right"
                style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                    <MapPinIcon className="w-6 h-6 text-blue-600" />
                    <span>Get in Touch</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Location */}
                    <a href="https://maps.google.com/?q=Kigali,Rwanda" target="_blank" rel="noreferrer"
                      className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl transition-transform transform hover:scale-[1.02] hover:shadow-md">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <MapPinIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Our Location</h4>
                        <p className="text-gray-600">Kigali, Rwanda</p>
                        <p className="text-sm text-gray-500">East Africa's Silicon Valley</p>
                      </div>
                    </a>

                    {/* Email */}
                    <a href="mailto:hello@khisima.com"
                      className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl transition-transform transform hover:scale-[1.02] hover:shadow-md">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Email Us</h4>
                        <p className="text-gray-600">hello@khisima.com</p>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </a>

                    {/* Phone */}
                    <a href="tel:+250788123456"
                      className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl transition-transform transform hover:scale-[1.02] hover:shadow-md">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <PhoneIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Call Us</h4>
                        <p className="text-gray-600">+250 788 123 456</p>
                        <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM (CAT)</p>
                      </div>
                    </a>

                    {/* Business Hours */}
                    <div className="flex items-start space-x-4 p-4 bg-white/70 rounded-xl transition-transform transform hover:scale-[1.02] hover:shadow-md">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <ClockIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Business Hours</h4>
                        <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                        <p className="text-sm text-gray-500">Central Africa Time (CAT)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-xl rounded-3xl 
                overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-transform duration-500 animate-slide-in-right"
                style={{ animationDelay: "0.4s" }}>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                    <HeartIcon className="w-6 h-6 text-blue-600" />
                    <span>Why Choose Khisima?</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-700">Native African language expertise</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-700">Cultural sensitivity & authenticity</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-700">24/7 multilingual support</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-700">Technology meets tradition</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

     {/* Social Media & Additional Sections */}
      <section className="relative z-10 py-16 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          
          {/* Social Media Section */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-3">
              <GlobeAltIcon className="w-8 h-8 text-blue-600" />
              <span>Connect with Us</span>
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Follow our journey as we bridge cultures and languages across Africa and beyond
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 px-4">
              {[
                { icon: FaTwitter, color: "bg-gray-800 hover:bg-gray-900", label: "X (Twitter)" },
                { icon: FaFacebookF, color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
                { icon: FaLinkedinIn, color: "bg-blue-700 hover:bg-blue-800", label: "LinkedIn" },
                { icon: FaInstagram, color: "bg-pink-500 hover:bg-pink-600", label: "Instagram" },
                { icon: FaWhatsapp, color: "bg-green-500 hover:bg-green-600", label: "WhatsApp" },
                { icon: FaTelegram, color: "bg-blue-500 hover:bg-blue-600", label: "Telegram" },
              ].map(({ icon: Icon, color, label }) => (
                <button
                  key={label}
                  className={`${color} p-3 sm:p-4 rounded-full text-white text-lg sm:text-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl animate-scale-in`}
                  style={{ animationDelay: `${Math.random() * 0.5}s` }}
                  title={label}
                >
                  <Icon />
                </button>
              ))}
            </div>
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