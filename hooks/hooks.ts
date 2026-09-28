/**
 * ==========================================================================
 * CUCUMBER HOOKS
 * --------------------------------------------------------------------------
 * Hooks are functions that Cucumber runs automatically around scenarios,
 * without being written as Gherkin steps:
 *
 *   BeforeAll -> runs ONCE, before any scenario in the whole test run
 *   Before    -> runs before EVERY scenario
 *   After     -> runs after EVERY scenario (even if it failed)
 *   AfterAll  -> runs ONCE, after every scenario has finished
 *
 * We use them here to manage the Playwright Browser / BrowserContext / Page
 * lifecycle so that:
 *   - the browser is launched only once (fast),
 *   - each scenario gets a clean, isolated context/page (reliable),
 *   - a screenshot is captured and attached to the report on failure,
 *   - every resource is closed properly so nothing leaks.
 * ==========================================================================
 */

import { Before, After, AfterStep, BeforeAll, AfterAll, Status, ITestCaseHookParameter, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, webkit } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { CustomWorld } from '../utils/CustomWorld';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../config/config';

setDefaultTimeout(config.timeout);

// The Browser instance (e.g. Chromium) is shared across all scenarios.
// Launching a browser process is relatively slow, so we do it once.
let browser: Browser;

/**
 * BeforeAll: launches the browser once before any scenario runs.
 * `headless` comes from config (env var HEADLESS), so the same code can run
 * with a visible browser window (debugging) or headless (CI).
 */
BeforeAll(async function () {
  const browserType = config.browser;

  if (browserType === 'firefox') {
    browser = await firefox.launch({ headless: config.headless });
  } else if (browserType === 'webkit') {
    browser = await webkit.launch({ headless: config.headless });
  } else {
    browser = await chromium.launch({ headless: config.headless });
  }
});

/**
 * Before: runs before every single scenario.
 * Creates a brand-new BrowserContext (isolated cookies/storage) and Page,
 * then stores them on `this` (the CustomWorld) so step definitions can use
 * them via `this.page`.
 */
Before(async function (this: CustomWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.timeout);

  // The LoginPage object is created here (once the page exists) and reused
  // by every step definition in the scenario.
  this.loginPage = new LoginPage(this.page);
});

/**
 * AfterStep: adds a brief pause after each step so the browser interaction is
 * visible while the scenario is running.
 */
AfterStep(async function (this: CustomWorld) {
  if (this.page && !this.page.isClosed()) {
    await this.page.waitForTimeout(1200);
  }
});

/**
 * After: runs after every single scenario, whether it passed or failed.
 * - On failure: takes a full-page screenshot and attaches it to the
 *   Cucumber report (visible directly in the HTML report).
 * - Always: closes the page and context so no browser resources leak
 *   between scenarios.
 */
After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const safeScenarioName = scenario.pickle.name.replace(/[^a-z0-9]+/gi, '_');
    const screenshotPath = path.join(screenshotDir, `${safeScenarioName}_${Date.now()}.png`);

    // Save to disk for easy manual inspection...
    const screenshotBuffer = await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    // ...and attach the same image bytes to the Cucumber report so it shows
    // up inline in the HTML report next to the failing step.
    await this.attach(screenshotBuffer, 'image/png');
  }

  // Always clean up, even when no screenshot was needed.
  if (this.page && !this.page.isClosed()) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});

/**
 * AfterAll: runs once after every scenario has completed.
 * Closes the shared Browser instance so the Node process can exit cleanly
 * and no browser process is left running in the background.
 */
AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
