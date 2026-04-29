import { test, expect } from '../../fixtures/airlineFixture'
import { setLabels } from '../../utils/helpers/allure'

/**
 * Airline interview-style scenarios on https://blazedemo.com plus
 * a sandbox API at https://reqres.in.
 *
 * Each test demonstrates a different Playwright capability:
 *   1. Network mocking (route.fulfill)
 *   2. Multi-tab handling (context.waitForEvent('page'))
 *   3. Dynamic XPath against tabular data
 *   4. API-driven setup chained with UI verification
 */
test.describe('Airline scenarios @AirlineFunc', () => {
  test('mocks a 500 from /reserve.php and shows a friendly error', async ({ page, homePage }) => {
    setLabels({
      epic: 'Airline',
      feature: 'Resilience',
      story: 'Network failure is handled gracefully',
      severity: 'normal',
      tags: ['mock', 'network']
    })

    await homePage.navigate()
    await homePage.mockFlightSearchError()
    await homePage.searchFlights()

    await expect(page.getByRole('heading', { name: /system down/i })).toBeVisible()
  })

  test('opens the "Check out our destination of the week" link in a new tab', async ({
    homePage
  }) => {
    setLabels({
      epic: 'Airline',
      feature: 'Navigation',
      story: 'External link opens in a new tab',
      severity: 'minor',
      tags: ['multi-tab']
    })

    await homePage.navigate()
    const newTab = await homePage.clickCheckoutDestinationLink()

    await newTab.waitForLoadState('domcontentloaded')
    await expect(newTab).toHaveURL(/vacation\.html/)
    await newTab.close()
  })

  test('reserves a flight by airline name using a dynamic XPath', async ({ page, reservePage }) => {
    setLabels({
      epic: 'Airline',
      feature: 'Reservations',
      story: 'Pick a specific airline from a dynamic table',
      severity: 'critical',
      tags: ['xpath', 'dynamic']
    })

    await reservePage.navigate()
    await reservePage.chooseFlightByAirline('Virgin America')

    await expect(page).toHaveURL(/.*purchase\.php/)
  })
})
