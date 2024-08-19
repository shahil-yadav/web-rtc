import { createContext, ReactNode, useContext, useReducer } from 'react'

export type Status = 'loading' | 'error' | 'success' | 'none'

interface State {
  isCameraOpened: boolean
  connection: Status
  roomID: string
}

export type Action =
  | { type: 'SET-CAMERA'; payload: boolean }
  | {
      type: 'SET-ROOM'
      payload: string
    }
  | { type: 'SET-CONNECTION'; payload: Status }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET-CAMERA':
      return {
        ...state,
        isCameraOpened: action.payload,
      }

    case 'SET-CONNECTION':
      return {
        ...state,
        connection: action.payload,
      }

    case 'SET-ROOM':
      return {
        ...state,
        roomID: action.payload,
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
  roomID: '',
  connection: 'none',
  isCameraOpened: false,
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
