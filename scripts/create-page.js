#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script to create new pages with consistent structure
// Usage: node scripts/create-page.js PageName feature

const pageName = process.argv[2];
const feature = process.argv[3];

if (!pageName || !feature) {
  console.error('Please provide both page name and feature');
  console.log('Usage: node scripts/create-page.js PageName feature');
  console.log('Example: node scripts/create-page.js GuestListPage guests');
  process.exit(1);
}

const pageTemplate = `import React from 'react';
import { PageTemplate } from '@/templates/PageTemplate';
import { Button } from '@/components/ui/button';

/**
 * ${pageName} - ${feature} feature page
 */
export default function ${pageName}() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: '${feature.charAt(0).toUpperCase() + feature.slice(1)}' },
  ];

  const actions = (
    <div className="flex gap-2">
      <Button>
        Primary Action
      </Button>
    </div>
  );

  return (
    <PageTemplate
      title="${pageName.replace(/([A-Z])/g, ' $1').trim()}"
      description="Description for ${pageName}"
      breadcrumbs={breadcrumbs}
      actions={actions}
      featureName="${feature.charAt(0).toUpperCase() + feature.slice(1)}"
    >
      <div className="space-y-6">
        {/* Page content goes here */}
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">${pageName}</h2>
          <p className="text-gray-600">This page is ready for implementation.</p>
        </div>
      </div>
    </PageTemplate>
  );
}
`;

const hookTemplate = `import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/shared';

interface Use${pageName.replace('Page', '')}Options {
  // Define options here
}

/**
 * Hook for ${pageName} functionality
 */
export default function use${pageName.replace('Page', '')}(
  options: Use${pageName.replace('Page', '')}Options = {}
) {
  const [data, setData] = useState(null);
  const { execute, loading, error } = useApi();

  const fetchData = async () => {
    try {
      const result = await execute(async () => {
        // API call implementation
        return Promise.resolve(null);
      });
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
`;

// Create directories
const pageDir = path.join('src', 'pages', feature);
const hooksDir = path.join(pageDir, 'hooks');

[pageDir, hooksDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create page file
const pagePath = path.join(pageDir, `${pageName}.tsx`);
fs.writeFileSync(pagePath, pageTemplate);

// Create hook file
const hookPath = path.join(hooksDir, `use${pageName.replace('Page', '')}.ts`);
fs.writeFileSync(hookPath, hookTemplate);

// Update hooks index
const hooksIndexPath = path.join(hooksDir, 'index.ts');
const hookExport = `export { default as use${pageName.replace('Page', '')} } from './use${pageName.replace('Page', '')}';`;

if (fs.existsSync(hooksIndexPath)) {
  const existingIndex = fs.readFileSync(hooksIndexPath, 'utf8');
  if (!existingIndex.includes(`use${pageName.replace('Page', '')}`)) {
    fs.appendFileSync(hooksIndexPath, `\n${hookExport}`);
  }
} else {
  fs.writeFileSync(hooksIndexPath, `// ${feature} hooks\n${hookExport}\n`);
}

console.log(`✅ Page ${pageName} created successfully!`);
console.log(`📁 Page: ${pagePath}`);
console.log(`🪝 Hook: ${hookPath}`);
console.log(`🎯 Feature: ${feature}`);
console.log(`\n📝 Next steps:`);
console.log(`1. Add route to src/router/index.tsx`);
console.log(`2. Add navigation link to sidebar if needed`);
console.log(`3. Implement page functionality`);
console.log(`4. Add tests for the new page`);