import type { DomainConfig } from '../env'

export const getAirlineConfig = (): DomainConfig => ({
  baseURL: process.env.AIRLINE_BASE_URL as string,
  apiBaseURL: process.env.API_BASE_URL,
  apiKey: process.env.API_KEY
})
