import '../config/env' // 👈 FORCE dotenv to load first
import { ENV } from '../config/env'

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
