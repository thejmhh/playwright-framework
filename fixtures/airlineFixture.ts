import { test as base, expect } from './baseFixture'
import { HomePage } from '../pages/airline/HomePage'
import { ReservePage } from '../pages/airline/ReservePage'
import { PurchasePage } from '../pages/airline/PurchasePage'
import { UserApiHelper } from '../utils/UserApiHelper'

type AirlineFixtures = {
  homePage: HomePage
  reservePage: ReservePage
  purchasePage: PurchasePage
  apiHelper: UserApiHelper
}

export const test = base.extend<AirlineFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  reservePage: async ({ page }, use) => {
    await use(new ReservePage(page))
  },
  purchasePage: async ({ page }, use) => {
    await use(new PurchasePage(page))
  },
  apiHelper: async ({ request }, use) => {
    await use(new UserApiHelper(request))
  }
})

export { expect }
