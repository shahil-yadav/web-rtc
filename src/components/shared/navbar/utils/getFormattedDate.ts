import { getDay } from './getDay'
import { getMonth } from './getMonth'

export const getFormattedDate = () => {
  const dateClass = new Date()
  const date = dateClass.getDate()
  const day = getDay(dateClass.getDay())
  const month = getMonth(dateClass.getMonth())
  return `${day}, ${month} ${date}`
}
