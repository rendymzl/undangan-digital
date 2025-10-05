/**
 * Import validation utilities for development
 * This file helps ensure consistent import patterns across the codebase
 */

export interface ImportRule {
  pattern: RegExp;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// Import pattern rules
export const IMPORT_RULES: ImportRule[] = [
  {
    pattern: /^import\s+.*\s+from\s+['"]\.\.\/\.\.\/\.\.\//,
    message: 'Avoid deep relative imports (../../../). Use path aliases instead (@/)',
    severity: 'error',
  },
  {
    pattern: /^import\s+.*\s+from\s+['"]\.\.\/\.\.\//,
    message: 'Consider using path aliases instead of relative imports (../../)',
    severity: 'warning',
  },
  {
    pattern: /^import\s+.*\s+from\s+['"]src\//,
    message: 'Use path aliases (@/) instead of absolute src/ imports',
    severity: 'error',
  },
  {
    pattern: /^import\s+\{[^}]*,\s*type\s+/,
    message: 'Separate type imports from value imports',
    severity: 'warning',
  },
  {
    pattern: /^import\s+type\s+.*\s+from\s+['"]react['"]/,
    message: 'React types should be imported separately: import type { FC } from "react"',
    severity: 'info',
  },
];

// Path alias patterns
export const PATH_ALIAS_PATTERNS = {
  COMPONENTS: /^@\/components\//,
  FEATURES: /^@\/features\//,
  UTILS: /^@\/utils\//,
  TYPES: /^@\/types\//,
  CONSTANTS: /^@\/constants\//,
  CONFIG: /^@\/config\//,
  ROUTER: /^@\/router\//,
  HOOKS: /^@\/hooks\//,
  LIB: /^@\/lib\//,
  PAGES: /^@\/pages\//,
  ASSETS: /^@\/assets\//,
};

// Import order groups
export enum ImportGroup {
  EXTERNAL = 1,
  INTERNAL = 2,
  RELATIVE = 3,
  TYPES = 4,
}

/**
 * Classify import based on its source
 */
export const classifyImport = (importPath: string): ImportGroup => {
  // Type imports
  if (importPath.includes('import type')) {
    return ImportGroup.TYPES;
  }
  
  // External libraries (no path prefix)
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    return ImportGroup.EXTERNAL;
  }
  
  // Internal modules (path aliases)
  if (importPath.startsWith('@/')) {
    return ImportGroup.INTERNAL;
  }
  
  // Relative imports
  if (importPath.startsWith('.')) {
    return ImportGroup.RELATIVE;
  }
  
  return ImportGroup.EXTERNAL;
};

/**
 * Validate import patterns in a file content
 */
export const validateImports = (fileContent: string): ImportValidationResult => {
  const lines = fileContent.split('\n');
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  let currentGroup = ImportGroup.EXTERNAL;
  let hasBlankLineBetweenGroups = true;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip non-import lines
    if (!trimmedLine.startsWith('import')) {
      return;
    }
    
    // Check against rules
    IMPORT_RULES.forEach(rule => {
      if (rule.pattern.test(trimmedLine)) {
        const message = `Line ${index + 1}: ${rule.message}`;
        
        switch (rule.severity) {
          case 'error':
            errors.push(message);
            break;
          case 'warning':
            warnings.push(message);
            break;
          case 'info':
            suggestions.push(message);
            break;
        }
      }
    });
    
    // Check import order
    const importGroup = classifyImport(trimmedLine);
    
    if (importGroup < currentGroup) {
      errors.push(`Line ${index + 1}: Import order violation. ${getGroupName(importGroup)} imports should come before ${getGroupName(currentGroup)} imports`);
    }
    
    // Check for blank lines between groups
    if (importGroup > currentGroup && !hasBlankLineBetweenGroups) {
      suggestions.push(`Line ${index + 1}: Consider adding a blank line between ${getGroupName(currentGroup)} and ${getGroupName(importGroup)} imports`);
    }
    
    currentGroup = Math.max(currentGroup, importGroup);
    
    // Reset blank line check
    hasBlankLineBetweenGroups = false;
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
};

/**
 * Get human-readable group name
 */
const getGroupName = (group: ImportGroup): string => {
  switch (group) {
    case ImportGroup.EXTERNAL:
      return 'external library';
    case ImportGroup.INTERNAL:
      return 'internal module';
    case ImportGroup.RELATIVE:
      return 'relative';
    case ImportGroup.TYPES:
      return 'type';
    default:
      return 'unknown';
  }
};

/**
 * Suggest path alias for relative import
 */
export const suggestPathAlias = (relativePath: string, currentFile: string): string | null => {
  // Simple heuristic to suggest path aliases
  if (relativePath.includes('/components/')) {
    return relativePath.replace(/.*\/components\//, '@/components/');
  }
  
  if (relativePath.includes('/utils/')) {
    return relativePath.replace(/.*\/utils\//, '@/utils/');
  }
  
  if (relativePath.includes('/types/')) {
    return relativePath.replace(/.*\/types\//, '@/types/');
  }
  
  if (relativePath.includes('/features/')) {
    return relativePath.replace(/.*\/features\//, '@/features/');
  }
  
  return null;
};

/**
 * Format imports according to the style guide
 */
export const formatImports = (imports: string[]): string => {
  const groups: Record<ImportGroup, string[]> = {
    [ImportGroup.EXTERNAL]: [],
    [ImportGroup.INTERNAL]: [],
    [ImportGroup.RELATIVE]: [],
    [ImportGroup.TYPES]: [],
  };
  
  // Group imports
  imports.forEach(importLine => {
    const group = classifyImport(importLine);
    groups[group].push(importLine);
  });
  
  // Sort within groups
  Object.values(groups).forEach(group => {
    group.sort();
  });
  
  // Combine with blank lines between groups
  const result: string[] = [];
  
  Object.entries(groups).forEach(([groupKey, groupImports]) => {
    if (groupImports.length > 0) {
      if (result.length > 0) {
        result.push(''); // Blank line between groups
      }
      result.push(...groupImports);
    }
  });
  
  return result.join('\n');
};