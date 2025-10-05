/**
 * React hooks for configuration management
 */

import { useState, useEffect, useCallback } from 'react';
import { configManager } from '@/config/configManager';

import type { AppConfig, ThemeConfig } from '@/config';

/**
 * Hook to access application configuration
 */
export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig>(configManager.getConfig());
  const [isLoading, setIsLoading] = useState(!configManager['_isInitialized']);

  useEffect(() => {
    const initializeConfig = async () => {
      try {
        await configManager.initialize();
        setConfig(configManager.getConfig());
      } catch (error) {
        console.error('Failed to initialize config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!configManager['_isInitialized']) {
      initializeConfig();
    } else {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    configManager.updateConfig(updates);
    setConfig(configManager.getConfig());
  }, []);

  const resetConfig = useCallback(() => {
    configManager.resetToDefaults();
    setConfig(configManager.getConfig());
  }, []);

  return {
    config,
    isLoading,
    updateConfig,
    resetConfig,
    isFeatureEnabled: configManager.isFeatureEnabled.bind(configManager),
    toggleFeature: configManager.toggleFeature.bind(configManager),
  };
};

/**
 * Hook to access theme configuration
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeConfig>(configManager.getTheme());
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const config = configManager.getConfig();
    setCurrentTheme(config.ui.defaultTheme);
    setThemeState(configManager.getTheme());
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    configManager.setTheme(newTheme);
    setCurrentTheme(newTheme);
    setThemeState(configManager.getTheme());
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [currentTheme, setTheme]);

  return {
    theme,
    currentTheme,
    setTheme,
    toggleTheme,
    isDark: theme === configManager.getTheme() && currentTheme === 'dark',
    isLight: theme === configManager.getTheme() && currentTheme === 'light',
    isSystem: currentTheme === 'system',
  };
};

/**
 * Hook to access feature flags
 */
export const useFeatureFlags = () => {
  const [features, setFeatures] = useState(configManager.getConfig().features);

  useEffect(() => {
    setFeatures(configManager.getConfig().features);
  }, []);

  const isEnabled = useCallback((feature: keyof AppConfig['features']) => {
    return configManager.isFeatureEnabled(feature);
  }, []);

  const toggle = useCallback((feature: keyof AppConfig['features']) => {
    configManager.toggleFeature(feature);
    setFeatures(configManager.getConfig().features);
  }, []);

  const enable = useCallback((feature: keyof AppConfig['features']) => {
    if (!isEnabled(feature)) {
      toggle(feature);
    }
  }, [isEnabled, toggle]);

  const disable = useCallback((feature: keyof AppConfig['features']) => {
    if (isEnabled(feature)) {
      toggle(feature);
    }
  }, [isEnabled, toggle]);

  return {
    features,
    isEnabled,
    toggle,
    enable,
    disable,
  };
};

/**
 * Hook to access environment information
 */
export const useEnvironment = () => {
  const config = configManager.getConfig();

  return {
    environment: config.app.environment,
    isDevelopment: config.app.environment === 'development',
    isProduction: config.app.environment === 'production',
    isStaging: config.app.environment === 'staging',
    debug: config.app.debug,
    version: config.app.version,
    appName: config.app.name,
  };
};

/**
 * Hook for responsive design based on config
 */
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};