#!/usr/bin/env node

/**
 * Validate the refactored project structure
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Expected directory structure
const expectedStructure = {
  'src/components': {
    required: true,
    description: 'UI and shared components',
    subdirs: ['ui', 'shared', 'error-boundaries', 'layout', 'access'],
  },
  'src/features': {
    required: true,
    description: 'Feature-specific modules',
    subdirs: ['auth', 'invitations', 'gallery', 'rsvp', 'amplop'],
  },
  'src/router': {
    required: true,
    description: 'Routing configuration',
    subdirs: ['routes', 'guards', 'utils'],
  },
  'src/utils': {
    required: true,
    description: 'Utility functions',
    subdirs: ['data-transform', 'text-formatting', 'color', 'form', 'test-data', 'error', 'test'],
  },
  'src/types': {
    required: true,
    description: 'Type definitions',
  },
  'src/constants': {
    required: true,
    description: 'Application constants',
  },
  'src/config': {
    required: true,
    description: 'Configuration files',
  },
  'src/hooks': {
    required: true,
    description: 'Custom React hooks',
  },
  'src/lib': {
    required: true,
    description: 'External library configurations',
  },
  'src/pages': {
    required: true,
    description: 'Page components',
    subdirs: ['dashboard', 'buat-undangan', 'undangan-sections', 'layout', 'admin', 'error'],
  },
  'src/assets': {
    required: false,
    description: 'Static assets',
  },
};

// Expected key files
const expectedFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/router/index.tsx',
  'src/components/error-boundaries/index.ts',
  'src/constants/index.ts',
  'src/config/index.ts',
  'src/utils/index.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'vite.config.ts',
  'eslint.config.js',
  'package.json',
];

function validateStructure() {
  log('🏗️  Validating project structure...', 'cyan');
  
  const results = {
    directories: { passed: 0, failed: 0, issues: [] },
    files: { passed: 0, failed: 0, issues: [] },
    overall: true,
  };
  
  // Validate directories
  log('\n📁 Checking directory structure...', 'blue');
  Object.entries(expectedStructure).forEach(([dirPath, config]) => {
    const fullPath = path.join(process.cwd(), dirPath);
    
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      log(`  ✅ ${dirPath} - ${config.description}`, 'green');
      results.directories.passed++;
      
      // Check subdirectories if specified
      if (config.subdirs) {
        config.subdirs.forEach(subdir => {
          const subdirPath = path.join(fullPath, subdir);
          if (fs.existsSync(subdirPath)) {
            log(`    ✅ ${dirPath}/${subdir}`, 'green');
          } else {
            log(`    ⚠️  ${dirPath}/${subdir} - missing but expected`, 'yellow');
            results.directories.issues.push(`Missing subdirectory: ${dirPath}/${subdir}`);
          }
        });
      }
    } else {
      const status = config.required ? '❌' : '⚠️ ';
      const color = config.required ? 'red' : 'yellow';
      log(`  ${status} ${dirPath} - ${config.description} (${config.required ? 'required' : 'optional'})`, color);
      
      if (config.required) {
        results.directories.failed++;
        results.overall = false;
      }
      
      results.directories.issues.push(`${config.required ? 'Missing required' : 'Missing optional'} directory: ${dirPath}`);
    }
  });
  
  // Validate key files
  log('\n📄 Checking key files...', 'blue');
  expectedFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      log(`  ✅ ${filePath}`, 'green');
      results.files.passed++;
    } else {
      log(`  ❌ ${filePath}`, 'red');
      results.files.failed++;
      results.files.issues.push(`Missing file: ${filePath}`);
      results.overall = false;
    }
  });
  
  // Check for common anti-patterns
  log('\n🔍 Checking for anti-patterns...', 'blue');
  const antiPatterns = [
    {
      pattern: 'src/components/pages',
      message: 'Pages should be in src/pages/, not src/components/',
    },
    {
      pattern: 'src/utils/components',
      message: 'Components should be in src/components/, not src/utils/',
    },
    {
      pattern: 'src/helpers',
      message: 'Use src/utils/ instead of src/helpers/',
    },
  ];
  
  let antiPatternsFound = 0;
  antiPatterns.forEach(({ pattern, message }) => {
    const fullPath = path.join(process.cwd(), pattern);
    if (fs.existsSync(fullPath)) {
      log(`  ⚠️  ${pattern} - ${message}`, 'yellow');
      antiPatternsFound++;
      results.directories.issues.push(`Anti-pattern found: ${message}`);
    }
  });
  
  if (antiPatternsFound === 0) {
    log(`  ✅ No anti-patterns found`, 'green');
  }
  
  // Display summary
  log('\n📊 Structure Validation Summary', 'bright');
  log('===============================', 'cyan');
  
  log(`\n📁 Directories: ${results.directories.passed} passed, ${results.directories.failed} failed`, 
    results.directories.failed === 0 ? 'green' : 'red');
  
  log(`📄 Files: ${results.files.passed} passed, ${results.files.failed} failed`, 
    results.files.failed === 0 ? 'green' : 'red');
  
  if (results.directories.issues.length > 0 || results.files.issues.length > 0) {
    log(`\n⚠️  Issues found:`, 'yellow');
    [...results.directories.issues, ...results.files.issues].forEach(issue => {
      log(`  • ${issue}`, 'yellow');
    });
  }
  
  if (results.overall) {
    log(`\n🎉 Project structure validation passed!`, 'green');
    log(`The refactored structure follows best practices.`, 'green');
  } else {
    log(`\n❌ Project structure validation failed`, 'red');
    log(`Please address the issues above before proceeding.`, 'red');
  }
  
  return results;
}

// Additional checks
function checkIndexFiles() {
  log('\n📋 Checking index files...', 'blue');
  
  const indexFiles = [
    'src/components/index.ts',
    'src/utils/index.ts',
    'src/constants/index.ts',
    'src/config/index.ts',
    'src/types/index.ts',
  ];
  
  indexFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const exportCount = (content.match(/export/g) || []).length;
      log(`  ✅ ${filePath} (${exportCount} exports)`, 'green');
    } else {
      log(`  ⚠️  ${filePath} - consider creating for better organization`, 'yellow');
    }
  });
}

// Run validation if called directly
if (require.main === module) {
  try {
    const results = validateStructure();
    checkIndexFiles();
    
    process.exit(results.overall ? 0 : 1);
  } catch (error) {
    log(`❌ Error validating structure: ${error.message}`, 'red');
    process.exit(1);
  }
}

module.exports = { validateStructure };