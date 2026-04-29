import { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly findFlightsBtn: Locator
  readonly checkoutDest: Locator

  constructor(page: Page) {
    this.page = page
    this.findFlightsBtn = page.getByRole('button', { name: 'Find Flights' })
    this.checkoutDest = page.getByRole('link', { name: /destination of the week!/i })
  }

  async navigate() {
    await this.page.goto('/')
  }

  /**
   * Intercepts the form submission to /reserve.php and returns a 500 response
   * with a synthetic "system down" page. Used to demo network mocking.
   */
  async mockFlightSearchError() {
    await this.page.route('**/reserve.php', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'text/html',
        body: '<html><body><h1>System down, try again later</h1></body></html>'
      })
    })
  }

  async searchFlights() {
    await this.findFlightsBtn.click()
  }

  /**
   * Clicks the "Travel The World" external link and returns the new Page
   * (tab) once it opens.
   */
  async clickCheckoutDestinationLink(): Promise<Page> {
    await this.checkoutDest.evaluate((el) => el.setAttribute('target', '_blank'))
    const pagePromise = this.page.context().waitForEvent('page')
    await this.checkoutDest.click()
    return await pagePromise
  }
}
