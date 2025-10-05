#!/usr/bin/env node

/**
 * Analyze import patterns in the refactored codebase
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

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

function analyzeImports() {
  log('🔍 Analyzing import patterns...', 'cyan');
  
  const srcFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['src/**/*.test.*', 'src/**/*.spec.*'] });
  
  const stats = {
    totalFiles: srcFiles.length,
    pathAliasImports: 0,
    relativeImports: 0,
    externalImports: 0,
    typeOnlyImports: 0,
    problematicImports: [],
    importsByType: {
      '@/components': 0,
      '@/features': 0,
      '@/utils': 0,
      '@/types': 0,
      '@/constants': 0,
      '@/config': 0,
      '@/router': 0,
      '@/hooks': 0,
      '@/lib': 0,
      '@/pages': 0,
      '@/assets': 0,
    },
  };
  
  srcFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineNumber) => {
      const trimmedLine = line.trim();
      
      // Skip non-import lines
      if (!trimmedLine.startsWith('import')) return;
      
      // Count type-only imports
      if (trimmedLine.includes('import type')) {
        stats.typeOnlyImports++;
      }
      
      // Analyze import sources
      const importMatch = trimmedLine.match(/from\s+['"]([^'"]+)['"]/);
      if (!importMatch) return;
      
      const importSource = importMatch[1];
      
      // Categorize imports
      if (importSource.startsWith('@/')) {
        stats.pathAliasImports++;
        
        // Count by alias type
        Object.keys(stats.importsByType).forEach(alias => {
          if (importSource.startsWith(alias)) {
            stats.importsByType[alias]++;
          }
        });
      } else if (importSource.startsWith('.')) {
        stats.relativeImports++;
        
        // Check for problematic relative imports
        if (importSource.includes('../../../')) {
          stats.problematicImports.push({
            file: filePath,
            line: lineNumber + 1,
            import: importSource,
            issue: 'Deep relative import (../../../)',
          });
        } else if (importSource.includes('../../')) {
          stats.problematicImports.push({
            file: filePath,
            line: lineNumber + 1,
            import: importSource,
            issue: 'Consider using path alias instead of ../../',
          });
        }
      } else {
        stats.externalImports++;
      }
    });
  });
  
  // Display results
  log('\n📊 Import Analysis Results', 'bright');
  log('==========================', 'cyan');
  
  log(`\n📁 Files analyzed: ${stats.totalFiles}`, 'blue');
  log(`📦 Total imports breakdown:`, 'blue');
  log(`  • Path alias imports (@/): ${stats.pathAliasImports}`, 'green');
  log(`  • Relative imports (./): ${stats.relativeImports}`, 'yellow');
  log(`  • External imports: ${stats.externalImports}`, 'blue');
  log(`  • Type-only imports: ${stats.typeOnlyImports}`, 'cyan');
  
  log(`\n🎯 Path alias usage:`, 'blue');
  Object.entries(stats.importsByType).forEach(([alias, count]) => {
    if (count > 0) {
      log(`  • ${alias}: ${count}`, 'green');
    }
  });
  
  if (stats.problematicImports.length > 0) {
    log(`\n⚠️  Problematic imports found: ${stats.problematicImports.length}`, 'yellow');
    stats.problematicImports.slice(0, 10).forEach(issue => {
      log(`  • ${issue.file}:${issue.line} - ${issue.issue}`, 'red');
      log(`    ${issue.import}`, 'red');
    });
    
    if (stats.problematicImports.length > 10) {
      log(`  ... and ${stats.problematicImports.length - 10} more`, 'yellow');
    }
  } else {
    log(`\n✅ No problematic imports found!`, 'green');
  }
  
  // Calculate percentages
  const totalImports = stats.pathAliasImports + stats.relativeImports + stats.externalImports;
  const pathAliasPercentage = ((stats.pathAliasImports / totalImports) * 100).toFixed(1);
  
  log(`\n📈 Import quality score:`, 'blue');
  log(`  • Path alias usage: ${pathAliasPercentage}%`, pathAliasPercentage > 80 ? 'green' : 'yellow');
  log(`  • Type-only imports: ${stats.typeOnlyImports}`, 'cyan');
  
  if (pathAliasPercentage > 80 && stats.problematicImports.length === 0) {
    log(`\n🎉 Excellent import organization!`, 'green');
  } else if (pathAliasPercentage > 60) {
    log(`\n👍 Good import organization, room for improvement`, 'yellow');
  } else {
    log(`\n⚠️  Import organization needs improvement`, 'red');
  }
  
  return stats;
}

// Run analysis if called directly
if (require.main === module) {
  try {
    analyzeImports();
  } catch (error) {
    log(`❌ Error analyzing imports: ${error.message}`, 'red');
    process.exit(1);
  }
}

module.exports = { analyzeImports };