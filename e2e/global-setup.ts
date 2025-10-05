import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the dev server to be ready
    console.log('⏳ Waiting for dev server...');
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:5173');
    await page.waitForSelector('body', { timeout: 30000 });
    console.log('✅ Dev server is ready');

    // Perform any global setup tasks here
    // For example: seed database, create test users, etc.
    
    // Mock authentication state for tests
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'mock-test-token');
      localStorage.setItem('user-id', 'test-user-123');
    });

    console.log('✅ Global setup completed');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;