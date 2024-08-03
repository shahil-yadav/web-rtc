import { useState } from 'react'
import { CaptureAudioVideo } from './components/CaptureAudioVideo'
import CreateRoom from './components/CreateRoom'
import { HangUp } from './components/HangUp'
import JoinRoom from './components/JoinRoom'
import { DisplayIceCandidates } from './ui/DisplayIceCandidates'
import DisplayStreams from './ui/DisplayStreams'
import { DisplayUserModes } from './ui/DisplayUserModes'
import { useVideoStreamsRef } from './useVideoStreamsRef'

export interface IDisabled {
  camera: boolean
  hangup: boolean
  join: boolean
  create: boolean
}

function WebRTC() {
  const { localVideoRef, remoteVideoRef } = useVideoStreamsRef()

  const [localRoomID, setLocalRoomID] = useState('')
  const [remoteRoomID, setRemoteRoomID] = useState('')
  const [localIceCandidates, setLocalIceCandidates] = useState<RTCIceCandidate[]>([])
  const [disabled, setDisabled] = useState<IDisabled>({
    camera: false,
    hangup: false,
    join: true,
    create: true,
  })

  return (
    <section className="px-5 space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <CaptureAudioVideo
          disabled={disabled.camera}
          setDisabled={setDisabled}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        />
        <CreateRoom
          setDisabled={setDisabled}
          disabled={disabled.create}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          setIceCandidates={setLocalIceCandidates}
          setRoomID={setLocalRoomID}
        />

        <JoinRoom
          disabled={disabled.join}
          setDisabled={setDisabled}
          setIceCandidates={setLocalIceCandidates}
          roomID={remoteRoomID}
          setRoomID={setRemoteRoomID}
        />

        <HangUp
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          roomID={localRoomID}
          setRoomID={setLocalRoomID}
        />
      </div>

      {localRoomID && <DisplayUserModes roomID={localRoomID} info="You are the caller" />}
      {remoteRoomID && <DisplayUserModes roomID={remoteRoomID} info="You ar the callee" />}
      <DisplayStreams localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} />
      <DisplayIceCandidates iceCandidates={localIceCandidates} />
    </section>
  )
}

export default WebRTC
