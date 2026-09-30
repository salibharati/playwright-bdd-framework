import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../utils/CustomWorld';

When('I add {string} to the cart', async function (this: CustomWorld, productName: string) {
  const inventoryItem = this.page.locator('.inventory_item').filter({ hasText: productName });
  await expect(inventoryItem).toHaveCount(1);
  await inventoryItem.getByRole('button', { name: 'Add to cart' }).click();
});

Then('I see cart badge count as {string}', async function (this: CustomWorld, count: string) {
  await expect(this.page.locator('.shopping_cart_badge')).toHaveText(count);
});

Then('I see {string} in the cart', async function (this: CustomWorld, productName: string) {
  await this.page.locator('.shopping_cart_link').click();
  const cartItem = this.page.locator('.cart_item').filter({ hasText: productName });
  await expect(cartItem.locator('.inventory_item_name')).toHaveText(productName);
});
