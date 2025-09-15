import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, FileText, Database, Users, CheckCircle, ArrowRight, Play, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import CTA from '../components/CTA';
import Partners from '../components/Partners';

const HomeScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const carouselImages = [
    {
      title: "Multilingual Rwanda",
      subtitle: "Where 6+ languages coexist",
      description: " From Africa for African Culture, experience the linguistic diversity",
      image: "https://c4.wallpaperflare.com/wallpaper/258/633/113/linguistics-vowels-international-phonetic-alphabet-languages-wallpaper-preview.jpg"
    },
    {
      title: "Digital Innovation",
      subtitle: "Technology meets tradition",
      description: "Bridging linguistic heritage with modern AI innovations",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80"
    },
    {
      title: "Global Impact",
      subtitle: "African voices worldwide",
      description: "Making 2,000+ African languages accessible to the world",
      image: "https://c1.wallpaperflare.com/preview/344/661/119/fountain-writing-pen-dictionary.jpg"
    }
  ];

  const services = [
    {
      category: "Language Services",
      icon: <Languages className="w-6 h-6" />,
      items: [
        "Translation & Localization",
        "Interpretation Services", 
        "Transcription & Subtitling",
        "Back Translation & LQA",
        "Editing & Proofreading",
        "Cultural Consulting",
        "Content Creation",
        "Voice-over & Dubbing"
      ]
    },
    {
      category: "Language data services",
      icon: <Database className="w-6 h-6" />,
      items: [
        "Text and Speech Data Collection",
        "Language Data Collection",
        "Corpus Development", 
        "Annotation & Labeling",
        "Prompt Creation",
        "Manual Quality Review"
      ]
    },
    {
      category: "Additional Services",
      icon: <FileText className="w-6 h-6" />,
      items: [
        "Machine Translation Post-Editing",
        "Language Consulting for AI",
        "Multilingual SEO Support",
        "Terminology Management"
      ]
    }
  ];

  const stats = [
    { number: "2,000+", label: "African Languages" },
    { number: "6+", label: "Languages in Rwanda" },
    { number: "100%", label: "Quality Focused" },
    { number: "24/7", label: "Global Reach" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
          opacity: 0;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          {carouselImages.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              
              <div className="animate-fade-in-up animation-delay-300">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  African Words,<br />
                  <span className="text-blue-300 animate-pulse">Global Reach</span>
                </h1>
              </div>
              <div className="animate-fade-in-up animation-delay-600">
                <p className="text-xl mb-2 max-w-3xl mx-auto leading-relaxed opacity-90">
                  {carouselImages[currentSlide].description}
                </p>
                <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed opacity-80">
                 We empower African voices through high-quality translation, localization, interpretation, and language data services.
                </p>
              </div>
              <div className="animate-fade-in-up animation-delay-900 flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
              <Link
                to="/quote"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full 
                          bg-gradient-to-r from-blue-600 to-blue-700 
                          px-8 py-3 text-lg font-semibold text-white 
                          shadow-lg shadow-blue-500/30 
                          transition-all duration-300 
                          hover:scale-105 hover:shadow-blue-500/50"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/about-us"
                className="group inline-flex items-center justify-center gap-2 rounded-full 
                          border-2 border-white 
                          px-8 py-3 text-lg font-semibold text-white 
                          shadow-md 
                          transition-all duration-300 
                          hover:bg-white hover:text-blue-600 hover:scale-105"
              >
                <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Learn More
              </Link>
            </div>

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`group hover-lift ${isVisible.stats ? 'animate-bounce-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#3a7acc' }}>
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`${isVisible.about ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <Badge className="mb-4" style={{ backgroundColor: '#3a7acc', color: 'white' }}>
                About Khisima
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                At the crossroads of language, culture, and technology
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Born in one of Africa's most multilingual nations where Kinyarwanda, English, French, Lingala, Luganda, and Swahili live side by side, Khisima understands the power of linguistic diversity.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: '#3a7acc' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">We don't just translate, we empower</h3>
                    <p className="text-gray-600 dark:text-gray-400">Combining linguistic expertise with cultural intelligence</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: '#3a7acc' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white"> We don’t just interpret — we connect.</h3>
                    <p className="text-gray-600 dark:text-gray-400">Strengthening representation for underserved languages.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <CheckCircle className="w-6 h-6 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: '#3a7acc' }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">We protect Africa’s stories and traditions.</h3>
                    <p className="text-gray-600 dark:text-gray-400">Keeping Africa’s cultural legacy alive and vibrant.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative ${isVisible.about ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-8 rounded-2xl hover:shadow-2xl transition-all duration-500">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover-lift hover:shadow-lg transition-all duration-300">
                    <Languages className="w-8 h-8 mx-auto mb-3 animate-bounce" style={{ color: '#3a7acc' }} />
                    <div className="font-semibold text-gray-900 dark:text-white">6+ Languages</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">In Rwanda</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover-lift hover:shadow-lg transition-all duration-300">
                    <Globe className="w-8 h-8 mx-auto mb-3 animate-bounce" style={{ color: '#3a7acc', animationDelay: '0.2s' }} />
                    <div className="font-semibold text-gray-900 dark:text-white">Global Reach</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Worldwide Impact</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover-lift hover:shadow-lg transition-all duration-300">
                    <Users className="w-8 h-8 mx-auto mb-3 animate-bounce" style={{ color: '#3a7acc', animationDelay: '0.4s' }} />
                    <div className="font-semibold text-gray-900 dark:text-white">Expert Team</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Native Speakers</div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover-lift hover:shadow-lg transition-all duration-300">
                    <Database className="w-8 h-8 mx-auto mb-3 animate-bounce" style={{ color: '#3a7acc', animationDelay: '0.6s' }} />
                    <div className="font-semibold text-gray-900 dark:text-white">AI Ready</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Language Data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${isVisible.mission ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Badge className="mb-6" style={{ backgroundColor: '#3a7acc', color: 'white' }}>
              Our Mission
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Making African languages digitally visible
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className={`${isVisible.mission ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Africa is home to over 2,000 languages, yet the majority remain digitally invisible. They are absent from translation apps, neglected by speech recognition systems, and largely underrepresented in artificial intelligence.
              </p>
            </div>
            <div className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift ${isVisible.mission ? 'animate-fade-in-up animation-delay-600' : 'opacity-0'}`}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#3a7acc' }}>
                We believe every language deserves space in the digital future
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                In the 21st century, language is more than communication. It is access, identity, and power. We're building the linguistic infrastructure that enables African words to reach global audiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${isVisible.services ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Badge className="mb-4" style={{ backgroundColor: '#3a7acc', color: 'white' }}>
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive language solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From translation and localization to Language data services, we provide everything you need to make African languages part of your digital strategy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover-lift hover:scale-105 dark:bg-gray-800 ${
                  isVisible.services ? 'animate-bounce-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#3a7acc' }}>
                      {React.cloneElement(service.icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300 dark:text-white">{service.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${itemIndex * 0.05}s` }}>
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#3a7acc' }} />
                        <span className="text-gray-600 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section & Partners */}

      <CTA isVisible={isVisible} />
      <Partners />
    </div>
  );
};

export default HomeScreen;