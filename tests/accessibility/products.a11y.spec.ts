import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'fs/promises';

test.describe('Accessibility tests for products page', () => {
  test('should have no accessibility violations on products page', async ({ page }) => {
    // Navigate to the products page
    await page.goto('/products');

    // Run accessibility checks using Axe
    const results = await new AxeBuilder({ page }).analyze();

    // Check if there are any violations
    if (results.violations.length > 0) {
      // Create a directory for accessibility reports if it doesn't exist
      await mkdir('accessibility-reports', { recursive: true });

      // Write the violations to a JSON file for further analysis
      await writeFile('accessibility-reports/products-a11y-report.json', JSON.stringify(results.violations, null, 2));

      // Fail the test with a message about the violations
      expect(results.violations.length, 'Accessibility violations found').toBe(0);
    }
  });
});