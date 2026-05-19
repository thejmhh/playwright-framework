import { APIRequestContext, expect } from '@playwright/test'
import { getAirlineEnv } from '../config/env'

export class UserApiHelper {
  private readonly request: APIRequestContext
  private readonly baseURL: string
  private readonly apiKey?: string

  constructor(request: APIRequestContext) {
    const ENV = getAirlineEnv()
    this.request = request
    this.baseURL = ENV.apiBaseURL ?? 'https://reqres.in/api'
    this.apiKey = ENV.apiKey
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json', Accept: '*/*' }
    if (this.apiKey) h['x-api-key'] = this.apiKey
    return h
  }

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

  async getUserById(id: number): Promise<{ id: number; email: string; first_name: string }> {
    const response = await this.request.get(`${this.baseURL}/users/${id}`, {
      headers: this.headers()
    })
    expect(response.status(), `GET /users/${id} should return 200`).toBe(200)
    const body = await response.json()
    return body.data
  }
}
