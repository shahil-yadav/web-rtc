import { Local } from '~/components/screens/_components/video/local'
import { Remote } from '~/components/screens/_components/video/remote'

export function Video({ state }: { state: 'local' | 'remote' }) {
  return (
    <>
      {state === 'local' && <Local />}
      {state === 'remote' && <Remote />}
    </>
  )
}
