import { test, expect } from '../../../fixtures/ecommerceFixture'
import { setLabels } from '../../../utils/helpers/allure'
import { DataFactory } from '../../../utils/dataFactory'
import { Helpers } from '../../../utils/helpers'

test.use({ storageState: 'storage/standard.json' })

test.describe('Checkout flow @e2e', () => {
  test('standard user can complete a purchase', async ({
    inventoryPage,
    cartPage,
    checkoutPage
  }, testInfo) => {
    setLabels({
      epic: 'E-commerce',
      feature: 'Checkout',
      story: 'Standard user completes the full checkout flow',
      severity: 'critical',
      tags: ['e2e', 'checkout']
    })

    await inventoryPage.navigate()
    await inventoryPage.addProductToCart('Sauce Labs Backpack')
    await inventoryPage.goToCart()

    await cartPage.clickCheckout()

    const user = DataFactory.generateUser()
    await checkoutPage.completeCheckout(user.firstName, user.lastName, user.postalCode)

    await Helpers.attachScreenshot(checkoutPage.page, testInfo, 'checkout-success')

    await expect(checkoutPage.successMessage).toBeVisible()
    await expect(checkoutPage.successMessage).toHaveText('Thank you for your order!')
  })
})
