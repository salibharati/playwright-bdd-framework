# Playwright + TypeScript + Cucumber BDD Framework (SauceDemo)

A beginner-friendly BDD test automation framework for **https://www.saucedemo.com**, built with:

- **Playwright** — browser automation library
- **TypeScript** — typed JavaScript
- **@cucumber/cucumber** — BDD test runner (Gherkin)
- **Node.js / npm**

> Cucumber is the test runner. Playwright is used only as the browser automation library
> (via `chromium.launch()`), **not** via the Playwright Test runner (`npx playwright test`).

---

## A. Project Architecture

```
playwright-bdd-framework/
│
├── features/                # Gherkin .feature files (plain-English scenarios)
│   └── login.feature
│
├── step-definitions/        # Glue code connecting Gherkin steps to Page Objects
│   └── login.steps.ts
│
├── pages/                   # Page Object Model — locators + UI actions per page
│   └── LoginPage.ts
│
├── hooks/                   # Cucumber Before/After hooks (browser lifecycle, screenshots)
│   └── hooks.ts
│
├── config/                  # Environment configuration
│   ├── config.ts            # Loads the right .env file and exposes typed config
│   ├── .env.qa               # QA environment variables
│   └── .env.uat              # UAT environment variables
│
├── test-runner/             # Programmatic Cucumber runner (alternative to the CLI)
│   └── runner.ts
│
├── utils/                   # Shared helpers
│   └── CustomWorld.ts       # Cucumber World: shares browser/page across steps
│
├── reports/                 # Generated HTML/JSON Cucumber reports (git-ignored)
├── screenshots/             # Generated failure screenshots (git-ignored)
│
├── cucumber.cjs             # Cucumber CLI configuration (paths, formatters, etc.)
├── playwright.config.ts     # Reference Playwright config (not used to run BDD tests)
├── tsconfig.json            # TypeScript compiler configuration
├── package.json             # Dependencies and npm scripts
└── README.md                # This file
```

### Role of each folder/file

| Path | Role |
|---|---|
| `features/` | Business-readable Gherkin scenarios. No code, no selectors. |
| `step-definitions/` | Maps each Gherkin line to a TypeScript function that calls a Page Object. |
| `pages/` | Page Object Model classes: all locators + UI actions for one page live together. |
| `hooks/` | Launches/closes the browser, creates a fresh context+page per scenario, captures screenshots on failure. |
| `config/` | Loads `.env.<TEST_ENV>` and exposes a single typed `config` object (base URL, credentials, browser, timeout). |
| `test-runner/` | A programmatic way to kick off the whole Cucumber suite from Node/TypeScript instead of the CLI. |
| `utils/CustomWorld.ts` | The Cucumber "World" — carries `page`/`context`/`loginPage` between the steps of one scenario. |
| `reports/` | Where the generated HTML and JSON Cucumber reports are written. |
| `screenshots/` | Where failure screenshots are saved (and also attached inline into the HTML report). |
| `cucumber.cjs` | Single source of truth for which features/steps to load and which report formats to generate. |
| `playwright.config.ts` | Documents browser/timeout settings; kept for tooling compatibility. Not the test runner. |

---

## B. Installation

```bash
cd playwright-bdd-framework
npm install
```

## C. Installing Playwright browsers

Playwright needs its own browser binaries (separate from any browser already on your machine):

```bash
npm run install:browsers
```

This runs `playwright install --with-deps chromium`. To install all browsers instead, run `npx playwright install`.

## D. Configuring environment files

Environment variables live in `config/.env.qa` and `config/.env.uat`:

```
BASE_URL=https://www.saucedemo.com
APP_USERNAME=standard_user
APP_PASSWORD=secret_sauce
BROWSER=chromium
HEADLESS=true
TIMEOUT=30000
```

Select which file is loaded with the `TEST_ENV` variable (defaults to `qa` if not set):

```bash
TEST_ENV=uat npm run test:bdd
```

`config/config.ts` reads the matching file via `dotenv` and exposes a single typed `config` object used everywhere (Page Objects, hooks). Nothing is hardcoded in the automation code itself.

## E. Running all BDD tests

```bash
npm run test:bdd
```

This cleans old reports/screenshots, then runs `cucumber-js` using `cucumber.cjs`, and writes:
- `reports/cucumber-report.html`
- `reports/cucumber-report.json`

Alternatively, run the same suite through the programmatic runner:

```bash
npm run test:bdd:runner
```

## F. Running a specific feature file

```bash
npx cucumber-js features/login.feature
```

## G. Running a specific scenario or tag

By tag (recommended — scenarios are tagged `@smoke` / `@regression`):

