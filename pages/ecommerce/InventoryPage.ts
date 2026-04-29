import { Page, Locator } from '@playwright/test'

export class InventoryPage {
  readonly page: Page
  readonly inventoryContainer: Locator
  readonly cartButton: Locator
  readonly burgerMenu: Locator
  readonly logoutLink: Locator
  readonly twitterLink: Locator

  constructor(page: Page) {
    this.page = page

    this.inventoryContainer = page.locator('.inventory_list')
    this.cartButton = page.locator('.shopping_cart_link')
    this.burgerMenu = page.locator('#react-burger-menu-btn')
    this.logoutLink = page.locator('#logout_sidebar_link')
    this.twitterLink = page.locator('.social_twitter a')
  }

  async navigate() {
    await this.page.goto('/inventory.html')
    await this.waitForPage()
  }

  async waitForPage() {
    await this.inventoryContainer.waitFor({ state: 'visible' })
  }

  getAddToCartButton(productName: string): Locator {
    return this.page.locator(`.inventory_item:has-text("${productName}") button`)
  }

  async addProductToCart(productName: string) {
    await this.getAddToCartButton(productName).click()
  }

  async goToCart() {
    await this.cartButton.click()
  }

  async openMenu() {
    await this.burgerMenu.click()
  }

  async logout() {
    await this.openMenu()
    await this.logoutLink.click()
  }
}
