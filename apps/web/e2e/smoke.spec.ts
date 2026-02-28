import { test, expect } from '@playwright/test';

test('login and navigate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Logged in as')).toBeVisible();
  await page.goto('/employees');
  await page.goto('/leave');
});