```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@regression"
# or the shortcuts:
npm run test:bdd:smoke
npm run test:bdd:regression
```

By exact scenario name:

```bash
npx cucumber-js --name "Successful login with valid credentials"
```

By line number (single scenario in a file):

```bash
npx cucumber-js features/login.feature:9
```

## H. Running in headed mode

```bash
npm run test:bdd:headed
```

This sets `HEADLESS=false` for that run, so `hooks/hooks.ts` launches a **visible** browser window. You can also just edit `HEADLESS` in the relevant `.env.<env>` file.

## I. Generating the HTML report

The HTML report is generated automatically on every run (see `cucumber.cjs`'s `format` array). To generate it explicitly:

```bash
npm run test:bdd:html
```

Then open `reports/cucumber-report.html` in any browser. It shows, per feature/scenario:
- Feature and Scenario names and tags
- Every step, with pass/fail status
- Execution duration
- The failure error message and stack trace (for failed steps)
- Attached screenshots (for failed scenarios)

## J. How screenshots are captured on failure

In `hooks/hooks.ts`, the `After` hook checks `scenario.result?.status === Status.FAILED`. If the scenario failed:
1. A full-page screenshot is taken with `this.page.screenshot({ path, fullPage: true })`.
2. It's saved to `screenshots/<scenario-name>_<timestamp>.png`.
3. The same image bytes are attached to the scenario via `this.attach(buffer, 'image/png')`, which makes Cucumber embed it directly inside the HTML report.
4. The page/context are then closed regardless of pass/fail, so no browser resources leak.

## K. How the framework works end-to-end

See the **Execution Flow** section below.

---

## Tagging support

Scenarios are tagged in `features/login.feature`:

```gherkin
@smoke
Scenario: Successful login with valid credentials
  ...

@regression
Scenario: Login with invalid credentials
  ...
```

Run only smoke tests:

```bash
npx cucumber-js --tags "@smoke"
```

Combine tags (AND / OR / NOT are supported by Cucumber's tag expressions):

```bash
npx cucumber-js --tags "@smoke and not @wip"
```

---

## Included scenarios

| Tag | Scenario | Outcome |
|---|---|---|
| `@smoke` | Successful login with valid credentials | Redirected to the inventory page |
| `@regression` | Login with invalid credentials | Inline error message is shown |

---

## Clean coding practices used

- `async/await` everywhere Playwright/Cucumber APIs are asynchronous
- Explicit TypeScript types/interfaces (e.g. `AppConfig`)
- Page Object Model — one class per page, locators encapsulated
- Reusable, single-purpose methods (`enterUsername`, `clickLogin`, ...)
- No hardcoded credentials — everything comes from `config/.env.*` via `config/config.ts`
- No duplicated Playwright code — all browser calls live in `pages/` and `hooks/`
- Meaningful, intention-revealing names for variables, methods and files

---

## Execution Flow

```
Feature File            (features/login.feature — Gherkin steps)
     ↓
Cucumber                (matches each Gherkin line to a step definition)
     ↓
Step Definition         (step-definitions/login.steps.ts — calls the page object)
     ↓
Page Object             (pages/LoginPage.ts — locators + actions)
     ↓
Playwright               (Page/Locator API — fill, click, expect)
     ↓
Browser                  (Chromium instance launched in hooks/hooks.ts)
     ↓
Application               (https://www.saucedemo.com)
     ↓
Cucumber Report           (reports/cucumber-report.html — steps, status, duration,
                            failure messages, attached screenshots)
```

**In words:**

1. `npm run test:bdd` (or `test:bdd:runner`) starts Cucumber, which reads `cucumber.cjs`.
2. Cucumber loads every `.feature` file, plus `step-definitions/**` and `hooks/**`.
3. `BeforeAll` launches one shared Playwright `Browser`.
4. For each scenario, `Before` opens a fresh `BrowserContext` + `Page` and stores them on the Cucumber `World` (`utils/CustomWorld.ts`), along with a new `LoginPage` instance.
5. Cucumber executes each Gherkin step in order, calling the matching function in `step-definitions/login.steps.ts`.
6. Each step definition calls a method on `LoginPage`, which performs the actual Playwright action (`goto`, `fill`, `click`) or assertion (`expect(...).toBeVisible()`) against the real browser and the SauceDemo application.
7. `After` closes the page/context; on failure it also captures and attaches a screenshot.
8. `AfterAll` closes the shared browser once the whole suite has finished.
9. Cucumber's formatters write the final `reports/cucumber-report.html` (and `.json`), which you open in a browser to review results, durations, failures and screenshots.
