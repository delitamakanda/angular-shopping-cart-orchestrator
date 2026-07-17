import { expect, test } from '@playwright/test';

test.describe('Product Search', () => {
  test('should return relevant products when a search query is entered', async ({ page }) => {
    await page.goto('https://example.com');

    // Enter a search query
    await page.fill('#search-input', 'laptop');
    await page.click('#search-button');

    // Wait for the search results to load
    await page.waitForSelector('.search-results');

    // Verify that the search results contain relevant products
    const productTitles = await page.$$eval('.product-title', titles => titles.map(title => title.textContent));
    expect(productTitles).toContain('Laptop Model A');
    expect(productTitles).toContain('Laptop Model B');
  });
});