export function DisplayIceCandidates({ iceCandidates }: { iceCandidates: RTCIceCandidate[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Local ICE Candidates[]</h2>
      <ul className="list-decimal px-5">
        {iceCandidates.map((ice, _) => (
          <li key={_}>
            {ice.address} ~ {ice.port}
          </li>
        ))}
      </ul>
    </div>
  )
}
