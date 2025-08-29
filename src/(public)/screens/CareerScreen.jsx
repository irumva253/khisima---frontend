/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmitCareerApplicationMutation } from '@/slices/careerApiSlice';
import { toast } from 'sonner';
import Spinner from '@/components/ui/Spinner';
import { ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp } from 'lucide-react';

const CareerScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    languages: '',
    coverLetter: '',
    resumeFile: null,
    portfolioUrl: '',
    availability: 'immediate',
    workType: 'remote',
    expectedSalary: '',
    referralSource: ''
  });

  const [submitApplication, { isLoading }] = useSubmitCareerApplicationMutation();

  const steps = [
    {
      id: 1,
      title: 'Personal Info',
      description: 'Basic information about you',
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      id: 2,
      title: 'Position & Experience',
      description: 'Role preferences and background',
      fields: ['position', 'experience', 'languages']
    },
    {
      id: 3,
      title: 'Work Preferences',
      description: 'Your work style and availability',
      fields: ['workType', 'availability', 'expectedSalary', 'portfolioUrl']
    },
    {
      id: 4,
      title: 'Documents & Cover Letter',
      description: 'Upload resume and write cover letter',
      fields: ['resumeFile', 'coverLetter', 'referralSource']
    }
  ];

  const positions = [
    {
      id: 'translator',
      title: 'Freelance Translator',
      type: 'Freelance',
      description: 'Work with diverse clients on translation projects across multiple languages',
      requirements: ['Native proficiency in 2+ languages', 'Translation certification preferred', 'Strong attention to detail']
    },
    {
      id: 'interpreter',
      title: 'Remote Interpreter',
      type: 'Remote',
      description: 'Provide real-time interpretation services for business meetings and events',
      requirements: ['Excellent verbal communication', 'Quick thinking abilities', 'Professional demeanor']
    },
    {
      id: 'intern-linguistic',
      title: 'Linguistic Research Intern',
      type: 'Internship',
      description: 'Support our research team in language documentation and analysis',
      requirements: ['Currently studying linguistics/languages', 'Research experience preferred', 'Academic excellence']
    },
    {
      id: 'intern-tech',
      title: 'Tech & Localization Intern',
      type: 'Internship',
      description: 'Help develop language learning tools and localization solutions',
      requirements: ['Tech background preferred', 'Interest in language technology', 'Problem-solving skills']
    }
  ];

  const faqData = [
    {
      id: 1,
      question: 'What qualifications do I need?',
      answer: 'Requirements vary by position. For translation roles, we typically require native proficiency in at least two languages. Certifications and relevant experience are preferred but not always required.'
    },
    {
      id: 2,
      question: 'Do you hire remote workers?',
      answer: 'Yes! Most of our positions are remote-friendly. We believe talent knows no borders, and we\'re committed to building a global team.'
    },
    {
      id: 3,
      question: 'What\'s the application process?',
      answer: 'After submitting your application, we\'ll review it within 48 hours. Qualified candidates will be contacted for a preliminary interview, followed by a skills assessment if applicable.'
    },
    {
      id: 4,
      question: 'Do you offer internships?',
      answer: 'Absolutely! We have internship programs specifically designed for language students. These positions offer real-world experience and mentorship opportunities.'
    },
    {
      id: 5,
      question: 'What benefits do you offer?',
      answer: 'Benefits vary by position type. Full-time roles include health insurance, professional development budget, and language learning stipends. Freelancers enjoy flexible schedules and competitive project rates.'
    },
    {
      id: 6,
      question: 'Can I work on multiple projects?',
      answer: 'Yes, especially for freelance positions. We encourage our team members to work on diverse projects to expand their skills and experience across different domains.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const validateStep = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    const requiredFields = step.fields.filter(field => {
      // Define which fields are required for each step
      const required = {
        1: ['firstName', 'lastName', 'email'], // Personal info required fields
        2: ['position', 'experience', 'languages'], // Position required fields
        3: [], // Work preferences - all optional
        4: ['resumeFile', 'coverLetter'] // Documents required fields
      };
      return required[stepId]?.includes(field);
    });

    return requiredFields.every(field => {
      const value = formData[field];
      return value && value !== '';
    });
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    // Allow clicking on completed steps or the next immediate step
    if (completedSteps.includes(stepId) || stepId === currentStep || stepId === currentStep - 1) {
      setCurrentStep(stepId);
    }
  };

