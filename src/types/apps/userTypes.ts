// Type Imports
import type { ThemeColor } from '@core/types'

export type UsersType = {
  id: number
  role: string
  email: string
  status: number
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
  phone: {
    country_code: string,
    number: string,
    country_name: string
  }
}
