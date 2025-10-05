export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

class ValidationService {
  private validateField(value: any, rules: ValidationRule, fieldName: string): string | null {
    // Required validation
    if (rules.required && (value === null || value === undefined || value === '')) {
      return `${fieldName} wajib diisi`;
    }

    // Skip other validations if value is empty and not required
    if (!rules.required && (value === null || value === undefined || value === '')) {
      return null;
    }

    const stringValue = String(value);

    // Min length validation
    if (rules.minLength && stringValue.length < rules.minLength) {
      return `${fieldName} minimal ${rules.minLength} karakter`;
    }

    // Max length validation
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return `${fieldName} maksimal ${rules.maxLength} karakter`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return `Format ${fieldName} tidak valid`;
    }

    // Email validation
    if (rules.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(stringValue)) {
        return `Format email tidak valid`;
      }
    }

    // Phone validation (Indonesian format)
    if (rules.phone) {
      const phonePattern = /^(\+62|62|0)[0-9]{9,13}$/;
      if (!phonePattern.test(stringValue.replace(/[\s-]/g, ''))) {
        return `Format nomor telepon tidak valid`;
      }
    }

    // URL validation
    if (rules.url) {
      try {
        new URL(stringValue);
      } catch {
        return `Format URL tidak valid`;
      }
    }

    // Number validations
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const numValue = Number(value);
      
      if (rules.min !== undefined && numValue < rules.min) {
        return `${fieldName} minimal ${rules.min}`;
      }
      
      if (rules.max !== undefined && numValue > rules.max) {
        return `${fieldName} maksimal ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  validate(
    data: Record<string, any>,
    schema: Record<string, ValidationRule>,
    fieldLabels?: Record<string, string>
  ): ValidationResult {
    const errors: Record<string, string> = {};

    Object.entries(schema).forEach(([fieldName, rules]) => {
      const value = data[fieldName];
      const label = fieldLabels?.[fieldName] || fieldName;
      const error = this.validateField(value, rules, label);
      
      if (error) {
        errors[fieldName] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Predefined validation schemas
  static schemas = {
    email: {
      email: { required: true, email: true },
    },
    
    password: {
      password: { 
        required: true, 
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      },
    },
    
    phone: {
      phone: { required: true, phone: true },
    },
    
    name: {
      firstName: { required: true, minLength: 2, maxLength: 50 },
      lastName: { required: true, minLength: 2, maxLength: 50 },
    },
    
    invitation: {
      groomName: { required: true, minLength: 2, maxLength: 100 },
      brideName: { required: true, minLength: 2, maxLength: 100 },
      eventDate: { required: true },
      eventTime: { required: true },
      venue: { required: true, minLength: 5, maxLength: 200 },
    },
    
    guest: {
      name: { required: true, minLength: 2, maxLength: 100 },
      email: { email: true },
      phone: { phone: true },
      guestCount: { required: true, min: 1, max: 10 },
    },
    
    payment: {
      amount: { required: true, min: 0 },
      paymentMethod: { required: true },
    },
  };

  // Helper methods for common validations
  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phonePattern = /^(\+62|62|0)[0-9]{9,13}$/;
    return phonePattern.test(phone.replace(/[\s-]/g, ''));
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  formatPhone(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Convert to Indonesian format
    if (cleaned.startsWith('0')) {
      return '+62' + cleaned.substring(1);
    } else if (cleaned.startsWith('62')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('+62')) {
      return cleaned;
    }
    
    return '+62' + cleaned;
  }

  // Async validation for server-side checks
  async validateAsync(
    data: Record<string, any>,
    schema: Record<string, ValidationRule & { asyncValidator?: (value: any) => Promise<string | null> }>,
    fieldLabels?: Record<string, string>
  ): Promise<ValidationResult> {
    // First run synchronous validation
    const syncResult = this.validate(data, schema, fieldLabels);
    
    if (!syncResult.isValid) {
      return syncResult;
    }

    // Then run async validations
    const asyncErrors: Record<string, string> = {};
    
    for (const [fieldName, rules] of Object.entries(schema)) {
      if (rules.asyncValidator) {
        const value = data[fieldName];
        const error = await rules.asyncValidator(value);
        if (error) {
          asyncErrors[fieldName] = error;
        }
      }
    }

    return {
      isValid: Object.keys(asyncErrors).length === 0,
      errors: { ...syncResult.errors, ...asyncErrors },
    };
  }
}

export const validationService = new ValidationService();