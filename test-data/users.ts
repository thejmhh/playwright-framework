import '../config/env' // 👈 FORCE dotenv to load first
import { getEcommerceEnv } from '../config/env'
const ENV = getEcommerceEnv()

export const USERS = {
  standard: {
    username: ENV.standardUser,
    role: 'standard'
  },
  locked: {
    username: ENV.lockedUser,
    role: 'locked'
  }
}
