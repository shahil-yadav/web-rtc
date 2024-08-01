import { useState } from 'react';
import { CaptureAudioVideo } from './components/CaptureAudioVideo';
import { HangUp } from './components/HangUp';
import { Video } from './ui/Video';
import { useVideoStreamsRef } from './useVideoStreamsRef';

// const actions = ['Capture Audio + Video', 'Create Room', 'Join Room', 'Hang Up'];
function WebRTC() {
  const { localVideoRef, remoteVideoRef } = useVideoStreamsRef();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [iceCandidates, setIceCandidates] = useState<RTCIceCandidateInit[]>([]);
  const [webRtcPeerConnection, setWebRtcPeerConnection] = useState<RTCPeerConnection>();

  const localVideo = localVideoRef.current;
  const remoteVideo = remoteVideoRef.current;

  async function handleCreateRoom() {
    if (!localStream) throw new Error('LocalStream is undefined, cannot create a RTCPeerConnection');
    const configuration = {
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
      iceCandidatePoolSize: 10,
    };
    const peerConnection = new RTCPeerConnection(configuration);

    registerPeerConnectionListeners(peerConnection);
    peerConnection.addEventListener('icecandidate', (event) => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      const JSON = event.candidate.toJSON();
      setIceCandidates((prev) => [...prev, JSON]);
    });

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    setWebRtcPeerConnection(() => peerConnection);
  }

  return (
    <section className="px-5 space-y-5">
      <div className="flex items-center gap-2">
        <CaptureAudioVideo setLocalStream={setLocalStream} localVideo={localVideo} remoteVideo={remoteVideo} />
        <HangUp localVideo={localVideo} remoteVideo={remoteVideo} />
        <button onClick={handleCreateRoom} className="btn">
          Create Room
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <Video streamRef={localVideoRef} muted />
        <Video streamRef={remoteVideoRef} />
      </div>

      <div>
        <p>Ice Candidates []</p>
        <ul>
          {iceCandidates.map((ice) => (
            <li>{ice.candidate}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function registerPeerConnectionListeners(peerConnection: RTCPeerConnection) {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

export default WebRTC;
