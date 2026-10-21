import { test, expect, Page } from '@playwright/test';

async function signIn(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in to demo' }).click();
  await expect(page.getByRole('heading', { name: 'A little clarity for your week.' })).toBeVisible();
}
async function connect(page: Page) {
  await page.getByRole('button', { name: 'Connect Office 365' }).click();
  await page.getByRole('button', { name: 'Confirm simulated connection' }).click();
  await expect(page.getByText('Connected · simulated', { exact: true })).toBeVisible();
}
async function processBatch(page: Page) {
  await connect(page);
  await page.getByRole('button', { name: 'Process new emails', exact: true }).click();
  await expect(page.getByText('Simulated processing', { exact: true })).toBeVisible();
  await expect(page.getByText('Your demo inbox is up to date.')).toBeVisible({ timeout: 20000 });
}
test('complete demo: processing, evidence, calendar, decisions, changes, downloads, reset', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.url().startsWith('http') && !request.url().startsWith('http://localhost:8081')) external.push(request.url()); });
  await signIn(page);
  await page.screenshot({ path: 'test-results/overview-before.png', fullPage: true });
  await connect(page);
  await page.getByRole('button', { name: 'Process new emails', exact: true }).click();
  await expect(page.getByText('Simulated processing', { exact: true })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Emails' }).click();
  await expect(page.getByText('Simulated processing', { exact: true })).toBeVisible();
  await expect(page.getByText('12 emails processed. 7 absence-related')).toBeVisible({ timeout: 20000 });
  await expect(page.getByText('StaffPlanner-Processed', { exact: true })).toHaveCount(14);
  const unreadProcessed = page.getByRole('row').filter({ hasText: 'Wednesday afternoon appointment' });
  await expect(unreadProcessed.getByText('Unread', { exact: true })).toBeVisible();
  await expect(unreadProcessed.getByText('Processed', { exact: true })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Staffing calendar' }).click();
  await expect(page.locator('.fc-resource-timeline')).toBeVisible();
  await expect(page.locator('.fc-datagrid-body').getByText('Alice Bennett')).toBeVisible();
  await expect(page.locator('.fc-timeline-event')).toHaveCount(8);
  await page.screenshot({ path: 'test-results/staffing-week.png', fullPage: true });
  await page.getByRole('button', { name: /Review Ben Carter:.*Pending/ }).click();
  await expect(page.getByRole('heading', { name: 'Request details' })).toBeVisible();
  await expect(page.getByText('I need Wednesday 21 October, 13:00–17:00, for a personal appointment.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'View full email' }).click();
  await expect(page.locator('mark')).toContainText('Wednesday 21 October');
  await page.getByRole('button', { name: 'Close Source email' }).click();
  await page.getByRole('button', { name: 'Approve', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm decision' }).click();
  await expect(page.getByRole('dialog', { name: 'Request details', exact: true }).getByText('Approved', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close Request details' }).click();
  await expect(page.getByRole('button', { name: /Review Ben Carter:.*Approved/ })).toBeVisible();
  await page.getByRole('button', { name: 'Month overview' }).click();
  await expect(page.locator('.fc-dayGridMonth-view')).toBeVisible();
  await expect(page.locator('.fc-daygrid-event').filter({ hasText: 'Ben Carter' })).toBeVisible();
  await page.getByRole('button', { name: 'Next period' }).click();
  await expect(page.getByRole('heading', { name: 'November 2026' })).toBeVisible();
  await page.getByRole('button', { name: 'Demo week', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'October 2026' })).toBeVisible();
  await page.getByRole('button', { name: 'Export sample' }).click();
  for (const content of ['approved-absences', 'work-schedule']) {
    await page.getByLabel('Sample content').selectOption(content);
    for (const format of ['csv', 'ics']) {
      await page.getByLabel('Format', { exact: true }).selectOption(format);
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('link', { name: `Download sample ${format.toUpperCase()}` }).click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe(`staffplanner-sample-${content}.${format}`);
      expect(await download.failure()).toBeNull();
    }
  }
  await page.getByRole('button', { name: 'Close Download a sample export' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Requests' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Ben Carter' }).getByText('Approved', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Review Alice Bennett' }).click();
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm decision' }).click();
  await page.getByRole('button', { name: 'Close Request details' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Alice Bennett' }).getByText('Declined', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Review Chloe Davis' }).click();
  await page.getByRole('button', { name: 'Needs clarification', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm decision' }).click();
  await page.getByRole('button', { name: 'Close Request details' }).click();
  await page.getByRole('button', { name: 'Review Diego Evans' }).click();
  await page.getByRole('button', { name: 'Accept amendment' }).click();
  await page.getByRole('button', { name: 'Confirm decision' }).click();
  await page.getByRole('button', { name: 'Close Request details' }).click();
  await page.getByRole('button', { name: 'Review Eva Foster' }).click();
  await page.getByRole('button', { name: 'Accept cancellation' }).click();
  await page.getByRole('button', { name: 'Confirm decision' }).click();
  await page.getByRole('button', { name: 'Close Request details' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Staffing calendar' }).click();
  await expect(page.locator('.fc-timeline-event')).toHaveCount(6);
  await expect(page.getByRole('button', { name: /Review Alice Bennett:/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Review Eva Foster:/ })).toHaveCount(0);
  await page.getByLabel('Team', { exact: true }).selectOption('Operations');
  await expect(page.locator('.fc-datagrid-body .resource-person')).toHaveCount(4);
  await page.getByLabel('Employee', { exact: true }).selectOption('diego');
  await expect(page.locator('.fc-timeline-event')).toHaveCount(1);
  await page.getByRole('navigation').getByRole('link', { name: 'Overview' }).click();
  await page.getByRole('button', { name: 'Process new emails', exact: true }).click();
  await expect(page.getByText('No new emails in this demo. Reset the demo to replay.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByText('Not connected', { exact: true })).toBeVisible();
  await expect(page.getByText('Your demo inbox is up to date.')).toHaveCount(0);
  await page.getByRole('button', { name: 'Sign out of demo' }).click();
  await expect(page.getByRole('button', { name: 'Sign in to demo' })).toBeVisible();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('reset cancels a running batch and narrow screens remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  await connect(page);
  await page.getByRole('button', { name: 'Process new emails', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByText('Simulated processing', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Not connected', { exact: true })).toBeVisible();
  await processBatch(page);
  await page.getByRole('navigation').getByRole('link', { name: 'Requests' }).click();
  await page.getByRole('button', { name: 'Review Alice Bennett' }).click();
  await expect(page.getByRole('dialog', { name: 'Request details', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile-request.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Request details', exact: true })).toHaveCount(0);
  await page.getByRole('navigation').getByRole('link', { name: 'Demo settings' }).click();
  await expect(page.getByRole('heading', { name: 'Made for a demonstration.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('reset discards scheduled completion, and evidence is keyboard accessible', async ({ page }) => {
  await signIn(page);
  await connect(page);
  await page.clock.install();
  await page.getByRole('button', { name: 'Process new emails', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.clock.fastForward(8000);
  await expect(page.getByText('Not connected', { exact: true })).toBeVisible();
  await expect(page.getByText('Your demo inbox is up to date.')).toHaveCount(0);
  await connect(page);
  await page.getByRole('button', { name: 'Process new emails', exact: true }).click();
  await page.clock.fastForward(7000);
  await expect(page.getByText('Your demo inbox is up to date.')).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Staffing calendar' }).click();
  const event = page.getByRole('button', { name: /Review Diego Evans:.*amendment/ });
  await event.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Request details' })).toBeVisible();
  await page.getByRole('button', { name: 'Original: Thursday annual leave' }).click();
  await expect(page.getByRole('dialog', { name: 'Source email', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Request details' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep original leave' }).click();
  await page.getByRole('button', { name: 'Confirm decision' }).click();
  await page.getByRole('button', { name: 'Close Request details' }).click();
  await expect(page.getByRole('button', { name: /Review Diego Evans:.*original retained/ })).toBeVisible();
  await page.getByLabel('Absence status').selectOption('Approved');
  await expect(page.getByRole('button', { name: /Review Diego Evans:.*original retained/ })).toBeVisible();
  await page.getByLabel('Absence status').selectOption('All');
  await page.getByRole('button', { name: 'Review evidence' }).click();
  await expect(page.getByRole('button', { name: 'Approve', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Close Request details' }).click();
  await page.reload();
  await expect(page.locator('.fc-timeline-event')).toHaveCount(2);
});