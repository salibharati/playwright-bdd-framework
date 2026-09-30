
import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { CustomWorld } from '../utils/CustomWorld';

When('I proceed to checkout', async function (this: CustomWorld) {
  await this.page.locator('.shopping_cart_link').click();
  await this.page.locator('#checkout').click();
});

When(
  'I fill in checkout information with {string} {string} {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.page.locator('#first-name').fill(firstName);
    await this.page.locator('#last-name').fill(lastName);
    await this.page.locator('#postal-code').fill(postalCode);
    await this.page.locator('#continue').click();
  }
);

When('I finish the checkout', async function (this: CustomWorld) {
  await this.page.locator('#finish').click();
});

Then('I see the order confirmation page', async function (this: CustomWorld) {
  await expect(this.page.locator('.complete-header'))
    .toHaveText('Thank you for your order!');
});

Then('I generate and save the order confirmation PDF', async function (this: CustomWorld) {
  await expect(this.page.locator('.complete-header'))
    .toHaveText('Thank you for your order!');

  const reportsDirectory = path.resolve(process.cwd(), 'reports');
  fs.mkdirSync(reportsDirectory, { recursive: true });

  const pdfPath = path.join(reportsDirectory, 'order-confirmation.pdf');
  await this.page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  expect(fs.statSync(pdfPath).size).toBeGreaterThan(0);
});