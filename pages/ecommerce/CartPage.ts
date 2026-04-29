import { Page, Locator } from '@playwright/test'

export class CartPage {
  readonly page: Page
  readonly cartItems: Locator
  readonly checkoutButton: Locator
  readonly continueShoppingButton: Locator

  constructor(page: Page) {
    this.page = page

    this.cartItems = page.locator('.cart_item')
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' })
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' })
  }

  async waitForPage() {
    await this.cartItems.first().waitFor({ state: 'visible' })
  }

  getCartItem(productName: string): Locator {
    return this.page.locator(`.cart_item:has-text("${productName}")`)
  }

  async removeProduct(productName: string) {
    await this.getCartItem(productName).locator('button').click()
  }

  async clickCheckout() {
    await this.checkoutButton.click()
  }

  async continueShopping() {
    await this.continueShoppingButton.click()
  }
}
