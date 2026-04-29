import { test, expect } from '../../fixtures/airlineFixture'
import { setLabels } from '../../utils/helpers/allure'

test('creates a user via API then verifies the response shape', async ({ apiHelper }) => {
  setLabels({
    epic: 'Airline',
    feature: 'API',
    story: 'API setup is decoupled from the UI',
    severity: 'normal',
    tags: ['api']
  })

  const id = await apiHelper.createUser('Joe Smith', 'QA Engineer')
  expect(id).toMatch(/\d+/)

  const fetched = await apiHelper.getUserById(2)
  expect(fetched.email).toContain('@')
  expect(fetched.first_name).toBeTruthy()
})
