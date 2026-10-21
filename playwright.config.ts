import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://localhost:8081', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
  webServer: { command: 'npm run web', url: 'http://localhost:8081', reuseExistingServer: !process.env.CI, timeout: 180000, env: { EXPO_OFFLINE: '1' } },
});