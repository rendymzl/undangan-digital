#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script to create new components with consistent structure
// Usage: node scripts/create-component.js ComponentName [feature]

const componentName = process.argv[2];
const feature = process.argv[3];

if (!componentName) {
  console.error('Please provide a component name');
  console.log('Usage: node scripts/create-component.js ComponentName [feature]');
  process.exit(1);
}

const componentTemplate = `import React from 'react';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

/**
 * ${componentName} component
 */
export default function ${componentName}({
  className = '',
  children,
}: ${componentName}Props) {
  return (
    <div className={\`${componentName.toLowerCase()} \${className}\`}>
      {children}
    </div>
  );
}

export type { ${componentName}Props };
`;

const indexTemplate = `// ${componentName} component
export { default as ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;

// Determine the target directory
let targetDir;
if (feature) {
  targetDir = path.join('src', 'pages', feature, 'components');
} else {
  targetDir = path.join('src', 'components', 'shared');
}

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Create component file
const componentPath = path.join(targetDir, `${componentName}.tsx`);
fs.writeFileSync(componentPath, componentTemplate);

// Update or create index file
const indexPath = path.join(targetDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  const existingIndex = fs.readFileSync(indexPath, 'utf8');
  if (!existingIndex.includes(componentName)) {
    fs.appendFileSync(indexPath, `\nexport { default as ${componentName} } from './${componentName}';`);
  }
} else {
  fs.writeFileSync(indexPath, indexTemplate);
}

console.log(`✅ Component ${componentName} created successfully!`);
console.log(`📁 Location: ${componentPath}`);
console.log(`📝 Index updated: ${indexPath}`);

if (feature) {
  console.log(`🎯 Feature: ${feature}`);
}