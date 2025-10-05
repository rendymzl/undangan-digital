/**
 * Environment variable validation utilities
 */

export interface EnvValidationRule {
  key: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'url';
  description: string;
  defaultValue?: string;
  validator?: (value: string) => boolean;
}

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missing: string[];
}

// Environment variable rules
export const ENV_RULES: EnvValidationRule[] = [
  {
    key: 'VITE_SUPABASE_URL',
    required: true,
    type: 'url',
    description: 'Supabase project URL',
    validator: (value) => value.includes('supabase.co'),
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    type: 'string',
    description: 'Supabase anonymous key',
    validator: (value) => value.length > 100, // Supabase keys are typically long
  },
  {
    key: 'VITE_APP_VERSION',
    required: false,
    type: 'string',
    description: 'Application version',
    defaultValue: '1.0.0',
  },
  {
    key: 'VITE_APP_NAME',
    required: false,
    type: 'string',
    description: 'Application name',
    defaultValue: 'Menantikan',
  },
  {
    key: 'VITE_ENABLE_ANALYTICS',
    required: false,
    type: 'boolean',
    description: 'Enable analytics tracking',
    defaultValue: 'false',
  },
  {
    key: 'VITE_ENABLE_ERROR_REPORTING',
    required: false,
    type: 'boolean',
    description: 'Enable error reporting',
    defaultValue: 'false',
  },
  {
    key: 'VITE_MAX_FILE_SIZE',
    required: false,
    type: 'number',
    description: 'Maximum file upload size in bytes',
    defaultValue: '5242880', // 5MB
  },
];

/**
 * Validate environment variables
 */
export const validateEnvironment = (): EnvValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing: string[] = [];

  ENV_RULES.forEach(rule => {
    const value = import.meta.env[rule.key];

    // Check if required variable is missing
    if (rule.required && !value) {
      missing.push(rule.key);
      errors.push(`Missing required environment variable: ${rule.key} (${rule.description})`);
      return;
    }

    // Skip validation if optional variable is missing
    if (!value) {
      if (rule.defaultValue) {
        warnings.push(`Using default value for ${rule.key}: ${rule.defaultValue}`);
      }
      return;
    }

    // Type validation
    switch (rule.type) {
      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(`Invalid URL format for ${rule.key}: ${value}`);
        }
        break;

      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`Invalid number format for ${rule.key}: ${value}`);
        }
        break;

      case 'boolean':
        if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
          errors.push(`Invalid boolean format for ${rule.key}: ${value} (expected: true/false/1/0)`);
        }
        break;

      case 'string':
        if (typeof value !== 'string' || value.trim().length === 0) {
          errors.push(`Invalid string format for ${rule.key}: value cannot be empty`);
        }
        break;
    }

    // Custom validation
    if (rule.validator && !rule.validator(value)) {
      errors.push(`Custom validation failed for ${rule.key}: ${value}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missing,
  };
};

/**
 * Get environment variable with type conversion
 */
export const getEnvVar = <T = string>(
  key: string,
  defaultValue?: T,
  type: 'string' | 'number' | 'boolean' = 'string'
): T => {
  const value = import.meta.env[key];

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }

  switch (type) {
    case 'number':
      const numValue = Number(value);
      if (isNaN(numValue)) {
        throw new Error(`Environment variable ${key} is not a valid number: ${value}`);
      }
      return numValue as T;

    case 'boolean':
      return (['true', '1'].includes(value.toLowerCase())) as T;

    case 'string':
    default:
      return value as T;
  }
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.MODE === 'development';
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.MODE === 'production';
};

/**
 * Get current environment mode
 */
export const getEnvironmentMode = (): string => {
  return import.meta.env.MODE || 'development';
};

/**
 * Print environment validation report
 */
export const printEnvReport = (): void => {
  const result = validateEnvironment();
  
  console.group('🔧 Environment Configuration Report');
  
  console.log(`Mode: ${getEnvironmentMode()}`);
  console.log(`Valid: ${result.isValid ? '✅' : '❌'}`);
  
  if (result.errors.length > 0) {
    console.group('❌ Errors');
    result.errors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  if (result.warnings.length > 0) {
    console.group('⚠️ Warnings');
    result.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }
  
  if (result.missing.length > 0) {
    console.group('📋 Missing Variables');
    result.missing.forEach(missing => console.log(`- ${missing}`));
    console.groupEnd();
  }
  
  console.groupEnd();
  
  // Throw error if validation failed
  if (!result.isValid) {
    throw new Error('Environment validation failed. Check console for details.');
  }
};