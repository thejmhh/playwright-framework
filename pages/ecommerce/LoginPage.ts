import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly error: Locator

  constructor(page: Page) {
    this.page = page

    this.usernameInput = page.getByPlaceholder('Username')
    this.passwordInput = page.getByPlaceholder('Password')
    this.loginButton = page.getByRole('button', { name: 'Login' })
    this.error = page.locator('[data-test="error"]')
  }

  async navigate(url: string) {
    await this.page.goto(url)
    await this.page.waitForLoadState('domcontentloaded')
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username)
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password)
  }

  async clickLogin() {
    await this.loginButton.click()
  }

  async login(username: string, password: string) {
    await this.usernameInput.waitFor({ state: 'visible' })

    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)

    await Promise.all([this.page.waitForLoadState('networkidle'), this.loginButton.click()])
  }
}
