import { APIRequestContext, expect } from '@playwright/test'
import { ENV } from '../config/env'

/**
 * API helper that targets reqres.in — a free public sandbox API.
 *
 * reqres.in is a stateless mock: POST /users responds 201 with a fake id and
 * createdAt timestamp. Useful for demonstrating API-driven test setup without
 * standing up a backend.
 *
 * In a real project, this class would target your actual service and the
 * baseURL/key would come from a secret store (CI variables, vault, etc.).
 */
export class UserApiHelper {
  private readonly request: APIRequestContext
  private readonly baseURL: string
  private readonly apiKey?: string

  constructor(request: APIRequestContext) {
    this.request = request
    this.baseURL = ENV.apiBaseURL ?? 'https://reqres.in/api'
    this.apiKey = ENV.apiKey
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json', Accept: '*/*' }
    if (this.apiKey) h['x-api-key'] = this.apiKey
    return h
  }

  /**
   * Creates a user via POST /users.
   * Returns the generated user id (string) so tests can chain UI flows on it.
   */
  async createUser(name: string, job: string): Promise<string> {
    const response = await this.request.post(`${this.baseURL}/users`, {
      headers: this.headers(),
      data: { name, job }
    })

    expect(response.status(), 'POST /users should return 201').toBe(201)

    const body = (await response.json()) as { id: string; name: string; job: string }
    expect(body.id, 'response should include an id').toBeTruthy()
    return body.id
  }

  /**
   * Fetches a user via GET /users/:id. Used as a verification step.
   */
  async getUserById(id: number): Promise<{ id: number; email: string; first_name: string }> {
    const response = await this.request.get(`${this.baseURL}/users/${id}`, {
      headers: this.headers()
    })
    expect(response.status(), `GET /users/${id} should return 200`).toBe(200)
    const body = await response.json()
    return body.data
  }
}
