import { ReactNode } from 'react'

export function Button({
  children,
  disabled,
  handleClickEvent,
}: {
  children: ReactNode
  disabled: boolean
  handleClickEvent: () => Promise<void> | void
}) {
  return (
    <button
      className="btn btn-circle bg-base-content p-2 disabled:bg-red-500"
      disabled={disabled}
      onClick={handleClickEvent}
      type="button"
    >
      {children}
    </button>
  )
}
