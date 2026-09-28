/**
 * ==========================================================================
 * CONFIGURATION LOADER — config/config.ts
 * --------------------------------------------------------------------------
 * This file centralises every "environment-dependent" value the framework
 * needs: base URL, credentials, browser type, headless mode and timeout.
 *
 * Instead of hardcoding these values, we read them from a `.env.<env>`
 * file using the `dotenv` package. Which file gets loaded depends on the
 * TEST_ENV environment variable:
 *
 *   TEST_ENV=qa  -> loads config/.env.qa
 *   TEST_ENV=uat -> loads config/.env.uat
 *   (not set)    -> defaults to "qa"
 *
 * Example:
 *   TEST_ENV=uat npm run test:bdd
 *
 * This keeps secrets/config OUT of the source code and lets the SAME
 * automation code run against different environments just by switching an
 * environment variable.
 * ==========================================================================
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Default to "qa" if no TEST_ENV is provided.
const testEnv = process.env.TEST_ENV?.toLowerCase() || 'qa';
const envFilePath = path.resolve(__dirname, `.env.${testEnv}`);

// `override: true` makes sure values from the .env file win, even if a
// variable with the same name already exists in the OS environment (this
// matters especially for USERNAME, which some operating systems, notably
// Windows, set automatically to the logged-in OS user).
dotenv.config({ path: envFilePath, override: true });

export interface AppConfig {
  baseUrl: string;
  username: string;
  password: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  timeout: number;
  environment: string;
}

export const config: AppConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',

  // APP_USERNAME/APP_PASSWORD are preferred; USERNAME/PASSWORD are also
  // supported to match the naming used in the brief, with a safe fallback.
  username: process.env.APP_USERNAME || process.env.USERNAME || 'standard_user',
  password: process.env.APP_PASSWORD || process.env.PASSWORD || 'secret_sauce',

  browser: (process.env.BROWSER as AppConfig['browser']) || 'chromium',
  headless: process.env.HEADLESS ? process.env.HEADLESS === 'true' : true,
  timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT, 10) : 30000,
  environment: testEnv,
};
