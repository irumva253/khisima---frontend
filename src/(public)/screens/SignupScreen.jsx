/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Phone, Chrome, Check, X } from 'lucide-react';
import { IconCircleDottedLetterK } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/slices/userApiSlice';
import { toast } from 'sonner';
import Meta from '../components/Meta';


const cn = (...classes) => classes.filter(Boolean).join(' ');

const Button = ({ className, variant = 'default', size = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-200 hover:bg-slate-50',
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
  };
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, ...props }) => (
  <div className="rounded-lg border bg-white border-slate-200 shadow-sm" {...props}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-2xl font-semibold leading-none tracking-tight text-slate-900">
    {children}
  </h3>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-slate-600">
    {children}
  </p>
);

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

const Input = ({ type, className, ...props }) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
);

const Label = ({ children, ...props }) => (
  <label className="text-sm font-medium leading-none text-slate-900" {...props}>
    {children}
  </label>
);


const Checkbox = ({ checked, onChange, name }) => (
  <div
    onClick={() => onChange(name, !checked)}
    className={cn(
      'h-4 w-4 rounded border flex items-center justify-center cursor-pointer transition-colors',
      checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 hover:border-slate-400'
    )}
  >
    {checked && <Check size={12} />}
  </div>
);

const PasswordStrength = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', test: password.length >= 8 },
    { label: 'Contains uppercase letter', test: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', test: /[a-z]/.test(password) },
    { label: 'Contains number', test: /\d/.test(password) },
    { label: 'Contains special character', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const strength = requirements.filter(req => req.test).length;
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <>
    <Meta title="Sign Up - Khisima" description="Create your Khisima account to access our services and solutions." />
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">Password strength:</span>
        <span className={cn(
          'text-xs font-medium',
          strength <= 1 ? 'text-red-600' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'
        )}>
          {strengthLabels[strength - 1] || 'Very Weak'}
        </span>
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 w-full rounded-full transition-colors',
              i < strength ? strengthColors[strength - 1] : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <div className="space-y-1">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center space-x-2 text-xs">
            <div className={cn(
              'w-3 h-3 rounded-full flex items-center justify-center',
              req.test ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
            )}>
              {req.test ? <Check size={8} /> : <X size={8} />}
            </div>
            <span className={req.test ? 'text-green-600' : 'text-slate-500'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

 
  const handleInputChange = (eOrName, maybeValue) => {
    if (typeof eOrName === 'string') {
      // Checkbox toggle
      const name = eOrName;
      const value = maybeValue;
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      const { name, value, type, checked } = eOrName.target;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    if (errors[eOrName.target?.name || eOrName]) {
      setErrors(prev => ({ ...prev, [eOrName.target?.name || eOrName]: '' }));
    }
  };

  // --- validation functions remain the same ---
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    return newErrors;
  };

  const handleNextStep = () => {
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateStep2();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    // Include agreeToTerms
    const { confirmPassword, ...userData } = formData;
    await register(userData).unwrap(); // send agreeToTerms to backend
    
    toast.success('Account created successfully! Please log in.');
    navigate('/login');
  } catch (err) {
    setErrors({ 
      general: err.data?.message || 'Registration failed. Please try again.' 
    });
    toast.error(err.data?.message || 'Registration failed');
  }
};


  const handleGoogleSignup = () => {
    toast.info('Google signup coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
            <IconCircleDottedLetterK stroke={2} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Khisima</h1>
          <p className="text-slate-600">Create your account to get started</p>
        </div>

        {/* Step Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {currentStep} of 2</span>
            <span className="text-sm text-slate-500">{currentStep === 1 ? 'Personal Info' : 'Security'}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 ? 'Personal Information' : 'Create Password'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 
                ? 'Tell us about yourself' 
                : 'Secure your account with a strong password'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                {errors.general}
              </div>
            )}

            {currentStep === 1 ? (
              /* --- Step 1 Form --- */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'border-red-300 focus-visible:ring-red-400' : ''}
                    />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'border-red-300 focus-visible:ring-red-400' : ''}
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'border-red-300 focus-visible:ring-red-400' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+250 7xx xxx xxx"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'border-red-300 focus-visible:ring-red-400' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <Button 
                    onClick={handleNextStep}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              /* --- Step 2 Form --- */
              <div className="space-y-4">
                {/* Password fields */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock size={16} /> Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn("pr-10", errors.password ? 'border-red-300 focus-visible:ring-red-400' : '')}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  <PasswordStrength password={formData.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock size={16} /> Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn("pr-10", errors.confirmPassword ? 'border-red-300 focus-visible:ring-red-400' : '')}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                {/* Terms checkbox */}
                <div className="space-y-3 mt-6 flex items-center">
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                  />
                  <span className="text-sm text-slate-700 ml-2">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </span>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

                <div className="flex justify-between gap-4 mt-6">
                  <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" onClick={handleSubmit} className="flex-1">
                    Sign Up
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm text-slate-600">
                  Or continue with
                  <Button variant="outline" size="sm" onClick={handleGoogleSignup} className="ml-2">
                    <Chrome size={16} /> Google
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SignupScreen;
