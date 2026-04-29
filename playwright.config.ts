import { defineConfig, devices } from '@playwright/test'
import path from 'path'

/**
 * Playwright configuration.
 *
 * Projects represent business domains, not browsers. Each project has its own
 * testDir and is loaded with its own environment config. Run with:
 *   npx playwright test --project=ecommerce
 *   npx playwright test --project=airline
 *   npx playwright test                       # runs all projects
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '50%' : undefined,

  timeout: 30_000,
  expect: {
    timeout: 10_000
  },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: true }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  use: {
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    headless: !process.env.HEADED,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  globalSetup: path.resolve(__dirname, 'global-setup.ts'),

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL
      }
    },
    {
      name: 'ecommerce',
      testDir: './tests/ecommerce',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.ECOMMERCE_BASE_URL
      },
      metadata: { domain: 'ecommerce' }
    },
    {
      name: 'airline',
      testDir: './tests/airline',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.AIRLINE_BASE_URL
      },
      metadata: { domain: 'airline' }
    }
  ]
})
