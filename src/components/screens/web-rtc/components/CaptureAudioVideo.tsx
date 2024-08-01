import SVG from '~/assets/nest-cam.svg';

export interface PeerStreams {
  localVideo: HTMLVideoElement | null;
  remoteVideo: HTMLVideoElement | null;
}

type CaptureAudioVideoProps = PeerStreams & { setLocalStream: (value: MediaStream) => void };

export function CaptureAudioVideo({ localVideo, remoteVideo, setLocalStream }: CaptureAudioVideoProps) {
  async function getMedia() {
    if (!localVideo || !remoteVideo)
      throw new Error('HTML Video not initialised properly', {
        cause: 'React Ref Hook Error',
      });

    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localVideo.srcObject = localStream;
    setLocalStream(localStream);

    const remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;
  }

  return (
    <button onClick={getMedia} className="btn btn-ghost px-5 py-2">
      <img className="bg-black rounded-lg p-1" src={SVG} alt="svg" />
      Capture Audio + Video
    </button>
  );
}
