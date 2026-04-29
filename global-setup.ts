import { chromium, FullConfig } from '@playwright/test'
import { LoginPage } from './pages/ecommerce/LoginPage'
import { getEcommerceEnv } from './config/env'
import fs from 'fs'
import path from 'path'

/**
 * Global setup runs once before all tests.
 *
 * Logs in to the ecommerce app and persists the auth state to
 * storage/standard.json so ecommerce specs can skip the login UI by
 * declaring `test.use({ storageState: 'storage/standard.json' })`.
 */
async function globalSetup(_config: FullConfig) {
  const env = getEcommerceEnv()

  if (!env.standardUser || !env.password) {
    throw new Error(
      '[global-setup] Missing ECOM_STANDARD_USER or ECOM_PASSWORD. Check config/.env.qa.'
    )
  }

  console.info('[global-setup] Performing one-time ecommerce login to seed storageState…')

  const storageDir = path.resolve(process.cwd(), 'storage')
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true })
  const storagePath = path.join(storageDir, 'standard.json')

  const browser = await chromium.launch()
  try {
    const context = await browser.newContext()
    const page = await context.newPage()

    const loginPage = new LoginPage(page)
    await loginPage.navigate(env.baseURL)
    await loginPage.login(env.standardUser, env.password)
    await page.waitForURL('**/inventory.html', { timeout: 15_000 })

    await context.storageState({ path: storagePath })
    console.info(`[global-setup] storageState saved to ${storagePath}`)
  } finally {
    await browser.close()
  }
}

export default globalSetup
