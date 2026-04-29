import { test as base, expect } from './baseFixture'
import { LoginPage } from '../pages/ecommerce/LoginPage'
import { InventoryPage } from '../pages/ecommerce/InventoryPage'
import { CartPage } from '../pages/ecommerce/CartPage'
import { CheckoutPage } from '../pages/ecommerce/CheckoutPage'

type EcomFixtures = {
  loginPage: LoginPage
  inventoryPage: InventoryPage
  cartPage: CartPage
  checkoutPage: CheckoutPage
}

export const test = base.extend<EcomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page))
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page))
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page))
  }
})

export { expect }