// Alternative approach: Modify the handleSubmit function in CareerScreen.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateStep(4)) {
    toast.error('Please fill in all required fields before submitting.');
    return;
  }

  try {
    // Create FormData object
    const formDataToSend = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Submit using the mutation directly with FormData
    const result = await submitApplication(formDataToSend).unwrap();
    console.log('Application submitted:', result);

    toast.success('Application submitted successfully! We will review your application and get back to you soon.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      languages: '',
      coverLetter: '',
      resumeFile: null,
      portfolioUrl: '',
      availability: 'immediate',
      workType: 'remote',
      expectedSalary: '',
      referralSource: ''
    });
    setCurrentStep(1);
    setCompletedSteps([]);
  } catch (error) {
    console.error('Submission error:', error);
    toast.error(error?.data?.message || 'Failed to submit application. Please try again.');
  }
};

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your first name"
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
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your last name"
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
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="your@email.com"
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="+250 7xx xxx xxx"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position of Interest *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select a position</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.id}>{pos.title}</option>
                  ))}
                  <option value="other">Other (specify in cover letter)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years (Entry Level)</option>
                  <option value="2-3">2-3 years</option>
                  <option value="4-6">4-6 years</option>
                  <option value="7-10">7-10 years</option>
                  <option value="10+">10+ years (Senior)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Languages (with proficiency levels) *
              </label>
              <textarea
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="e.g., English (Native), French (Fluent), Spanish (Intermediate), etc."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Type Preference
                </label>
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="remote">Remote</option>
                  <option value="freelance">Freelance</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="immediate">Immediate</option>
                  <option value="2weeks">2 weeks notice</option>
                  <option value="1month">1 month</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Salary (USD/month)
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="e.g., $3000-5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Portfolio/LinkedIn URL
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="https://your-portfolio.com or LinkedIn profile"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Resume/CV *
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="resumeFile"
                  onChange={handleInputChange}
                  required
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-gray-500 text-sm">
                    {formData.resumeFile ? formData.resumeFile.name : 'Upload your resume (PDF, DOC, DOCX)'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Tell us about yourself, your experience, and why you want to join Khisima. What drives your passion for languages?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How did you hear about us?
              </label>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Select an option</option>
                <option value="website">Company Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Employee Referral</option>
                <option value="jobboard">Job Board</option>
                <option value="university">University/School</option>
                <option value="social">Social Media</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
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
          {/* Floating Language Icons */}
          <div className="absolute top-20 left-10 text-white/20 animate-float-slow">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
          </div>
          <div className="absolute top-32 right-20 text-white/15 animate-float-medium">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
            </svg>
          </div>
          <div className="absolute bottom-40 left-20 text-white/20 animate-float-fast">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
            </svg>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 animate-fade-in">
            <ol className="flex items-center space-x-2 text-sm text-blue-100">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-white font-medium">Careers</span>
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="text-center animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join the Khisima Team
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              Be part of a mission-driven team that's empowering languages worldwide. 
              We offer exciting opportunities for translators, linguists, and language enthusiasts.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay">
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-lg font-semibold mb-1">Global Impact</div>
                <div className="text-blue-100 text-sm">Empower languages worldwide</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-2">
                <div className="text-2xl mb-2">💼</div>
                <div className="text-lg font-semibold mb-1">Flexible Work</div>
                <div className="text-blue-100 text-sm">Remote & freelance options</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-fade-in-delay-3">
                <div className="text-2xl mb-2">🎓</div>
                <div className="text-lg font-semibold mb-1">Growth</div>
                <div className="text-blue-100 text-sm">Internships & learning</div>
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
          {/* Open Positions Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {positions.map((position, index) => (
                <div
                  key={position.id}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {position.title}
                      </h3>
                      <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        position.type === 'Freelance' ? 'bg-green-100 text-green-800' :
                        position.type === 'Remote' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {position.type}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {position.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form Section with Stepper */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 md:p-8 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Apply Now</h2>
                <p className="text-blue-100 leading-relaxed text-sm md:text-base">
                Ready to join our team? Fill out the application below and we'll get back to you within 48 hours.
                </p>
            </div>

            {/* Stepper Header - Responsive Version */}
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                    <div
                        onClick={() => handleStepClick(step.id)}
                        className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                        completedSteps.includes(step.id)
                            ? 'bg-green-500 border-green-500 text-white'
                            : step.id === currentStep
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : step.id < currentStep || completedSteps.includes(step.id - 1)
                            ? 'border-gray-300 text-gray-500 hover:border-blue-400'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {completedSteps.includes(step.id) ? (
                        <Check size={18} className="md:w-5 md:h-5" />
                        ) : (
                        <span className="font-semibold text-sm md:text-base">{step.id}</span>
                        )}
                    </div>
                    
                    <div className="ml-3 md:ml-4 flex-1">
                        <div className={`text-xs md:text-sm font-semibold ${
                        step.id === currentStep ? 'text-blue-600' :
                        completedSteps.includes(step.id) ? 'text-green-600' :
                        'text-gray-500'
                        }`}>
                        {step.title}
                        </div>
                        <div className="text-xs text-gray-500 hidden md:block">
                        {step.description}
                        </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                        <div className={`hidden md:block w-16 h-0.5 ml-4 ${
                        completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                    )}
                    </div>
                ))}
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-4 md:p-8">
                <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    {steps.find(s => s.id === currentStep)?.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                    {steps.find(s => s.id === currentStep)?.description}
                </p>
                </div>

                {renderStepContent()}

                {/* Navigation Buttons - Responsive Version */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-6 md:pt-8 mt-6 md:mt-8 border-t border-gray-200 space-y-reverse space-y-4 md:space-y-0">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-200 w-full md:w-auto justify-center ${
                    currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <ChevronLeft size={18} className="mr-2" />
                    Previous
                </button>

                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        step.id === currentStep
                            ? 'bg-blue-600 w-4 md:w-8'
                            : completedSteps.includes(step.id)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                    />
                    ))}
                </div>

                {currentStep < steps.length ? (
                    <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-semibold rounded-lg md:rounded-xl hover:bg-blue-700 transition-all duration-200 w-full md:w-auto justify-center mb-4 md:mb-0"
                    >
                    Next
                    <ChevronRight size={18} className="ml-2" />
                    </button>
                ) : (
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg md:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto justify-center mb-4 md:mb-0"
                    >
                    {isLoading ? (
                        <>
                        <Spinner size="sm" className="mr-3" />
                        <span className="text-sm md:text-base">Submitting...</span>
                        </>
                    ) : (
                        <>
                        <span className="text-sm md:text-base">Submit Application</span>
                        <Check size={18} className="ml-2" />
                        </>
                    )}
                    </button>
                )}
                </div>
            </form>
            </div>

          {/* Why Join Us Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-12 mb-16 text-white relative overflow-hidden animate-fade-in">
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Why Join Khisima?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Work when and where you're most productive. We offer flexible hours and remote work options for most positions.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Continuous Learning</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Access to training resources, language learning tools, and professional development opportunities.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Competitive Benefits</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Enjoy competitive compensation, health benefits, and professional development opportunities.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  Join a diverse team of language professionals who are passionate about breaking down communication barriers 
                  and making the world more connected through the power of language.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section with Accordions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-4xl mx-auto">
              {faqData.map((faq, index) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-xl mb-4 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {faq.question}
                    </h3>
                    <div className="ml-4 flex-shrink-0">
                      {openAccordion === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                      )}
                    </div>
                  </button>
                  
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openAccordion === faq.id
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="px-6 py-4 bg-white border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl p-8 text-center border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our HR team is here to help. Reach out if you have any questions about our open positions or application process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:careers@khisima.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                careers@khisima.com
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Contact Form
              </Link>
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
  );
};

export default CareerScreen;