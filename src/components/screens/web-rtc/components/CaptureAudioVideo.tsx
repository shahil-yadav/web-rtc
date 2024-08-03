import SVG from '~/assets/camera.png'
import { setLocalStream, useLocalStream, useRemoteStream } from '../useStreams'
import React from 'react'
import { IDisabled } from '..'
import { Button } from './CreateRoom'

export interface PeerStreams {
  localVideoRef: React.RefObject<HTMLVideoElement>
  remoteVideoRef: React.RefObject<HTMLVideoElement>
}

export function CaptureAudioVideo({
  localVideoRef,
  remoteVideoRef,
  setDisabled,
  disabled,
}: PeerStreams & {
  disabled: boolean
  setDisabled: React.Dispatch<React.SetStateAction<IDisabled>>
}) {
  async function getMedia() {
    if (!localVideoRef.current || !remoteVideoRef.current)
      throw new Error('HTML Video not initialised properly', {
        cause: 'React Ref Hook Error',
      })

    await setLocalStream() /** Request Camera Access */
    localVideoRef.current.srcObject = useLocalStream()

    const remoteStream = useRemoteStream()
    remoteVideoRef.current.srcObject = remoteStream

    setDisabled((prev) => ({
      ...prev,
      create: false,
      join: false,
    }))
  }

  return <Button disabled={disabled} fn={getMedia} text={<img src={SVG} alt="svg" />} />
}
