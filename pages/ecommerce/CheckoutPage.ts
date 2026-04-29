import { Page, Locator } from '@playwright/test'

export class CheckoutPage {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly postalCodeInput: Locator
  readonly continueButton: Locator
  readonly finishButton: Locator
  readonly successMessage: Locator

  constructor(page: Page) {
    this.page = page

    this.firstNameInput = page.getByPlaceholder('First Name')
    this.lastNameInput = page.getByPlaceholder('Last Name')
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code')
    this.continueButton = page.getByRole('button', { name: 'Continue' })
    this.finishButton = page.getByRole('button', { name: 'Finish' })
    this.successMessage = page.locator('.complete-header')
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName)
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName)
  }

  async fillPostalCode(postalCode: string) {
    await this.postalCodeInput.fill(postalCode)
  }

  async clickContinue() {
    await this.continueButton.click()
  }

  async clickFinish() {
    await this.finishButton.click()
  }

  async completeCheckout(first: string, last: string, zip: string) {
    await this.fillFirstName(first)
    await this.fillLastName(last)
    await this.fillPostalCode(zip)
    await this.clickContinue()
    await this.clickFinish()
  }

  async getSuccessMessage() {
    return this.successMessage
  }
}
