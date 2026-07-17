import 'dotenv/config';

import { defineConfig, devices } from '@playwright/test';

import { getEnvironmentConfig, Environment } from './config/environments';

const env: Environment = (process.env.NODE_ENV as Environment) || 'development';
const environmentConfig = getEnvironmentConfig(env);

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['html', { 
        outputFolder: 'reports/playwright-html', open: 'never'
    }],
    [
        'json',
        {
            outputFile: 'reports/playwright.json',
        },
    ],
    [
        'junit',
        {
            outputFile: 'reports/playwright-junit.xml',
        },
    ]
  ],

  use: {
    baseURL: environmentConfig.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    serviceWorkers: 'block',
    ignoreHTTPSErrors: false,
  },

  outputDir: 'reports/playwright-results',

  projects: [
    {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
    },
  ],
});