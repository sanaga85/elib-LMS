import React, { useState } from 'react';
import { School, ChevronDown, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInstitutionStore } from '../../store/institutionStore';
import { Link } from 'react-router-dom';

const InstitutionSwitcher: React.FC = () => {
  const { user, currentInstitutionId, switchInstitution, hasPermission } = useAuthStore();
  const { institutions } = useInstitutionStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Only SUPER_ADMIN can switch institutions
  if (!hasPermission(['SUPER_ADMIN'])) {
    return null;
  }
  
  // Filter active institutions only
  const activeInstitutions = institutions.filter(inst => inst.active);
  
  const currentInstitution = activeInstitutions.find(inst => inst.id === currentInstitutionId) || activeInstitutions[0];
  
  if (!currentInstitution) {
    return null;
  }
  
  const handleInstitutionChange = (institutionId: string) => {
    switchInstitution(institutionId);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-indigo-800 transition-colors duration-200"
      >
        <div className="h-6 w-6 rounded-md overflow-hidden bg-white/10">
          {currentInstitution.logo ? (
            <img
              src={currentInstitution.logo}
              alt={currentInstitution.name}
              className="h-6 w-6 object-cover"
            />
          ) : (
            <School className="h-4 w-4 text-white" />
          )}
        </div>
        <span className="text-sm text-white font-medium truncate max-w-[120px]">
          {currentInstitution.name}
        </span>
        <ChevronDown className="h-4 w-4 text-indigo-300" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Switch Institution
            </div>
            
            {activeInstitutions.map((institution) => (
              <button
                key={institution.id}
                onClick={() => handleInstitutionChange(institution.id)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <div className="h-8 w-8 rounded-md overflow-hidden bg-gray-100 mr-3">
                  {institution.logo ? (
                    <img
                      src={institution.logo}
                      alt={institution.name}
                      className="h-8 w-8 object-cover"
                    />
                  ) : (
                    <School className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <span className="text-sm text-gray-700 flex-1 truncate">
                  {institution.name}
                </span>
                {institution.id === currentInstitutionId && (
                  <Check className="h-4 w-4 text-indigo-600" />
                )}
              </button>
            ))}
            
            <div className="border-t border-gray-100 mt-1 pt-1">
              <Link
                to="/institutions"
                className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100"
              >
                Manage Institutions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionSwitcher;