import { createContext, ReactNode, useContext, useReducer } from 'react'

interface State {
  localStream?: MediaStream
  localVideo?: HTMLVideoElement
  remoteStream?: MediaStream
  remoteVideo?: HTMLVideoElement
  room: String
}

export type Action =
  | {
      type: 'SET-ROOM'
      payload: string
    }
  | {
      type: 'SET-LOCAL-VIDEO'
      payload: HTMLVideoElement
    }
  | {
      type: 'SET-LOCAL-STREAM'
      payload: MediaStream
    }
  | {
      type: 'SET-REMOTE-VIDEO'
      payload: HTMLVideoElement
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

    case 'SET-LOCAL-VIDEO':
      return {
        ...state,
        localVideo: action.payload,
      }

    case 'SET-LOCAL-STREAM':
      if (!state.localVideo) throw new Error('Cannot dispatch until local <video/> is defined')
      state.localVideo.srcObject = action.payload
      return {
        ...state,
        localStream: action.payload,
      }

    case 'SET-REMOTE-VIDEO':
      return {
        ...state,
        remoteVideo: action.payload,
      }

    case 'SET-EMPTY-REMOTE-STREAM': {
      if (!state.remoteVideo) throw new Error('Cannot dispatch until remote <video/> is defined')
      const remoteStream = new MediaStream()
      state.remoteVideo.srcObject = remoteStream

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

const Context = createContext<ContextProps>({
  state: { room: '' },
  dispatch: (arg) => {},
})

function StreamsProvider({ children }: { children: ReactNode }) {
  const initialValue = {
    room: '',
  }
  const [state, dispatch] = useReducer(reducer, initialValue)

  const contextValue = { state, dispatch }
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export function useStreamsContext() {
  return useContext(Context)
}

export default StreamsProvider
