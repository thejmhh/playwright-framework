import { Page, Locator } from '@playwright/test'

/**
 * Purchase page on blazedemo.com.
 *
 */
export class PurchasePage {
  readonly page: Page
  readonly nameInput: Locator
  readonly addressInput: Locator
  readonly cityInput: Locator
  readonly stateInput: Locator
  readonly zipInput: Locator
  readonly creditCardInput: Locator
  readonly purchaseBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.locator('#inputName')
    this.addressInput = page.locator('#address')
    this.cityInput = page.locator('#city')
    this.stateInput = page.locator('#state')
    this.zipInput = page.locator('#zipCode')
    this.creditCardInput = page.locator('#creditCardNumber')
    this.purchaseBtn = page.getByRole('button', { name: /purchase flight/i })
  }

  async navigate() {
    await this.page.goto('/purchase.php')
  }

  async fillBilling(name: string, address: string, city: string, state: string, zip: string) {
    await this.nameInput.fill(name)
    await this.addressInput.fill(address)
    await this.cityInput.fill(city)
    await this.stateInput.fill(state)
    await this.zipInput.fill(zip)
  }

  async submitPurchase(cardNumber: string) {
    await this.creditCardInput.fill(cardNumber)
    await this.purchaseBtn.click()
  }
}
