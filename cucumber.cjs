/**
 * ==========================================================================
 * CUCUMBER CONFIGURATION (cucumber.cjs)
 * --------------------------------------------------------------------------
 * This is Cucumber.js's recommended configuration file. Both:
 *   - the CLI (`npx cucumber-js`), and
 *   - the programmatic runner (test-runner/runner.ts, via `loadConfiguration`)
 * read this SAME file, so behaviour is always consistent no matter how you
 * start the tests.
 *
 * paths          -> which .feature files to run
 * require        -> glob patterns of TypeScript files Cucumber must load
 *                    BEFORE running (our step definitions and hooks)
 * requireModule  -> Node modules to load first; ts-node/register lets
 *                    Cucumber (a plain Node.js/JavaScript tool) understand
 *                    our TypeScript files on the fly, with no separate
 *                    build step
 * format         -> one or more report formats to generate:
 *                     - progress-bar: live dots/console output
 *                     - html:...     : the readable HTML report
 *                     - json:...     : machine-readable report (CI, etc.)
 * publishQuiet   -> silences the "publish your report to Cucumber Reports
 *                    cloud" prompt
 * ==========================================================================
 */

/** @type {import('@cucumber/cucumber/api').IConfiguration} */
const config = {
  paths: ['features/**/*.feature'],
  require: [
    'step-definitions/**/*.ts',
    'hooks/**/*.ts',
    'utils/**/*.ts',
  ],
  requireModule: ['ts-node/register/transpile-only'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
  },
};

module.exports = {
  default: config,
};
