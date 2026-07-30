import { expect, test } from '@playwright/test';

test.describe('Product Search', () => {
  test('should return relevant products when a search query is entered', async ({ page }) => {
    await page.goto('/');

    // Enter a search query
    await page.fill('#mat-input-0', 'blouse');
    // no clicking the search button because the search is triggered on input change
    // await page.click('#search-button');

    // Wait for the debounced search results to update (search-as-you-type)
    await page.locator('.card-title', { hasText: 'Nikita Blouse' }).first().waitFor();

    // Verify that the search results contain relevant products
    const productTitles = await page.$$eval('.card-title', titles => titles.map(title => title.textContent));

    expect(productTitles).toContain('Nikita Blouse');
    expect(productTitles).toContain('Lunaire Blouse (2colors)');
  });
});