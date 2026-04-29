import type { DomainConfig } from '../env'

export const getEcommerceConfig = (): DomainConfig => ({
  baseURL: process.env.ECOMMERCE_BASE_URL as string,
  standardUser: process.env.ECOM_STANDARD_USER,
  lockedUser: process.env.ECOM_LOCKED_USER,
  password: process.env.ECOM_PASSWORD
})
