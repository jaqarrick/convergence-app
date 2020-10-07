import React, { useCallback, useEffect, useState, useRef } from "react"
import { RouteChildrenProps, Link } from "react-router-dom"
import RoomDataObject from "../../types"
import Peer from "peerjs"

interface RouteProps extends RouteChildrenProps<{ roomid: string }> {}
interface PassedProps {
  message: string
  currentRoom: string
  currentPeer: any
  setCurrentPeer: (peer: string) => void
  currentRoomObject: RoomDataObject | undefined
  updateSocketPeers: (roomid: string, peerid: string) => void
}
const RoomComponent: React.FC<RouteProps & PassedProps> = ({
  message,
  match,
  currentRoom,
  currentPeer,
  currentRoomObject,
  setCurrentPeer,
  updateSocketPeers,
}) => {
  useEffect(() => console.log(message, currentRoom), [currentRoom, message])
  const initPeerVideo = useCallback((stream: MediaStream) => {
    if (peerVideoRef) {
      peerVideoRef.current.srcObject = stream
    }
  }, [])

  const initUserVideo = useCallback((stream: MediaStream) => {
    if (userVideoRef) {
      userVideoRef.current.srcObject = stream
    }
  }, [])
  const [peer, setPeer] = useState<any>()
  const createPeer = useCallback(() => {
    const peer = new Peer({
      host: "localhost",
      port: 9000,
      path: "/convergence",
    })
    peer.on("open", id => {
      setCurrentPeer(id)
      updateSocketPeers(currentRoom, id)
      setPeer(peer)
    })

    peer.on("call", (call: any) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then(stream => {
          call.answer(stream)
          call.on("stream", (remoteStream: MediaStream) => {
            initPeerVideo(remoteStream)
            initUserVideo(stream)
          })
        })
    })
  }, [
    setCurrentPeer,
    initUserVideo,
    currentRoom,
    setPeer,
    updateSocketPeers,
    initPeerVideo,
  ])
  // const [currentRoom, setCurrentRoom] = useState<any>(null)
  const initVideoCall = useCallback(
    (targetPeerId: any) => {
      if (peer) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(stream => {
            const call = peer.call(targetPeerId, stream)
            call.on("stream", (remoteStream: MediaStream) => {
              initPeerVideo(remoteStream)
              initUserVideo(stream)
            })
          })

        // const getUserMedia = navigator.getUserMedia
        // getUserMedia(
        //   { video: true, audio: true },
        //   (stream: MediaStream) => {
        //     var call = peer.call("another-peers-id", stream)
        //     call.on("stream", (remoteStream: MediaStream) => {
        //       initPeerVideo(remoteStream)
        //       setStream(stream)

        //       userVideoRef.current.srcObject = stream
        //     })
        //   },
        //   function (err) {
        //     console.log("Failed to get local stream", err)
        //   }
        // )
      }
    },
    [peer, initPeerVideo, initUserVideo]
  )
  const peerVideoRef = useRef<any>(null)
  const userVideoRef = useRef<any>(null)

  return (
    <div>
      {" "}
      <button onClick={createPeer}> Create New Peer </button>
      <p>
        {" "}
        {currentPeer
          ? `Your peer id is ${currentPeer}`
          : `You haven't created a peer id yet`}{" "}
      </p>
      <h1> {match?.params.roomid} </h1>
      <p> {message} </p>
      <div>
        {" "}
        <ul>
          {currentRoomObject?.peerids.map((peerid, i) => {
            if (peerid !== currentPeer)
              return (
                <li onClick={() => initVideoCall(peerid)} key={i}>
                  {" "}
                  <button onClick={() => initVideoCall(peerid)}>
                    {" "}
                    Call {peerid}{" "}
                  </button>
                </li>
              )
          })}
        </ul>
      </div>
      <div>
        {" "}
        <video autoPlay ref={userVideoRef}></video>
        <video autoPlay ref={peerVideoRef}></video>
      </div>
      <Link to='/'> Home </Link>
    </div>
  )
}

export default RoomComponent
