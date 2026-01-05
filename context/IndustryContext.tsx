


import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Industry } from '../types/index';

interface IndustryContextType {
  industry: Industry;
  setIndustry: (industry: Industry) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export const IndustryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [industry, setIndustry] = useState<Industry>('Construction');

  return (
    <IndustryContext.Provider value={{ industry, setIndustry }}>
      {children}
    </IndustryContext.Provider>
  );
};

export const useIndustry = () => {
  const context = useContext(IndustryContext);
  if (!context) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
};