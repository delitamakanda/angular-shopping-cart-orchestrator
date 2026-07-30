import { config } from 'dotenv';

config();

export type Environment = 'development' | 'production';

export interface TestEnvironment {
  apiUrl: string;
  baseUrl: string;
}

const environments: Record<Environment, TestEnvironment> = {
  development: {
    apiUrl: 'https://merchstoreapi.applikuapp.com/api',
    baseUrl: 'https://agreeable-wave-082824403.5.azurestaticapps.net/fr/home',
  },
  production: {
    apiUrl: config().parsed?.API_URL || 'https://merchstoreapi.applikuapp.com/api',
    baseUrl: config().parsed?.BASE_URL || 'https://agreeable-wave-082824403.5.azurestaticapps.net/fr/home',
  },
}

export function getEnvironmentConfig(env: Environment): TestEnvironment {
    return environments[env];
}