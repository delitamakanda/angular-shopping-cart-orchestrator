import { config } from 'dotenv';

config();

export type Environment = 'development' | 'production';

export interface TestEnvironment {
  apiUrl: string;
  baseUrl: string;
}

const environments: Record<Environment, TestEnvironment> = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    baseUrl: 'http://localhost:3000',
  },
  production: {
    apiUrl: config().parsed?.API_URL || 'https://api.example.com',
    baseUrl: config().parsed?.BASE_URL || 'https://www.example.com',
  },
}

export function getEnvironmentConfig(env: Environment): TestEnvironment {
    return environments[env];
}