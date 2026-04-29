import dotenv from 'dotenv'
import path from 'path'
import { getEcommerceConfig } from './domains/ecommerce.config'
import { getAirlineConfig } from './domains/airline.config'
import { getInsuranceConfig } from './domains/insurance.config'

/**
 * Environment loader.
 *
 * - ENV    selects which .env file is loaded (default: 'qa')
 * - DOMAIN selects which domain config is active (default: 'ecommerce')
 *
 * Falls back to fail-fast if a required env var is missing for the active domain,
 * so tests don't run with `undefined` baseURL and produce confusing errors.
 */

const ENV_NAME = process.env.ENV || 'qa'
const DOMAIN = process.env.DOMAIN || 'ecommerce'

const envFile = path.resolve(process.cwd(), `config/.env.${ENV_NAME}`)
const result = dotenv.config({ path: envFile })

if (result.error) {
  // Soft warn — env vars may also come from CI secrets, not files
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

const domainLoaders: Record<string, () => DomainConfig> = {
  ecommerce: getEcommerceConfig,
  airline: getAirlineConfig,
  insurance: getInsuranceConfig
}

const loader = domainLoaders[DOMAIN]
if (!loader) {
  throw new Error(
    `Unknown DOMAIN="${DOMAIN}". Valid values: ${Object.keys(domainLoaders).join(', ')}`
  )
}

const activeConfig = loader()

if (!activeConfig.baseURL) {
  throw new Error(
    `Missing baseURL for DOMAIN="${DOMAIN}". Check config/.env.${ENV_NAME} or CI environment variables.`
  )
}

export const ENV = activeConfig
export const ACTIVE_DOMAIN = DOMAIN
export const ACTIVE_ENV = ENV_NAME
