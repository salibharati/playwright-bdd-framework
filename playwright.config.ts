/**
 * ==========================================================================
 * playwright.config.ts
 * --------------------------------------------------------------------------
 * NOTE ON PURPOSE OF THIS FILE:
 * This project intentionally does NOT use the Playwright Test runner
 * (`npx playwright test`) to execute the BDD scenarios — Cucumber.js is the
 * test runner (see cucumber.cjs and test-runner/runner.ts). All actual
 * scenario execution, reporting and pass/fail logic goes through Cucumber.
 *
 * This file exists for two reasons:
 *   1. `npx playwright install` (used to download browser binaries) looks
 *      for a Playwright project, and having this file keeps the project
 *      structure standard and IDE/tooling-friendly.
 *   2. It documents, in one place, the browser settings this framework is
 *      designed around, in case the project is ever extended with native
 *      Playwright Test specs alongside the Cucumber BDD suite.
 *
 * Playwright automation itself (browser/context/page creation) is
 * controlled by hooks/hooks.ts and config/config.ts, NOT by this file.
 * ==========================================================================
 */

import { defineConfig } from '@playwright/test';
import { config } from './config/config';

export default defineConfig({
  // No `testDir` pointing at .feature files — Playwright Test does not
  // understand Gherkin. This config is kept minimal/reference-only.
  timeout: config.timeout,
  use: {
    baseURL: config.baseUrl,
    headless: config.headless,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
