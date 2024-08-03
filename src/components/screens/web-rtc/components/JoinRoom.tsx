import { addDoc, collection, doc, getDoc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import React from 'react'
import Png from '~/assets/connect.png'
import { useFirestore } from '~/lib/firebase'
import { IDisabled } from '..'
import { usePeerConnection } from '../usePeerConnection'
import { useLocalStream, useRemoteStream } from '../useStreams'
import { Button } from './CreateRoom'
import { useFetchOffer } from './useFetchOffer'
import { useFetchRemoteIceCandidates } from './useFetchRemoteIceCandidates'

interface JoinRoomProps {
  roomID: string
  disabled: boolean
  setDisabled: React.Dispatch<React.SetStateAction<IDisabled>>
  setRoomID: React.Dispatch<React.SetStateAction<string>>
  setIceCandidates: React.Dispatch<React.SetStateAction<RTCIceCandidate[]>>
}

function JoinRoom(props: JoinRoomProps) {
  const offer = useFetchOffer(props.roomID)
  const remoteIceCandidates = useFetchRemoteIceCandidates(props.roomID)
  const db = useFirestore()
  const localStream = useLocalStream()
  const remoteStream = useRemoteStream()

  const isReady: 'not-found' | 'ready' = !offer || remoteIceCandidates.length === 0 ? 'not-found' : 'ready'

  async function handleJoinRoom() {
    props.setDisabled((prev) => ({
      ...prev,
      join: true,
      create: true,
    }))
    const roomID = props.roomID

    const document = await getDoc(doc(db, 'rooms', roomID))
    if (document.exists()) {
      const peerConnection = usePeerConnection()

      /** 1. Add local streams to the peer connection[START] 👇 */
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })
      /** Add local streams to the peer connection[END] 👆 */

      /** 2. Listen for calleeCandidates[START] 👇 */
      peerConnection.addEventListener('icecandidate', function (event) {
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
        addDoc(collection(db, 'rooms', roomID, 'calleeCandidates'), event.candidate.toJSON())
      })
      /** Listen for calleeCandidates[END] 👆 */

      /** 3. Add an event listener to remote streams[START] 👇 */
      peerConnection.addEventListener('track', (event) => {
        console.log('Got remote track:', event.streams[0])
        event.streams[0].getTracks().forEach((track) => {
          console.log('Add a track to the remoteStream:', track)
          remoteStream.addTrack(track)
        })
      })
      /** Add an event listener to remote streams[END] 👆 */

      /** 4. Code for creating a SDP answer[START] 👇 */
      const offer = document.data().offer
      console.log('Got offer:', offer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection.createAnswer()
      console.log('Created answer:', answer)
      await peerConnection.setLocalDescription(answer)
      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      }
      await updateDoc(doc(db, 'rooms', roomID), roomWithAnswer)
      /** Code for creating a SDP answer[END] 👆 */

      /** 5.Listening for remote ice candidates[START] 👇 */
      onSnapshot(query(collection(db, 'rooms', roomID, 'callerCandidates')), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const iceCandidate = change.doc.data()
            console.log(`Got new remote ICE candidate: ${JSON.stringify(iceCandidate)}`)
            await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
          }
        })
      })
      /** Listening for remote ice candidates[END] 👆 */
    }
  }

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <Button
        disabled={props.disabled}
        fn={() => {
          const modal = document.getElementById('my_modal_1') as HTMLDialogElement
          if (modal !== null) modal.showModal()
        }}
        text={<img src={Png} alt="connect" />}
      />

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box m-10 bg-stone-900">
          <h3 className="font-bold text-lg">Enter room id</h3>
          <input
            type="text"
            onChange={(e) => props.setRoomID(e.currentTarget.value)}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs my-4 bg-black/20"
          />

          <div className="modal-action">
            <form className="flex gap-4 items-center" method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button onClick={handleJoinRoom} disabled={isReady === 'not-found'} className="btn disabled:text-white">
                {isReady === 'not-found' ? '❌ Not Found' : '✅ Join'}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default JoinRoom
