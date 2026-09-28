/**
 * ==========================================================================
 * TEST RUNNER — test-runner/runner.ts
 * --------------------------------------------------------------------------
 * This is a programmatic entry point for running the whole BDD suite,
 * using Cucumber.js's official `@cucumber/cucumber/api` module.
 *
 * IMPORTANT: Cucumber is the test runner here — NOT the Playwright Test
 * runner (`npx playwright test`). Playwright is used purely as a browser
 * automation LIBRARY (via `chromium.launch()` etc. in hooks/hooks.ts).
 * This file is what drives Cucumber:
 *   1. loadConfiguration() reads cucumber.cjs (paths, require globs,
 *      formatters, etc.) — the SAME config the CLI uses.
 *   2. runCucumber() then:
 *        - finds every .feature file under `paths`
 *        - loads step-definitions/**, hooks/** (via `require`)
 *        - executes each scenario, step by step
 *        - writes the HTML + JSON reports
 *   3. The process exits with code 0 (success) or 1 (failure), which is
 *      what CI systems use to know whether the build should pass or fail.
 *
 * Run it with:
 *   npm run test:bdd:runner
 * ==========================================================================
 */

import { loadConfiguration, runCucumber } from '@cucumber/cucumber/api';

async function main(): Promise<void> {
  // Reads cucumber.cjs from the project root and merges it with any
  // CLI-style overrides we want to force from code (none needed here,
  // since cucumber.cjs already has everything we need).
  const { runConfiguration } = await loadConfiguration({
    provided: {},
  });

  console.log(`\nRunning Cucumber BDD suite (TEST_ENV=${process.env.TEST_ENV || 'qa'})...\n`);

  const { success } = await runCucumber(runConfiguration);

  if (success) {
    console.log('\n✅ All scenarios passed. HTML report: reports/cucumber-report.html\n');
  } else {
    console.error('\n❌ Some scenarios failed. See reports/cucumber-report.html for details.\n');
  }

  process.exit(success ? 0 : 1);
}

main().catch((error) => {
  console.error('Fatal error while running the Cucumber BDD suite:', error);
  process.exit(1);
});
