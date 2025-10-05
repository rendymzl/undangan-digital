/**
 * Configuration manager for centralized config handling
 */

import { config, validateConfig, type AppConfig } from './env';
import { lightTheme, darkTheme, applyTheme, type ThemeConfig } from './theme';

export class ConfigManager {
  private static instance: ConfigManager;
  private _config: AppConfig;
  private _theme: ThemeConfig;
  private _isInitialized = false;

  private constructor() {
    this._config = config;
    this._theme = lightTheme;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Initialize the configuration manager
   */
  public async initialize(): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    try {
      // Validate configuration
      const validation = validateConfig();
      if (!validation.isValid) {
        console.error('Configuration validation failed:', validation.errors);
        throw new Error(`Configuration errors: ${validation.errors.join(', ')}`);
      }

      // Load user preferences
      await this.loadUserPreferences();

      // Apply initial theme
      this.applyCurrentTheme();

      // Set up environment-specific configurations
      this.setupEnvironmentConfig();

      this._isInitialized = true;
      console.log('ConfigManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ConfigManager:', error);
      throw error;
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): AppConfig {
    return { ...this._config };
  }

  /**
   * Get specific config value
   */
  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this._config[key];
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<AppConfig>): void {
    this._config = {
      ...this._config,
      ...updates,
      app: { ...this._config.app, ...updates.app },
      supabase: { ...this._config.supabase, ...updates.supabase },
      features: { ...this._config.features, ...updates.features },
      ui: { ...this._config.ui, ...updates.ui },
    };

    // Save to localStorage for persistence
    this.saveUserPreferences();
  }

  /**
   * Get current theme
   */
  public getTheme(): ThemeConfig {
    return { ...this._theme };
  }

  /**
   * Set theme
   */
  public setTheme(theme: 'light' | 'dark' | 'system'): void {
    let newTheme: ThemeConfig;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newTheme = prefersDark ? darkTheme : lightTheme;
    } else {
      newTheme = theme === 'dark' ? darkTheme : lightTheme;
    }

    this._theme = newTheme;
    this.updateConfig({
      ui: { ...this._config.ui, defaultTheme: theme }
    });

    this.applyCurrentTheme();
  }

  /**
   * Apply current theme to DOM
   */
  private applyCurrentTheme(): void {
    applyTheme(this._theme);
    
    // Update document class for theme-specific styles
    const isDark = this._theme === darkTheme;
    document.documentElement.classList.toggle('dark', isDark);
  }

  /**
   * Load user preferences from localStorage
   */
  private async loadUserPreferences(): Promise<void> {
    try {
      const stored = localStorage.getItem('app_config');
      if (stored) {
        const userConfig = JSON.parse(stored);
        this.updateConfig(userConfig);
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }

  /**
   * Save user preferences to localStorage
   */
  private saveUserPreferences(): void {
    try {
      const userConfig = {
        ui: this._config.ui,
        features: {
          enableOfflineMode: this._config.features.enableOfflineMode,
        },
      };
      localStorage.setItem('app_config', JSON.stringify(userConfig));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }

  /**
   * Setup environment-specific configurations
   */
  private setupEnvironmentConfig(): void {
    // Development-specific setup
    if (this._config.app.environment === 'development') {
      // Enable debug logging
      if (this._config.app.debug) {
        console.log('Debug mode enabled');
      }
    }

    // Production-specific setup
    if (this._config.app.environment === 'production') {
      // Disable console logs in production
      if (!this._config.app.debug) {
        console.log = () => {};
        console.warn = () => {};
      }
    }

    // Setup theme system listener
    if (this._config.ui.defaultTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        this._theme = e.matches ? darkTheme : lightTheme;
        this.applyCurrentTheme();
      });
    }
  }

  /**
   * Get feature flag value
   */
  public isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this._config.features[feature] as boolean;
  }

  /**
   * Toggle feature flag
   */
  public toggleFeature(feature: keyof AppConfig['features']): void {
    const currentValue = this._config.features[feature] as boolean;
    this.updateConfig({
      features: {
        ...this._config.features,
        [feature]: !currentValue,
      },
    });
  }

  /**
   * Reset configuration to defaults
   */
  public resetToDefaults(): void {
    localStorage.removeItem('app_config');
    this._config = config;
    this._theme = lightTheme;
    this.applyCurrentTheme();
  }

  /**
   * Get configuration summary for debugging
   */
  public getConfigSummary(): Record<string, any> {
    return {
      environment: this._config.app.environment,
      version: this._config.app.version,
      theme: this._config.ui.defaultTheme,
      features: this._config.features,
      initialized: this._isInitialized,
    };
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();