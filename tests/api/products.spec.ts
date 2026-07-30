import { test, expect } from '@playwright/test';
import { getEnvironmentConfig, Environment } from '../../config/environments';
const env: Environment = (process.env.NODE_ENV as Environment) || 'development';
const environmentConfig = getEnvironmentConfig(env);

test.describe('Products API', () => {
  test('should return a list of products', async ({ request }) => {
    const response = await request.get(`${environmentConfig.apiUrl}/store/product/`);
    expect(response.status()).toBe(200);
    const products = await response.json();
    expect(Array.isArray(products.results)).toBe(true);
    expect(products.results.length).toBeGreaterThan(0);
  });
  
  test('should return a specific product by ID', async ({ request }) => {
    const productId = "8b2ab1bb-a0d5-47ce-82e6-845a1787c501"; // Replace with a valid product ID for testing
    const response = await request.get(`${environmentConfig.apiUrl}/store/product/${productId}/detail/`);
    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product.uuid).toBe(productId);
  });
  
  test('should return a 404 for a non-existent product', async ({ request }) => {
    const nonExistentProductId = 9999; // Replace with an ID that does not exist
    const response = await request.get(`${environmentConfig.apiUrl}/store/product/${nonExistentProductId}/detail/`);
    expect(response.status()).toBe(404);
  });
});