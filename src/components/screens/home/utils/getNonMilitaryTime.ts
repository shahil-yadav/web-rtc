export function getNonMilitaryTime() {
  const date = new Date()
  const hours = date.getHours() % 12
  const minutes = date.getMinutes()
  const format = hours >= 12 ? 'PM' : 'AM'
  const fMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  const fHours = hours === 0 ? 12 : hours
  const time = `${fHours}:${fMinutes} ${format}`
  return time
}
