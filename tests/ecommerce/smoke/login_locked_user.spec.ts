import { test, expect } from '../../../fixtures/ecommerceFixture'
import { setLabels } from '../../../utils/helpers/allure'
import { getEcommerceEnv } from '../../../config/env'
const ENV = getEcommerceEnv()

test.describe('Authentication — locked user @smoke', () => {
  test('locked user sees an error and cannot log in', async ({ loginPage }) => {
    setLabels({
      epic: 'E-commerce',
      feature: 'Authentication',
      story: 'Locked user is rejected',
      severity: 'critical',
      tags: ['smoke', 'auth', 'negative']
    })

    await loginPage.navigate(ENV.baseURL)
    await loginPage.login(ENV.lockedUser!, ENV.password!)

    await expect(loginPage.error).toBeVisible()
    await expect(loginPage.error).toContainText(/locked out/i)
  })
})
