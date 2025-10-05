/**
 * Environment configuration
 */

export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    url: string;
    debug: boolean;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  features: {
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    enablePerformanceMonitoring: boolean;
    maxFileUploadSize: number;
    enableOfflineMode: boolean;
  };
  ui: {
    defaultTheme: 'light' | 'dark' | 'system';
    defaultLanguage: string;
    enableAnimations: boolean;
    compactMode: boolean;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  app: {
    name: 'Menantikan',
    version: '1.0.0',
    environment: 'development',
    url: 'http://localhost:5173',
    debug: true,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  features: {
    enableAnalytics: false,
    enableErrorReporting: false,
    enablePerformanceMonitoring: false,
    maxFileUploadSize: 5 * 1024 * 1024, // 5MB
    enableOfflineMode: false,
  },
  ui: {
    defaultTheme: 'system',
    defaultLanguage: 'id',
    enableAnimations: true,
    compactMode: false,
  },
};

// Environment-specific configurations
const configurations: Record<string, Partial<AppConfig>> = {
  development: {
    app: {
      name: 'Menantikan',
      version: '1.0.0',
      environment: 'development',
      url: 'http://localhost:5173',
      debug: true,
    },
    features: {
      enableAnalytics: false,
      enableErrorReporting: false,
      enablePerformanceMonitoring: false,
      maxFileUploadSize: 5 * 1024 * 1024,
      enableOfflineMode: false,
    },
  },
  staging: {
    app: {
      name: 'Menantikan',
      version: '1.0.0',
      environment: 'staging',
      url: 'https://staging.menantikan.com',
      debug: false,
    },
    features: {
      enableAnalytics: true,
      enableErrorReporting: true,
      enablePerformanceMonitoring: true,
      maxFileUploadSize: 10 * 1024 * 1024,
      enableOfflineMode: true,
    },
  },
  production: {
    app: {
      name: 'Menantikan',
      version: '1.0.0',
      environment: 'production',
      url: 'https://menantikan.com',
      debug: false,
    },
    features: {
      enableAnalytics: true,
      enableErrorReporting: true,
      enablePerformanceMonitoring: true,
      maxFileUploadSize: 10 * 1024 * 1024,
      enableOfflineMode: true,
    },
  },
};

// Get current environment
const getCurrentEnvironment = (): string => {
  return import.meta.env.MODE || 'development';
};

// Merge configurations
const createConfig = (): AppConfig => {
  const environment = getCurrentEnvironment();
  const envConfig = configurations[environment] || {};
  
  return {
    ...defaultConfig,
    ...envConfig,
    app: {
      ...defaultConfig.app,
      ...envConfig.app,
    },
    supabase: {
      ...defaultConfig.supabase,
      ...envConfig.supabase,
    },
    features: {
      ...defaultConfig.features,
      ...envConfig.features,
    },
    ui: {
      ...defaultConfig.ui,
      ...envConfig.ui,
    },
  };
};

// Export the configuration
export const config = createConfig();

// Helper functions
export const isDevelopment = () => config.app.environment === 'development';
export const isProduction = () => config.app.environment === 'production';
export const isStaging = () => config.app.environment === 'staging';

// Validation
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }
  
  if (!config.app.name) {
    errors.push('App name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};