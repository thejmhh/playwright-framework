import { Page, TestInfo } from '@playwright/test'

export class Helpers {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle')
  }

  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ path: `screenshots/${name}.png` })
  }

  static async attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
    const screenshot = await page.screenshot()
    await testInfo.attach(name, {
      body: screenshot,
      contentType: 'image/png'
    })
  }

  static async retryAction(action: () => Promise<void>, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        await action()
        return
      } catch (error) {
        if (i === retries) throw error
      }
    }
  }
}
