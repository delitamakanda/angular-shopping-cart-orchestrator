import { test, expect } from '@playwright/test';
import { getEnvironmentConfig, Environment } from '../../config/environments';
const env: Environment = (process.env.NODE_ENV as Environment) || 'development';
const environmentConfig = getEnvironmentConfig(env);

test.describe('Products API', () => {
  test('should return a list of products', async ({ request }) => {
    const response = await request.get(`${environmentConfig.apiUrl}/products`);
    expect(response.status()).toBe(200);
    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });
  
  test('should return a specific product by ID', async ({ request }) => {
    const productId = 1; // Replace with a valid product ID for testing
    const response = await request.get(`${environmentConfig.apiUrl}/products/${productId}`);
    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product.id).toBe(productId);
  });
  
  test('should return a 404 for a non-existent product', async ({ request }) => {
    const nonExistentProductId = 9999; // Replace with an ID that does not exist
    const response = await request.get(`${environmentConfig.apiUrl}/products/${nonExistentProductId}`);
    expect(response.status()).toBe(404);
  });
});