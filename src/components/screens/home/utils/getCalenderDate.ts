import { getFormattedDate } from './getFormattedDate'
import { getNonMilitaryTime } from './getNonMilitaryTime'

export function getCalenderDate() {
  const currentLocaleTime = getNonMilitaryTime()
  const dayMonthDate = getFormattedDate()
  return `${currentLocaleTime} · ${dayMonthDate}`
}
