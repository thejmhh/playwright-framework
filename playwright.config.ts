import { defineConfig, devices } from '@playwright/test'
import { ENV } from './config/env'
import path from 'path'

/**
 * Playwright configuration.
 *
 * Defaults:
 * - Headless on CI, headed locally (override with --headed / HEADED=1)
 * - Parallel everywhere; bring down to 1 worker only when debugging
 * - Retries: 2 on CI, 0 locally
 * - Reporters: list + html (built-in) + allure (rich reporting)
 * - Multi-browser: chromium by default; firefox/webkit via npm scripts or --project
 *
 * Run examples:
 *   npm test                          # all projects
 *   npm run test:chromium             # chromium only
 *   npm run smoke:qa                  # @smoke tests on ecommerce/qa
 *   DOMAIN=airline ENV=qa npm test    # explicit env
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
    baseURL: ENV.baseURL,
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
        baseURL: ENV.apiBaseURL
      }
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
