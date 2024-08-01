export function Video(props: { streamRef: React.RefObject<HTMLVideoElement>; muted?: boolean }) {
  return (
    <video
      ref={props.streamRef}
      className="h-[400px] aspect-video bg-stone-400 md:w-1/2"
      playsInline
      muted
      autoPlay
    ></video>
  );
}
