import { createContext, ReactNode, useContext, useReducer } from 'react'

export type Status = 'loading' | 'error' | 'success' | 'none'

interface State {
  isOfferCreated: boolean
  camera: boolean
  connected: Status
  room: string
}

export type Action =
  | { type: 'SET-CAMERA'; payload: boolean }
  | {
      type: 'SET-ROOM'
      payload: string
    }
  | { type: 'SET-CONNECTION'; payload: Status }
  | { type: 'SET-RTC-OFFER'; payload: boolean }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET-CAMERA':
      return {
        ...state,
        camera: action.payload,
      }

    case 'SET-CONNECTION':
      return {
        ...state,
        connected: action.payload,
      }

    case 'SET-ROOM':
      return {
        ...state,
        room: action.payload,
      }

    case 'SET-RTC-OFFER':
      return {
        ...state,
        isOfferCreated: action.payload,
      }

    default:
      return state
  }
}

interface ContextProps {
  state: State
  dispatch: (arg: Action) => void
}

const initialValue: State = {
  room: '',
  connected: 'none',
  camera: false,
  isOfferCreated: false,
}

const Context = createContext<ContextProps>({
  state: initialValue,
  dispatch: (arg) => {},
})

function StreamsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialValue)
  const contextValue = { state, dispatch }
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export function useStreamsContext() {
  return useContext(Context)
}

export default StreamsProvider
