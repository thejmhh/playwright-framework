import type { DomainConfig } from '../env'

export const getInsuranceConfig = (): DomainConfig => ({
  baseURL: process.env.INSURANCE_BASE_URL as string
})
