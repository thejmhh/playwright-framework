import dotenv from 'dotenv'
import path from 'path'
import { getEcommerceConfig } from './domains/ecommerce.config'
import { getAirlineConfig } from './domains/airline.config'
import { getInsuranceConfig } from './domains/insurance.config'

/**
 * Environment loader.
 *
 * ENV selects which .env file is loaded (default: 'qa').
 * each spec imports the config it needs explicitly via getEcommerceEnv() / getAirlineEnv().
 */

const ENV_NAME = process.env.ENV || 'qa'
const envFile = path.resolve(process.cwd(), `config/.env.${ENV_NAME}`)
const result = dotenv.config({ path: envFile })

if (result.error) {
  console.warn(`[env] Could not load ${envFile}. Falling back to process.env.`)
}

export interface DomainConfig {
  baseURL: string
  standardUser?: string
  lockedUser?: string
  password?: string
  apiBaseURL?: string
  apiKey?: string
}

export const getEcommerceEnv = (): DomainConfig => {
  const config = getEcommerceConfig()
  if (!config.baseURL) {
    throw new Error(
      `Missing ECOMMERCE_BASE_URL. Check config/.env.${ENV_NAME} or CI environment variables.`
    )
  }
  return config
}

export const getAirlineEnv = (): DomainConfig => {
  const config = getAirlineConfig()
  if (!config.baseURL) {
    throw new Error(
      `Missing AIRLINE_BASE_URL. Check config/.env.${ENV_NAME} or CI environment variables.`
    )
  }
  return config
}

export const getInsuranceEnv = (): DomainConfig => {
  const config = getInsuranceConfig()
  if (!config.baseURL) {
    throw new Error(
      `Missing INSURANCE_BASE_URL. Check config/.env.${ENV_NAME} or CI environment variables.`
    )
  }
  return config
}

export const ACTIVE_ENV = ENV_NAME
