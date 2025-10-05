import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a specific dashboard page
   */
  async navigateTo(path: string) {
    await this.page.goto(`/dashboard${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('[data-testid="page-loaded"]', { 
      timeout: 10000,
      state: 'attached'
    }).catch(() => {
      // Fallback: wait for common elements
      return this.page.waitForSelector('main, [role="main"]', { timeout: 10000 });
    });
  }

  /**
   * Fill form field by label
   */
  async fillFieldByLabel(label: string, value: string) {
    const field = this.page.getByLabel(label);
    await field.fill(value);
  }

  /**
   * Click button by text
   */
  async clickButton(text: string) {
    const button = this.page.getByRole('button', { name: text });
    await button.click();
  }

  /**
   * Wait for toast notification
   */
  async waitForToast(message?: string) {
    if (message) {
      await expect(this.page.getByText(message)).toBeVisible({ timeout: 5000 });
    } else {
      // Wait for any toast-like element
      await this.page.waitForSelector('[role="alert"], .toast, [data-testid="toast"]', {
        timeout: 5000
      });
    }
  }

  /**
   * Wait for modal to open
   */
  async waitForModal(title?: string) {
    await this.page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    if (title) {
      await expect(this.page.getByRole('dialog').getByText(title)).toBeVisible();
    }
  }

  /**
   * Close modal by clicking outside or close button
   */
  async closeModal() {
    // Try to find and click close button first
    const closeButton = this.page.getByRole('button', { name: /close|batal|cancel/i });
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Fallback: press Escape key
      await this.page.keyboard.press('Escape');
    }
    
    // Wait for modal to disappear
    await this.page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 5000 });
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Simulate file upload
   */
  async uploadFile(selector: string, filePath: string) {
    const fileInput = this.page.locator(selector);
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Wait for network requests to complete
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 });
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for specific text to appear
   */
  async waitForText(text: string, timeout = 5000) {
    await this.page.waitForSelector(`text=${text}`, { timeout });
  }

  /**
   * Get table data
   */
  async getTableData(tableSelector: string) {
    const rows = await this.page.locator(`${tableSelector} tbody tr`).all();
    const data = [];
    
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      data.push(cells);
    }
    
    return data;
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selectSelector: string, optionText: string) {
    await this.page.locator(selectSelector).click();
    await this.page.getByText(optionText).click();
  }

  /**
   * Check accessibility violations
   */
  async checkAccessibility() {
    // This would integrate with axe-playwright for accessibility testing
    // await injectAxe(this.page);
    // const violations = await checkA11y(this.page);
    // expect(violations).toHaveLength(0);
  }

  /**
   * Mock API response
   */
  async mockApiResponse(url: string, response: any) {
    await this.page.route(url, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Wait for API call
   */
  async waitForApiCall(url: string) {
    return this.page.waitForResponse(response => 
      response.url().includes(url) && response.status() === 200
    );
  }
}