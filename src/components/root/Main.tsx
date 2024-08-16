import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { DocumentData, QuerySnapshot } from 'firebase/firestore'
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

async function fetchRandomAvatar(): Promise<Image> {
  const { collection, limit, orderBy, query, where, getDocs } = await import('firebase/firestore')
  const db = useFirestore()

  const citiesRef = collection(db, 'profiles')

  const TOTAL_PROFILE_PICTURES = 330
  const index = Math.random() * TOTAL_PROFILE_PICTURES

  let snapshot: QuerySnapshot<DocumentData>
  snapshot = await getDocs(query(citiesRef, where('index', '>=', index), orderBy('index'), limit(1)))
  if (snapshot.empty) {
    snapshot = await getDocs(query(citiesRef, where('index', '<=', index), orderBy('index'), limit(1)))
  }

  const avatar = snapshot.docs[0].data()
  return {
    src: avatar.src,
    alt: avatar.alt,
  }
}

export default Main
