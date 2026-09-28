/**
 * ==========================================================================
 * PAGE OBJECT MODEL (POM) — LoginPage
 * --------------------------------------------------------------------------
 * The Page Object Model is a design pattern that puts all knowledge about
 * a specific screen/page of the application in ONE class:
 *   - the CSS/XPath locators for elements on that page
 *   - the actions a user can perform on that page (click, fill, etc.)
 *
 * WHY we do this:
 *   - Step definitions stay readable (business language, no CSS selectors).
 *   - If the UI changes (e.g. a button's id changes), we fix it in ONE
 *     place (this file) instead of hunting through every step definition.
 *   - Page objects can be reused across many scenarios/features.
 *
 * `Page` is Playwright's object representing a single browser tab. All
 * interaction with the browser (navigating, clicking, typing, reading
 * text) happens through this object.
 * ==========================================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/config';

export class LoginPage {
  private readonly page: Page;

  // ---- Locators -----------------------------------------------------
  // Keeping locators as readonly class fields means they are defined once
  // (in the constructor) and reused by every method below.
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly inventoryList: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.inventoryList = page.locator('.inventory_list');
  }

  /**
   * Navigates the browser to the SauceDemo login page.
   * The base URL comes from config/config.ts, which itself is loaded from
   * the environment file selected via the TEST_ENV variable.
   */
  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(config.baseUrl);
  }

  /**
   * Types the given username into the username field.
   * `fill()` clears the field first, then types the value.
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Types the given password into the password field.
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the "Login" button to submit the credentials.
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Verifies that login succeeded: the browser should have navigated to
   * the inventory page and the product list should be visible.
   * Uses Playwright's web-first assertions (`expect`), which automatically
   * retry until the condition is true or the timeout is reached.
   */
  async verifySuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.inventoryList).toBeVisible();
  }

  /**
   * Verifies that an inline error message is shown after a failed login
   * attempt (e.g. wrong username/password).
   */
  async verifyErrorMessage(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  /**
   * Returns the text of the error message, useful if a scenario wants to
   * assert on the exact wording of the error.
   */
  async getErrorMessageText(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
