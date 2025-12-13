
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfigService } from '../services/ConfigService';
import { Logger } from '../services/Logger';

interface FeatureFlags {
  enableAi: boolean;
  enableAdvancedAnalytics: boolean;
  enableRealtimeCollaboration: boolean;
  [key: string]: boolean;
}

interface FeatureFlagContextType {
  flags: FeatureFlags;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flags] = useState<FeatureFlags>(ConfigService.features);

  const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
    const enabled = flags[feature] ?? false;
    Logger.debug(`Feature Check: ${String(feature)} = ${enabled}`, { component: 'FeatureFlagProvider' });
    return enabled;
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, isFeatureEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlag = (feature: keyof FeatureFlags) => {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  return context.isFeatureEnabled(feature);
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  return context;
};
