import { test as base, expect } from '@playwright/test'

/**
 * Base fixture shared by all domains.
 *
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const errors: Error[] = []
    page.on('pageerror', (err) => errors.push(err))

    await use(page)

    if (errors.length > 0) {
      console.warn(
        `[baseFixture] ${errors.length} uncaught page error(s) during test:\n` +
          errors.map((e) => `  - ${e.message}`).join('\n')
      )
    }
  }
})

export { expect }
