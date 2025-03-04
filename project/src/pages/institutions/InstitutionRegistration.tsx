import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, 
  Check, 
  X, 
  Upload,
  ArrowRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInstitutionStore } from '../../store/institutionStore';

const InstitutionRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuthStore();
  const { addInstitution } = useInstitutionStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    foundedYear: new Date().getFullYear(),
    primaryColor: '#4F46E5',
    secondaryColor: '#818CF8',
    logo: '',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  if (!hasPermission(['SUPER_ADMIN'])) {
    return (
      <div className="text-center py-12">
        <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Access Denied</h3>
        <p className="text-gray-500">You don't have permission to view this page</p>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Institution name is required';
      }
      
      if (!formData.domain.trim()) {
        newErrors.domain = 'Domain is required';
      } else if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.domain)) {
        newErrors.domain = 'Please enter a valid domain (e.g., university.edu)';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    }
    
    if (step === 2) {
      if (!formData.primaryColor.trim()) {
        newErrors.primaryColor = 'Primary color is required';
      } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.primaryColor)) {
        newErrors.primaryColor = 'Please enter a valid hex color code';
      }
      
      if (!formData.secondaryColor.trim()) {
        newErrors.secondaryColor = 'Secondary color is required';
      } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.secondaryColor)) {
        newErrors.secondaryColor = 'Please enter a valid hex color code';
      }
    }
    
    if (step === 3) {
      if (!formData.adminEmail.trim()) {
        newErrors.adminEmail = 'Admin email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
        newErrors.adminEmail = 'Please enter a valid email address';
      }
      
      if (!formData.adminFirstName.trim()) {
        newErrors.adminFirstName = 'First name is required';
      }
      
      if (!formData.adminLastName.trim()) {
        newErrors.adminLastName = 'Last name is required';
      }
      
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      // Add the new institution
      addInstitution({
        name: formData.name,
        domain: formData.domain,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        foundedYear: formData.foundedYear,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        logo: formData.logo || 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1129&q=80',
        active: true
      });
      
      // In a real implementation, we would also create the admin user here
      
      // Simulate API call delay
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/institutions');
      }, 1500);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, this would upload the file to a server
      // For now, we'll just create a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Register New Institution</h1>
        <p className="text-gray-600">Add a new institution to the E-Library LMS platform</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-indigo-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Institution Registration</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 4 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                currentStep >= 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                4
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Basic Info</span>
              <span>Branding</span>
              <span>Admin Account</span>
              <span>Review</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                <p className="text-sm text-gray-600">Enter the basic details about the institution</p>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Institution Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.name ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                      Domain <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        placeholder="university.edu"
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.domain ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.domain && (
                        <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                      Founded Year
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="foundedYear"
                        name="foundedYear"
                        value={formData.foundedYear}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.email ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.phone ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://www.university.edu"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Branding</h3>
                <p className="text-sm text-gray-600">Configure the institution's branding and appearance</p>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                      Logo
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        {formData.logo ? (
                          <img
                            src={formData.logo}
                            alt="Institution logo"
                            className="h-24 w-24 object-cover"
                          />
                        ) : (
                          <School className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-5">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only"
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                      Primary Color <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="primaryColor"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className="h-10 w-10 border-0 rounded-md shadow-sm p-0"
                      />
                      <input
                        type="text"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className={`ml-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.primaryColor ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    {errors.primaryColor && (
                      <p className="mt-1 text-sm text-red-600">{errors.primaryColor}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                      Secondary Color <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="secondaryColor"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className="h-10 w-10 border-0 rounded-md shadow-sm p-0"
                      />
                      <input
                        type="text"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className={`ml-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.secondaryColor ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    {errors.secondaryColor && (
                      <p className="mt-1 text-sm text-red-600">{errors.secondaryColor}</p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Preview
                    </label>
                    <div className="mt-2 p-4 border border-gray-300 rounded-md">
                      <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                          <div 
                            className="h-10 w-24 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: formData.primaryColor }}
                          >
                            Primary
                          </div>
                          <div 
                            className="h-10 w-24 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: formData.secondaryColor }}
                          >
                            Secondary
                          </div>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button 
                            type="button"
                            className="px-4 py-2 rounded-md text-white"
                            style={{ backgroundColor: formData.primaryColor }}
                          >
                            Primary Button
                          </button>
                          <button 
                            type="button"
                            className="px-4 py-2 rounded-md text-white"
                            style={{ backgroundColor: formData.secondaryColor }}
                          >
                            Secondary Button
                          </button>
                        </div>
                        
                        <div 
                          className="p-4 rounded-md"
                          style={{ backgroundColor: `${formData.primaryColor}20` }}
                        >
                          <h4 
                            className="text-lg font-medium mb-2"
                            style={{ color: formData.primaryColor }}
                          >
                            {formData.name || 'Institution Name'}
                          </h4>
                          <p className="text-gray-700">
                            This is a sample text to preview how your branding colors will look in the application.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Admin Account</h3>
                <p className="text-sm text-gray-600">Create an administrator account for this institution</p>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                      Admin Email <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="adminEmail"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.adminEmail ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.adminEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.adminEmail}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="adminFirstName"
                        name="adminFirstName"
                        value={formData.adminFirstName}
                        onChange={handleInputChange}
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.adminFirstName ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.adminFirstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.adminFirstName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="adminLastName"
                        name="adminLastName"
                        value={formData.adminLastName}
                        onChange={handleInputChange}
                        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.adminLastName ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.adminLastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.adminLastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="termsAccepted"
                          name="termsAccepted"
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                          Terms and Conditions <span className="text-red-500">*</span>
                        </label>
                        <p className="text-gray-500">
                          I agree to the terms and conditions of the E-Library LMS platform.
                        </p>
                        {errors.termsAccepted && (
                          <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Review Information</h3>
                <p className="text-sm text-gray-600">Please review the information before submitting</p>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Institution Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Institution Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-gray-400" />
                            Domain
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.domain}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            Founded
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.foundedYear}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Description</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.description || 'N/A'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            Email
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            Phone
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            Address
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.address || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-2">Branding</h5>
                      <div className="flex space-x-4 mb-4">
                        <div>
                          <div 
                            className="h-12 w-12 rounded-md"
                            style={{ backgroundColor: formData.primaryColor }}
                          ></div>
                          <p className="text-xs text-gray-500 mt-1">Primary</p>
                          <p className="text-xs font-mono">{formData.primaryColor}</p>
                        </div>
                        <div>
                          <div 
                            className="h-12 w-12 rounded-md"
                            style={{ backgroundColor: formData.secondaryColor }}
                          ></div>
                          <p className="text-xs text-gray-500 mt-1">Secondary</p>
                          <p className="text-xs font-mono">{formData.secondaryColor}</p>
                        </div>
                      </div>
                      
                      <h5 className="text-sm font-medium text-gray-500 mb-2">Admin Account</h5>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Admin Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.adminEmail}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Admin Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.adminFirstName} {formData.adminLastName}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow- 800">Important Note</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          After registration, an email will be sent to the admin email address with instructions to set up the account password.
                          The institution will be in inactive state until the admin completes the setup process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Register Institution
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstitutionRegistration;