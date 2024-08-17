import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { useEffect } from 'react'
import { useSignIn } from '~/components/contexts/UserContext'
import { Router } from '~/components/router/Router'
import { setupFirebase, useAuth } from '~/lib/firebase'

// eslint-disable-next-line no-undef
const storageWorker = new ComlinkWorker<typeof import('~/components/root/utils/storage')>(
  new URL('~/components/root/utils/storage', import.meta.url),
  {
    name: 'firestore-storage-worker',
    type: 'module',
  },
)

function Main() {
  const { signIn } = useSignIn()
  // const { signOut } = useSignOut()
  useEffect(() => {
    setupFirebase()
    const auth = useAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const avatar = await storageWorker.fetchRandomAvatar()
        signIn(user, avatar)
        console.log('Anonymous user signed-in.', user)
      } else {
        console.log('There was no anonymous session. Creating a new anonymous user.')
        // Sign the user in anonymously since accessing Storage requires the user to be authorized.
        signInAnonymously(auth).catch(function (error) {
          if (error.code === 'auth/operation-not-allowed') {
            window.alert(
              'Anonymous Sign-in failed. Please make sure that you have enabled anonymous ' +
                'sign-in on your Firebase project.',
            )
          }
          console.table(error)
        })
      }
    })
  }, [])
  return <Router />
}

export default Main
