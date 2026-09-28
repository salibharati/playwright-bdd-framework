/**
 * ==========================================================================
 * STEP DEFINITIONS — login.steps.ts
 * --------------------------------------------------------------------------
 * Step definitions are the "glue" between the plain-English Gherkin text
 * in features/login.feature and real Playwright automation code.
 *
 * Cucumber reads each Gherkin line (e.g. "Given I navigate to the login
 * page") and looks for a Given/When/Then call below whose string matches
 * it EXACTLY. When it finds a match, it runs that function.
 *
 * Notice these functions contain NO CSS selectors and NO low-level
 * Playwright calls directly — all of that lives in pages/LoginPage.ts
 * (Page Object Model). This keeps step definitions short, readable, and
 * easy to maintain.
 *
 * `this` inside each function is the CustomWorld instance for the current
 * scenario (see utils/CustomWorld.ts and hooks/hooks.ts), which is where
 * the Playwright `page` and the `loginPage` object live.
 * ==========================================================================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../utils/CustomWorld';
import { config } from '../config/config';

Given('I navigate to the login page', async function (this: CustomWorld) {
  await this.loginPage.navigateToLoginPage();
});

When('I enter valid username and password', async function (this: CustomWorld) {
  // Credentials come from the environment config (config/config.ts),
  // which loads them from config/.env.qa or config/.env.uat depending on
  // the TEST_ENV variable. Nothing is hardcoded here.
  await this.loginPage.enterUsername(config.username);
  await this.loginPage.enterPassword(config.password);
});

When('I enter invalid username and password', async function (this: CustomWorld) {
  await this.loginPage.enterUsername('invalid_user');
  await this.loginPage.enterPassword('wrong_password');
});

When('I click the login button', async function (this: CustomWorld) {
  await this.loginPage.clickLogin();
});

Then('I should be successfully logged in', async function (this: CustomWorld) {
  await this.loginPage.verifySuccessfulLogin();
});

Then('I should see an error message', async function (this: CustomWorld) {
  await this.loginPage.verifyErrorMessage();
});
