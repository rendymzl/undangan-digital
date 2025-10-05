#!/usr/bin/env node

/**
 * Development tools for the refactored Menantikan project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔧 ${description}`, 'cyan');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    return false;
  }
}

// Available commands
const commands = {
  'type-check': {
    description: 'Run TypeScript type checking',
    command: 'npx tsc --noEmit',
  },
  'lint': {
    description: 'Run ESLint on the codebase',
    command: 'npx eslint . --ext .ts,.tsx',
  },
  'lint-fix': {
    description: 'Run ESLint and fix auto-fixable issues',
    command: 'npx eslint . --ext .ts,.tsx --fix',
  },
  'build': {
    description: 'Build the application',
    command: 'npm run build',
  },
  'test-architecture': {
    description: 'Test the refactored architecture',
    command: 'node -e "console.log(\'Architecture tests would run here - integrate with your test runner\')"',
  },
  'analyze-imports': {
    description: 'Analyze import patterns',
    command: 'node scripts/analyze-imports.js',
  },
  'validate-structure': {
    description: 'Validate project structure',
    command: 'node scripts/validate-structure.js',
  },
};

function showHelp() {
  log('\n🛠️  Menantikan Development Tools', 'bright');
  log('=====================================', 'cyan');
  log('\nAvailable commands:', 'yellow');
  
  Object.entries(commands).forEach(([cmd, info]) => {
    log(`  ${cmd.padEnd(20)} - ${info.description}`, 'white');
  });
  
  log('\nUsage:', 'yellow');
  log('  node scripts/dev-tools.js <command>', 'white');
  log('  node scripts/dev-tools.js all        - Run all checks', 'white');
  log('  node scripts/dev-tools.js help       - Show this help', 'white');
}

function runAll() {
  log('\n🚀 Running all development checks...', 'bright');
  
  const results = [];
  const checksToRun = ['type-check', 'lint', 'build'];
  
  checksToRun.forEach(cmd => {
    const success = runCommand(commands[cmd].command, commands[cmd].description);
    results.push({ cmd, success });
  });
  
  log('\n📊 Summary:', 'bright');
  results.forEach(({ cmd, success }) => {
    const status = success ? '✅' : '❌';
    log(`  ${status} ${cmd}`, success ? 'green' : 'red');
  });
  
  const allPassed = results.every(r => r.success);
  if (allPassed) {
    log('\n🎉 All checks passed!', 'green');
  } else {
    log('\n⚠️  Some checks failed. Please review the output above.', 'yellow');
    process.exit(1);
  }
}

// Main execution
const command = process.argv[2];

if (!command || command === 'help') {
  showHelp();
} else if (command === 'all') {
  runAll();
} else if (commands[command]) {
  runCommand(commands[command].command, commands[command].description);
} else {
  log(`❌ Unknown command: ${command}`, 'red');
  showHelp();
  process.exit(1);
}