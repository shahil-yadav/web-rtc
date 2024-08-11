import { CSSProperties, useEffect, useState } from 'react'
import { getFormattedDate } from '~/components/shared/navbar/utils/getFormattedDate'

interface DateTypes {
  hours: number
  minutes: number
  seconds: number
  format: 'AM' | 'PM'
}

export function Time() {
  const [date, setDate] = useState<DateTypes>()
  const formattedDate = getFormattedDate()

  useEffect(() => {
    function updateTime(date: Date): DateTypes {
      return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        format: date.getHours() >= 12 ? 'PM' : 'AM',
      }
    }

    const interval = setInterval(() => {
      setDate((prev) => ({
        ...prev,
        ...updateTime(new Date()),
      }))
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (date === undefined) return <span className="loading loading-spinner loading-sm mx-2" />

  return (
    <time className="hidden sm:inline" dateTime={new Date().toLocaleDateString()}>
      <Countdown hours={date.hours} minutes={date.minutes} seconds={date.seconds} />
      <span className="px-1">{date.format}</span>
      {formattedDate}
    </time>
  )
}

function Countdown({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) {
  function useCssVariables(value: number) {
    return { '--value': value } as CSSProperties
  }

  return (
    <span className="countdown font-mono">
      <span style={useCssVariables(hours)} />:
      <span style={useCssVariables(minutes)} />:
      <span style={useCssVariables(seconds)} />
    </span>
  )
}
