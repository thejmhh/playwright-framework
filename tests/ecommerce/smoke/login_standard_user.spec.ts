import { test, expect } from '../../../fixtures/ecommerceFixture'
import { setLabels } from '../../../utils/helpers/allure'
import { ENV } from '../../../config/env'

test.describe('Authentication — standard user @smoke', () => {
  test('standard user can log in and reach the inventory', async ({ loginPage, inventoryPage }) => {
    setLabels({
      epic: 'E-commerce',
      feature: 'Authentication',
      story: 'Standard user can log in',
      severity: 'critical',
      tags: ['smoke', 'auth']
    })

    await loginPage.navigate(ENV.baseURL)
    await loginPage.login(ENV.standardUser!, ENV.password!)

    await expect(inventoryPage.inventoryContainer).toBeVisible()
    await expect(loginPage.page).toHaveURL(/.*inventory\.html/)
  })
})
