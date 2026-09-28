/**
 * ==========================================================================
 * CUSTOM CUCUMBER WORLD
 * --------------------------------------------------------------------------
 * Cucumber creates a fresh "World" object for every scenario. The World is
 * just a plain object (`this` inside hooks and step definitions) that lets
 * different steps of the SAME scenario share state.
 *
 * Example: the `Given` step opens the browser page, and the later `When`
 * and `Then` steps need access to that SAME page object. We store it here
 * as `this.page` so every step in the scenario can read/write it.
 *
 * We extend Cucumber's base `World` class and register our version with
 * `setWorldConstructor`, so Cucumber uses OUR class instead of the default
 * empty one.
 * ==========================================================================
 */

import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class CustomWorld extends World {
  // A BrowserContext is an isolated browser "profile" (its own cookies,
  // storage, cache). We create a new one per scenario so tests never leak
  // state (e.g. login sessions) into one another.
  public context!: BrowserContext;

  // A Page is a single browser tab living inside the context above. All
  // Playwright interactions (goto, click, fill) happen through a Page.
  public page!: Page;

  // Page objects are attached to the world so step definitions can reach
  // them via `this.loginPage` without re-instantiating them everywhere.
  public loginPage!: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
