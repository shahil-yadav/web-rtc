import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { useEffect } from 'react'
import { Image, useSignIn } from '~/components/contexts/UserContext'
import { Router } from '~/components/router/Router'
import { setupFirebase, useAuth, useFirestore } from '~/lib/firebase'

function Main() {
  const { signIn } = useSignIn()
  // const { signOut } = useSignOut()
  useEffect(() => {
    setupFirebase()
    const auth = useAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const avatar = await fetchRandomAvatar()
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

async function fetchRandomAvatar() {
  const { collection, doc, getDoc, getDocs } = await import('firebase/firestore')
  const db = useFirestore()
  const container: string[] = []
  const querySnapshot = await getDocs(collection(db, 'profiles'))
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // container.push(doc.data() as
    container.push(doc.id)
  })
  const randInt = Math.random()
  const choose = Math.round(randInt * container.length)

  // Index needs to be in 0 <= n <= length - 1
  const index = Math.max(0, Math.min(container.length - 1, choose))

  const image = (await getDoc(doc(db, 'profiles', container[index]))).data() as Image
  return image
}

export default Main
