import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  timeout: 45_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4400', trace: 'off', launchOptions: { executablePath: '/opt/pw-browsers/chromium' } },
  webServer: { command: 'node scripts/serve.cjs dist 4400', url: 'http://127.0.0.1:4400/index.html', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
