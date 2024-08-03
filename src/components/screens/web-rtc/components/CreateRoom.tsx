import { addDoc, collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useFirestore } from '~/lib/firebase'
import { IDisabled } from '..'
import { usePeerConnection } from '../usePeerConnection'
import { useLocalStream, useRemoteStream } from '../useStreams'
import { PeerStreams } from './CaptureAudioVideo'

interface CreateRoomProps {
  disabled: boolean
  setDisabled: React.Dispatch<React.SetStateAction<IDisabled>>
  setRoomID: (value: string | ((prevState: string) => string)) => void
  setIceCandidates: (value: RTCIceCandidate[] | ((prevState: RTCIceCandidate[]) => RTCIceCandidate[])) => void
}

function CreateRoom(props: CreateRoomProps & PeerStreams) {
  const db = useFirestore()
  const peerConnection = usePeerConnection()
  const remoteStream = useRemoteStream()
  const localStream = useLocalStream()

  async function handleCreateRoom() {
    props.setDisabled((prev) => ({ ...prev, create: true }))

    /** 0. Create a document(room) in the collection of rooms */
    const roomRef = collection(db, 'rooms')
    const roomIDDocRef = await addDoc(roomRef, {})
    props.setRoomID(() => roomIDDocRef.id)
    const roomID = roomIDDocRef.id

    /** 1. Add local stream to the peer connection[START] 👇 */
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })
    console.log('Attatched localStreams to the peer-connection')
    /**  Add local stream to the peer connection[END] 👆 */

    /** 2. Listen for ice-candidates[START] 👇 */
    function sendLocalIceCandidatesToDb(event: RTCPeerConnectionIceEvent) {
      if (!event.candidate) {
        console.log('Got final candidates!')
        return
      }
      console.log('Got candidate: ', event.candidate)
      props.setIceCandidates((prev) => {
        const newCandidate = event.candidate
        let found = false
        for (let index = 0; index < prev.length; index++) {
          const prevCandidate = prev[index]
          if (prevCandidate.address === newCandidate?.address && prevCandidate.port === newCandidate.port) {
            found = true
            break
          }
        }

        if (found === true) return [...prev]
        else return [...prev, newCandidate!]
      })
      addDoc(collection(db, 'rooms', roomID, 'callerCandidates'), event.candidate.toJSON())
    }
    peerConnection.addEventListener('icecandidate', sendLocalIceCandidatesToDb)
    /**  Listen for ice-candidates[END] 👆 */

    /** 3. Create an offer and send to the DB[START] 👇 */
    const offer = await peerConnection.createOffer()
    peerConnection.setLocalDescription(offer)
    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    }
    await updateDoc(doc(db, 'rooms', roomID), roomWithOffer)
    /** Create an offer and send to the DB[END] 👆 */

    /** 4. Add remote stream to the peer connection[START] 👇 */
    function listenRemoteStreams(event: RTCTrackEvent) {
      event.streams[0].getTracks().forEach((track) => {
        console.log('Attatching a remote track to remote streams', track)
        remoteStream.addTrack(track)
      })
    }
    peerConnection.addEventListener('track', listenRemoteStreams)
    /** Add remote stream to the peer connection[END] 👆 */

    /** 5. Listen for remote ice candidates[START] 👇 */
    onSnapshot(query(collection(db, 'rooms', roomID, 'calleeCandidates')), (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const iceCandidate = new RTCIceCandidate(change.doc.data())
          console.log(`Got new remote ICE candidate: ${iceCandidate.address}~${iceCandidate.port}`)
          await peerConnection.addIceCandidate(iceCandidate)
        }
      })
    })
    /** Listen for remote ice candidates[END] 👆 */

    /** 6. Listen for remote offers[START] 👇 */
    onSnapshot(doc(db, 'rooms', roomID), async (snapshot) => {
      const data = snapshot.data()
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer)
        const rtcSessionDescription = new RTCSessionDescription(data.answer)
        await peerConnection.setRemoteDescription(rtcSessionDescription)
      }
    })
    /** Listen for remote offers[END] 👆 */
  }

  return <Button fn={handleCreateRoom} disabled={props.disabled} text="+" />
}

export function Button({
  fn,
  disabled,
  text,
}: {
  fn: () => Promise<void> | void
  disabled: boolean
  text: React.ReactNode
}) {
  return (
    <button onClick={fn} disabled={disabled} className="btn-circle btn-outline p-2">
      <span className="text-white text-lg font-bold relative">
        {text}
        {disabled && <span className="absolute top-0 left-0">❌</span>}
      </span>
    </button>
  )
}

export default CreateRoom
