import { createContext, ReactNode, useContext, MutableRefObject, useReducer, useRef } from 'react'

export const iceConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

export type Status = 'loading' | 'error' | 'success' | 'none'

interface State {
  connection: Status
  isCameraOpened: boolean
  isConnectionEstablished?: RTCPeerConnectionState
  isRemoteAnswerRecieved: boolean
  isResetTriggered: boolean
  resetPeerConnection: VoidFunction
  roomID: string
}

export type Action =
  | { type: 'SET-CAMERA'; payload: boolean }
  | { type: 'SET-CONNECTION-ESTABILISHMENT-STATUS'; payload: RTCPeerConnectionState }
  | { type: 'SET-CONNECTION'; payload: Status }
  | { type: 'SET-REMOTE-ANSWER-STATUS'; payload: boolean }
  | { type: 'SET-ROOM'; payload: string }
  | { type: 'SET-RESET-TRIGGER'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET-RESET-TRIGGER':
      return {
        ...state,
        isResetTriggered: action.payload,
      }

    case 'SET-CAMERA':
      return {
        ...state,
        isCameraOpened: action.payload,
      }

    case 'SET-CONNECTION-ESTABILISHMENT-STATUS':
      return {
        ...state,
        isConnectionEstablished: action.payload,
      }

    case 'SET-CONNECTION':
      return {
        ...state,
        connection: action.payload,
      }

    case 'SET-REMOTE-ANSWER-STATUS':
      return {
        ...state,
        isRemoteAnswerRecieved: action.payload,
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

  reference?: {
    localStream: MutableRefObject<MediaStream>
    remoteStream: MutableRefObject<MediaStream>
    peerConnection: MutableRefObject<RTCPeerConnection>
  }
}

const initialValue: State = {
  connection: 'none',
  isCameraOpened: false,
  isRemoteAnswerRecieved: false,
  resetPeerConnection: () => {},
  roomID: '',
  isResetTriggered: false,
}

const Context = createContext<ContextProps>({
  state: initialValue,
  dispatch: (arg) => {},
})

function StreamsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialValue)
  const contextValue = { dispatch, state }
  const localStream = useRef<MediaStream>(new MediaStream())
  const remoteStream = useRef<MediaStream>(new MediaStream())
  const peerConnection = useRef<RTCPeerConnection>(new RTCPeerConnection(iceConfiguration))

  return (
    <Context.Provider
      value={{
        ...contextValue,
        reference: {
          localStream,
          remoteStream,
          peerConnection,
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useStreamsContext() {
  return useContext(Context)
}

export default StreamsProvider
