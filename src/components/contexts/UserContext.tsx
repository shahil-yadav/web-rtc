import { User } from 'firebase/auth'
import { createContext, ReactNode, useContext, useReducer } from 'react'

export type Image = { src: string; alt: string }

type AuthActions =
  | { type: 'SIGN_IN'; payload: { user: User; avatar: Image } }
  | { type: 'SIGN_OUT' }
  | { type: 'SET-AVATAR-IMAGE'; payload: Image }

type AuthState =
  | {
      state: 'SIGNED_IN'
      currentUser: User
      avatar: { src: string; alt: string }
    }
  | {
      state: 'SIGNED_OUT'
    }
  | {
      state: 'UNKNOWN'
    }

const AuthReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        state: 'SIGNED_IN',
        currentUser: action.payload.user,
        avatar: action.payload.avatar,
      }

    case 'SIGN_OUT':
      return {
        state: 'SIGNED_OUT',
      }

    default:
      return { ...state }
  }
}

type AuthContextProps = {
  state: AuthState
  dispatch: (value: AuthActions) => void
}

export const AuthContext = createContext<AuthContextProps>({
  state: { state: 'UNKNOWN' },
  dispatch: (val) => {},
})

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, { state: 'UNKNOWN' })

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

const useAuthState = () => {
  const { state } = useContext(AuthContext)
  return {
    state,
  }
}

const useSignIn = () => {
  const { dispatch } = useContext(AuthContext)
  return {
    signIn: (user: User, avatar: Image) => {
      dispatch({ type: 'SIGN_IN', payload: { user, avatar } })
    },
  }
}

const useSignOut = () => {
  const { dispatch } = useContext(AuthContext)
  return {
    signOut: () => {
      dispatch({ type: 'SIGN_OUT' })
    },
  }
}

export { AuthProvider, useAuthState, useSignIn, useSignOut }
