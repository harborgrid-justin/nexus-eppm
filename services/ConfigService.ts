
export const ConfigService = {
  get env() {
    return process.env.NODE_ENV || 'development';
  },
  get apiKey() {
    return process.env.API_KEY || '';
  },
  get isProduction() {
    return this.env === 'production';
  },
  get appVersion() {
    return '1.2.0'; // Should come from package.json in build
  },
  features: {
    enableAi: true,
    enableAdvancedAnalytics: false, // Hidden feature
    enableRealtimeCollaboration: true,
  }
};
