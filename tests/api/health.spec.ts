import { expect, test } from '@playwright/test';
import { getEnvironmentConfig, Environment } from '../../config/environments';

const env: Environment = (process.env.NODE_ENV as Environment) || 'development';
const environmentConfig = getEnvironmentConfig(env);

test.describe('Health API', () => {
  test('should return a successful response from the health endpoint', async ({ request }) => {
    const response = await request.get(`${environmentConfig.apiUrl}/health`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('ok');
  });
});