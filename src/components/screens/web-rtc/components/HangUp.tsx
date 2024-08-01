import { PeerStreams } from './CaptureAudioVideo';

export function HangUp({ localVideo, remoteVideo }: PeerStreams) {
  function handleEvent() {
    if (!localVideo || !remoteVideo)
      throw new Error('HTML Video not initialised properly', {
        cause: 'React Ref Hook Error',
      });

    /** Stopping Streams code 👇 */
    const streams = [localVideo, remoteVideo];
    streams.forEach((stream) => {
      if (stream.srcObject instanceof MediaStream) {
        const tracks = stream.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        stream.srcObject = null;
      }
    });
    /** Stopping Streams code 👆 */
  }

  return (
    <button onClick={handleEvent} className="btn px-5 py-2 btn-error">
      Hang up
    </button>
  );
}
