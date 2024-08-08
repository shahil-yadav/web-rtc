import { useState } from 'react'
import { CopyIcon } from '~/assets/svg/SearchIcon'

export function Tooltip(props: { text: string }) {
  const [success, setSuccess] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(props.text)
      setSuccess(true)
    } catch (error) {
      console.error('🚀 ~ file: create.tsx:158 ~ handleCopy ~ error:', error)
    }
  }
  return (
    <div className="tooltip" data-tip={success === false ? 'Copy to Clipboard' : 'Copied to Clipboard ✅'}>
      <button className="px-3" onClick={handleCopy}>
        {success ? '✅' : <CopyIcon />}
      </button>
    </div>
  )
}
