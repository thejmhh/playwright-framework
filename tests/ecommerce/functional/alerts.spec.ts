import { test, expect } from '../../../fixtures/ecommerceFixture'
import { setLabels } from '../../../utils/helpers/allure'

test.use({ storageState: 'storage/standard.json' })

test.describe('Native dialogs @functional', () => {
  test('handles a native browser alert', async ({ inventoryPage }) => {
    setLabels({
      epic: 'E-commerce',
      feature: 'Browser dialogs',
      story: 'Tester accepts a native alert',
      severity: 'minor',
      tags: ['functional', 'dialog']
    })

    await inventoryPage.navigate()

    let dialogMessage = ''
    inventoryPage.page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert')
      dialogMessage = dialog.message()
      await dialog.accept()
    })

    await inventoryPage.page.evaluate(() => alert('Are you sure you want to checkout?'))

    expect(dialogMessage).toBe('Are you sure you want to checkout?')
  })
})
