export function DisplayUserModes({ roomID, info }: { roomID: string; info: string }) {
  return (
    roomID && (
      <div>
        <p className="">
          Room ID: <span className="underline font-bold underline-offset-4">{roomID}</span>
        </p>
        <p className="text-red-500 text-lg">{info}</p>
      </div>
    )
  )
}
