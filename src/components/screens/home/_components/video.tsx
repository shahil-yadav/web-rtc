import { Local } from './local'
import { Remote } from './remote'

export function Video({ state }: { state: 'local' | 'remote' }) {
  return (
    <>
      {state === 'local' && <Local />}
      {state === 'remote' && <Remote />}
    </>
  )
}
