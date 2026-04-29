import { chromium, FullConfig } from '@playwright/test'
import { LoginPage } from './pages/ecommerce/LoginPage'
import { ENV, ACTIVE_DOMAIN } from './config/env'
import fs from 'fs'
import path from 'path'

/**
 * Global setup runs once before all tests.
 *
 * For the ecommerce domain it logs in once and persists the auth state to
 * `storage/standard.json` so individual tests can skip the login UI by
 * declaring `test.use({ storageState: 'storage/standard.json' })`.
 *
 * Other domains (airline, insurance) do nothing here — they handle their own
 * setup per spec via fixtures.
 */
async function globalSetup(_config: FullConfig) {
  if (ACTIVE_DOMAIN !== 'ecommerce') {
    console.log(`[global-setup] Domain "${ACTIVE_DOMAIN}" — no global login needed.`)
    return
  }

  if (!ENV.standardUser || !ENV.password) {
    throw new Error(
      '[global-setup] Missing ECOM_STANDARD_USER or ECOM_PASSWORD. Check config/.env.qa.'
    )
  }

  console.log('[global-setup] Ecommerce — performing one-time login to seed storageState…')

  const storageDir = path.resolve(process.cwd(), 'storage')
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true })
  const storagePath = path.join(storageDir, 'standard.json')

  const browser = await chromium.launch()
  try {
    const context = await browser.newContext()
    const page = await context.newPage()

    const loginPage = new LoginPage(page)
    await loginPage.navigate(ENV.baseURL)
    await loginPage.login(ENV.standardUser, ENV.password)
    await page.waitForURL('**/inventory.html', { timeout: 15_000 })

    await context.storageState({ path: storagePath })
    console.log(`[global-setup] storageState saved to ${storagePath}`)
  } finally {
    await browser.close()
  }
}

export default globalSetup
