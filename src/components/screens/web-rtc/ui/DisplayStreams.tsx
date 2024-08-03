import React from 'react'

function DisplayStreams({
  localVideoRef,
  remoteVideoRef,
}: {
  localVideoRef: React.RefObject<HTMLVideoElement>
  remoteVideoRef: React.RefObject<HTMLVideoElement>
}) {
  return (
    <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-2">
      <video ref={localVideoRef} className="h-[200px] bg-stone-400" playsInline muted autoPlay />
      <video ref={remoteVideoRef} className="h-[200px] bg-stone-400" playsInline autoPlay />
    </div>
  )
}

export default DisplayStreams
