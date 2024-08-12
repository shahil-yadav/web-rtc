import { createContext, ReactNode, useContext, useReducer } from 'react'

type Status = 'loading' | 'error' | 'success'

interface State {
  localStream?: MediaStream
  remoteStream?: MediaStream
  room: string
  status?: Status
  isConnected: boolean
}

export type Action =
  | {
      type: 'SET-ROOM'
      payload: string
    }
  | { type: 'SET-CONNECTION'; payload: boolean }
  | {
      type: 'SET-STATUS'
      payload: Status
    }
  | {
      type: 'SET-LOCAL-STREAM'
      payload: MediaStream
    }
  | {
      type: 'SET-EMPTY-REMOTE-STREAM'
      payload: null
    }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET-ROOM':
      return {
        ...state,
        room: action.payload,
      }

    case 'SET-STATUS':
      return {
        ...state,
        status: action.payload,
      }

    case 'SET-LOCAL-STREAM':
      return {
        ...state,
        localStream: action.payload,
      }

    case 'SET-EMPTY-REMOTE-STREAM': {
      const remoteStream = new MediaStream()
      return {
        ...state,
        remoteStream,
      }
    }

    default:
      return state
  }
}

interface ContextProps {
  state: State
  dispatch: (arg: Action) => void
}

const initialValue = {
  room: '',
  isConnected: false,
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
