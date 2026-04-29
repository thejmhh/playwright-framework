import { test, expect } from '../../../fixtures/ecommerceFixture'
import { setLabels } from '../../../utils/helpers/allure'

test.use({ storageState: 'storage/standard.json' })

test.describe('Multi-tab navigation @functional', () => {
  test('opens the Twitter footer link in a new tab', async ({ inventoryPage, context }) => {
    setLabels({
      epic: 'E-commerce',
      feature: 'Navigation',
      story: 'External link opens in a new tab',
      severity: 'minor',
      tags: ['functional', 'multi-tab']
    })

    await inventoryPage.navigate()

    const newTabPromise = context.waitForEvent('page')
    await inventoryPage.twitterLink.click()
    const newTab = await newTabPromise

    await newTab.waitForLoadState('domcontentloaded')
    await expect(newTab).toHaveURL(/x\.com|twitter\.com/)
    await newTab.close()
  })
})
