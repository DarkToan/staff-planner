import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 1360, height: 718 }, { width: 1440, height: 900 }]) {
  test(`login content fits the desktop viewport at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const heading = page.getByRole('heading', { name: 'Your team starts here.' });
    await expect(heading).toHaveCSS('line-height', '42px');
    await expect(heading).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole('heading', { name: 'Good planning. Better days.' })).toBeInViewport({ ratio: 1 });
    await expect(page.getByLabel('Email address', { exact: true })).toBeInViewport({ ratio: 1 });
    await expect(page.getByLabel('Password', { exact: true })).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole('button', { name: 'Sign in to demo' })).toBeInViewport({ ratio: 1 });
    await expect(page.getByText('A frontend-only product preview. No account needed.')).toBeInViewport({ ratio: 1 });

    const headingBounds = await heading.boundingBox();
    const descriptionBounds = await page.getByText('Explore a simpler way to manage absences and keep your team covered.').boundingBox();
    expect(descriptionBounds!.y).toBeGreaterThanOrEqual(headingBounds!.y + headingBounds!.height);

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    expect(await page.locator('.login-page').evaluate(element => element.getBoundingClientRect().height)).toBeLessThanOrEqual(viewport.height + 1);
    await page.screenshot({ path: `test-results/login-${viewport.width}.png` });
  });
}

for (const viewport of [{ width: 1090, height: 574 }, { width: 390, height: 844 }]) {
  test(`login remains compact and usable in a reduced viewport at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const heading = page.getByRole('heading', { name: 'Your team starts here.' });
    await expect(heading).toHaveCSS('line-height', '42px');
    const bounds = await heading.boundingBox();
    // Two text lines plus Tamagui's small glyph-clipping padding.
    expect(bounds?.height).toBeLessThanOrEqual(86);
    expect(await page.locator('.login-page').evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(1100);

    await page.getByLabel('Email address', { exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByLabel('Email address', { exact: true })).toBeInViewport({ ratio: 1 });
    await page.getByRole('button', { name: 'Sign in to demo' }).click();
    await expect(page.getByRole('heading', { name: 'A little clarity for your week.' })).toBeVisible();
  });
}