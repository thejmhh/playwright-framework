import { Page } from '@playwright/test'

export class ReservePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigate() {
    await this.page.goto('/reserve.php')
  }

  /**
   * Finds the row whose first cell text matches `airlineName` and clicks the
   * "Choose This Flight" button on that row.
   *
   * Use Playwright's locator chaining instead of a handrolled XPath so the
   * intent is obvious and the locator is autoretried.
   */
  async chooseFlightByAirline(airlineName: string) {
    const row = this.page.locator('tr').filter({ hasText: airlineName }).first()
    await row.getByRole('button', { name: /choose this flight/i }).click()
  }
}
