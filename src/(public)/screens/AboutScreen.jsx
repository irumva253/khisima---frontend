import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Languages, 
  Users, 
  Database,
  CheckCircle,
  Award,
  Target,
  Heart,
  Lightbulb,
  Zap,
  BookOpen,
  MapPin,
  Quote
} from 'lucide-react';
import SocialButton from '@/components/kokonutui/social-button';
import Meta from '../components/Meta';
import Partners from '../components/Partners';

const AboutScreen = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { number: "2,000+", label: "African Languages", description: "Languages we're working to digitize" },
    { number: "50+", label: "Projects Completed", description: "Successful language projects delivered" },
    { number: "15+", label: "Countries Served", description: "Global reach across continents" },
    { number: "99%", label: "Client Satisfaction", description: "Consistent quality and service" }
  ];



  const values = [
    {
      title: "Cultural Preservation",
      description: "We believe every language carries the wisdom, history, and identity of its people.",
      icon: <Heart className="w-8 h-8" />,
      color: "#e11d48"
    },
    {
      title: "Technological Innovation",
      description: "Leveraging cutting-edge technology to make African languages accessible globally.",
      icon: <Zap className="w-8 h-8" />,
      color: "#3a7acc"
    },
    {
      title: "Quality Excellence",
      description: "Delivering exceptional quality through rigorous processes and expert linguists.",
      icon: <Award className="w-8 h-8" />,
      color: "#f59e0b"
    },
    {
      title: "Community Impact",
      description: "Creating opportunities and empowering communities through language technology.",
      icon: <Users className="w-8 h-8" />,
      color: "#10b981"
    }
  ];

  // const team = [
  //   {
  //     name: "Mr. Olivier NIYOMUGISHA",
  //     role: "Founder & CEO",
  //     bio: "Computational linguist with 10+ years in African language research and NLP.",
  //     languages: "Kinyarwanda, English, French, Swahili",
  //     image: "https://images.unsplash.com/photo-1494790108755-2616b612b217?w=400&h=400&fit=crop&q=80"
  //   },
  //   {
  //     name: "Jean-Baptiste Nkurikiye",
  //     role: "Head of Localization",
  //     bio: "Expert translator specializing in African language localization for tech companies.",
  //     languages: "Kinyarwanda, English, French, Kirundi",
  //     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80"
  //   },
  //   {
  //     name: "Sarah Mukamana",
  //     role: "NLP Data Specialist",
  //     bio: "AI researcher focused on low-resource language processing and data collection.",
  //     languages: "Kinyarwanda, English, Luganda",
  //     image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80"
  //   },
  //   {
  //     name: "David Mutabazi",
  //     role: "Cultural Consultant",
  //     bio: "Cultural anthropologist ensuring authentic representation in all our projects.",
  //     languages: "Kinyarwanda, Swahili, English, Lingala",
  //     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80"
  //   }
  // ];

  const tabs = [
    { id: 'story', label: 'Our Story', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mission', label: 'Mission & Vision', icon: <Target className="w-4 h-4" /> },
    { id: 'values', label: 'Our Values', icon: <Heart className="w-4 h-4" /> },
    // { id: 'team', label: 'Our Team', icon: <Users className="w-4 h-4" /> }
  ];

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
    <>
    <Meta title="About Us" description="Learn more about Khisima's mission, values, and team." />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      <style jsx="true">{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .animate-bounce-in { animation: bounceIn 0.6s ease-out forwards; }
        .animation-delay-300 { animation-delay: 0.3s; opacity: 0; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
        .animation-delay-900 { animation-delay: 0.9s; opacity: 0; }
        .hover-lift:hover { transform: translateY(-5px); transition: transform 0.3s ease; }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 text-sm px-4 py-2" style={{ backgroundColor: '#3a7acc', color: 'white' }}>
              <MapPin className="w-4 h-4 mr-2" />
              About Khisima
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Bridging Languages,<br />
              <span style={{ color: '#3a7acc' }}>Building Futures</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Born from the vibrant multilingual landscape of Rwanda, Khisima stands at the intersection of tradition and innovation, bringing African voices to the forefront of global technology.
            </p>
          </div>
        </div>
      </section>
      

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center group hover-lift ${isVisible.stats ? 'animate-bounce-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#3a7acc' }}>
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-1 sm:space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 mb-2 sm:mb-0 ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#3a7acc' } : {}}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Our Story Tab */}
          {activeTab === 'story' && (
            <div className="animate-fade-in-up">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    From Rwanda's Multilingual Heart
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Khisima was born from a simple yet powerful realization: in a world increasingly connected by technology, too many voices were being left behind. Founded in Rwanda, one of Africa's most linguistically diverse nations, we witnessed firsthand the daily miracle of multilingual communication.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Our journey began when we saw brilliant minds switching between Kinyarwanda, English, French, and Swahili in a single conversation, yet finding their languages absent from the digital tools shaping their futures. This gap between linguistic richness and technological representation sparked our mission.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4" style={{ borderColor: '#3a7acc' }}>
                    <Quote className="w-8 h-8 mb-4" style={{ color: '#3a7acc' }} />
                    <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                      "We realized that preserving languages isn't just about culture—it's about ensuring equal access to the digital future for everyone."
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">— Founder & CEO</p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://res.cloudinary.com/dcueemfxj/image/upload/v1756809066/khisima-abt-hero_eafytn.jpg"
                    alt="About Hero"
                    className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2">
                      <Languages className="w-6 h-6" style={{ color: '#3a7acc' }} />
                      <span className="font-semibold text-gray-900 dark:text-white">6+ Languages</span>
                    </div>
                    <div className="mt-2">
                      <SocialButton  />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              

            </div>
          )}

          {/* Mission & Vision Tab */}
          {activeTab === 'mission' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                  Our Mission & Vision
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <Card className="hover:shadow-2xl transition-all duration-500 hover-lift border-0 shadow-lg dark:bg-gray-800">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3a7acc' }}>
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      To bridge the digital divide for African languages by providing world-class language services and Language data solutions that amplify African voices in global systems.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#3a7acc' }} />
                        <span className="text-gray-700 dark:text-gray-300">Make African languages digitally accessible</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#3a7acc' }} />
                        <span className="text-gray-700 dark:text-gray-300">Preserve cultural heritage through technology</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#3a7acc' }} />
                        <span className="text-gray-700 dark:text-gray-300">Enable equal participation in the digital economy</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-2xl transition-all duration-500 hover-lift border-0 shadow-lg dark:bg-gray-800">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3a7acc' }}>
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      A world where every African language has equal representation in digital systems, where technology speaks the languages of all people, and where linguistic diversity drives innovation.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#3a7acc' }} />
                        <span className="text-gray-700 dark:text-gray-300">Universal digital language inclusion</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#3a7acc' }} />
                        <span className="text-gray-700 dark:text-gray-300">AI systems that understand African languages</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 mt-1" style={{ color: '#3a7acc' }} />
                        <span className="text-gray-700 dark:text-gray-300">Empowered African communities through technology</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Values Tab */}
          {activeTab === 'values' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  What Drives Us
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Our values shape every project, every partnership, and every decision we make.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <Card 
                    key={index}
                    className="hover:shadow-2xl transition-all duration-500 hover-lift border-0 shadow-lg group dark:bg-gray-800"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div 
                          className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: `${value.color}15` }}
                        >
                          {React.cloneElement(value.icon, { style: { color: value.color } })}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors duration-300">
                            {value.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Team Tab */}
          {/* {activeTab === 'team' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Meet Our Team
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  A diverse group of linguists, technologists, and cultural experts united by a shared vision.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <Card 
                    key={index}
                    className="hover:shadow-2xl transition-all duration-500 hover-lift border-0 shadow-lg group overflow-hidden dark:bg-gray-800"
                  >
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                      <p className="text-sm font-medium mb-3" style={{ color: '#3a7acc' }}>{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{member.bio}</p>
                      <div className="border-t pt-4 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Languages:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{member.languages}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </section>
      <hr className='my-8 border-gray-200 dark:border-gray-700' />
      {/*  Partners */}
       <Partners />

    </div>
    </>
  );
};

export default AboutScreen;