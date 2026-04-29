import { test, expect } from '../../../fixtures/ecommerceFixture'
import { PRODUCTS } from '../../../test-data/products'
import { setLabels } from '../../../utils/helpers/allure'

test.use({ storageState: 'storage/standard.json' })

test.describe('Add to cart — data-driven @e2e', () => {
  for (const [key, productName] of Object.entries(PRODUCTS)) {
    test(`adds "${productName}" to the cart`, async ({ inventoryPage, cartPage }) => {
      setLabels({
        epic: 'E-commerce',
        feature: 'Cart',
        story: `User adds ${productName}`,
        severity: 'normal',
        tags: ['e2e', 'cart', `product:${key}`]
      })

      await inventoryPage.navigate()
      await inventoryPage.addProductToCart(productName)
      await inventoryPage.goToCart()

      await expect(cartPage.getCartItem(productName)).toBeVisible()
    })
  }
})
